import client from './../client/elasticsearch';

export const create_index = async () => {
    try {
        if (!await client.indices.exists({ index: process.env.DEPLOYMENT_INDEX! })) {
            client.indices.create({
                index: process.env.DEPLOYMENT_INDEX!,
                mappings: {
                    "properties": {
                        "created_at": {
                            "type": "date"
                        },
                        "description": {
                            "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "gpu": {
                            "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "id": {
                            "type": "text",
                            "fields": {
                                "autocomplete": {
                                    "type": "completion",
                                    "analyzer": "standard_analyzer",
                                    "preserve_separators": true,
                                    "preserve_position_increments": true,
                                    "max_input_length": 50
                                },
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "maxReplicas": {
                            "type": "long"
                        },
                        "minReplicas": {
                            "type": "long"
                        },
                        "model_id": {
                            "type": "text",
                            "fields": {
                                "autocomplete": {
                                    "type": "completion",
                                    "analyzer": "standard_analyzer",
                                    "preserve_separators": true,
                                    "preserve_position_increments": true,
                                    "max_input_length": 50
                                },
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "name": {
                            "type": "text",
                            "fields": {
                                "autocomplete": {
                                    "type": "completion",
                                    "analyzer": "standard_analyzer",
                                    "preserve_separators": true,
                                    "preserve_position_increments": true,
                                    "max_input_length": 50
                                },
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "server": {
                            "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "status": {
                            "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "updated_at": {
                            "type": "date"
                        }
                    }
                },
                settings: {
                    "index": {
                        "routing": {
                            "allocation": {
                                "include": {
                                    "_tier_preference": "data_content"
                                }
                            }
                        },
                        "analysis": {
                            "filter": {
                                "english_stop": {
                                    "type": "stop",
                                    "stopwords": "_english_"
                                }
                            },
                            "analyzer": {
                                "standard_analyzer": {
                                    "filter": [
                                        "lowercase",
                                        "trim",
                                        "asciifolding",
                                        "english_stop"
                                    ],
                                    "char_filter": [
                                        "html_strip"
                                    ],
                                    "type": "custom",
                                    "tokenizer": "whitespace_tokenizer"
                                },
                                "search_analyzer": {
                                    "filter": [
                                        "lowercase",
                                        "asciifolding"
                                    ],
                                    "char_filter": [
                                        "html_strip"
                                    ],
                                    "type": "custom",
                                    "tokenizer": "whitespace_tokenizer"
                                }
                            },
                            "tokenizer": {
                                "whitespace_tokenizer": {
                                    "pattern": '[-,;./(){}"|\\[\\] ]',
                                    "type": "pattern"
                                }
                            }
                        },
                        "number_of_shards": "1",
                        "number_of_replicas": "0"
                    }
                }
            })
        }

        if (!await client.indices.exists({ index: process.env.FINETUNING_INDEX! })) {
            client.indices.create({
                index: process.env.FINETUNING_INDEX!,
                mappings: {
                    "properties": {
                        "batch_size": {
                            "type": "long"
                        },
                        "created_at": {
                            "type": "date"
                        },
                        "dataset_id": {
                            "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "description": {
                            "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "finetuning_method": {
                            "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "gpu": {
                            "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "id": {
                            "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "lora_alpha": {
                            "type": "long"
                        },
                        "lora_dropout": {
                            "type": "float"
                        },
                        "lora_r": {
                            "type": "long"
                        },
                        "lr": {
                            "type": "long"
                        },
                        "model": {
                            "type": "text",
                            "fields": {
                                "autocomplete": {
                                    "type": "completion",
                                    "analyzer": "standard_analyzer",
                                    "preserve_separators": true,
                                    "preserve_position_increments": true,
                                    "max_input_length": 50
                                },
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "num_epochs": {
                            "type": "long"
                        },
                        "optimizer": {
                            "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "pipeline_name": {
                            "type": "text",
                            "fields": {
                                "autocomplete": {
                                    "type": "completion",
                                    "analyzer": "standard_analyzer",
                                    "preserve_separators": true,
                                    "preserve_position_increments": true,
                                    "max_input_length": 50
                                },
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "status": {
                            "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "upload_model_to_hf": {
                            "type": "boolean"
                        }
                    }
                },
                settings: {
                    "index": {
                        "routing": {
                            "allocation": {
                                "include": {
                                    "_tier_preference": "data_content"
                                }
                            }
                        },
                        "analysis": {
                            "filter": {
                                "english_stop": {
                                    "type": "stop",
                                    "stopwords": "_english_"
                                }
                            },
                            "analyzer": {
                                "standard_analyzer": {
                                    "filter": [
                                        "lowercase",
                                        "trim",
                                        "asciifolding",
                                        "english_stop"
                                    ],
                                    "char_filter": [
                                        "html_strip"
                                    ],
                                    "type": "custom",
                                    "tokenizer": "whitespace_tokenizer"
                                },
                                "search_analyzer": {
                                    "filter": [
                                        "lowercase",
                                        "asciifolding"
                                    ],
                                    "char_filter": [
                                        "html_strip"
                                    ],
                                    "type": "custom",
                                    "tokenizer": "whitespace_tokenizer"
                                }
                            },
                            "tokenizer": {
                                "whitespace_tokenizer": {
                                    "pattern": '[-,;./(){}"|\\[\\] ]',
                                    "type": "pattern"
                                }
                            }
                        },
                        "number_of_shards": "1",
                        "number_of_replicas": "0"
                    }
                }
            })
        }

        if (!await client.indices.exists({ index: process.env.PROMPT_INDEX! })) {
            client.indices.create({
                index: process.env.PROMPT_INDEX!,
                mappings: {
                    "properties": {
                        "created_at": {
                            "type": "date"
                        },
                        "description": {
                            "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "id": {
                            "type": "text",
                            "fields": {
                                "autocomplete": {
                                    "type": "completion",
                                    "analyzer": "standard_analyzer",
                                    "preserve_separators": true,
                                    "preserve_position_increments": true,
                                    "max_input_length": 50
                                },
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "name": {
                            "type": "text",
                            "fields": {
                                "autocomplete": {
                                    "type": "completion",
                                    "analyzer": "standard_analyzer",
                                    "preserve_separators": true,
                                    "preserve_position_increments": true,
                                    "max_input_length": 50
                                },
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "prompt": {
                            "properties": {
                                "content": {
                                    "type": "text",
                                    "fields": {
                                        "keyword": {
                                            "type": "keyword",
                                            "ignore_above": 256
                                        }
                                    }
                                },
                                "id": {
                                    "type": "long"
                                },
                                "message": {
                                    "type": "text",
                                    "fields": {
                                        "keyword": {
                                            "type": "keyword",
                                            "ignore_above": 256
                                        }
                                    }
                                },
                                "role": {
                                    "type": "text",
                                    "fields": {
                                        "keyword": {
                                            "type": "keyword",
                                            "ignore_above": 256
                                        }
                                    }
                                }
                            }
                        },
                        "status": {
                            "type": "text",
                            "fields": {
                                "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                }
                            }
                        },
                        "updated_at": {
                            "type": "date"
                        }
                    }
                },
                settings: {
                    "index": {
                        "routing": {
                            "allocation": {
                                "include": {
                                    "_tier_preference": "data_content"
                                }
                            }
                        },
                        "analysis": {
                            "filter": {
                                "english_stop": {
                                    "type": "stop",
                                    "stopwords": "_english_"
                                }
                            },
                            "analyzer": {
                                "standard_analyzer": {
                                    "filter": [
                                        "lowercase",
                                        "trim",
                                        "asciifolding",
                                        "english_stop"
                                    ],
                                    "char_filter": [
                                        "html_strip"
                                    ],
                                    "type": "custom",
                                    "tokenizer": "whitespace_tokenizer"
                                },
                                "search_analyzer": {
                                    "filter": [
                                        "lowercase",
                                        "asciifolding"
                                    ],
                                    "char_filter": [
                                        "html_strip"
                                    ],
                                    "type": "custom",
                                    "tokenizer": "whitespace_tokenizer"
                                }
                            },
                            "tokenizer": {
                                "whitespace_tokenizer": {
                                    "pattern": '[-,;./(){}"|\\[\\] ]',
                                    "type": "pattern"
                                }
                            }
                        },
                        "number_of_shards": "1",
                        "number_of_replicas": "0"
                    }
                }
            })
        }
    } catch (error: any) {
        console.error(error)
    }
}