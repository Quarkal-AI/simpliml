import express from 'express';
import { create_prompt, delete_prompt, edit_prompt, get_prompts } from './../controllers/prompt.controller';

const router = express.Router();

router.post('/', get_prompts);
router.post('/create', create_prompt);
router.post('/edit', edit_prompt);
router.post('/delete', delete_prompt);

export default router;
