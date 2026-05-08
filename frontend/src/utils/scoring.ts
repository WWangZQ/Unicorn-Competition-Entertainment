import type { DimensionId } from '../data/dimensions';
import { ALL_DIMENSION_IDS, DIMENSIONS } from '../data/dimensions';
import type { Personality } from '../data/personalities';
import { personalities, specialPersonalities } from '../data/personalities';
import { questions, hiddenQuestions } from '../data/questions';

export interface QuizResult {
  personality: Personality | null;
  similarity: number;
  dimensionScores: Record<DimensionId, number>;
  specialCode: string | null;
  specialName: string | null;
  specialTagline: string | null;
}

// Compute dimension scores from user answers
export function computeDimensionScores(
  mainAnswers: Record<string, number>,
): Record<DimensionId, number> {
  const scores = Object.fromEntries(
    ALL_DIMENSION_IDS.map((id) => [id, 0]),
  ) as Record<DimensionId, number>;

  for (const q of questions) {
    const answerIndex = mainAnswers[q.id];
    if (answerIndex !== undefined && answerIndex >= 0 && answerIndex < q.options.length) {
      scores[q.dimension] += q.options[answerIndex].score;
    }
  }

  return scores;
}

// Cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Map similarity (-1..1) to a 0-100% scale, where 0 similarity = 50%, 1.0 = 100%
function similarityToPercent(sim: number): number {
  // Cosine similarity of 1.0 = 100%, 0 = 50%, -1 = 0%
  return Math.round(50 + sim * 50);
}

// Count consecutive neutral (score=1) answers in main questions
function maxConsecutiveNeutral(answers: Record<string, number>): number {
  let max = 0;
  let cur = 0;
  for (const q of questions) {
    const idx = answers[q.id];
    if (idx !== undefined && q.options[idx]?.score === 1) {
      cur++;
      max = Math.max(max, cur);
    } else {
      cur = 0;
    }
  }
  return max;
}

// Check hidden trigger activation
function checkHiddenTriggers(answers: Record<string, number>): string | null {
  for (const hq of hiddenQuestions) {
    const idx = answers[hq.id];
    if (idx !== undefined) {
      // For hidden questions, option index matters for trigger logic
      // hidden_q1 (night_trigger): option 3 or 4 activates night owl
      // hidden_q2 (vanish_trigger): option 4 activates vanish
      if (hq.id === 'hidden_q1' && idx >= 2) return 'night_trigger';
      if (hq.id === 'hidden_q2' && idx === 3) return 'vanish_trigger';
    }
  }
  return null;
}

export function computeResult(mainAnswers: Record<string, number>): QuizResult {
  const dimensionScores = computeDimensionScores(mainAnswers);

  // Build user vector from dimension scores
  const userVec = ALL_DIMENSION_IDS.map((id) => dimensionScores[id]);

  // Find best matching personality
  let bestPersonality: Personality | null = null;
  let bestSimilarity = -Infinity;

  for (const p of personalities) {
    const profileVec = ALL_DIMENSION_IDS.map((id) => p.profile[id]);
    const sim = cosineSimilarity(userVec, profileVec);
    if (sim > bestSimilarity) {
      bestSimilarity = sim;
      bestPersonality = p;
    }
  }

  const similarity = similarityToPercent(bestSimilarity);

  // Special: hidden triggers
  const trigger = checkHiddenTriggers(mainAnswers);
  const consecutiveNeutral = maxConsecutiveNeutral(mainAnswers);

  if (consecutiveNeutral >= 5) {
    const lag = specialPersonalities.find((s) => s.code === 'LAG')!;
    return {
      personality: null,
      similarity: 0,
      dimensionScores,
      specialCode: lag.code,
      specialName: lag.name,
      specialTagline: lag.tagline,
    };
  }

  if (trigger) {
    // Hidden trigger: return special but also show matched personality info
    // Actually just return the special one for now
    const hidden = specialPersonalities.find((s) => s.code === '????')!;
    return {
      personality: null,
      similarity: 0,
      dimensionScores,
      specialCode: hidden.code,
      specialName: hidden.name,
      specialTagline: hidden.tagline,
    };
  }

  if (similarity < 60) {
    const hidden = specialPersonalities.find((s) => s.code === '????')!;
    return {
      personality: null,
      similarity,
      dimensionScores,
      specialCode: hidden.code,
      specialName: hidden.name,
      specialTagline: hidden.tagline,
    };
  }

  return {
    personality: bestPersonality,
    similarity,
    dimensionScores,
    specialCode: null,
    specialName: null,
    specialTagline: null,
  };
}

// Get model-level scores from dimension scores
export function getModelScores(
  dimScores: Record<DimensionId, number>,
): Record<string, number> {
  const models: Record<string, DimensionId[]> = {
    S: ['S1', 'S2', 'S3'],
    E: ['E1', 'E2', 'E3'],
    A: ['A1', 'A2', 'A3'],
    Ac: ['Ac1', 'Ac2', 'Ac3'],
    So: ['So1', 'So2', 'So3'],
  };
  const result: Record<string, number> = {};
  for (const [key, dims] of Object.entries(models)) {
    result[key] = dims.reduce((sum, d) => sum + dimScores[d], 0);
  }
  return result;
}

// Helper to get dimension display info
export function getDimensionLabel(id: DimensionId): string {
  return DIMENSIONS[id]?.name ?? id;
}

export function getModelLabel(key: string): string {
  const labels: Record<string, string> = {
    S: '自我',
    E: '情感',
    A: '态度',
    Ac: '行动',
    So: '社交',
  };
  return labels[key] ?? key;
}
