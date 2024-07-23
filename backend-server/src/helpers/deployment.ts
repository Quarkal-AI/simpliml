import { k8sAppsApi, k8sCoreApi } from "./../client/kubernetes"
import { LooseObject } from "./../types/elasticBody";

let gpu_config = JSON.parse(process.env.GPU_CONFIGURATON!)

export const deploy_model = async (deployment_id: string, model_id: string, gpu: string, min: number, server: string) => {

    let llm_args: string[] = []
    if (server === "vllm") {
        llm_args = ["--model", model_id, "--trust-remote-code", "--host", "0.0.0.0", "--port", "8000"]
    } else if (server === "tgi") {
        llm_args = ["--model-id", model_id, "--trust-remote-code", "--hostname", "0.0.0.0", "--port", "8000"]
    } else if (server === "lmdeploy" ) {
        llm_args = ["lmdeploy", "serve", "api_server", model_id, "--server-port", "8000"]
    } else if (server === "sglang") {
        llm_args = ["python3", "-m", "sglang.launch_server", "--model-path", model_id, "--host", "0.0.0.0", "--port", "8000"]
    } else {
        // TO-DO
    }

    const deployemntBody = {
        kind: "Deployment",
        apiVersion: "apps/v1",
        metadata: {
            "name": deployment_id,
            "namespace": process.env.DEPLOYMENT_NAMESPACE,
            "labels": {
                "app": deployment_id
            }
        },
        spec: {
            replicas: min,
            selector: {
                matchLabels: {
                    app: deployment_id
                }
            },
            template: {
                metadata: {
                    labels: {
                        app: deployment_id
                    },
                },
                spec: {
                    containers: [
                        {
                            image: process.env[server.toUpperCase()],
                            imagePullPolicy: "IfNotPresent",
                            name: deployment_id,
                            args: llm_args,
                            env: [
                                {
                                    "name": "HF_TOKEN",
                                    "value": process.env.HF_TOKEN ? process.env.HF_TOKEN : ""
                                }
                            ],
                            ports: [
                                {
                                    "containerPort": 8000,
                                    "protocol": "TCP"
                                }
                            ],
                            resources: {
                                limits: {
                                    "nvidia.com/gpu": "1",
                                }
                            },
                            readinessProbe: {
                                httpGet: {
                                    path: "/health",
                                    port: 8000,
                                    scheme: "HTTP"
                                },
                                timeoutSeconds: 1,
                                periodSeconds: 10,
                                successThreshold: 1,
                                failureThreshold: 3
                            },
                            volumeMounts: [
                                {
                                    "mountPath": "/dev/shm",
                                    "name": "shm"
                                },
                            ]
                        },
                        {
                            "image": "ghcr.io/quarkal-ai/deploy-status:v1",
                            "name": "status-checker",
                            "imagePullPolicy": "IfNotPresent",
                            "env": [
                                {
                                    "name": "deployment_id",
                                    "value": deployment_id
                                },
                                {
                                    "name": "deployment_index",
                                    "value": process.env.DEPLOYMENT_INDEX
                                },
                                {
                                    "name": "es_host",
                                    "value": process.env.ES_HOST
                                },
                                {
                                    "name": "es_user",
                                    "value": process.env.ES_USERNAME
                                },
                                {
                                    "name": "es_password",
                                    "value": process.env.ES_PASSWORD
                                },
                                {
                                    "name": "namespace",
                                    "value": process.env.DEPLOYMENT_NAMESPACE
                                }
                            ]
                        }
                    ],
                    nodeSelector: gpu_config[gpu].selector,
                    serviceAccountName: "k8s-model",
                    volumes: [
                        {
                            "name": "shm",
                            "emptyDir": {
                                "medium": "Memory",
                                "sizeLimit": "10Gi"
                            }
                        }
                    ]
                }
            }
        }
    }

    const serviceBody = {
        kind: "Service",
        apiVersion: "v1",
        metadata: {
            "name": `svc-${deployment_id}`,
            "namespace": process.env.DEPLOYMENT_NAMESPACE,
        },
        spec: {
            selector: {
                "app": deployment_id
            },
            ports: [
                {
                    "protocol": "TCP",
                    "port": 8000,
                    "targetPort": 8000
                }
            ]
        }
    }

    const deployResponse = k8sAppsApi.createNamespacedDeployment(process.env.DEPLOYMENT_NAMESPACE!, deployemntBody)
    const serviceResponse = k8sCoreApi.createNamespacedService(process.env.DEPLOYMENT_NAMESPACE!, serviceBody)

    await Promise.all([deployResponse, serviceResponse])
    return true
}

export const delete_model = async (deployment_ids: []) => {
    await Promise.all([
        deployment_ids.map(async (id) => {
            k8sAppsApi.deleteNamespacedDeployment(id, process.env.DEPLOYMENT_NAMESPACE!)
        }), deployment_ids.map(async (id) => {
            k8sCoreApi.deleteNamespacedService(`svc-${id}`, process.env.DEPLOYMENT_NAMESPACE!)
        })]);
    return true
}

export const edit_model = async (deployment_id: string, edit_meta: LooseObject) => {
    const res_deploy = await k8sAppsApi.readNamespacedDeployment(deployment_id, process.env.DEPLOYMENT_NAMESPACE!)

    if (res_deploy.body.spec && edit_meta["replicas"]) {
        res_deploy.body.spec.replicas = edit_meta["replicas"]
    }
    if (res_deploy.body.spec?.template.spec && edit_meta["gpu"]) {
        res_deploy.body.spec.template.spec.nodeSelector = gpu_config[edit_meta["gpu"]].selector
    }

    await k8sAppsApi.replaceNamespacedDeployment(deployment_id, process.env.DEPLOYMENT_NAMESPACE!, res_deploy.body)
    return true
}