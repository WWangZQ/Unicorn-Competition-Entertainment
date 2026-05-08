import type { DimensionId } from './dimensions';
import { ALL_DIMENSION_IDS } from './dimensions';

export interface Personality {
  code: string;
  name: string;
  tagline: string;
  dimension: DimensionId;       // home dimension
  model: string;
  profile: Record<DimensionId, number>;  // 0-4 ideal score per dimension
}

export interface SpecialPersonality {
  code: string;
  name: string;
  tagline: string;
  trigger: string;
}

// Profile helper: generate a full 15-dim profile from home + secondary high/low
function makeProfile(
  home: DimensionId,
  high: DimensionId[],
  low: DimensionId[],
): Record<DimensionId, number> {
  const profile = {} as Record<DimensionId, number>;
  for (const dim of ALL_DIMENSION_IDS) {
    if (dim === home) profile[dim] = 4;
    else if (high.includes(dim)) profile[dim] = 3;
    else if (low.includes(dim)) profile[dim] = 1;
    else profile[dim] = 2;
  }
  return profile;
}

const SELF = '自我模型';
const EMOTIONAL = '情感模型';
const ATTITUDE = '态度模型';
const ACTION = '行动驱力模型';
const SOCIAL = '社交模型';

export const personalities: Personality[] = [
  // ===== 自我模型 S1-S3 =====
  {
    code: 'DDL-0', name: '截止线战神', tagline: '没到最后一刻，都不算开始。',
    dimension: 'S1', model: SELF,
    profile: makeProfile('S1', ['A3', 'Ac3'], ['E3', 'So2']),
  },
  {
    code: 'DDL-1', name: '前夜爆种人', tagline: '平时像没动，死线前像开挂。',
    dimension: 'S1', model: SELF,
    profile: makeProfile('S1', ['E2', 'So3'], ['Ac2', 'Ac1']),
  },
  {
    code: 'DRAG', name: '能拖就拖人', tagline: '今天不做，不是摆烂，是给明天的我机会。',
    dimension: 'S2', model: SELF,
    profile: makeProfile('S2', ['A2', 'E3'], ['Ac3', 'S3']),
  },
  {
    code: 'AFK', name: '已读不做者', tagline: '任务我看见了，身体还没同意。',
    dimension: 'S2', model: SELF,
    profile: makeProfile('S2', ['So2', 'E3'], ['Ac1', 'A3']),
  },
  {
    code: 'CTRL', name: '计划控', tagline: '我不是爱催，只是看不得世界失控。',
    dimension: 'S3', model: SELF,
    profile: makeProfile('S3', ['Ac2', 'Ac3'], ['A2', 'E3']),
  },
  {
    code: 'SAFE', name: '摸鱼保命人', tagline: '不求出彩，但求别背锅。',
    dimension: 'S3', model: SELF,
    profile: makeProfile('S3', ['E3', 'So2'], ['So1', 'A3']),
  },
  // ===== 情感模型 E1-E3 =====
  {
    code: 'CAMP', name: '熟人舒适圈', tagline: '我不是不合群，我只是精准合群。',
    dimension: 'E1', model: EMOTIONAL,
    profile: makeProfile('E1', ['So2', 'E3'], ['So1', 'A2']),
  },
  {
    code: 'COFF-EE', name: '通宵续命体', tagline: '白天像路人，晚上靠咖啡续命。',
    dimension: 'E2', model: EMOTIONAL,
    profile: makeProfile('E2', ['S1', 'A3'], ['E1', 'So1']),
  },
  {
    code: 'LIB-R', name: '图书馆钉子户', tagline: '不是我爱学习，是座位离不开我。',
    dimension: 'E2', model: EMOTIONAL,
    profile: makeProfile('E2', ['E1', 'S3'], ['So1', 'A2']),
  },
  {
    code: 'EXIT', name: '提前开溜人', tagline: '不是活动无聊，是我撤退得比较有边界感。',
    dimension: 'E3', model: EMOTIONAL,
    profile: makeProfile('E3', ['So2', 'S2'], ['E2', 'So1']),
  },
  {
    code: 'VOID', name: '空气队友', tagline: '你以为他在队里，其实他在系统里。',
    dimension: 'E3', model: EMOTIONAL,
    profile: makeProfile('E3', ['Ac2', 'So2'], ['Ac3', 'S3']),
  },
  // ===== 态度模型 A1-A3 =====
  {
    code: 'COPY', name: '拼接缝合怪', tagline: '天下资料一大抄，能交就是硬道理。',
    dimension: 'A1', model: ATTITUDE,
    profile: makeProfile('A1', ['A2', 'Ac2'], ['A3', 'S3']),
  },
  {
    code: 'BLAM-R', name: '甩锅预备役', tagline: '活不一定干得完，责任一定分得清。',
    dimension: 'A1', model: ATTITUDE,
    profile: makeProfile('A1', ['E3', 'Ac2'], ['Ac3', 'So3']),
  },
  {
    code: 'PATC-H', name: '补锅永动机', tagline: '改完这版还有下版，下版后面还有下一版。',
    dimension: 'A2', model: ATTITUDE,
    profile: makeProfile('A2', ['Ac3', 'E2'], ['A1', 'S1']),
  },
  {
    code: 'PPT-A', name: '汇报美化师', tagline: '内容可以空，排版不能输。',
    dimension: 'A2', model: ATTITUDE,
    profile: makeProfile('A2', ['So3', 'So1'], ['Ac3', 'S2']),
  },
  {
    code: 'RUSH', name: '抱佛脚圣体', tagline: '学得晚，不代表考得烂。',
    dimension: 'A3', model: ATTITUDE,
    profile: makeProfile('A3', ['S1', 'Ac1'], ['S3', 'E2']),
  },
  {
    code: 'WHEE-L', name: '造轮子的人', tagline: '别人还在想方案，我已经重新发明一遍了。',
    dimension: 'A3', model: ATTITUDE,
    profile: makeProfile('A3', ['Ac3', 'S2'], ['A2', 'So1']),
  },
  // ===== 行动驱力模型 Ac1-Ac3 =====
  {
    code: 'MASK', name: '假装很忙人', tagline: '窗口开得越多，贡献看起来越真。',
    dimension: 'Ac1', model: ACTION,
    profile: makeProfile('Ac1', ['A2', 'So3'], ['Ac3', 'S2']),
  },
  {
    code: 'ALRM-R', name: '警铃本铃', tagline: '我催你，就是DDL催你。',
    dimension: 'Ac1', model: ACTION,
    profile: makeProfile('Ac1', ['S3', 'Ac2'], ['E3', 'A2']),
  },
  {
    code: '404', name: '任务蒸发者', tagline: '昨天还在，今天就像没存在过。',
    dimension: 'Ac2', model: ACTION,
    profile: makeProfile('Ac2', ['E3', 'So2'], ['S3', 'Ac3']),
  },
  {
    code: 'SPEC', name: '文档堆尸人', tagline: '字我写了，坑我也标了，出事就别说没人提醒。',
    dimension: 'Ac3', model: ACTION,
    profile: makeProfile('Ac3', ['S3', 'A3'], ['A2', 'E3']),
  },
  {
    code: 'GHOS-T', name: '组会幽灵', tagline: '平时查无此人，汇报准时上线。',
    dimension: 'Ac3', model: ACTION,
    profile: makeProfile('Ac3', ['So3', 'A2'], ['E2', 'So2']),
  },
  // ===== 社交模型 So1-So3 =====
  {
    code: 'SOC-A', name: '活动永动机', tagline: '哪儿有热闹，哪儿就有我的签到记录。',
    dimension: 'So1', model: SOCIAL,
    profile: makeProfile('So1', ['So3', 'E2'], ['E3', 'S2']),
  },
  {
    code: 'SYNC', name: '控场发言人', tagline: '场面一冷，我就开始组织语言。',
    dimension: 'So1', model: SOCIAL,
    profile: makeProfile('So1', ['S3', 'Ac2'], ['E3', 'S1']),
  },
  {
    code: 'DUO', name: '搭子收集家', tagline: '饭搭、课搭、馆搭，主打一个不落单。',
    dimension: 'So2', model: SOCIAL,
    profile: makeProfile('So2', ['E1', 'So1'], ['E3', 'S1']),
  },
  {
    code: 'CHAT-R', name: '路过社牛', tagline: '不一定认识，但一定能聊两句。',
    dimension: 'So2', model: SOCIAL,
    profile: makeProfile('So2', ['So3', 'So1'], ['E2', 'Ac3']),
  },
  {
    code: 'LOUD-R', name: '气氛起哄王', tagline: '活动成不成功，先看我愿不愿意带头喊。',
    dimension: 'So3', model: SOCIAL,
    profile: makeProfile('So3', ['So1', 'E2'], ['S2', 'A1']),
  },
];

export const specialPersonalities: SpecialPersonality[] = [
  {
    code: '????', name: '隐藏款', tagline: '你是校园里最独特的存在，无法归类，无需归类。',
    trigger: 'match_score < 60%',
  },
  {
    code: 'LAG', name: '永久加载中', tagline: '加载了，但没完全加载。',
    trigger: '连续中立选项',
  },
];

export function getPersonalityByCode(code: string): Personality | undefined {
  return personalities.find((p) => p.code === code);
}
