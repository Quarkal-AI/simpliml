import client from './../client/elasticsearch';
import { Request, Response } from 'express';
import crypto from 'crypto';
import * as fs from 'fs';
import { create_job, delete_job, fetch_logs } from './../helpers/pipeline';
import { LooseObject } from './../types/elasticBody';

let gpu_config = JSON.parse(process.env.GPU_CONFIGURATON!);

/**
 * Retrieves pipelines from Elasticsearch with pagination.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<Response>} A Promise that resolves when the operation is completed.
 *
 * @throws {Error} Will throw an error if there's an issue during the process.
 */
export const get_pipelines = async (req: Request, res: Response): Promise<Response> => {
  /* 

        #swagger.tags = ['Finetune']
        #swagger.description = 'Get pipelines from Elasticsearch with pagination.'

        #swagger.parameters['page'] = {
            in: 'query',
            required: true,
            type: 'number',
            description: 'The page number for pagination.',
            example: 0
        }

        #swagger.responses[200] = {
            description: 'Successful response containing pipeline data and total pages.',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            success: {
                                type: 'boolean',
                                description: 'Indicates if the request was successful.'
                            },
                            data: {
                                type: 'object',
                                properties: {
                                    pipeline: {
                                        type: 'array',
                                        items: {
                                            type: 'object'
                                        },
                                        description: 'Array of pipeline objects retrieved from Elasticsearch.'
                                    },
                                    total_page: {
                                        type: 'integer',
                                        description: 'Total number of pages available based on the pagination.'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        #swagger.responses[500] = {
            description: 'Internal server error.',
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            message: {
                                type: 'string',
                                description: 'Error message describing the issue.'
                            },
                            success: {
                                type: 'boolean',
                                description: 'Indicates if the request was unsuccessful.'
                            }
                        }
                    }
                }
            }
        } 
    */
  try {
    let { page, search } = req.body;
    let search_query;

    if(search){
      search_query = {
        index: process.env.FINETUNING_INDEX!,
        suggest: {
          text: search,
          "name-suggest": {
            completion: {
              size: 10,
              field: "pipeline_name.autocomplete",
              skip_duplicates: true,
              fuzzy: {
                fuzziness: 2
              }
            }
          }
        }
      }
    }else{
      search_query = {
        index: process.env.FINETUNING_INDEX!,
        query: {
          match_all: {},
        },
        sort: [
          {
            created_at: {
              order: 'desc',
            },
          },
        ],
        from: (page - 1) * 10,
        size: 10,
      }
    }
    
    // @ts-ignore
    const es_data = await client.search(search_query);

    const data: LooseObject[] = [];
    if(search){
      // @ts-ignore
      for (let detail of es_data.suggest["name-suggest"][0]["options"]) {
        data.push(detail._source!);
      }
    }else{
      for (let detail of es_data.hits.hits) {
        data.push(detail._source!);
      }
    }

    const total = await client.count({
      index: process.env.FINETUNING_INDEX!,
      query: {
        match_all: {},
      },
    });
    const total_page = Math.ceil(total.count / 10);

    return res.status(200).json({
      success: true,
      data: { pipeline: data, total_page: total_page },
    });
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

/**
 * Creates a pipeline for training a model with specified configurations.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<Response>} A Promise that resolves when the operation is completed.
 *
 * @throws {Error} Will throw an error if there's an issue during the process.
 */
export const create_pipeline = async (req: Request, res: Response): Promise<Response> => {
  /*
        #swagger.tags = ['Finetune']
        #swagger.description = 'Create a pipeline for training a model with specified configurations.'

        #swagger.requestBody = {
            required: true,
            schema: {
                type: 'object',
                properties: {
                    dataset_id: { type: 'string', description: 'ID of the dataset.' },
                    num_epochs: { type: 'number', description: 'Number of epochs for training.' },
                    lr: { type: 'number', description: 'Learning rate for training.' },
                    batch_size: { type: 'number', description: 'Batch size for training.' },
                    lora_alpha: { type: 'number', description: 'Alpha parameter for LoRA.' },
                    lora_r: { type: 'number', description: 'R parameter for LoRA.' },
                    lora_dropout: { type: 'number', description: 'Dropout rate for LoRA.' },
                    gpu: { type: 'string', description: 'GPU for training.' },
                    model_id: { type: 'string', description: 'ID of the model.' },
                    method: { type: 'string', description: 'Method for training.' },
                    optimizer: { type: 'string', description: 'Optimizer for training.' },
                    export: { type: 'boolean', description: 'Flag to indicate if model export is required.' },
                    reduce_batch_size: { type: 'boolean', description: 'Flag to indicate if batch size needs to be reduced.' }
                }
            }
        } 
    */

  /* 
    #swagger.responses[200] = {
        description: 'Successful response indicating the pipeline creation was successful.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', description: 'Indicates if the request was successful.' }
                    }
                }
            }
        }
    } */

  /* 
    #swagger.responses[500] = {
        description: 'Internal server error.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', description: 'Error message describing the issue.' },
                        success: { type: 'boolean', description: 'Indicates if the request was unsuccessful.' }
                    }
                }
            }
        }
    } */
  try {
    let {
      pipeline_name,
      num_epochs,
      lr,
      batch_size,
      lora_alpha,
      lora_r,
      lora_dropout,
      model,
      finetuning_method,
      gpu,
      optimizer,
      upload_model_to_hf,
      dataset_id,
    } = req.body;

    let job_id = crypto.randomBytes(5).toString('hex');

    const payload = {
      pipeline_name,
      model,
      id: job_id,
      num_epochs,
      finetuning_method,
      lr,
      batch_size,
      lora_alpha,
      lora_r,
      upload_model_to_hf,
      lora_dropout,
      status: 'Starting',
      created_at: new Date().toISOString(),
      gpu: gpu_config[gpu].name,
      dataset_id,
    };

    let f_method = finetuning_method === 'qlora_4bit' ? '--quantization_bit 4' : finetuning_method === 'lora_8bit' ? '--quantization_bit 8' : '';
    let export_model = upload_model_to_hf ? `&& python3 src/export_model.py --model_name_or_path ${model} --adapter_name_or_path /finetuned-model/${job_id}/ --template default --finetuning_type lora --export_dir /app/output/${job_id} --export_size 5 --export_legacy_format False` : ""
    let job_cmd = `python3 update_status.py Active False && envsubst < dataset_info_env.json  > /app/datasets/dataset_info.json && export train_time=$(date) && CUDA_VISIBLE_DEVICES=0 python3 -u src/train.py  --stage sft --do_train --model_name_or_path ${model} --optim ${optimizer} --dataset_dir /app/datasets --dataset ${dataset_id} --template default --finetuning_type lora ${f_method} --lora_rank ${lora_r} --lora_alpha ${lora_alpha} --lora_dropout 0 --lora_target q_proj,v_proj --output_dir /app/output${job_id} --per_device_train_batch_size ${batch_size} --gradient_accumulation_steps 4 --lr_scheduler_type cosine --logging_steps 10 --save_steps 100 --learning_rate ${lr} --num_train_epochs ${num_epochs} --bf16 --flash_attn auto --warmup_steps 10 --include_tokens_per_second True --disable_tqdm True --ddp_find_unused_parameters False --logging_first_step True --upcast_layernorm ${export_model}; python3 update_status.py Complete ${upload_model_to_hf ? "upload": "ignore"}`;

    await create_job(job_id, job_cmd, model, gpu, dataset_id);
    await client.index({
      index: process.env.FINETUNING_INDEX!,
      id: job_id,
      refresh: true,
      document: payload,
    });
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

/**
 * Deletes pipelines based on provided IDs.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<Response>} A Promise that resolves when the operation is completed.
 *
 * @throws {Error} Will throw an error if there's an issue during the process.
 */
export const delete_pipelines = async (req: Request, res: Response): Promise<Response> => {
  /* #swagger.tags = ['Finetune']
   #swagger.description = 'Delete pipelines based on provided IDs.'

   #swagger.parameters['pipeline_ids'] = {
        in: 'path',
        description: 'Array of pipeline IDs to delete.',
        required: true,
        type: 'array',
        items: {
            type: 'string'
        }
    } */

  /* #swagger.responses[200] = {
        description: 'Successful response indicating the pipelines were deleted successfully.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', description: 'Indicates if the request was successful.' }
                    }
                }
            }
        }
    } */

  /* #swagger.responses[500] = {
        description: 'Internal server error.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', description: 'Error message describing the issue.' },
                        success: { type: 'boolean', description: 'Indicates if the request was unsuccessful.' }
                    }
                }
            }
        }
    } */

  try {
    const { pipeline_ids } = req.body;
    const parsed_pipeline_ids = JSON.parse(pipeline_ids);
    await delete_job(parsed_pipeline_ids);
    await client.bulk({
      body: parsed_pipeline_ids.flatMap((doc: string) => [
        { delete: { _index: process.env.FINETUNING_INDEX!, _id: doc } },
      ]),
    });
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

/**
 * Get details of a specific pipeline by ID.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<Response>} A Promise that resolves when the operation is completed.
 *
 * @throws {Error} Will throw an error if there's an issue during the process.
 */
export const pipeline_details = async (req: Request, res: Response): Promise<Response> => {
  /* #swagger.tags = ['Finetune']
   #swagger.description = 'Get details of a specific pipeline by ID.'

   #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID of the pipeline to get details for.',
        required: true,
        type: 'string'
    } */

  /* #swagger.responses[200] = {
        description: 'Successful response containing details of the requested pipeline.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', description: 'Indicates if the request was successful.' },
                        data: { type: 'object', description: 'Details of the requested pipeline.' }
                    }
                }
            }
        }
    } */

  /* #swagger.responses[500] = {
        description: 'Internal server error.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', description: 'Error message describing the issue.' },
                        success: { type: 'boolean', description: 'Indicates if the request was unsuccessful.' }
                    }
                }
            }
        }
    } */

  try {
    const { pipeline_id } = req.body;
    const es_data = await client.get({
      index: process.env.FINETUNING_INDEX!,
      id: pipeline_id,
    });
    return res.status(200).json({ success: true, data: es_data._source });
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

/**
 * Get logs of a specific pipeline by ID.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<Response>} A Promise that resolves when the operation is completed.
 *
 * @throws {Error} Will throw an error if there's an issue during the process.
 */

export const pipeline_logs = async (req: Request, res: Response): Promise<Response> => {
  /* #swagger.tags = ['Finetune']
   #swagger.description = 'Get logs of a specific pipeline by ID.'

   #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID of the pipeline to get logs for.',
        required: true,
        type: 'string'
    } */

  /* #swagger.responses[200] = {
        description: 'Successful response containing logs of the requested pipeline.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', description: 'Indicates if the request was successful.' },
                        data: { type: 'string', description: 'Logs of the requested pipeline.' }
                    }
                }
            }
        }
    } */

  /* #swagger.responses[500] = {
        description: 'Internal server error.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', description: 'Error message describing the issue.' },
                        success: { type: 'boolean', description: 'Indicates if the request was unsuccessful.' }
                    }
                }
            }
        }
    } */

  try {
    const { pipeline_id } = req.body;
    const id = pipeline_id;
    const path = `finetuning_logs/${id}.log`;

    let data;

    if (fs.existsSync(path)) {
      let file_log = fs.readFileSync(path);
      data = file_log.toString('utf-8');
    } else {
      const logs = await fetch_logs(id);
      if (!logs.body) {
        data = 'Starting the Finetuning Pipeline, currently no logs to show';
      } else {
        data = logs.body;
      }
    }

    return res.status(200).json({ success: true, data: data });
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
