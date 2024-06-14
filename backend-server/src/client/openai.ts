import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: "EMPTY",
    baseURL: process.env.INFERENCE_SERVER_URL,
    defaultHeaders: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
    }
});

export default openai