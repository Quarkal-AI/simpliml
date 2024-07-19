import express from 'express';
import { get_analytics_data, get_models_data, get_piechart_data, get_quantitative_data, get_users_data } from '../controllers/dashboard.controller';
const router = express.Router();
router.post('/get_analytics_data', get_analytics_data);
router.post('/get_quantitative_data', get_quantitative_data);
router.post('/get_users_data', get_users_data);
router.post('/get_models_data', get_models_data);
router.post('/get_piechart_data', get_piechart_data);
export default router