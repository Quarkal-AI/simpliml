import client from "./../client/elasticsearch"
import { v4 as uuidv4 } from 'uuid';
import { Response, NextFunction } from 'express';
import { CustomRequest } from "./../types/requestBody";
import { DeploymentSource } from "./../types/elasticBody";

export const authenticate = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1];

        if (!token) {
            return res.status(403).json({ success: false, message: "Error! Missing API key." });
        }

        if (process.env.API_KEY !== token) {
            return res.status(401).json({ success: false, message: 'Access Denied' })
        }

        const es_data = await client.get<DeploymentSource>({
            index: process.env.DEPLOYMENT_INDEX!,
            id: req.body.model,
            _source: ["model_id", "server"],
        }, {
            ignore: [404]
        })

        if (!es_data.found) {
            return res.status(404).json({ success: false, message: 'Model does not exists' })
        }

        req.server = es_data._source?.server!
        req.model = es_data._source?.model_id!
        req.trace_id = uuidv4();

        return next();
    } catch (error: any) {
        console.log("error", error)
        return res.status(500).json({
            message: error.message,
            success: false,
        });
    }
}
