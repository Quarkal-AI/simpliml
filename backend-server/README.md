# Backend Server

### Built With

- [Node.js](https://nodejs.org)

## Getting Started
To get a local copy up and running, please follow these simple steps.

### Prerequisites

Here is what you need to be able to run simpliml locally

- Node.js (Version: >=20.x)

## Project Directory Structure

```
├── Dockerfile
├── README.md
├── jest.config.js
├── package.json
├── src
│   ├── app.ts
│   ├── client
│   │   ├── elasticsearch.ts
│   │   ├── kubernetes.ts
│   │   └── openai.ts
│   ├── controllers
│   │   ├── api.controller.ts
│   │   ├── deployment.controller.ts
│   │   ├── finetuning.controller.ts
│   │   ├── health.controller.ts
│   │   ├── logs.controller.ts
│   │   ├── model.controller.ts
│   │   └── prompt.controller.ts
│   ├── core
│   │   └── Logger.ts
│   ├── helpers
│   │   ├── deployment.ts
│   │   └── pipeline.ts
│   ├── models
│   │   └── index.models.ts
│   ├── routes
│   │   ├── api.routes.ts
│   │   ├── deployment.routes.ts
│   │   ├── finetuning.routes.ts
│   │   ├── health.routes.ts
│   │   ├── index.ts
│   │   ├── logs.routes.ts
│   │   ├── model.routes.ts
│   │   └── prompt.routes.ts
│   ├── server.ts
│   ├── swagger.ts
│   ├── swagger_output.json
│   └── types
│       ├── elasticBody.ts
│       ├── requestBody.ts
│       └── responseBody.ts
├── tests
│   └── setup.ts
└── tsconfig.json
```

## Development

### Setup

1. Clone this repo or [fork](https://github.com/quarkal-ai/simpliml/fork).

```bash
git clone https://github.com/quarkal-ai/simpliml
```

2. Go to the project folder

```bash
cd backend-server
```

3. Set up your `.env` file
- Duplicate `.env.example` to `.env` and update the vales accordingly
```bash
cp .env.example .env
```

4. Install packages with npm
```bash
npm install
```

5. Run Development Server
```bash
npm run watch
```
Your development server will be running at http://localhost:3001

## Swagger Docs
You Can Access Swagger at http://localhost:3001/docs