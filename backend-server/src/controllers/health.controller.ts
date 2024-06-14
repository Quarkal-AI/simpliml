import { Request, Response } from 'express';

export const health = async (req: Request, res: Response): Promise<Response> => {
    /*  #swagger.description = 'Healthcheck route for the server'*/
    try {
        return res.status(200).json({ success: true });
    } catch (error: any) {
        console.error(error)
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
}