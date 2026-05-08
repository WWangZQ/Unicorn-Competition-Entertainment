export type DimLevel = 'H' | 'M' | 'L';

export interface Dimension {
  id: string;
  model: string;
  modelEn: string;
  name: string;
  desc: string;
  levels: Record<DimLevel, string>;
}

export const ALL_DIMENSION_IDS = [
  'S1', 'S2', 'S3',
  'E1', 'E2', 'E3',
  'A1', 'A2', 'A3',
  'Ac1', 'Ac2', 'Ac3',
  'So1', 'So2', 'So3',
] as const;

export type DimensionId = (typeof ALL_DIMENSION_IDS)[number];

export function scoreToLevel(score: number): DimLevel {
  if (score <= 1) return 'L';
  if (score === 2) return 'M';
  return 'H';
}

export const DIMENSIONS: Record<DimensionId, Dimension> = {
  // 自我模型
  S1: { id: 'S1', model: '自我模型', modelEn: 'Self', name: '自尊自信', desc: '你如何看待自己的能力和价值',
    levels: {
      H: '心里对自己大致有数，不太会被路人一句话打散。',
      M: '有时候觉得自己还行，有时候觉得自己不行，主打一个弹性自信。',
      L: '每天都在"我行"和"我不行"之间反复横跳，别人的评价能让你琢磨三天。',
    },
  },
  S2: { id: 'S2', model: '自我模型', modelEn: 'Self', name: '自我清晰度', desc: '你有多了解真实的自己',
    levels: {
      H: '对自己的脾气、欲望和底线都算门儿清。',
      M: '大概知道自己是什么样的人，但偶尔也会突然不认识自己。',
      L: '你问我是什么样的人？好问题，我也在找。',
    },
  },
  S3: { id: 'S3', model: '自我模型', modelEn: 'Self', name: '核心价值观', desc: '什么对你来说最重要',
    levels: {
      H: '很容易被目标、成长或某种重要信念推着往前。',
      M: '有在意的事，但也可以为了生存暂时搁置。',
      L: '意义？活着就是意义，剩下的再说。',
    },
  },
  // 情感模型
  E1: { id: 'E1', model: '情感模型', modelEn: 'Emotional', name: '依恋安全感', desc: '你在关系中的安全感和信任度',
    levels: {
      H: '更愿意相信关系本身，不会被一点风吹草动吓散。',
      M: '信一半留一半，属于情感上的稳健投资策略。',
      L: '别人靠近一步，你本能后退两步，安全感得靠自己给。',
    },
  },
  E2: { id: 'E2', model: '情感模型', modelEn: 'Emotional', name: '情感投入度', desc: '你投入感情和精力的深度',
    levels: {
      H: '投入起来不要命，一旦上头整个人的CPU都被占满。',
      M: '会投入，但会给自己留后手，不至于全盘梭哈。',
      L: '感情？我在旁边看看就行，不必亲自下场。',
    },
  },
  E3: { id: 'E3', model: '情感模型', modelEn: 'Emotional', name: '边界与依赖', desc: '你如何在亲密和独立之间平衡',
    levels: {
      H: '空间感很重要，再爱也得留一块属于自己的地。',
      M: '有边界但不至于建墙，能亲密也能独处。',
      L: '依赖到自己也害怕，一旦有人能靠就想完全贴上去。',
    },
  },
  // 态度模型
  A1: { id: 'A1', model: '态度模型', modelEn: 'Attitude', name: '世界观倾向', desc: '你如何看待世界和他人',
    levels: {
      H: '相信世界总体是好的，人心总体是善的，虽然偶尔被打脸。',
      M: '既不天真也不彻底阴谋论，观望是你的本能。',
      L: '这世界是个巨大的套路，你的默认设置是怀疑。',
    },
  },
  A2: { id: 'A2', model: '态度模型', modelEn: 'Attitude', name: '规则与灵活度', desc: '你对待规则和框架的态度',
    levels: {
      H: '秩序感较强，能按流程来就不爱即兴炸场。',
      M: '规则是死的你是活的，该遵守遵守该绕路绕路。',
      L: '规则？那是给老实人看的。你有自己的操作系统。',
    },
  },
  A3: { id: 'A3', model: '态度模型', modelEn: 'Attitude', name: '人生意义感', desc: '你对所做之事的意义感知',
    levels: {
      H: '做事更有方向，知道自己大概要往哪边走。',
      M: '时而觉得一切有意义，时而觉得一切是虚无，主打一个来回。',
      L: '人生是一场大型随机事件，你选择边走边看。',
    },
  },
  // 行动驱力模型
  Ac1: { id: 'Ac1', model: '行动驱力模型', modelEn: 'Action Drive', name: '动机导向', desc: '什么驱动你行动',
    levels: {
      H: '更容易被成果、成长和推进感点燃。',
      M: '有时候被目标驱动，有时候被DDL驱动——后者更频繁。',
      L: '驱动你的主要力量是"再不做就来不及了"。',
    },
  },
  Ac2: { id: 'Ac2', model: '行动驱力模型', modelEn: 'Action Drive', name: '决策风格', desc: '你如何做决定',
    levels: {
      H: '拍板速度快，决定一下就不爱回头磨叽。',
      M: '会纠结但不会无限纠结，有deadline帮你做决定。',
      L: '点个外卖能看半小时菜单，重大决定更是能拖则拖。',
    },
  },
  Ac3: { id: 'Ac3', model: '行动驱力模型', modelEn: 'Action Drive', name: '执行模式', desc: '你如何把事情落地',
    levels: {
      H: '推进欲比较强，事情不落地心里都像卡了根刺。',
      M: '能执行但需要预热，启动慢但跑起来还行。',
      L: '想法很多落地很少，属于脑内完成型选手。',
    },
  },
  // 社交模型
  So1: { id: 'So1', model: '社交模型', modelEn: 'Social', name: '社交主动性', desc: '你主动发起社交的倾向',
    levels: {
      H: '有局必到，没局自己组，社交电池续航惊人。',
      M: '有人来就接，没人来也不硬凑，社交弹性适中。',
      L: '社交是消耗品，每次社交后需要同等时间回血。',
    },
  },
  So2: { id: 'So2', model: '社交模型', modelEn: 'Social', name: '人际边界感', desc: '你在关系中的边界感知',
    levels: {
      H: '边界感偏强，靠太近会先本能性后退半步。',
      M: '有边界但可以灵活调整，看人下菜碟。',
      L: '边界是什么？我和你之间不需要这种东西。',
    },
  },
  So3: { id: 'So3', model: '社交模型', modelEn: 'Social', name: '表达与真实度', desc: '你在社交中展现真实自我的程度',
    levels: {
      H: '我行我素，在谁面前都是同一副面孔，装不了也不想装。',
      M: '会看气氛说话，真实和体面通常各留一点。',
      L: '在不同人面前是完全不同的版本，有时候自己也分不清哪个是真的。',
    },
  },
};

export const MODELS = [
  { key: 'S', name: '自我模型', en: 'Self', dims: ['S1', 'S2', 'S3'] as const },
  { key: 'E', name: '情感模型', en: 'Emotional', dims: ['E1', 'E2', 'E3'] as const },
  { key: 'A', name: '态度模型', en: 'Attitude', dims: ['A1', 'A2', 'A3'] as const },
  { key: 'Ac', name: '行动驱力模型', en: 'Action Drive', dims: ['Ac1', 'Ac2', 'Ac3'] as const },
  { key: 'So', name: '社交模型', en: 'Social', dims: ['So1', 'So2', 'So3'] as const },
];
