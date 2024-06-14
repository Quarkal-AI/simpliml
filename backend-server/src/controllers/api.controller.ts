import { Request, Response } from 'express';

export const api = async (req: Request, res: Response): Promise<Response> => {
    /* #swagger.tags = ['API Key']
   #swagger.description = 'Get the API key'

   #swagger.responses[200] = {
        description: 'Successful response indicating the deployments were deleted successfully.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', description: 'Indicates if the request was successful.' },
                        data: {
                            type: 'object',
                            properties: {
                                hfToken: { type: 'string', description: 'Huggingface Token'},
                                apiToken: { type: 'string', description: 'SimpliML Token'}
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
        return res.status(200).json({ success: true, data: {hfToken: process.env.HF_TOKEN, apiToken: process.env.API_KEY} });
    } catch (error: any) {
        console.error(error)
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
}