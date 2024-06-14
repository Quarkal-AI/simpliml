import { Client } from "@elastic/elasticsearch";

const client = new Client({
  node: process.env?.ES_HOST, // Elasticsearch endpoint
  auth: {
    username: process.env?.ES_USERNAME!,
    password: process.env?.ES_PASSWORD!,
  },
});

export default client