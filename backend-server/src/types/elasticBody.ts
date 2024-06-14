export interface DeploymentSource {
    id: string;
    model_id: string;
    maxReplicas: number;
    minReplicas: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
    status: string;
    gpu: string;
    total_runs?: number;
}

export interface LooseObject {
    [key: string]: any
}