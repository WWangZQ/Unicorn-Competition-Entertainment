import type { DimensionId } from './dimensions';
import { ALL_DIMENSION_IDS } from './dimensions';

export interface Personality {
  code: string;
  name: string;
  tagline: string;
  description: string;
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
    description: '你是时间管理界的极限运动员。你的效率曲线是一条完美的指数函数——前95%的时间趋近于零，最后5%的时间垂直起飞。你的室友已经习惯了你在截止前夜的键盘声和偶尔传来的绝望叹息。但神奇的是，你从来没真正翻过车。这不是运气，这是一种让所有拖延者羡慕但永远学不会的天赋。',
    dimension: 'S1', model: SELF,
    profile: makeProfile('S1', ['A3', 'Ac3'], ['E3', 'So2']),
  },
  {
    code: 'DDL-1', name: '前夜爆种人', tagline: '平时像没动，死线前像开挂。',
    description: '你拥有一种令科学家困惑的能力：平时看起来完全像没在动的生物，但一到DDL前夜就突然激活了所有潜能。你的同学永远想不通——明明你和他们一起在摸鱼，为什么最后交出来的东西比他们还好？这是一种薛定谔的效率状态：在截止时间到来之前，你既是废物又是天才。',
    dimension: 'S1', model: SELF,
    profile: makeProfile('S1', ['E2', 'So3'], ['Ac2', 'Ac1']),
  },
  {
    code: 'DRAG', name: '能拖就拖人', tagline: '今天不做，不是摆烂，是给明天的我机会。',
    description: '你的人生哲学可以概括为：今天能不做的事，明天也不会想做。但你相信任务有时会被时间自动解决——有些事情拖着拖着就不用做了，有些事情拖着拖着就有人替你做了。你最大的天赋是：把"等等再说"说成了一种人生态度，而且听起来居然很有道理。',
    dimension: 'S2', model: SELF,
    profile: makeProfile('S2', ['A2', 'E3'], ['Ac3', 'S3']),
  },
  {
    code: 'AFK', name: '已读不做者', tagline: '任务我看见了，身体还没同意。',
    description: '你拥有一种超能力：看到消息，理解消息，然后完全忽略消息。你的身体和大脑之间存在一套严格的审批流程——大脑说"要做"，身体说"下次一定"。你不是不想做，你只是觉得有些事情需要深思熟虑——深思熟虑到大家都忘了这件事为止。不回复就是最好的回复。',
    dimension: 'S2', model: SELF,
    profile: makeProfile('S2', ['So2', 'E3'], ['Ac1', 'A3']),
  },
  {
    code: 'CTRL', name: '计划控', tagline: '我不是爱催，只是看不得世界失控。',
    description: '你是人形的任务管理器，Ctrl+S是你的肌肉记忆。当别人还在想"大概怎么做"的时候，你已经把任务拆成了17个子步骤并标注了优先级。你的室友怕你，因为你会在群里@所有人并附上一张甘特图。但说真的，没有你，大部分小组项目会在第一周就进入熵增状态。你不是爱控制，你只是看不得世界失控。',
    dimension: 'S3', model: SELF,
    profile: makeProfile('S3', ['Ac2', 'Ac3'], ['A2', 'E3']),
  },
  {
    code: 'SAFE', name: '摸鱼保命人', tagline: '不求出彩，但求别背锅。',
    description: '你的人生策略是：不出彩，但也不出错。这是一种极其聪明的生存智慧——你精准地找到了"刚好不被挂科/批评/开除"的黄金分割线。你不是没能力，你只是觉得没必要为了多拿两分把自己累成狗。安全第一，优秀第二，能不能混过去第三——而且你每次都能混过去，这本身就是一种能力。',
    dimension: 'S3', model: SELF,
    profile: makeProfile('S3', ['E3', 'So2'], ['So1', 'A3']),
  },
  // ===== 情感模型 E1-E3 =====
  {
    code: 'CAMP', name: '熟人舒适圈', tagline: '我不是不合群，我只是精准合群。',
    description: '你不是不合群——你是精准合群。在陌生人面前你是一本合上的书，在熟人面前你是24小时滚动播出的综艺节目。你的社交模式是：要么不说话，要么说到停不下来，中间没有过渡地带。这不是社恐，这是一种社交品质筛选机制——能进入你的熟人圈，说明对方通过了某种你也没说清楚但确实存在的考核。',
    dimension: 'E1', model: EMOTIONAL,
    profile: makeProfile('E1', ['So2', 'E3'], ['So1', 'A2']),
  },
  {
    code: 'COFF-EE', name: '通宵续命体', tagline: '白天像路人，晚上靠咖啡续命。',
    description: '咖啡因是你身体的第二血液。白天你在课堂上像一个待机状态的机器人，但一到深夜，你就变成了充满灵感的创作者。你的室友不明白为什么你总在凌晨三点最清醒——其实你自己也不明白。你只知道夜晚有一种魔力，让所有白天不想做的事突然变得值得一做。人生循环：困→咖啡→不困→熬夜→更困→更多咖啡。',
    dimension: 'E2', model: EMOTIONAL,
    profile: makeProfile('E2', ['S1', 'A3'], ['E1', 'So1']),
  },
  {
    code: 'LIB-R', name: '图书馆钉子户', tagline: '不是我爱学习，是座位离不开我。',
    description: '图书馆是你的第二个宿舍。不是因为你多爱学习，而是你发现了一个秘密：在图书馆里，哪怕只是坐着翻手机，也感觉自己今天没有白过。你和常坐的那个位置之间已经建立了一种超越理性的绑定关系——如果有人占了你的位置，你一整天都会不舒服。你不是书呆子，你是氛围型学习者，学习效率完全取决于座位的好坏。',
    dimension: 'E2', model: EMOTIONAL,
    profile: makeProfile('E2', ['E1', 'S3'], ['So1', 'A2']),
  },
  {
    code: 'EXIT', name: '提前开溜人', tagline: '不是活动无聊，是我撤退得比较有边界感。',
    description: '你拥有一种优雅的消失能力。任何社交活动对你来说都有一个隐藏的倒计时——当计时归零，你就会像鱼从水族箱里消失一样安静地离开。你不是不喜欢社交，你只是觉得自己的社交电量有限，必须在耗尽之前体面撤退。别人还没反应过来你已经走了——这让你在朋友中获得了一个神秘人设："刚才还在，现在人呢？"',
    dimension: 'E3', model: EMOTIONAL,
    profile: makeProfile('E3', ['So2', 'S2'], ['E2', 'So1']),
  },
  {
    code: 'VOID', name: '空气队友', tagline: '你以为他在队里，其实他在系统里。',
    description: '你在小组里最擅长的技能是：存在但不被注意。你的名字在群聊里出现频率极低，但你也从不出错、从不惹事、从不成为任何人的麻烦。有人说你是团队的幽灵——你确实在，但没人能说出你具体做了什么。这是一种独特的生存策略：既参与了集体活动，又保留了全部个人时间。你是小组里的暗物质，看不见但理论上存在。',
    dimension: 'E3', model: EMOTIONAL,
    profile: makeProfile('E3', ['Ac2', 'So2'], ['Ac3', 'S3']),
  },
  // ===== 态度模型 A1-A3 =====
  {
    code: 'COPY', name: '拼接缝合怪', tagline: '天下资料一大抄，能交就是硬道理。',
    description: '你是互联网时代的炼金术士——把别人的东西拿来，加一点自己的东西（主要是格式调整），然后炼成一份全新的作业。你的Ctrl+C和Ctrl+V键已经磨得发亮。但你不是抄袭，你是在做"信息整合"——至少你是这么告诉自己的。事实证明，这个世界确实奖励会整合的人。原创是奢侈的，能交差是实在的。',
    dimension: 'A1', model: ATTITUDE,
    profile: makeProfile('A1', ['A2', 'Ac2'], ['A3', 'S3']),
  },
  {
    code: 'BLAM-R', name: '甩锅预备役', tagline: '活不一定干得完，责任一定分得清。',
    description: '你对责任的分布有着极其敏锐的直觉。任何任务一开始，你的大脑就会自动计算：哪些地方可能出事，出事了谁能扛。你不是不负责任——你只是觉得，责任应该像披萨一样被精确地切成等份，而你的那块最好是个空盘子。活不一定干得完，但责任边界一定分得清，这是你的核心竞争力。',
    dimension: 'A1', model: ATTITUDE,
    profile: makeProfile('A1', ['E3', 'Ac2'], ['Ac3', 'So3']),
  },
  {
    code: 'PATC-H', name: '补锅永动机', tagline: '改完这版还有下版，下版后面还有下一版。',
    description: '你的人生就是在不断地修补别人留下的漏洞。你以为改完这版就结束了，但永远有下一版在等着你。你不是受虐狂，你只是拥有一种罕见的责任感——看到事情不完美就浑身难受。这让你成为了团队里最累的那个人，也成了团队里最不可或缺的那个人。改完这版还有下版，下版后面还有下一版，下一版后面……你在补锅，锅在补你。',
    dimension: 'A2', model: ATTITUDE,
    profile: makeProfile('A2', ['Ac3', 'E2'], ['A1', 'S1']),
  },
  {
    code: 'PPT-A', name: '汇报美化师', tagline: '内容可以空，排版不能输。',
    description: '你深信一条真理：内容可以空，但排版不能输。你不一定记得自己写了什么，但你一定记得用了什么字体、什么配色、什么动画效果。你的PPT拿出来，光看封面就能让人忽略里面所有的实质性空洞。有人说你是形式主义者，你说这是用户体验——毕竟，一个好看的PPT可以让老师心情好一点，而心情好的老师，打分就高。',
    dimension: 'A2', model: ATTITUDE,
    profile: makeProfile('A2', ['So3', 'So1'], ['Ac3', 'S2']),
  },
  {
    code: 'RUSH', name: '抱佛脚圣体', tagline: '学得晚，不代表考得烂。',
    description: '你的学习曲线是一条惊人的垂直线——平时几乎为零，考试前48小时直冲云霄。你的短期记忆能力令人恐惧，可以在一个晚上记住一个学期的内容，然后在考完的第二天全部清空。这不是学习，这是一种极限运动。但你的成绩单证明：学得晚，不代表考得烂。你的佛脚，是全世界最有效的学习工具。',
    dimension: 'A3', model: ATTITUDE,
    profile: makeProfile('A3', ['S1', 'Ac1'], ['S3', 'E2']),
  },
  {
    code: 'WHEE-L', name: '造轮子的人', tagline: '别人还在想方案，我已经重新发明一遍了。',
    description: '别人用现成的工具已经把活干完了，你还在搭建自己的工具。你知道有现成的，但你觉得那个不够好——它没有你想要的某个特定功能，或者代码风格让你不舒服。所以你决定自己重新造一个。等你的轮子造好了，别人已经在造车了。但你的轮子确实比别人的好，这一点你无法否认。你是效率的死敌，也是品质的守护者。',
    dimension: 'A3', model: ATTITUDE,
    profile: makeProfile('A3', ['Ac3', 'S2'], ['A2', 'So1']),
  },
  // ===== 行动驱力模型 Ac1-Ac3 =====
  {
    code: 'MASK', name: '假装很忙人', tagline: '窗口开得越多，贡献看起来越真。',
    description: '你的桌面永远开着十几个窗口，但其中至少一半是装饰性的。你深谙一个生存真理：看起来忙比真的忙更重要。你的Alt+Tab切换速度已经练到了肌肉记忆级别——任何时候有人靠近，你都能在0.3秒内从B站切到论文。你不是在偷懒，你是在进行"多任务并行处理"——至少Windows的任务管理器是这么显示的。',
    dimension: 'Ac1', model: ACTION,
    profile: makeProfile('Ac1', ['A2', 'So3'], ['Ac3', 'S2']),
  },
  {
    code: 'ALRM-R', name: '警铃本铃', tagline: '我催你，就是DDL催你。',
    description: '你是行走的人形闹钟。不仅催自己，也催别人——而且催得比DDL还准时。你催人的时候态度温和但无法拒绝，因为你每次催都附带一个精确到分钟的时间表。你的队友既烦你又依赖你——因为没有你的提醒，他们真的会忘记所有事情。你是小组的活体日历，24小时待机的友好催命符。',
    dimension: 'Ac1', model: ACTION,
    profile: makeProfile('Ac1', ['S3', 'Ac2'], ['E3', 'A2']),
  },
  {
    code: '404', name: '任务蒸发者', tagline: '昨天还在，今天就像没存在过。',
    description: '你有一种特殊的能力：任务到了你这里就像进了黑洞。不是你不做，而是你总是有更紧急的事情要先处理……然后那个任务就再也没有出现过。你拥有一种罕见的"优先级动态调整机制"——任何任务在你手上，优先级都会自动降到最低。你的队友已经学会了：重要的事情不要只发给你一个人。',
    dimension: 'Ac2', model: ACTION,
    profile: makeProfile('Ac2', ['E3', 'So2'], ['S3', 'Ac3']),
  },
  {
    code: 'SPEC', name: '文档堆尸人', tagline: '字我写了，坑我也标了，出事就别说没人提醒。',
    description: '你写的文档比你的代码还长。每一个函数都有注释，每一个注释都有修改记录，每一个修改记录都标注了时间和原因。你不是在写代码，你是在为未来的考古学家留下文物。当项目在三个月后出bug的时候，所有人都会回来翻你的文档——那一刻，你就是全组的救世主。你是团队的保险单，是代码库的考古学家。',
    dimension: 'Ac3', model: ACTION,
    profile: makeProfile('Ac3', ['S3', 'A3'], ['A2', 'E3']),
  },
  {
    code: 'GHOS-T', name: '组会幽灵', tagline: '平时查无此人，汇报准时上线。',
    description: '你有一种神秘的存在模式：平时在群里完全查无此人，但一到组会时间就准时出现在屏幕上。没人知道你这周做了什么，但汇报的时候你说的头头是道。这不是偷懒，这是一种高效的工作模式——只在关键时刻发力。你是小组里最神秘的角色，来无影去无踪，但汇报从来不掉链子。',
    dimension: 'Ac3', model: ACTION,
    profile: makeProfile('Ac3', ['So3', 'A2'], ['E2', 'So2']),
  },
  // ===== 社交模型 So1-So3 =====
  {
    code: 'SOC-A', name: '活动永动机', tagline: '哪儿有热闹，哪儿就有我的签到记录。',
    description: '你的日历比校长还满。哪里有活动，哪里就有你的签到记录。你不是社交达人——你是社交永动机。你的微信里有无数个活动群，你甚至记不清自己是什么时候加进去的。有人说你是不是不用学习，你微微一笑——社交就是你的学习。你的人脉网络比你学校的WiFi覆盖范围还广。',
    dimension: 'So1', model: SOCIAL,
    profile: makeProfile('So1', ['So3', 'E2'], ['E3', 'S2']),
  },
  {
    code: 'SYNC', name: '控场发言人', tagline: '场面一冷，我就开始组织语言。',
    description: '场面一冷，你的大脑就开始高速运转。你不是主持人，但每次讨论跑偏或者冷场的时候，你总是那个站出来的人。你有一种天赋：能在三秒内想出一个合适的话题，或者把跑偏的讨论拉回正轨。你的存在让所有会议至少能准时结束。你不是控制欲强，你只是受不了尴尬的沉默。',
    dimension: 'So1', model: SOCIAL,
    profile: makeProfile('So1', ['S3', 'Ac2'], ['E3', 'S1']),
  },
  {
    code: 'DUO', name: '搭子收集家', tagline: '饭搭、课搭、馆搭，主打一个不落单。',
    description: '你有一种特殊的收集癖：收集各种搭子。饭搭、课搭、馆搭、健身搭、奶茶搭、取快递搭——你的生活被各种搭子填满了。你不是离不开人，你只是觉得有人一起做事情比较有意思。你的手机通讯录是按"搭子类型"分类的，这个分类系统只有你自己能看懂。一个人可以走很快，但有人搭班更有趣。',
    dimension: 'So2', model: SOCIAL,
    profile: makeProfile('So2', ['E1', 'So1'], ['E3', 'S1']),
  },
  {
    code: 'CHAT-R', name: '路过社牛', tagline: '不一定认识，但一定能聊两句。',
    description: '你有一种令人费解的能力：和完全不认识的人在三十秒内聊得像老朋友。排队、等车、坐电梯——任何场景都是你的社交舞台。你不一定记得对方的名字，但你一定记得上次聊了什么。有人说你是社牛本牛，你说你只是对人有天然的好奇心。你的社交半径大到自己的微信都管理不过来了。',
    dimension: 'So2', model: SOCIAL,
    profile: makeProfile('So2', ['So3', 'So1'], ['E2', 'Ac3']),
  },
  {
    code: 'LOUD-R', name: '气氛起哄王', tagline: '活动成不成功，先看我愿不愿意带头喊。',
    description: '你是氛围组的核心成员。活动热不热闹，一半取决于你愿不愿意带头喊。你不一定是最会组织的，但你一定是最会带气氛的。你的笑声是全场最响的，你的掌声是全场最用力的。有人说你太浮夸了，但所有人都承认——有你在的地方，绝对不会冷场。你是气氛组的灵魂，派对的发动机，行走的BGM。',
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
