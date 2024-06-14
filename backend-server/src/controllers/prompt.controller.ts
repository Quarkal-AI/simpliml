import client from './../client/elasticsearch';
import { Request, Response } from 'express';
import openai from './../client/openai';
import crypto from 'crypto';
import { LooseObject } from './../types/elasticBody';

/**
 * Get prompts from the prompt index.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<Response>} A Promise that resolves when the operation is completed.
 *
 * @throws {Error} Will throw an error if there's an issue during the process.
 */
export const get_prompts = async (req: Request, res: Response): Promise<Response> => {
  /* 
    #swagger.tags = ['Prompt']
    #swagger.description = 'Get prompts from the prompt index.'

    #swagger.responses[200] = {
        description: 'Successful response containing prompts data.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', description: 'Indicates if the request was successful.' },
                        data: { 
                            type: 'array',
                            items: {
                                type: 'object'
                            },
                            description: 'Array of prompts.'
                        }
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
    const { page, search } = req.body;
    let search_query;
    if (search) {
      search_query = {
        index: process.env.PROMPT_INDEX!,
        suggest: {
          text: search,
          "name-suggest": {
            completion: {
              size: 5,
              field: "name.autocomplete",
              skip_duplicates: true,
              fuzzy: {
                fuzziness: 2
              }
            }
          }
        }
      }
    } else {
      search_query = {
        index: process.env.PROMPT_INDEX!,
        query: {
          match_all: {},
        },
        sort: [
          {
            updated_at: {
              order: 'desc',
            },
          },
        ],
        from: (page - 1) * 5,
        size: 5
      }
    }

    // @ts-ignore
    const es_data = await client.search(search_query);

    let data: LooseObject[] = [];
    if (search) {
      // @ts-ignore
      for (let detail of es_data.suggest["name-suggest"][0]["options"]) {
        data.push(detail._source!);
      }
    } else {
      for (let detail of es_data.hits.hits) {
        data.push(detail._source!);
      }
    }

    const counts = await client.count({
      index: process.env.PROMPT_INDEX!,
      query: {
        match_all: {},
      },
    });

    const totalPage = Math.ceil(counts.count / 5);

    return res.status(200).json({ success: true, data: data, totalPage: totalPage });
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

/**
 * Create a new prompt.
 *
 * @param {import('express').Request} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.prompt_name - The name of the prompt.
 * @param {string} req.body.prompt - The prompt content.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<Response>} A Promise that resolves when the operation is completed.
 *
 * @throws {Error} Will throw an error if there's an issue during the process.
 */
export const create_prompt = async (req: Request, res: Response): Promise<Response> => {
  /* #swagger.tags = ['Prompt']
   #swagger.description = 'Create a new prompt.'

   #swagger.requestBody = {
        required: true,
        schema: {
            type: 'object',
            properties: {
                prompt_name: { type: 'string', description: 'The name of the prompt.' },
                prompt: { type: 'string', description: 'The content of the prompt.' }
            }
        }
    }

   #swagger.responses[200] = {
        description: 'Successful response indicating the prompt was created successfully.',
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
    let prompt_id = crypto.randomBytes(5).toString('hex');
    const { prompt_name, prompt } = req.body;

    await client.index({
      index: process.env.PROMPT_INDEX!,
      id: prompt_id,
      refresh: true,
      document: {
        id: prompt_id,
        name: prompt_name,
        prompt: prompt,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
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
 * Edit an existing prompt.
 *
 * @param {import('express').Request} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.prompt_id - The ID of the prompt to edit.
 * @param {string} req.body.prompt_name - The new name of the prompt.
 * @param {string} req.body.prompt - The new content of the prompt.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<Response>} A Promise that resolves when the operation is completed.
 *
 * @throws {Error} Will throw an error if there's an issue during the process.
 */
export const edit_prompt = async (req: Request, res: Response): Promise<Response> => {
  /* #swagger.tags = ['Prompt']
   #swagger.description = 'Edit an existing prompt.'

   #swagger.requestBody = {
        required: true,
        schema: {
            type: 'object',
            properties: {
                prompt_id: { type: 'string', description: 'The ID of the prompt to edit.' },
                prompt_name: { type: 'string', description: 'The new name of the prompt.' },
                prompt: { type: 'string', description: 'The new content of the prompt.' }
            }
        }
    }

   #swagger.responses[200] = {
        description: 'Successful response indicating the prompt was edited successfully.',
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
    const { prompt_id, prompt_name, prompt } = req.body;

    await client.update({
      index: process.env.PROMPT_INDEX!,
      id: prompt_id,
      refresh: true,
      doc: {
        name: prompt_name,
        prompt: prompt,
        updated_at: new Date().toISOString(),
      },
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
 * Delete prompts by their IDs.
 *
 * @param {import('express').Request} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string[]} req.body.prompt_ids - Array of prompt IDs to delete.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<Response>} A Promise that resolves when the operation is completed.
 *
 * @throws {Error} Will throw an error if there's an issue during the process.
 */
export const delete_prompt = async (req: Request, res: Response): Promise<Response> => {
  /* #swagger.tags = ['Prompt']
   #swagger.description = 'Delete prompts by their IDs.'

   #swagger.requestBody = {
        required: true,
        schema: {
            type: 'object',
            properties: {
                prompt_ids: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Array of prompt IDs.'
                }
            }
        }
    }

   #swagger.responses[200] = {
        description: 'Successful response indicating the prompts were deleted successfully.',
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
    const { prompt_ids } = req.body;

    await client.bulk({
      body: prompt_ids.flatMap((doc: string) => [
        { delete: { _index: process.env.PROMPT_INDEX!, _id: doc } },
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

export const promptInferHandler = (io: any, socket: any) => {
  socket.on('/prompts/send_message', async (data: LooseObject) => {
    try {
      const { max_tokens, temperature, top_k, top_p, repetition_penalty, prompt, model_id } = data;

      // @ts-ignore
      const stream = await openai.chat.completions.create({
        repetition_penalty: parseFloat(repetition_penalty),
        max_tokens: parseInt(max_tokens),
        top_p: parseFloat(top_p),
        top_k: parseInt(top_k),
        temperature: parseFloat(temperature),
        model: model_id,
        messages: prompt,
        stream: true,
      });
      for await (const chunk of stream) {
        io.to(`${socket.id}`).emit('prompt:start', {
          result: chunk.choices[0].delta?.content || '',
          cold_start: undefined,
          response_time: undefined,// @ts-ignore
          prompt_tokens: chunk?.usage?.prompt_tokens,// @ts-ignore
          total_tokens: chunk?.usage?.total_tokens,// @ts-ignore
          completion_tokens: chunk?.usage?.completion_tokens,
        });
      }
      io.to(`${socket.id}`).emit('prompt:end');
    } catch (error: any) {
      if (error.code === 'ERR_STREAM_PREMATURE_CLOSE') {
        io.to(`${socket.id}`).emit('prompt:end');
      } else {
        io.to(`${socket.id}`).emit('prompt:start', {
          result: JSON.stringify(error),
          cold_start: undefined,
          response_time: undefined,
          prompt_tokens: undefined,
          total_tokens: undefined,
          completion_tokens: undefined,
        });
        io.to(`${socket.id}`).emit('prompt:end');
      }
    }
  });
};