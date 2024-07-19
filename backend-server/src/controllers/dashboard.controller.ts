import client from './../client/elasticsearch';
import { Request, Response } from 'express';
import { LooseObject } from './../types/elasticBody';

/**
 * Retrieves deployments from the inference index.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<Response>} A Promise that resolves when the operation is completed.
 *
 * @throws {Error} Will throw an error if there's an issue during the process.
 */

export const get_analytics_data = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  // #swagger.tags = ['Dashboard']

  /* #swagger.requestBody = {
      required: true,
      content: {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      selectedInterval: {
                          type: "string",
                          example: "15d/d"
                      }
                  }
              }
          }
      }
  } */

  /* #swagger.responses[200] = {
      description: 'Analytics data retrieved successfully.',
      content: {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      data: {
                          type: "object",
                          properties: {
                              total_tokens: {
                                  type: "array",
                                  items: {
                                      type: "object",
                                      properties: {
                                          key_as_string: { type: "string", example: "2024-06-10" },
                                          key: { type: "integer", example: 1717977600000 },
                                          doc_count: { type: "integer", example: 0 },
                                          completion_tokens: {
                                              type: "object",
                                              properties: { value: { type: "integer", example: 0 } }
                                          },
                                          prompt_tokens: {
                                              type: "object",
                                              properties: { value: { type: "integer", example: 0 } }
                                          }
                                      }
                                  }
                              },
                              diff_error: {
                                  type: "array",
                                  items: {
                                      type: "object",
                                      properties: {
                                          key_as_string: { type: "string", example: "2024-06-10" },
                                          key: { type: "integer", example: 1717977600000 },
                                          doc_count: { type: "integer", example: 0 },
                                          total_errors: {
                                              type: "object",
                                              properties: { value: { type: "integer", example: 0 } }
                                          }
                                      }
                                  }
                              },
                              request_graph: {
                                  type: "array",
                                  items: {
                                      type: "object",
                                      properties: {
                                          key_as_string: { type: "string", example: "2024-06-10" },
                                          key: { type: "integer", example: 1717977600000 },
                                          doc_count: { type: "integer", example: 0 }
                                      }
                                  }
                              }
                          }
                      },
                      success: { type: "boolean", example: true }
                  }
              }
          }
      }
  } */

  /* #swagger.responses[500] = {
      description: 'Unexpected Error at Server. Please try again.',
      content: {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      message: { type: "string", example: "Unexpected Error at Server. Please try again!!" },
                      success: { type: "boolean", example: false }
                  }
              }
          }
      }
  } */
  try {
    const { selectedInterval } = req.body;
    let interval = '1d';
    let timePeriod = selectedInterval;
    if (selectedInterval && selectedInterval === '90d/d')
      interval = '15d';
    else if (
      selectedInterval &&
      (selectedInterval === '6M/M' ||
        selectedInterval === '1y/y')
    )
      interval = '15d';
    timePeriod = selectedInterval;
    let day = parseInt(timePeriod.split('d')[0]);
    if (timePeriod.includes('M/M')) {
      day = 180;
    } else if (timePeriod.includes('y/y')) {
      day = 360;
    }
    day = day - 1;
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
                gte: `now-${timePeriod}`,
                lte: 'now',
              },
            },
          },
        ],
      },
    };
    let es_total_tokens = client.search({
      index: process.env.INFERENCE_LOGS_INDEX,
      query: query,
      size: 0,
      aggs: {
        dates: {
          date_histogram: {
            field: '@timestamp',
            format: 'yyyy-MM-dd',
            fixed_interval: interval,
            min_doc_count: 0,
            extended_bounds: {
              min: `now-${timePeriod}`,
              max: 'now',
            },
          },
          aggs: {
            completion_tokens: {
              sum: {
                field: 'fields.meta.res.body.usage.completion_tokens',
              },
            },
            prompt_tokens: {
              sum: {
                field: 'fields.meta.res.body.usage.prompt_tokens',
              },
            },
          },
        },
      },
    });

    let error_query = JSON.parse(JSON.stringify(query));
    error_query.bool.must.push({
      bool: {
        must_not: [
          {
            term: {
              'fields.meta.res.statusCode': {
                value: 200,
              },
            },
          },
        ],
      },
    });
    let es_diff_error = client.search({
      index: process.env.INFERENCE_LOGS_INDEX,
      query: error_query,
      size: 0,
      aggs: {
        dates: {
          date_histogram: {
            field: '@timestamp',
            format: 'yyyy-MM-dd',
            fixed_interval: interval,
            min_doc_count: 0,
            extended_bounds: {
              min: `now-${timePeriod}`,
              max: 'now',
            },
          },
          aggs: {
            total_errors: {
              value_count: {
                field: 'fields.meta.res.statusCode',
              },
            },
          },
        },
      },
    });
    let es_requestsgraph = client.search({
      index: process.env.INFERENCE_LOGS_INDEX,
      query: query,
      size: 0,
      aggs: {
        requests_per_day: {
          date_histogram: {
            field: '@timestamp',
            format: 'yyyy-MM-dd',
            fixed_interval: interval,
            min_doc_count: 0,
            extended_bounds: {
              min: `now-${timePeriod}`,
              max: 'now',
            },
          },
        },
      },
    });
    let es_data: [LooseObject, LooseObject, LooseObject] = await Promise.all([
      es_total_tokens,
      es_diff_error,
      es_requestsgraph,
    ]);
    let analytics_data = {
      total_tokens: es_data[0]?.aggregations.dates.buckets,
      diff_error: es_data[1].aggregations.dates.buckets,
      request_graph: es_data[2].aggregations.requests_per_day.buckets,
    };
    return res.status(200).json({ data: analytics_data, success: true });
  } catch (error: any) {
    return res.status(500).json({
      message: 'Unexpected Error at Sevrer. Please try again!!',
      success: false,
    });
  }
};

/**
 * Retrieves quantitative data from the inference index.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<Response>} A Promise that resolves when the operation is completed.
 *
 * @throws {Error} Will throw an error if there's an issue during the process.
 */

export const get_quantitative_data = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  // #swagger.tags = ['Dashboard']

  /* #swagger.requestBody = {
      required: true,
      content: {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      selectedInterval: {
                          type: "string",
                          example: "1d/d"
                      }
                  }
              }
          }
      }
  } */

  /* #swagger.responses[200] = {
      description: 'Quantitative data retrieved successfully.',
      content: {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      data: {
                          type: "object",
                          properties: {
                              average_latency: { type: "number", example: 0 },
                              requests: { type: "integer", example: 57 },
                              input_tokens: { type: "integer", example: 147 },
                              output_tokens: { type: "integer", example: 277 }
                          }
                      },
                      success: { type: "boolean", example: true }
                  }
              }
          }
      }
  } */

  /* #swagger.responses[500] = {
      description: 'Unexpected Error at Server. Please try again.',
      content: {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      message: { type: "string", example: "Unexpected Error at Server. Please try again!!" },
                      success: { type: "boolean", example: false }
                  }
              }
          }
      }
  } */
  try {
    const { selectedInterval } = req.body;
    let interval = '1d';
    let timePeriod = selectedInterval;
    if (selectedInterval && selectedInterval === '90d/d')
      interval = '15d';
    else if (
      selectedInterval &&
      (selectedInterval === '6M/M' ||
        selectedInterval === '1y/y')
    )
      interval = '15d';

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
                gte: `now-${timePeriod}`,
                lte: 'now',
              },
            },
          },
        ],
      },
    };

    let es_total_tokens = client.search({
      index: process.env.INFERENCE_LOGS_INDEX,
      query: query,
      size: 0,
      aggs: {
        dates: {
          date_histogram: {
            field: '@timestamp',
            format: 'yyyy-MM-dd',
            fixed_interval: interval,
            min_doc_count: 0,
            extended_bounds: {
              min: `now-${timePeriod}`,
              max: 'now',
            },
          },
          aggs: {
            completion_tokens: {
              sum: {
                field: 'fields.meta.res.body.usage.completion_tokens',
              },
            },
            prompt_tokens: {
              sum: {
                field: 'fields.meta.res.body.usage.prompt_tokens',
              },
            },
          },
        },
      },
    });

    let es_requests = client.count({
      index: process.env.INFERENCE_LOGS_INDEX,
      query: query,
    });

    let latency_query = JSON.parse(JSON.stringify(query));

    latency_query.bool.must.push({
      exists: {
        field: 'fields.meta.responseTime',
      },
    });

    let es_avg_latency = client.search({
      index: process.env.INFERENCE_LOGS_INDEX,
      query: latency_query,
      size: 0,
      aggs: {
        average_resp: {
          avg: {
            field: 'fields.meta.responseTime',
          },
        },
      },
    });

    let es_data: [LooseObject, LooseObject, LooseObject] = await Promise.all([
      es_avg_latency,
      es_requests,
      es_total_tokens,
    ]);

    let input_tokens = 0;
    let output_tokens = 0;

    for (const data of es_data[2].aggregations.dates.buckets) {
      input_tokens += data.prompt_tokens.value;
      output_tokens += data.completion_tokens.value;
    }

    let quantitative_data = {
      average_latency:
        es_data[0].aggregations.average_resp.value === null
          ? 0
          : es_data[0].aggregations.average_resp.value,
      requests: es_data[1].count,
      input_tokens: input_tokens,
      output_tokens: output_tokens,
    };

    return res.status(200).json({ data: quantitative_data, success: true });
  } catch (error) {
    return res.status(500).json({
      message: 'Unexpected Error at Sevrer. Please try again!!',
      success: false,
    });
  }
};

/**
 * Retrieves user data from the inference index.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<Response>} A Promise that resolves when the operation is completed.
 * @throws {Error} Will throw an error if there's an issue during the process.
 */

export const get_users_data = async (req: Request, res: Response) => {
  // #swagger.tags = ['Dashboard']

  /* #swagger.requestBody = {
      required: true,
      content: {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      selectedInterval: {
                          type: "string",
                          example: "1d"
                      }
                  }
              }
          }
      }
  } */

  /* #swagger.responses[200] = {
      description: 'User data retrieved successfully.',
      content: {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      data: {
                          type: "object",
                          properties: {
                              users: {
                                  type: "array",
                                  items: {
                                      type: "object",
                                      properties: {
                                          key: { type: "string", example: "none" },
                                          doc_count: { type: "integer", example: 57 }
                                      }
                                  }
                              },
                              unique_users: {
                                  type: "array",
                                  items: {
                                      type: "object",
                                      properties: {
                                          key_as_string: { type: "string", example: "2024-06-10" },
                                          key: { type: "integer", example: 1717977600000 },
                                          doc_count: { type: "integer", example: 0 },
                                          unique_users: {
                                              type: "object",
                                              properties: {
                                                  value: { type: "integer", example: 0 }
                                              }
                                          }
                                      }
                                  }
                              },
                              count_unique_user: { type: "integer", example: 0 }
                          }
                      },
                      success: { type: "boolean", example: true }
                  }
              }
          }
      }
  } */

  /* #swagger.responses[500] = {
      description: 'Unexpected Error at Server. Please try again.',
      content: {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      message: { type: "string", example: "Unexpected Error at Server. Please try again!!" },
                      success: { type: "boolean", example: false }
                  }
              }
          }
      }
  } */
  try {
    const { selectedInterval } = req.body;
    let interval = '1d';
    if (selectedInterval && selectedInterval === '90d/d')
      interval = '15d';
    else if (
      selectedInterval &&
      (selectedInterval === '6M/M' ||
        selectedInterval === '1y/y')
    )
      interval = '15d';
    let timePeriod = selectedInterval;
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
                gte: `now-${timePeriod}`,
                lte: 'now',
              },
            },
          },
        ],
      },
    };

    let es_user = client.search({
      index: process.env.INFERENCE_LOGS_INDEX,
      query: query,
      size: 0,
      aggs: {
        users: {
          terms: {
            field: 'fields.meta.req.headers.metadata._user.keyword',
            missing: 'none',
            size: 10,
          },
        },
      },
    });
    let es_unique_users = client.search({
      index: process.env.INFERENCE_LOGS_INDEX,
      query: query,
      size: 0,
      aggs: {
        dates: {
          date_histogram: {
            field: '@timestamp',
            format: 'yyyy-MM-dd',
            fixed_interval: interval,
            min_doc_count: 0,
            extended_bounds: {
              min: `now-${timePeriod}`,
              max: 'now',
            },
          },
          aggs: {
            unique_users: {
              cardinality: {
                field: 'fields.meta.req.headers.metadata._user.keyword',
              },
            },
          },
        },
      },
    });

    let es_data: [LooseObject, LooseObject] = await Promise.all([
      es_user,
      es_unique_users,
    ]);

    let user_count = 0;

    es_data[0].aggregations.users.buckets.forEach((ele: any) => {
      if (ele.key !== 'none') user_count += 1;
    });

    let users_data = {
      users: es_data[0].aggregations.users.buckets,
      unique_users: es_data[1].aggregations.dates.buckets,
      count_unique_user: user_count,
    };

    return res.status(200).json({ data: users_data, success: true });
  } catch (error) {
    return res.status(500).json({
      message: 'Unexpected Error at Sevrer. Please try again!!',
      success: false,
    });
  }
};

/**
 * Retrieves users data from the inference index.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<Response>} A Promise that resolves when the operation is completed.
 *
 * @throws {Error} Will throw an error if there's an issue during the process.
 */

export const get_models_data = async (req: Request, res: Response) => {
  // #swagger.tags = ['Dashboard']

  /* #swagger.requestBody = {
      required: true,
      content: {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      selectedInterval: {
                          type: "string",
                          example: "1d/d"
                      }
                  }
              }
          }
      }
  } */

  /* #swagger.responses[200] = {
      description: 'Users data retrieved successfully.',
      content: {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      data: {
                          type: "object",
                          properties: {
                              users: {
                                  type: "array",
                                  items: {
                                      type: "object",
                                      properties: {
                                          key: { type: "string", example: "none" },
                                          doc_count: { type: "integer", example: 57 }
                                      }
                                  }
                              },
                              unique_users: {
                                  type: "array",
                                  items: {
                                      type: "object",
                                      properties: {
                                          key_as_string: { type: "string", example: "2024-06-10" },
                                          key: { type: "integer", example: 1717977600000 },
                                          doc_count: { type: "integer", example: 0 },
                                          unique_users: {
                                              type: "object",
                                              properties: {
                                                  value: { type: "integer", example: 0 }
                                              }
                                          }
                                      }
                                  }
                              },
                              count_unique_user: { type: "integer", example: 0 }
                          }
                      },
                      success: { type: "boolean", example: true }
                  }
              }
          }
      }
  } */

  /* #swagger.responses[500] = {
      description: 'Unexpected Error at Server. Please try again.',
      content: {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      message: { type: "string", example: "Unexpected Error at Server. Please try again!!" },
                      success: { type: "boolean", example: false }
                  }
              }
          }
      }
  } */
  try {
    const { selectedInterval } = req.body;
    let timePeriod = selectedInterval;

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
                gte: `now-${timePeriod}`,
                lte: 'now',
              },
            },
          },
        ],
      },
    };

    let es_model: LooseObject = await client.search({
      index: process.env.INFERENCE_LOGS_INDEX,
      query: query,
      size: 0,
      aggs: {
        unique_models: {
          terms: {
            field: 'fields.meta.req.body.model.keyword',
          },
        },
      },
    });

    let models_data = {
      unique_models: es_model.aggregations.unique_models.buckets,
    };

    return res.status(200).json({ data: models_data, success: true });
  } catch (error) {
    return res.status(500).json({
      message: 'Unexpected Error at Sevrer. Please try again!!',
      success: false,
    });
  }
};

/**
 * Retrieves pie chart data from the inference index.
 *
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<Response>} A Promise that resolves when the operation is completed.
 *
 * @throws {Error} Will throw an error if there's an issue during the process.
 */

export const get_piechart_data = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  // #swagger.tags = ['Dashboard']

  /* #swagger.requestBody = {
      required: true,
      content: {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      selectedInterval: {
                          type: "string",
                          example: "1d"
                      }
                  }
              }
          }
      }
  } */

  /* #swagger.responses[200] = {
      description: 'Pie chart data retrieved successfully.',
      content: {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      data: {
                          type: "object",
                          properties: {
                              errors: {
                                  type: "array",
                                  items: {
                                      type: "object",
                                      properties: {
                                          key: { type: "integer", example: 500 },
                                          doc_count: { type: "integer", example: 32 }
                                      }
                                  }
                              },
                              total_errors: { type: "integer", example: 32 }
                          }
                      },
                      success: { type: "boolean", example: true }
                  }
              }
          }
      }
  } */

  /* #swagger.responses[500] = {
      description: 'Unexpected Error at Server. Please try again.',
      content: {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      message: { type: "string", example: "Unexpected Error at Server. Please try again!!" },
                      success: { type: "boolean", example: false }
                  }
              }
          }
      }
  } */
  try {
    const { selectedInterval } = req.body;
    let timePeriod = selectedInterval;

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
                gte: `now-${timePeriod}`,
                lte: 'now',
              },
            },
          },
        ],
      },
    };

    query.bool.must.push({
      // @ts-ignore
      bool: {
        must_not: [
          {
            term: {
              'fields.meta.res.statusCode': {
                value: 200,
              },
            },
          },
        ],
      },
    });

    let es_errors: LooseObject = await client.search({
      index: process.env.INFERENCE_LOGS_INDEX,
      query: query,
      size: 0,
      aggs: {
        total_errors: {
          value_count: {
            field: 'fields.meta.res.statusCode',
          },
        },
        errors: {
          terms: {
            field: 'fields.meta.res.statusCode',
          },
        },
      },
    });

    let piechart_data = {
      errors: es_errors.aggregations.errors.buckets,
      total_errors: es_errors.aggregations.total_errors.value,
    };

    return res.status(200).json({ data: piechart_data, success: true });
  } catch (error) {
    return res.status(500).json({
      message: 'Unexpected Error at Sevrer. Please try again!!',
      success: false,
    });
  }
};
