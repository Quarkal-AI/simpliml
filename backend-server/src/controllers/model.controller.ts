import openai from './../client/openai';
import { Request, Response, NextFunction } from 'express';
import elasticClient from '../client/elasticsearch';
import { LooseObject } from 'elasticBody';

async function get_model_hits(id: string) {
    let hits_res = await elasticClient.count({
        index: process.env.INFERENCE_LOGS_INDEX,
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

export const get_model_by_id = async (req: Request, res: Response, next: NextFunction) => {
    /* #swagger.tags = ['Model']
   #swagger.description = 'Get the details of deployed model by id'

   #swagger.parameters['id'] = {
        in: 'query',
        description: 'Deploymnet ID to fetch details for'
        type: 'string'
    }

   #swagger.responses[200] = {
        description: 'Successful response indicating that details are fecthed successfully.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', description: 'Indicates if the request was successful.' },
                        data: { type: 'object', description: 'Object conating deployed model details' }
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
        const id = req.params.id;
        var model: LooseObject = await elasticClient.get({
            index: process.env.DEPLOYMENT_INDEX!,
            id
        });
        model['_source']['total_runs'] = await get_model_hits(id);

        return res.status(200).json({ data: model['_source'], success: true });
    } catch (error: any) {
        console.error(error)
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};

export const modelInferHandler = async (io: any, socket: any) => {
    socket.on('/models/infer', async (data: LooseObject) => {
        try {
            const { max_tokens, temperature, top_k, top_p, repetition_penalty, prompt, model } = data;
            // @ts-ignore
            const stream = await openai.completions.create({
                repetition_penalty: parseFloat(repetition_penalty),
                max_tokens: parseInt(max_tokens),
                top_p: parseFloat(top_p),
                top_k: parseInt(top_k),
                temperature: parseFloat(temperature),
                prompt: prompt,
                model: model,
                stream: true,
            });

            for await (const chunk of stream) {
                io.to(`${socket.id}`).emit('result', {
                    result: chunk.choices[0]?.text || "",
                    cold_start: undefined,
                    response_time: undefined,// @ts-ignore
                    prompt_tokens: chunk?.usage?.prompt_tokens,// @ts-ignore
                    total_tokens: chunk?.usage?.total_tokens,// @ts-ignore
                    completion_tokens: chunk?.usage?.completion_tokens,
                });
            }
            io.to(`${socket.id}`).emit('stream:ended');
        } catch (error: any) {
            if (error.code === 'ERR_STREAM_PREMATURE_CLOSE') {
                io.to(`${socket.id}`).emit('stream:ended');
            } else {
                io.to(`${socket.id}`).emit('result', {
                    result: JSON.stringify(error),
                    cold_start: undefined,
                    response_time: undefined,
                    prompt_tokens: undefined,
                    total_tokens: undefined,
                    completion_tokens: undefined,
                });
                io.to(`${socket.id}`).emit('stream:ended');
            }
        }
    });
};