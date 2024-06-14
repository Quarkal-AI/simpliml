import client from "./../client/elasticsearch";
import { LooseObject } from "./../types/elasticBody";

const regex = RegExp('{{([^}]+)}}', 'g');

export const formatPrompt = async (variables: LooseObject, prompt_id: string) => {
    const es_data: LooseObject = await client.get({
        index: process.env.PROMPT_INDEX!,
        id: prompt_id,
        _source: ["prompt"]
    });

    if (!es_data.found) return false
    for (let chunk of es_data._source.prompt) {
        delete chunk.id
        while (true) {
            const match = regex.exec(chunk["message"]);
            if (!match) break;
            console.log(match, variables[match[1]])
            chunk["content"] = chunk["message"].replace(`{{${match[1]}}}`, variables[match[1]] ? variables[match[1]] : `{{${match[1]}}}`)
            delete chunk.message
        }
    }

    return es_data._source.prompt
}