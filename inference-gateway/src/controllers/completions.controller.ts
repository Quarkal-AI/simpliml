import { Response } from 'express';
import { updateResponse } from "./../helpers/updateStreamRes"
import OpenAI from 'openai';
import { CustomRequest } from "./../types/requestBody";

async function updateStreamRes(id: string, trace_id: string, created: number, model: string, text: string, finish_reason: string, usage: {}) {
    const resBody = {
        "id": id,
        "object": "text_completion",
        "created": created,
        "model": model,
        "choices": [
            {
                "index": 0,
                "text": text,
                "logprobs": null,
                "finish_reason": finish_reason,
                "stop_reason": null
            }
        ],
        "usage": usage
    }
    await updateResponse(resBody, trace_id)
}

export const completions = async (req: CustomRequest, res: Response) => {
    try {
        /* #swagger.tags = ['Completions']
   #swagger.description = 'OpenAI compatible chat inference endpoint'

   #swagger.requestBody = {
        required: true,
        schema: {
            type: 'object',
            properties: {
                model: {
                    type: 'string',
                    description: 'deployment id of the model'
                },
                prompt: {
                    type: 'string',
                    description: 'Array of object containing role and content'
                },
                temperature: {
                    type: 'number',
                    description: ''
                },
                stream: {
                    type: 'boolean',
                    description: ''
                },
                top_p: {
                    type: 'number',
                    description: ''
                },
                top_k: {
                    type: 'number',
                    description: ''
                },
                frequency_penalty: {
                    type: 'number',
                    description: ''
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
        const { prompt, temperature, top_p, max_tokens, stop, stream, model_id } = req.body

        const client = new OpenAI({
            apiKey: "EMPTY",
            baseURL: `http://${model_id}.${process.env.DEPLOYMENT_NAMESPACE}.svc.cluster.local:8000/v1`
        })

        const Completion = await client.completions.create({
            prompt: prompt,
            model: req.model,
            temperature: temperature ? temperature : 1.0,
            top_p: top_p ? top_p : 0.9,
            max_tokens: max_tokens ? max_tokens : 256,
            stop: stop ? stop : [],
            stream: stream ? stream : false
        });

        if (stream) {
            let stream_ans = "";
            let id, usage, created, finish_reason;
            // @ts-ignore
            for await (const chunk of Completion) {
                id = chunk.id
                created = chunk.created
                stream_ans += chunk.choices[0]?.text
                if (chunk.usage) {
                    finish_reason = chunk.choices[0]?.finish_reason
                    usage = chunk.usage
                }
                res.write("data: " + JSON.stringify(chunk) + "\n\n");
            }
            updateStreamRes(id, req.trace_id, created, req.model, stream_ans, finish_reason, usage)
            return res.end();
        } else {
            return res.status(200).json(Completion)
        }
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({ message: error.message, success: false });
    }
}