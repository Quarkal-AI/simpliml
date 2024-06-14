import express from 'express';
import healthRouter from './health.routes';
import completionRouter from './completion.routes';
import chatRouter from './chat.routes';
const router = express.Router();

// Deployment Routes
router.use('/health', healthRouter);
router.use('/v1/completions', completionRouter);
router.use('/v1/chat/completions', chatRouter);

export default router;
