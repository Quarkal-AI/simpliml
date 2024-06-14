import express from 'express';
import deployRouter from './deployment.routes';
import finetuneRouter from './finetuning.routes';
import promptRouter from './prompt.routes';
import logsRouter from './logs.routes';
import healthRouter from './health.routes';
import apiRouter from './api.routes';
import modelRouter from './model.routes';

const router = express.Router();

router.use('/api', apiRouter)
router.use('/health', healthRouter)
router.use('/deployment', deployRouter);
router.use('/finetuning', finetuneRouter);
router.use('/prompt', promptRouter);
router.use('/logs', logsRouter);
router.use('/models', modelRouter);

export default router;
