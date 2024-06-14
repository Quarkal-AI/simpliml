import express from 'express';
import { health } from "./../controllers/health.controller";
import { authenticate } from "./../auth/authentication";

const router = express.Router();

router.post('/', authenticate, health);

export default router