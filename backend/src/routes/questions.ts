import { Router } from 'express';
import { getQuestions, upsertQuestion, deleteQuestion } from '../db.js';

const router = Router();

// Valid dimension IDs
const VALID_DIMENSIONS = new Set([
  'S1', 'S2', 'S3', 'E1', 'E2', 'E3',
  'A1', 'A2', 'A3', 'Ac1', 'Ac2', 'Ac3',
  'So1', 'So2', 'So3',
]);

function isValidQuestionId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{1,30}$/.test(id);
}

function isValidQuestionText(text: string): boolean {
  return text.length >= 5 && text.length <= 500;
}

function isValidOption(opt: unknown): opt is { text: string; score: number } {
  return (
    typeof opt === 'object' &&
    opt !== null &&
    'text' in opt &&
    typeof (opt as any).text === 'string' &&
    (opt as any).text.length >= 1 &&
    (opt as any).text.length <= 200 &&
    'score' in opt &&
    typeof (opt as any).score === 'number' &&
    Number.isInteger((opt as any).score) &&
    (opt as any).score >= 0 &&
    (opt as any).score <= 5
  );
}

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

  if (!isValidQuestionId(id)) {
    res.status(400).json({ error: '题目ID格式不正确（1-30位字母数字下划线）' });
    return;
  }
  if (!isValidQuestionText(text)) {
    res.status(400).json({ error: '题目内容长度需在5-500字之间' });
    return;
  }
  if (!VALID_DIMENSIONS.has(dimension)) {
    res.status(400).json({ error: '无效的维度ID' });
    return;
  }
  if (!Array.isArray(options) || options.length < 2 || options.length > 6) {
    res.status(400).json({ error: '选项数量需在2-6个之间' });
    return;
  }
  if (!options.every(isValidOption)) {
    res.status(400).json({ error: '选项格式不正确' });
    return;
  }

  upsertQuestion({
    id,
    text: text.slice(0, 500),
    dimension,
    options: JSON.stringify(options.map((o) => ({ ...o, text: o.text.slice(0, 200) }))),
    is_hidden: is_hidden ? 1 : 0,
  });
  res.json({ success: true });
});

router.put('/:id', (req, res) => {
  const { text, dimension, options, is_hidden } = req.body;
  const id = req.params.id;

  if (!isValidQuestionId(id)) {
    res.status(400).json({ error: '无效的题目ID' });
    return;
  }
  if (!isValidQuestionText(text)) {
    res.status(400).json({ error: '题目内容长度需在5-500字之间' });
    return;
  }
  if (!VALID_DIMENSIONS.has(dimension)) {
    res.status(400).json({ error: '无效的维度ID' });
    return;
  }
  if (!Array.isArray(options) || options.length < 2 || options.length > 6) {
    res.status(400).json({ error: '选项数量需在2-6个之间' });
    return;
  }
  if (!options.every(isValidOption)) {
    res.status(400).json({ error: '选项格式不正确' });
    return;
  }

  upsertQuestion({
    id,
    text: text.slice(0, 500),
    dimension,
    options: JSON.stringify(options.map((o) => ({ ...o, text: o.text.slice(0, 200) }))),
    is_hidden: is_hidden ? 1 : 0,
  });
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  if (!isValidQuestionId(id)) {
    res.status(400).json({ error: '无效的题目ID' });
    return;
  }
  deleteQuestion(id);
  res.json({ success: true });
});

export default router;
