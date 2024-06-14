import express from 'express';
import { create_pipeline, delete_pipelines, get_pipelines, pipeline_details, pipeline_logs } from '../controllers/finetuning.controller';

const router = express.Router();

router.post('/', get_pipelines);
router.post('/create', create_pipeline);
router.post('/delete', delete_pipelines);
router.post('/details', pipeline_details);
router.post('/logs', pipeline_logs);

export default router;
