import { k8sJobsApi, k8sCoreApi } from "./../client/kubernetes"
let gpu_config = JSON.parse(process.env.GPU_CONFIGURATON!)

export const create_job = async (pipeline_id: string, command: string, model_id: string, gpu: string, dataset_id: string) => {
    let job_yaml = {
        "kind": "Job",
        "apiVersion": "batch/v1",
        "metadata": {
            "name": pipeline_id,
            "namespace": process.env.FINETUNING_NAMESPACE
        },
        "spec": {
            "backoffLimit": 1,
            "template": {
                "spec": {
                    "nodeSelector": gpu_config[gpu].selector,
                    "serviceAccountName": "k8s-model",
                    "volumes": [
                        {
                            "name": "shm",
                            "emptyDir": {
                                "medium": "Memory",
                                "sizeLimit": "16Gi"
                            }
                        },
                        {
                            "name": "ssd",
                            "persistentVolumeClaim": {
                                "claimName": "nfs-ssd-pvc"
                            }
                        }
                    ],
                    "containers": [
                        {
                            "tty": true,
                            "name": pipeline_id,
                            "image": "ghcr.io/quarkal-ai/llm-trainer:v1",
                            "env": [
                                {
                                    "name": "DATASET_ID",
                                    "value": dataset_id
                                },
                                {
                                    "name": "PYTHONWARNINGS",
                                    "value": "ignore"
                                },
                                {
                                    "name": "job_id",
                                    "value": pipeline_id
                                },
                                {
                                    "name": "base_model",
                                    "value": model_id
                                },
                                {
                                    "name": "PYTHONUNBUFFERED",
                                    "value": "1"
                                },
                                {
                                    "name": "HF_TOKEN",
                                    "value": process.env.HF_TOKEN ? process.env.HF_TOKEN : ""
                                },
                                {
                                    "name": "backend_url",
                                    "value": process.env.BACKEND_SERVER_URL!
                                },
                                {
                                    "name": "es_host",
                                    "value": process.env.ES_HOST!
                                },
                                {
                                    "name": "es_user",
                                    "value": process.env.ES_USERNAME!
                                },
                                {
                                    "name": "es_password",
                                    "value": process.env.ES_PASSWORD!
                                },
                                {
                                    "name": "index_name",
                                    "value": process.env.FINETUNING_INDEX!
                                }
                            ],
                            "command": ["/bin/bash", "-c", command],
                            "resources": {
                                "limits": {
                                    "nvidia.com/gpu": "1",
                                }
                            },
                            "imagePullPolicy": "IfNotPresent",
                            "volumeMounts": [
                                {
                                    "mountPath": "/dev/shm",
                                    "name": "shm"
                                },
                                {
                                    "mountPath": "/root/.cache/huggingface/hub",
                                    "name": "ssd",
                                    "subPath": "models"
                                },
                                {
                                    "mountPath": "/app/data",
                                    "name": "ssd",
                                    "subPath": "datasets"
                                },
                                {
                                    "mountPath": "/app/output",
                                    "name": "ssd",
                                    "subPath": "finetune_output"
                                },
                                {
                                    "mountPath": "/app/logs",
                                    "name": "ssd",
                                    "subPath": "finetuning_logs"
                                }
                            ]
                        },
                    ],
                    "restartPolicy": "Never",
                    "terminationGracePeriodSeconds": 30,
                }
            }
        }
    }

    await k8sJobsApi.createNamespacedJob(process.env.FINETUNING_NAMESPACE!, job_yaml)
}

export const delete_job = async (pipeline_ids: []) => {
    await Promise.all([
        pipeline_ids.map(async (id) => {
            k8sJobsApi.deleteNamespacedJob(id, process.env.FINETUNING_NAMESPACE!, undefined, undefined, 0, undefined, "Foreground")
        })]);
    return true
}

export const fetch_logs = async (pipeline_id: string) => {
    const pod = await k8sCoreApi.listNamespacedPod(process.env.FINETUNING_NAMESPACE!, undefined, undefined, undefined, undefined, `job-name=${pipeline_id}`)
    const logs = await k8sCoreApi.readNamespacedPodLog(pod.body.items[0]?.metadata?.name!, process.env.FINETUNING_NAMESPACE!, pipeline_id);
    return logs
}