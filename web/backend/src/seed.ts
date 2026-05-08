import { questionCount, upsertQuestion } from './db.js';

export function seedDefaults(): void {
  if (questionCount() > 0) return;

  const defaults = [
    { id: 'q1', text: '距离DDL还剩8小时，你打开了一个空白文档。此时你的内心更像？', dimension: 'S1', options: JSON.stringify([{ text: '完了完了完了，手在抖，心跳在加速', score: 0 }, { text: '有点慌，但隐约记得上次也是这么活下来的', score: 1 }, { text: '慌什么，我祖上三代都是死线前夜才真正开始写', score: 2 }]), is_hidden: 0 },
    { id: 'q2', text: '你在最后一分钟踩着点把作业交了。室友问你怎么做到的，你说：', dimension: 'S1', options: JSON.stringify([{ text: '别问了，我刚刚经历了人类不该经历的精神状态', score: 0 }, { text: '运气好，再加上我最后两小时突然不像人了', score: 1 }, { text: '这有什么，我的人生就是在截止时间前一秒按提交', score: 2 }]), is_hidden: 0 },
    { id: 'q3', text: '你告诉朋友"我已经开始做了"，这句话的真实意思是：', dimension: 'S2', options: JSON.stringify([{ text: '我想了想，大概想了三秒，这也算开始', score: 0 }, { text: '我打开了一个空白文件，给它起好了名字，然后去刷B站了', score: 1 }, { text: '我真的开始了，可能只写了一行标题，但我人已经在路上了', score: 2 }]), is_hidden: 0 },
    { id: 'q4', text: '有人在群里发了一条消息@你，你看到了但没回。三小时后你还在"想怎么回"。此时你是？', dimension: 'S2', options: JSON.stringify([{ text: '我承认我在装死，而且装死的时长已经超出了合理范围', score: 0 }, { text: '我在等一个更好的时机', score: 1 }, { text: '不回就不回，真紧急的事会打电话', score: 2 }]), is_hidden: 0 },
    { id: 'q5', text: '小组里有人的做事方式和你的节奏完全不对付。你更接近哪种状态？', dimension: 'S3', options: JSON.stringify([{ text: '只要别拖累我就行，项目能交上去谁管他怎么搞', score: 0 }, { text: '我会试着对齐一次，不行就算了', score: 1 }, { text: '受不了，我必须让事情走上正轨', score: 2 }]), is_hidden: 0 },
    { id: 'q6', text: '一门课你可以选"水过去稳及格"或者"冲一把可能高分也可能翻车"，你心里更偏向？', dimension: 'S3', options: JSON.stringify([{ text: '稳的，翻车比低分更让我难受一百倍', score: 0 }, { text: '看是什么课，重要的课可以赌一把', score: 1 }, { text: '不冲有什么意思，混及格不如直接翘了', score: 2 }]), is_hidden: 0 },
    { id: 'q7', text: '你发现常去的自习室那个靠窗第三排的位置被人坐了。你一整天都？', dimension: 'E1', options: JSON.stringify([{ text: '浑身不对劲，那个位置和我之间有绑定关系', score: 0 }, { text: '有点不舒服但很快找了个新的', score: 1 }, { text: '无所谓，今天坐哪都是坐', score: 2 }]), is_hidden: 0 },
    { id: 'q8', text: '固定饭搭子突然说这周要陪另一个朋友吃饭。你的第一反应是？', dimension: 'E1', options: JSON.stringify([{ text: '有一种微妙的、不太想承认的失落感', score: 0 }, { text: '好吧也行，我一个人吃也不是不能活', score: 1 }, { text: '太好了可以自由安排', score: 2 }]), is_hidden: 0 },
  ];

  for (const q of defaults) {
    upsertQuestion(q);
  }
  console.log(`Seeded ${defaults.length} default questions`);
}
