import client from "./../client/elasticsearch";
const delay = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms))


export const updateResponse = async (data: {}, trace_id: string) => {

    await delay(1000);
    await client.updateByQuery({
        index: process.env.INFERENCE_LOGS_INDEX!,
        refresh: true,
        script: {
            lang: 'painless',
            source: 'ctx._source.fields.meta.res.body = params.data',
            params: {
                data
            }
        },
        query: {
            term: {
                "fields.meta.trace_id.keyword": {
                    value: trace_id
                }
            }
        }
    })
    return;
}