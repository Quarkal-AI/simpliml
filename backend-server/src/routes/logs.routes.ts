import express from 'express';
import { export_logs, get_logs, get_uniquefields, log_details } from '../controllers/logs.controller';

const router = express.Router();

router.post('/', get_logs);
router.post('/details', log_details);
router.post('/filters', get_uniquefields);
router.post('/export', export_logs);

export default router;
