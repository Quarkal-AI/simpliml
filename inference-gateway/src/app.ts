import express, { Request, Response, NextFunction } from 'express';
import { Logger } from "./core/Logger";
import createError from "http-errors";
import cors from 'cors';
import helmet from "helmet";
import routes from './routes';
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./swagger_output.json";

dotenv.config();

const app = express();
app.use(Logger)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));
app.use(helmet());
app.use(cors({ origin: process.env.DOMAINS, optionsSuccessStatus: 200, credentials: true, preflightContinue: false }));
// Routes
app.use("/", routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => next(createError(404)));

// Middleware Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return res.status(500).send(err);
});

export default app;
