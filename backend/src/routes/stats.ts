import { Router } from 'express';
import { addResult, getStats } from '../db.js';

const router = Router();

// Input validation helpers
function isValidString(val: unknown, minLen = 1, maxLen = 200): val is string {
  return typeof val === 'string' && val.length >= minLen && val.length <= maxLen;
}

function isValidDimensionScores(val: unknown): val is Record<string, number> {
  if (typeof val !== 'object' || val === null) return false;
  const scores = val as Record<string, unknown>;
  return Object.values(scores).every(
    (v) => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 10,
  );
}

router.post('/submit', (req, res) => {
  const { nickname, personalityCode, personalityName, dimensionScores, deviceId } = req.body;

  // Validate required fields
  if (!isValidString(personalityCode, 1, 50)) {
    res.status(400).json({ error: '人格代码格式不正确' });
    return;
  }
  if (!isValidString(personalityName, 1, 100)) {
    res.status(400).json({ error: '人格名称格式不正确' });
    return;
  }

  // Validate optional fields
  const safeNickname = isValidString(nickname, 0, 50) ? nickname.slice(0, 50) : '匿名';
  const safeDeviceId = isValidString(deviceId, 0, 64) ? deviceId.slice(0, 64) : '';
  const safeDimensionScores = isValidDimensionScores(dimensionScores) ? dimensionScores : {};

  addResult({
    nickname: safeNickname,
    personality_code: personalityCode,
    personality_name: personalityName,
    dimension_scores: JSON.stringify(safeDimensionScores),
    device_id: safeDeviceId,
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
