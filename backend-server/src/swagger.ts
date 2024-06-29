import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: 'v1.0.0',
    title: 'SimpliML | API Documentation',
    description: 'SimpliML GenAI Infrastructure Management',
    termsOfService: 'https://simpliml.com/terms-of-use',
    contact: {
      name: 'SimpliML',
      email: 'support@simpliml.com',
      url: 'https://simpliml.com',
    },
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
    },
  },
  servers: [
    {
      url: 'http://localhost:3001/api/v1',
      description: '',
    },
  ],
  tags: [
    {
      name: 'Dashboard',
    },
    {
      name: 'Deployment',
    },
    {
      name: 'Model',
    },
    {
      name: 'Prompt',
    },
    {
      name: 'Finetune',
    },
    {
      name: 'Logs',
    },
  ],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/routes/index.ts'];

swaggerAutogen({ openapi: '3.1.0' })(outputFile, endpointsFiles, doc);
