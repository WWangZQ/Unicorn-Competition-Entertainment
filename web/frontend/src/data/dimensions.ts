export interface Dimension {
  id: string;
  model: string;
  modelEn: string;
  name: string;
  desc: string;
}

export const ALL_DIMENSION_IDS = [
  'S1', 'S2', 'S3',
  'E1', 'E2', 'E3',
  'A1', 'A2', 'A3',
  'Ac1', 'Ac2', 'Ac3',
  'So1', 'So2', 'So3',
] as const;

export type DimensionId = (typeof ALL_DIMENSION_IDS)[number];

export const DIMENSIONS: Record<DimensionId, Dimension> = {
  // 自我模型
  S1: { id: 'S1', model: '自我模型', modelEn: 'Self', name: '自尊自信', desc: '你如何看待自己的能力和价值' },
  S2: { id: 'S2', model: '自我模型', modelEn: 'Self', name: '自我清晰度', desc: '你有多了解真实的自己' },
  S3: { id: 'S3', model: '自我模型', modelEn: 'Self', name: '核心价值观', desc: '什么对你来说最重要' },
  // 情感模型
  E1: { id: 'E1', model: '情感模型', modelEn: 'Emotional', name: '依恋安全感', desc: '你在关系中的安全感和信任度' },
  E2: { id: 'E2', model: '情感模型', modelEn: 'Emotional', name: '情感投入度', desc: '你投入感情和精力的深度' },
  E3: { id: 'E3', model: '情感模型', modelEn: 'Emotional', name: '边界与依赖', desc: '你如何在亲密和独立之间平衡' },
  // 态度模型
  A1: { id: 'A1', model: '态度模型', modelEn: 'Attitude', name: '世界观倾向', desc: '你如何看待世界和他人' },
  A2: { id: 'A2', model: '态度模型', modelEn: 'Attitude', name: '规则与灵活度', desc: '你对待规则和框架的态度' },
  A3: { id: 'A3', model: '态度模型', modelEn: 'Attitude', name: '人生意义感', desc: '你对所做之事的意义感知' },
  // 行动驱力模型
  Ac1: { id: 'Ac1', model: '行动驱力模型', modelEn: 'Action Drive', name: '动机导向', desc: '什么驱动你行动' },
  Ac2: { id: 'Ac2', model: '行动驱力模型', modelEn: 'Action Drive', name: '决策风格', desc: '你如何做决定' },
  Ac3: { id: 'Ac3', model: '行动驱力模型', modelEn: 'Action Drive', name: '执行模式', desc: '你如何把事情落地' },
  // 社交模型
  So1: { id: 'So1', model: '社交模型', modelEn: 'Social', name: '社交主动性', desc: '你主动发起社交的倾向' },
  So2: { id: 'So2', model: '社交模型', modelEn: 'Social', name: '人际边界感', desc: '你在关系中的边界感知' },
  So3: { id: 'So3', model: '社交模型', modelEn: 'Social', name: '表达与真实度', desc: '你在社交中展现真实自我的程度' },
};

export const MODELS = [
  { key: 'S', name: '自我模型', en: 'Self', dims: ['S1', 'S2', 'S3'] as const },
  { key: 'E', name: '情感模型', en: 'Emotional', dims: ['E1', 'E2', 'E3'] as const },
  { key: 'A', name: '态度模型', en: 'Attitude', dims: ['A1', 'A2', 'A3'] as const },
  { key: 'Ac', name: '行动驱力模型', en: 'Action Drive', dims: ['Ac1', 'Ac2', 'Ac3'] as const },
  { key: 'So', name: '社交模型', en: 'Social', dims: ['So1', 'So2', 'So3'] as const },
];
