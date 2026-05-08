import { Router } from 'express';
import { getPersonalities, upsertPersonality } from '../db.js';

const router = Router();

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
  if (!code || !name || !tagline) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  upsertPersonality({
    code,
    name,
    tagline,
    dimension: dimension ?? '',
    model: model ?? '',
    profile: JSON.stringify(profile ?? {}),
  });
  res.json({ success: true });
});

router.put('/:code', (req, res) => {
  const { name, tagline, dimension, model, profile } = req.body;
  upsertPersonality({
    code: req.params.code,
    name,
    tagline,
    dimension: dimension ?? '',
    model: model ?? '',
    profile: JSON.stringify(profile ?? {}),
  });
  res.json({ success: true });
});

export default router;
