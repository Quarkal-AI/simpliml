import { Response } from 'express';
import { updateResponse } from "./../helpers/updateStreamRes"
import { formatPrompt } from "./../helpers/promptFormatter"
import OpenAI from 'openai';
import { LooseObject } from "./../types/elasticBody";
import { CustomRequest } from "./../types/requestBody";


async function updateStreamRes(id: string, trace_id: string, created: number, model: string, text: string, finish_reason: string, usage: {}) {
    const resBody = {
        "id": id,
        "object": "chat.completion",
        "created": created,
        "model": model,
        "choices": [
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": text
                },
                "logprobs": null,
                "finish_reason": finish_reason,
                "stop_reason": null
            }
        ],
        "usage": usage
    }
    await updateResponse(resBody, trace_id)
}

export const chat = async (req: CustomRequest, res: Response) => {
    /* #swagger.tags = ['Chat']
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
                messages: {
                    type: 'array',
                    description: 'Array of object containing role and content'
                },
                temperature: {
                    type: 'float',
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
                    type: 'float',
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
    try {
        const { messages, temperature, top_p, max_tokens, stop, stream, prompt_variables, prompt_id, model_id } = req.body

        let prompt_res: LooseObject = {};
        const client = new OpenAI({
            apiKey: "EMPTY",
            baseURL: `http://${model_id}.${process.env.DEPLOYMENT_NAMESPACE}.svc.cluster.local:8000/v1`
        })

        if (prompt_id) {
            if (!prompt_variables) return res.status(422).json({ success: false, message: "The prompt_variables is missing" });
            prompt_res = await formatPrompt(prompt_variables, prompt_id)
            if (!prompt_res) return res.status(422).json({ success: false, message: "The prompt_id is invalid. Please check the prompt_id" });
        }

        const Chat = await client.chat.completions.create({
            messages: prompt_id ? prompt_res["prompt"] : messages,
            model: req.model,
            temperature: temperature ? temperature : 1.0,
            top_p: top_p ? top_p : 0.9,
            max_tokens: max_tokens ? max_tokens : 256,
            stop: stop ? stop : [],
            stream: stream ? stream : false,
            stream_options: {
                include_usage: true
            }
        });

        if (stream) {
            let stream_ans = "";
            let id, usage, created, finish_reason;
            // @ts-ignore
            for await (const chunk of Chat) {
                id = chunk.id
                created = chunk.created
                stream_ans += chunk.choices[0]?.delta?.content ? chunk.choices[0]?.delta?.content : ""
                if (chunk.usage) {
                    finish_reason = chunk.choices[0]?.finish_reason
                    usage = chunk.usage
                }
                res.write("data: " + JSON.stringify(chunk) + "\n\n");
            }
            updateStreamRes(id, req.trace_id, created, req.model, stream_ans, finish_reason, usage)
            return res.end();
        } else {
            return res.status(200).json(Chat)
        }
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({ message: "Unexpected error at server", success: false });
    }
}