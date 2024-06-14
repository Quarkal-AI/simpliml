import { KubeConfig, AppsV1Api, BatchV1Api, CoreV1Api } from "@kubernetes/client-node";

const kc = new KubeConfig();
kc.loadFromDefault();

export const k8sAppsApi = kc.makeApiClient(AppsV1Api);
export const k8sJobsApi = kc.makeApiClient(BatchV1Api);
export const k8sCoreApi = kc.makeApiClient(CoreV1Api);