import axios from "axios";
import { Request, Response } from 'express';

export const health = async (req: Request, res: Response) => {
    try {
        const { server, model, model_id } = req.body
        let data;
        if (server === "triton") {
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `http://${model_id}.${process.env.DEPLOYMENT_NAMESPACE}.svc.cluster.local:8000/v2/health/ready`,
                headers: {}
            };
            data = await axios.request(config)
        } else {
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `http://${model_id}.${process.env.DEPLOYMENT_NAMESPACE}.svc.cluster.local:8000/health`,
                headers: {}
            };
            data = await axios.request(config)
        }

        return res.status(200).json()
    } catch (error: any) {
        return res.status(500).json({ message: error.message, success: false });
    }
}