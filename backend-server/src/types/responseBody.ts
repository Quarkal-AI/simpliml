import type { Response } from 'express';

interface GetDeploymentData {
    "model_id": string,
    "maxReplicas": number,
    "minReplicas": number,
    "deployment_name": string,
    "description": string,
    "license": string,
    "author": string,
    "created_at": string,
    "status": string,
    "gpu": string,
    "id": string,
    "total_runs": number
}

export default interface GetDeploymentResponse extends Response {
    data: GetDeploymentData[];
    success: boolean;
    total_page: number;
}