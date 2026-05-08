import { Router } from 'express';
import { addResult, getStats } from '../db.js';

const router = Router();

router.post('/submit', (req, res) => {
  const { nickname, personalityCode, personalityName, dimensionScores, deviceId } = req.body;

  if (!personalityCode || !personalityName) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  addResult({
    nickname: nickname ?? '匿名',
    personality_code: personalityCode,
    personality_name: personalityName,
    dimension_scores: JSON.stringify(dimensionScores ?? {}),
    device_id: deviceId ?? '',
  });

  res.json({ success: true });
});

router.get('/', (_req, res) => {
  const stats = getStats();
  res.json({
    totalParticipants: stats.total,
    personalityDistribution: stats.distribution,
  });
});

export default router;
