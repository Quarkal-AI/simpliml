import cors from 'cors';
import dotenv from "dotenv";
import helmet from "helmet";
import routes from './routes';
import { Server } from 'socket.io';
import { createServer } from 'http';
import createError from "http-errors";
import { Logger } from "./core/Logger";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger_output.json";
import { create_index } from './models/index.models';
import { modelInferHandler } from './controllers/model.controller';
import express, { Request, Response, NextFunction } from 'express';
import { promptInferHandler } from './controllers/prompt.controller';

dotenv.config();
create_index();

const app = express();
app.use(Logger)
app.use(express.json({ limit: '10mb' }));
app.use(
  express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }),
);
app.use(helmet());
app.use(cors({ origin: process.env.DOMAINS, optionsSuccessStatus: 200, credentials: true, preflightContinue: false }));

// Routes
app.use("/api/v1", routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => next(createError(404)));

// Middleware Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return res.status(500).send(err);
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.DOMAINS,
    credentials: true,
    optionsSuccessStatus: 200,
  },
});

const onConnection = async (socket: any) => {
  socket.join(`${socket.id}`);
  modelInferHandler(io, socket);
  promptInferHandler(io, socket);
};

io.on('connection', onConnection);

export default httpServer;
