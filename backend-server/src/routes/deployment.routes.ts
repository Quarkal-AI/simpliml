import express from 'express';
import { get_deployments, create_deployments, edit_deployments, delete_deployments } from "./../controllers/deployment.controller"

const router = express.Router();

router.post('/', get_deployments);
router.post('/create', create_deployments);
router.post('/edit', edit_deployments);
router.post('/delete', delete_deployments);

export default router