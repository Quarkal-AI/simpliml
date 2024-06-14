import express from 'express';
import { completions } from "./../controllers/completions.controller";
import { authenticate } from "./../auth/authentication";

const router = express.Router();

router.post('/', authenticate, completions);

export default router