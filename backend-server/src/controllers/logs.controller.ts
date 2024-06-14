// @ts-nocheck

import client from './../client/elasticsearch';
import { Request, Response } from 'express';
import { LooseObject } from './../types/elasticBody';

const exportData = (data, type) => {
  const info = [];

  data.map((entry) => {
    let obj = new Object();

    if (entry) {
      if (entry._source && entry._source.fields && entry._source.fields.meta) {
        obj['timestamp'] = entry._source['@timestamp'];

        const source = entry._source.fields.meta;

        obj['trace_id'] = source.trace_id;
        obj['feedback_count'] = source.feedback_count;

        let url;
        if (source.req) {
          obj['path_url'] = source.req.url;

          if (source.req.url === '/v1/completions') {
            url = '/v1/completions';
            if (source.req.body) {
              obj['request'] = source.req.body.prompt;
            }
          } else if (source.req.url === '/v1/chat/completions') {
            url = '/v1/chat/completions';
            if (
              source.req.body &&
              source.req.body.messages &&
              source.req.body.messages.length > 0
            ) {
              if (type === 'json') {
                obj['request'] = source.req.body.messages;
              } else {
                let request = '';
                source.req.body.messages.forEach((message) => {
                  let req = '';
                  req = req + message.role + ':\n';
                  req = req + message.content + '\n\n';

                  request = request + req;
                });
                obj['request'] = request;
              }
            }
          }
        }

        const res = source.res;
        if (res && res.body) {
          obj['model'] = res.body.model;

          if (res.body.server)
            obj['response_time'] = Number(res.body.server.response_time) * 1000;

          if (res.body.usage) {
            obj['prompt_tokens'] = res.body.usage.prompt_tokens;
            obj['completion_tokens'] = res.body.usage.completion_tokens;
          }

          if (res.body.choices && res.body.choices.length > 0) {
            if (url === '/v1/completions')
              obj['response'] = res.body.choices[0].text;
            else if (url === '/v1/chat/completions') {
              if (type === 'json') {
                obj['response'] = res.body.choices;
              } else {
                let response = '';
                res.body.choices.map((choice) => {
                  let res = '';
                  res = res + choice.message.role + ':\n';
                  res = res + choice.message.content + '\n\n';

                  response = response + res;
                });

                obj['response'] = response;
              }
            }
          }
        }
      }
    }
    info.push(obj);
  });

  return info;
};

/**
 * Get inference request logs.
 *
 * @param {import('express').Request} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {number} req.body.pageNumber - The page number for pagination.
 * @param {Object} req.body.filters - Filters for querying logs.
 * @param {string} req.body.filters.interval - Time interval for filtering logs.
 * @param {string[]} req.body.filters.model - Array of model names to filter logs by.
 * @param {string[]} req.body.filters.username - Array of usernames to filter logs by.
 * @param {string[]} req.body.filters.path - Array of paths to filter logs by.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<Response>} A Promise that resolves when the operation is completed.
 *
 * @throws {Error} Will throw an error if there's an issue during the process.
 */
export const get_logs = async (req: Request, res: Response): Promise<Response> => {
  /* 
    #swagger.tags = ['Logs']
    #swagger.description = 'Get inference request logs.'

    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Request body containing pagination information and filters.',
        required: true,
        schema: {
            type: 'object',
            properties: {
                pageNumber: { type: 'number', description: 'The page number for pagination.' },
                filters: {
                    type: 'object',
                    properties: {
                        interval: { type: 'string', description: 'Time interval for filtering logs.' },
                        model: { type: 'array', items: { type: 'string' }, description: 'Array of model names to filter logs by.' },
                        username: { type: 'array', items: { type: 'string' }, description: 'Array of usernames to filter logs by.' },
                        path: { type: 'array', items: { type: 'string' }, description: 'Array of paths to filter logs by.' }
                    }
                }
            }
        }
    }

   #swagger.responses[200] = {
        description: 'Successful response containing logs data.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', description: 'Indicates if the request was successful.' },
                        data: {
                            type: 'object',
                            properties: {
                                logs: { type: 'array', items: { type: 'object' }, description: 'Array of logs.' },
                                totalPages: { type: 'number', description: 'Total number of pages for pagination.' }
                            }
                        }
                    }
                }
            }
        }
    }

   #swagger.responses[500] = {
        description: 'Internal server error.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', description: 'Error message describing the issue.' },
                        success: { type: 'boolean', description: 'Indicates if the request was unsuccessful.' }
                    }
                }
            }
        }
    }
    */

  try {
    const { pageNumber, filters } = req.body;
    const startIndex = (pageNumber - 1) * 10;

    if (!await client.indices.exists({ index: process.env.INFERENCE_LOGS_INDEX! })) {
      return res.status(200).json({
        success: true,
        data: { logs: [], totalPages: 0 },
      });
    }

    let query = {
      bool: {
        must: [
          {
            exists: {
              field: 'fields.meta.trace_id',
            },
          },
        ],
      },
    };

    if (filters) {
      query.bool.must.push({
        range: {
          '@timestamp': {
            gte: `now-${filters.interval}`,
            lte: 'now',
          },
        },
      });
    }

    if (filters.model && filters.model.length > 0) {
      query.bool.must.push({
        terms: {
          'fields.meta.user.model.keyword': filters.model,
        },
      });
    }

    if (filters.username && filters.username.length > 0) {
      query.bool.must.push({
        terms: {
          'fields.meta.req.headers.metadata._user.keyword': filters.username,
        },
      });
    }

    if (filters.path && filters.path.length > 0) {
      query.bool.must.push({
        terms: {
          'fields.meta.req.url.keyword': filters.path,
        },
      });
    }

    const totalRecords = await client.count({
      index: process.env.INFERENCE_LOGS_INDEX!,
      query: query,
    });

    const inference_request_logs = await client.search({
      index: process.env.INFERENCE_LOGS_INDEX!,
      from: startIndex,
      size: 10,
      sort: [
        {
          '@timestamp': {
            order: 'desc',
          },
        },
      ],
      _source: [
        '@timestamp',
        'fields.meta.req.url',
        'fields.meta.res.body.usage',
        'fields.meta.req.model',
        'fields.meta.trace_id',
        'fields.meta.feedback_count',
        'fields.meta.req.headers.metadata._user',
        'fields.meta.res.statusCode',
        'fields.meta.req.server',
      ],
      query: query,
    });

    let data = inference_request_logs['hits']['hits'];

    let logs: LooseObject[] = [];
    data.map((entry) => {
      if (entry._source.fields.meta?.res?.body?.usage) {
        entry._source.fields.meta.total_tokens =
          entry._source.fields?.meta?.res?.body?.usage?.completion_tokens +
          (entry._source.fields?.meta?.res?.body?.usage?.prompt_tokens
            ? entry._source.fields?.meta?.res?.body?.usage?.prompt_tokens
            : 0);
        // delete entry._source.fields.meta.res.data.usage;
      }
      logs.push(entry._source);
    });

    return res.status(200).json({
      success: true,
      data: { logs, totalPages: totalRecords.count / 10 },
    });
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

/**
 *  Get logs based on the provided trace ID.
 *
 * @param {import('express').Request} req - The request object.
 * @param {string} req.body.traceId - The trace ID used to retrieve logs.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<Response>} A Promise that resolves when the operation is completed.
 *
 * @throws {Error} Will throw an error if there's an issue during the process.
 */
export const log_details = async (req: Request, res: Response): Promise<Response> => {
  /* #swagger.tags = ['Logs']
   #swagger.description = 'Get logs based on the provided trace ID.'

   #swagger.requestBody = {
        required: true,
        schema: {
            type: 'object',
            properties: {
                traceId: { type: 'string', description: 'The trace ID used to retrieve logs.' }
            }
        }
   }
   
   #swagger.responses[200] = {
        description: 'Successful response containing log data.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', description: 'Indicates if the request was successful.' },
                        data: { type: 'object', description: 'Log data.' }
                    }
                }
            }
        }
   }
   
   #swagger.responses[500] = {
        description: 'Internal server error.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', description: 'Error message describing the issue.' },
                        success: { type: 'boolean', description: 'Indicates if the request was unsuccessful.' }
                    }
                }
            }
        }
   }
*/

  try {
    const { traceId } = req.body;

    const logSummary = await client.search({
      index: process.env.INFERENCE_LOGS_INDEX!,
      query: {
        term: {
          'fields.meta.trace_id.keyword': traceId,
        },
      },
    });

    const log = logSummary.hits.hits[0]._source;

    log['fields']['meta']['req']['requestBody'] =
      log['fields']['meta']['requestBody'];

    delete log['fields']['meta']['requestBody'];

    res.status(200).json({ success: true, data: log });
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

/**
 * Retrieves unique fields from the inference logs based on the specified field type.
 *
 * @param {import('express').Response} res - The response object.
 * @param {import('express').Request} req - The request object.
 * @param {string} req.body.field - The field for which we are fetching distinct values.
 * @returns {Promise<Response>} A Promise that resolves when the operation is completed.
 *
 * @throws {Error} Will throw an error if there's an issue during the process.
 */
export const get_uniquefields = async (req: Request, res: Response): Promise<Response> => {
  /* #swagger.tags = ['Logs']
   #swagger.description = 'Get unique fields from the inference logs based on the specified field type.'
   
   #swagger.requestBody = {
        required: true,
        schema: {
            type: 'object',
            properties: {
                field: { 
                    type: 'string',
                    description: 'The type of field to retrieve unique values for.',
                    enum: ['models', 'users', 'paths']
                }
            }
        }
   }
   
   #swagger.responses[200] = {
        description: 'Successful response containing unique field values.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', description: 'Indicates if the request was successful.' },
                        data: { 
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    key: { type: 'string', description: 'The unique field value.' },
                                    doc_count: { type: 'integer', description: 'The count of documents with this value.' }
                                }
                            },
                            description: 'Array of unique field values with document count.'
                        }
                    }
                }
            }
        }
   }
   
   #swagger.responses[500] = {
        description: 'Internal server error.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', description: 'Error message describing the issue.' },
                        success: { type: 'boolean', description: 'Indicates if the request was unsuccessful.' }
                    }
                }
            }
        }
   }
*/
  try {
    const { field, interval } = req.body;

    const FIELDS = {
      models: 'fields.meta.req.model',
      users: 'fields.meta.req.headers.metadata._user',
      paths: 'fields.meta.req.url',
    };

    const fieldName = FIELDS[field];

    let query = {
      bool: {
        must: [
          {
            exists: {
              field: 'fields.meta.trace_id',
            },
          },
        ],
      },
    };

    if (interval) {
      const INTERVALS = ["15m", "60m", "24h", "7d", "14d", "30d", "90d"];
      if (INTERVALS.includes(interval) === false) {
        res.status(400).json({
          success: false,
          message: "invalid interval",
        });
        return;
      } else {
        query.bool.must.push({
          range: {
            "@timestamp": {
              gte: `now-${interval}`,
              lte: "now",
            },
          },
        });
      }
    }

    const inference_request_logs = await client.search({
      index: process.env.INFERENCE_LOGS_INDEX!,
      size: 0,
      query: query,
      aggs: {
        'unique-fields': {
          terms: {
            field: `${fieldName}.keyword`,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: inference_request_logs.aggregations
        ? inference_request_logs['aggregations']['unique-fields']['buckets']
        : [],
    });
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({ message: error.message, success: false });
  }
};

/**
 * Exports logs based on the provided parameters.
 *
 * @param {import('express').Response} res - The response object.
 * @param {import('express').Request} req - The request object.
 * @param {string} req.body.properties.type - "csv" | "json", type of data to be exported
 * @param {string} req.body.properties.interval - Time interval for which we want to fetch logs
 * @returns {Promise<Response>} A Promise that resolves when the operation is completed.
 *
 * @throws {Error} Will throw an error if there's an issue during the process.
 */
export const export_logs = async (req: Request, res: Response): Promise<Response> => {
  /* #swagger.tags = ['Logs']
   #swagger.description = 'Export logs based on the provided parameters.'
   
   #swagger.requestBody = {
        required: true,
        schema: {
            type: 'object',
            properties: {
                type: { 
                    type: 'string',
                    description: 'The type of export to perform.',
                    enum: ['csv', 'json']
                },
                interval: { 
                    type: 'string',
                    description: 'The time interval for the log data.',
                    example: '1d'
                }
            }
        }
   }
   
   #swagger.responses[200] = {
        description: 'Successful response containing exported log data.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', description: 'Indicates if the request was successful.' },
                        data: { type: 'object', description: 'Exported log data.' }
                    }
                }
            }
        }
   }
   
   #swagger.responses[500] = {
        description: 'Internal server error.',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', description: 'Error message describing the issue.' },
                        success: { type: 'boolean', description: 'Indicates if the request was unsuccessful.' }
                    }
                }
            }
        }
   }
*/

  try {
    let { type } = req.body;

    let query = {
      bool: {
        must: [
          {
            exists: {
              field: 'fields.meta.trace_id',
            },
          },
          {
            range: {
              '@timestamp': {
                gte: `now-${req.body.interval}`,
                lte: 'now',
              },
            },
          },
        ],
      },
    };

    const totalRecords = await client.count({
      index: process.env.INFERENCE_LOGS_INDEX!,
      query,
    });

    const inference_request_logs = await client.search({
      index: process.env.INFERENCE_LOGS_INDEX!,
      size: totalRecords.count,
      sort: [
        {
          '@timestamp': {
            order: 'desc',
          },
        },
      ],
      _source: [
        '@timestamp',
        'fields.meta.req.url',
        'fields.meta.req.body.max_tokens',
        'fields.meta.req.model',
        'fields.meta.trace_id',
        'fields.meta.res.body',
        'fields.meta.req.body',
      ],
      query: query,
    });

    const data = inference_request_logs['hits']['hits'];

    return res.status(200).json({ success: true, data: exportData(data, type) });
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({ message: error.message, success: false });
  }
};
