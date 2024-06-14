import { PromptType } from "@/app/promptstore/_components/PromptCard";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const deploymentFormAtom = atom({
  key: "deployment-form",
  default: {
    model_id: "",
    containers: 1,
    deployment_name: "",
    description: "",
    model_type: "text-generation",
    server: "vllm",
    gpu: ""
  },
});


export const promptStoreModelSettings = atom({
  key: "prompt-store-model-settings",
  default: {
    model_id: "",
    max_tokens: "100",
    temperature: "1.0",
    top_p: "0.92",
    top_k: "40",
    repetition_penalty: "1.0",
    formData: "",
  },
});

export const systemPromptAtom = atom({
  key: "system-prompt",
  default: "",
});

interface propmtVariable {
  id: number;
  variables: string[];
}

export const promptVariable = atom<propmtVariable[]>({
  key: "prompt-variable",
  default: [{ id: 0, variables: [] }],
});

export const promptInputAtom = atom({
  key: "prompt-input",
  default: "",
});

export const promptResponseAtom = atom({
  key: "prompt-response",
  default: {
    data: "",
    responseTime: "",
    coldTime: "",
    promptToken: "",
    completionToken: "",
    totalToken: "",
  },
});

interface DatasetForm {
  file: File | null;
  dataset_id: string;
}

export const datasetFormAtom = atom<DatasetForm>({
  key: "dataset-form",
  default: {
    file: null,
    dataset_id: "",
  },
});
export const platformAtom = atom({
  key: "platform-form",
  default: {
    platform: "",
  },
});

interface finetuningModalFormData {
  pipeline_name: string;
  num_epochs: number;
  lr: number;
  batch_size: number;
  lora_alpha: number;
  hf_id?:string;
  lora_r: number;
  lora_dropout: number;
  model: string;
  finetuning_method: string;
  gpu: string;
  optimizer: string;
  upload_model_to_hf: boolean;
}

export const fineTuningFormAtom = atom<finetuningModalFormData>({
  key: "fine-tuning-form",
  default: {
    pipeline_name: "",
    num_epochs: 2,
    lr: 0.0002,
    batch_size: 2,
    lora_alpha: 16,
    lora_r: 8,
    lora_dropout: 0.05,
    model: "",
    finetuning_method: "",
    gpu: "",
    optimizer: "",
    upload_model_to_hf: false,
  },
});

export const sideBarStateAtom = atom<string>({
  key: "sidebar-state",
  default: "models",
  effects_UNSTABLE: [persistAtom],
});

export const settingTabAtom = atom<string>({
  key: "setting-tab",
  default: "profile",
  effects_UNSTABLE: [persistAtom],
});

export const deleteConfirmationAtom = atom({
  key: "delete-confirmation",
  default: { id: "", show: false, delete: false },
});

// for showing edit modal for a specific model
export const editModalAtom = atom({
  key: "edit-modal",
  default: { id: "", show: false },
});

export const editInstanceAtom=atom({
  key:"edit-instance",
  default:{ id: "", show: false, state:'' as string }
})

export const sidebarAtom=atom({
key:"sidebar-atom",
default:true
})
// state for storing the search results while searching for a model
export const searchModelAtom = atom({
  key: "model-search",
  default: [
    {
      image: "",
      author: "",
      deployment_name: "",
      description: "",
      created_at: "",
      license: "",
      status: "",
    },
  ],
});

// array containing a list of user prompt inputs while creating prompt list
export const userPromptsAtom = atom<
  { id: number; role: string; content: string }[]
>({
  key: "prompts",
  default: [
    {
      id: Math.floor(Math.random() * 200),
      role: "user",
      content: "",
    },
  ],
});

export const editPromptAtom = atom({
  key: "editPrompt",
  default: <PromptType>{},
});

// to store the prompts that are selected for deletion
export const checkedPromptsAtom = atom<string[]>({
  key: "selectedPrompts",
  default: [],
});

