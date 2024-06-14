import express from 'express';
import { api } from "./../controllers/api.controller"

const router = express.Router();

router.get('/', api);

export default router