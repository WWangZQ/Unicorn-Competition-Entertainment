import { Router } from 'express';
import { getPersonalities, upsertPersonality } from '../db.js';

const router = Router();

// Valid dimension IDs
const VALID_DIMENSIONS = new Set([
  'S1', 'S2', 'S3', 'E1', 'E2', 'E3',
  'A1', 'A2', 'A3', 'Ac1', 'Ac2', 'Ac3',
  'So1', 'So2', 'So3',
]);

const VALID_MODELS = new Set([
  '自我模型', '情感模型', '态度模型', '行动驱力模型', '社交模型',
]);

function isValidCode(code: string): boolean {
  return /^[A-Za-z0-9_-]{2,20}$/.test(code);
}

function isValidString(val: unknown, minLen = 1, maxLen = 500): val is string {
  return typeof val === 'string' && val.length >= minLen && val.length <= maxLen;
}

function isValidProfile(val: unknown): val is Record<string, number> {
  if (typeof val !== 'object' || val === null) return false;
  const profile = val as Record<string, unknown>;
  return Object.entries(profile).every(
    ([key, v]) =>
      VALID_DIMENSIONS.has(key) &&
      typeof v === 'number' &&
      Number.isInteger(v) &&
      v >= 0 &&
      v <= 4,
  );
}

router.get('/', (_req, res) => {
  const rows = getPersonalities();
  const personalities = rows.map((r) => ({
    ...r,
    profile: JSON.parse(r.profile),
  }));
  res.json(personalities);
});

router.post('/', (req, res) => {
  const { code, name, tagline, dimension, model, profile } = req.body;

  if (!isValidCode(code)) {
    res.status(400).json({ error: '人格代码格式不正确（2-20位字母数字）' });
    return;
  }
  if (!isValidString(name, 1, 50)) {
    res.status(400).json({ error: '名称长度需在1-50字之间' });
    return;
  }
  if (!isValidString(tagline, 1, 100)) {
    res.status(400).json({ error: '标语长度需在1-100字之间' });
    return;
  }
  if (!VALID_DIMENSIONS.has(dimension)) {
    res.status(400).json({ error: '无效的维度ID' });
    return;
  }
  if (!VALID_MODELS.has(model)) {
    res.status(400).json({ error: '无效的模型类型' });
    return;
  }
  if (!isValidProfile(profile)) {
    res.status(400).json({ error: '维度分值格式不正确' });
    return;
  }

  upsertPersonality({
    code,
    name: name.slice(0, 50),
    tagline: tagline.slice(0, 100),
    dimension,
    model,
    profile: JSON.stringify(profile),
  });
  res.json({ success: true });
});

router.put('/:code', (req, res) => {
  const { name, tagline, dimension, model, profile } = req.body;
  const code = req.params.code;

  if (!isValidCode(code)) {
    res.status(400).json({ error: '无效的人格代码' });
    return;
  }
  if (!isValidString(name, 1, 50)) {
    res.status(400).json({ error: '名称长度需在1-50字之间' });
    return;
  }
  if (!isValidString(tagline, 1, 100)) {
    res.status(400).json({ error: '标语长度需在1-100字之间' });
    return;
  }
  if (!VALID_DIMENSIONS.has(dimension)) {
    res.status(400).json({ error: '无效的维度ID' });
    return;
  }
  if (!VALID_MODELS.has(model)) {
    res.status(400).json({ error: '无效的模型类型' });
    return;
  }
  if (!isValidProfile(profile)) {
    res.status(400).json({ error: '维度分值格式不正确' });
    return;
  }

  upsertPersonality({
    code,
    name: name.slice(0, 50),
    tagline: tagline.slice(0, 100),
    dimension,
    model,
    profile: JSON.stringify(profile),
  });
  res.json({ success: true });
});

export default router;
