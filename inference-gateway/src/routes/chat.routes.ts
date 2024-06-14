import express from 'express';
import { chat } from "./../controllers/chat.controller";
import { authenticate } from "./../auth/authentication";

const router = express.Router();

router.post('/', authenticate, chat);

export default router