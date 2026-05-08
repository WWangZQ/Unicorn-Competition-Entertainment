import { Router } from 'express';
import { getQuestions, upsertQuestion, deleteQuestion } from '../db.js';

const router = Router();

router.get('/', (_req, res) => {
  const rows = getQuestions();
  const questions = rows.map((r) => ({
    ...r,
    options: JSON.parse(r.options),
    is_hidden: Boolean(r.is_hidden),
  }));
  res.json(questions);
});

router.post('/', (req, res) => {
  const { id, text, dimension, options, is_hidden } = req.body;
  if (!id || !text || !dimension || !options) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  upsertQuestion({
    id,
    text,
    dimension,
    options: JSON.stringify(options),
    is_hidden: is_hidden ? 1 : 0,
  });
  res.json({ success: true });
});

router.put('/:id', (req, res) => {
  const { text, dimension, options, is_hidden } = req.body;
  upsertQuestion({
    id: req.params.id,
    text,
    dimension,
    options: JSON.stringify(options),
    is_hidden: is_hidden ? 1 : 0,
  });
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  deleteQuestion(req.params.id);
  res.json({ success: true });
});

export default router;
