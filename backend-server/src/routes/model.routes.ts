import express from 'express';
import { get_model_by_id } from '../controllers/model.controller';

const router = express.Router();

router.get('/get_model_by_id/:id', get_model_by_id)

export default router