// @ts-nocheck

import client from './../client/elasticsearch';
import { estypes } from '@elastic/elasticsearch';
import { Request, Response } from 'express';
import crypto from 'crypto';
import { deploy_model, delete_model, edit_model } from './../helpers/deployment';
import { DeploymentSource, LooseObject } from './../types/elasticBody';

let gpu_config = JSON.parse(process.env.GPU_CONFIGURATON!);

async function get_model_hits(id: string) {
  let hits_res = await client.count({
    index: process.env.DEPLOYMENT_INDEX,
    query: {
      term: {
        'fields.meta.requestBody.model.keyword': {
          value: id,
        },
      },
    },
  });

  return hits_res.count;
}

/**
 * Retrieves deployments from the deployment index.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<Response>} A Promise that resolves when the operation is completed.
 *
 * @throws {Error} Will throw an error if there's an issue during the process.
 */
export const get_deployments = async ( req: Request, res: Response ): Promise<Response> => {
  // #swagger.tags = ['Deployment']

  /* #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        page: {
                            type: "number",
                            example: 0
                        }
                    }
                }  
            }
        }
    }*/

  /* #swagger.responses[200] = {
            description: 'Get a specific user.',
            schema: {
                name: 'John Doe',
                age: 29,
                about: ''
            }
    }*/
  try {
    const { page, search } = req.body;
    let search_query;
    if (search) {
      search_query = {
        index: process.env.DEPLOYMENT_INDEX!,
        suggest: {
          text: search,
          'name-suggest': {
            completion: {
              size: 10,
              field: 'name.autocomplete',
              skip_duplicates: true,
              fuzzy: {
                fuzziness: 2,
              },
            },
          },
        },
      };
    } else {
      search_query = {
        index: process.env.DEPLOYMENT_INDEX!,
        query: {
          match_all: {},
        },
        size: 10,
        sort: [
          {
            updated_at: {
              order: 'desc',
            },
          },
        ],
        from: Number(page - 1) * 10,
      };
    }
    const models = await client.search(search_query);

    let data: LooseObject[] = [];
    let model_ids = [];

    if (search) {
      for (let detail of models.suggest['name-suggest'][0]['options']) {
        model_ids.push(get_model_hits(detail._source?.id!));
        data.push(detail._source!);
      }
    } else {
      for (let detail of models.hits.hits) {
        model_ids.push(get_model_hits(detail._source?.id!));
        data.push(detail._source!);
      }
    }
    let total_runs = await Promise.all(model_ids);
    for (let i = 0; i < data.length; i++) {
      data[i].total_runs = total_runs[i];
    }
    const total = await client.count({
      index: process.env.DEPLOYMENT_INDEX,
      query: {
        match_all: {},
      },
    });
    const total_page = Math.ceil(total.count / 10);

    return res.status(200).json({
      success: true,
      data: { deployments: data, total_page: total_page },
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
 * Create a new deployment.
 *
 * @param {import('express').Request} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.deployment_name - The name of the deployment.
 * @param {string} req.body.description - The description of the deployment.
 * @param {string} req.body.model_id - The ID of the model to deploy.
 * @param {string} req.body.max_containers - The maximum number of containers for the deployment.
 * @param {string} req.body.min_containers - The minimum number of containers for the deployment.
 * @param {string} req.body.gpu - The GPU type for the deployment.
 * @param {string} req.body.server - The server for the deployment.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<Response>} A Promise that resolves when the operation is completed.
 *
 * @throws {Error} Will throw an error if there's an issue during the process.
 */
export const create_deployments = async ( req: Request, res: Response ): Promise<Response> => {
  /* #swagger.tags = ['Deployment']
   #swagger.description = 'Create a new deployment.'

   #swagger.requestBody = {
        required: true,
        schema: {
            type: 'object',
            properties: {
                deployment_name: { type: 'string', description: 'The name of the deployment.' },
                description: { type: 'string', description: 'The description of the deployment.' },
                model_id: { type: 'string', description: 'The ID of the model to deploy.' },
                max_containers: { type: 'string', description: 'The maximum number of containers for the deployment.' },
                min_containers: { type: 'string', description: 'The minimum number of containers for the deployment.' },
                gpu: { type: 'string', description: 'The GPU type for the deployment.' },
                server: { type: 'string', description: 'The server for the deployment.' }
            }
        }
    }

   #swagger.responses[200] = {
        description: 'Successful response indicating the deployment was created successfully.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', description: 'Indicates if the request was successful.' },
                        data: {
                            type: 'object',
                            properties: {
                                deployment_id: { type: 'string', description: 'The ID of the created deployment.' }
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
                        message: { type: 'string', description: 'Error message describing the issue.' },
                        success: { type: 'boolean', description: 'Indicates if the request was unsuccessful.' }
                    }
                }
            }
        }
    }
    */
  try {
    let deployment_id = crypto.randomBytes(5).toString('hex');
    const { gpu, model_id, containers, server, deployment_name, description } = req.body

    await client.index({
      index: process.env.DEPLOYMENT_INDEX!,
      id: deployment_id,
      refresh: true,
      document: {
        id: deployment_id,
        model_id: model_id.trim(),
        replicas: parseInt(containers),
        name: deployment_name.trim(),
        description: description.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'Deploying',
        server: server.trim(),
        gpu: gpu_config[gpu].name,
      },
    });

    await deploy_model(deployment_id, model_id.trim(), gpu, parseInt(containers), server.trim());

    return res.status(200).json({ success: true, data: { deployment_id } });
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

/**
 * Edit an existing deployment.
 *
 * @param {import('express').Request} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.deployment_id - The ID of the deployment to edit.
 * @param {number} [req.body.minReplicas] - The new value for minimum replicas.
 * @param {number} [req.body.maxReplicas] - The new value for maximum replicas.
 * @param {string} [req.body.gpu] - The new GPU type.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<Response>} A Promise that resolves when the operation is completed.
 *
 * @throws {Error} Will throw an error if there's an issue during the process.
 */
export const edit_deployments = async ( req: Request, res: Response ): Promise<Response> => {
  /* #swagger.tags = ['Deployment']
   #swagger.description = 'Edit an existing deployment.'

   #swagger.requestBody = {
        required: true,
        schema: {
            type: 'object',
            properties: {
                deployment_id: { type: 'string', description: 'The ID of the deployment to edit.' },
                minReplicas: { type: 'number', description: 'The new value for minimum replicas.' },
                maxReplicas: { type: 'number', description: 'The new value for maximum replicas.' },
                gpu: { type: 'string', description: 'The new GPU type.' }
            }
        }
    }

   #swagger.responses[200] = {
        description: 'Successful response indicating the deployment was edited successfully.',
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
    }

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
    }
*/
  try {
    const { containers, deployment_id, gpu } = req.body;

    let temp_update: LooseObject = {};
    if (containers >= 0) {
      temp_update['replicas'] = parseInt(containers);
    }
    if (gpu) {
      temp_update['gpu'] = gpu_config[gpu].name;
    }

    const create_request: estypes.UpdateRequest<DeploymentSource> = {
      id: deployment_id,
      index: process.env.DEPLOYMENT_INDEX!,
      doc: temp_update,
      refresh: true,
    };

    await client.update(create_request);
    if (gpu) {
      temp_update['gpu'] = gpu;
    }
    await edit_model(deployment_id, temp_update);
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
 * Delete deployments by their IDs.
 *
 * @param {import('express').Request} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string[]} req.body.deployment_ids - Array of deployment IDs to delete.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<Response>} A Promise that resolves when the operation is completed.
 *
 * @throws {Error} Will throw an error if there's an issue during the process.
 */
export const delete_deployments = async ( req: Request, res: Response ): Promise<Response> => {
  /* #swagger.tags = ['Deployment']
   #swagger.description = 'Delete deployments by their IDs.'

   #swagger.requestBody = {
        required: true,
        schema: {
            type: 'object',
            properties: {
                deployment_ids: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of deployment IDs.'
                }
            }
        }
    }

   #swagger.responses[200] = {
        description: 'Successful response indicating the deployments were deleted successfully.',
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
    }

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
    }
  */
  try {
    const { deployment_ids } = req.body;
    await delete_model(deployment_ids);
    await client.bulk({
      body: deployment_ids.flatMap((doc: string) => [
        { delete: { _index: process.env.DEPLOYMENT_INDEX!, _id: doc } },
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
