import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { saveNickname, getNickname, getHistory } from '../utils/storage';
import { personalities } from '../data/personalities';
import { MODELS } from '../data/dimensions';
import { getStats, type PersonalityStat } from '../utils/api';
import PersonalityCard from '../components/PersonalityCard';

export default function HomePage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(getNickname() ?? '');
  const [showInput, setShowInput] = useState(false);
  const [hotList, setHotList] = useState<PersonalityStat[]>([]);

  useEffect(() => {
    getStats()
      .then((s) => setHotList(s.personalityDistribution.slice(0, 10)))
      .catch(() => {
        // Fallback to local
        const map = new Map<string, { code: string; name: string; count: number }>();
        getHistory().forEach((entry) => {
          const code = entry.personality?.code ?? entry.specialCode ?? '????';
          const name = entry.personality?.name ?? entry.specialName ?? '未知';
          const e = map.get(code);
          e ? e.count++ : map.set(code, { code, name, count: 1 });
        });
        setHotList([...map.values()].sort((a, b) => b.count - a.count).slice(0, 10));
      });
  }, []);

  const handleStart = () => {
    if (nickname.trim()) {
      saveNickname(nickname.trim());
    }
    navigate('/quiz');
  };

  return (
    <div className="page home-page">
      <section className="hero card">
        <div className="eyebrow">科广TI 人格测试 · 娱乐向</div>
        <h1 className="hero-title">科广TI — 你是哪种人格？</h1>
        <p className="hero-desc">
          30 道主线题 + 隐藏支线，五大模型十五维度交叉分析，为你匹配最贴合的人格标签。
          测试仅供娱乐，请勿当真。
        </p>

        <div className="hero-grid">
          <div className="mini-panel">
            <h3>五大模型</h3>
            <ul>
              {MODELS.map((m) => (
                <li key={m.key}>{m.name} — {m.dims.length} 个维度</li>
              ))}
            </ul>
          </div>
          <div className="mini-panel">
            <h3>关于测试</h3>
            <ul>
              <li>约 32 题，5–8 分钟</li>
              <li>含 2 道隐藏支线触发题</li>
              <li>题目每次随机排列</li>
              <li>纯前端计算，不上传数据</li>
            </ul>
          </div>
        </div>

        {showInput ? (
          <div className="nickname-input-wrap">
            <input
              className="input"
              type="text"
              placeholder="输入你的昵称（可选）"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              autoFocus
            />
            <button className="btn btn--primary" onClick={handleStart}>
              开始测试 →
            </button>
          </div>
        ) : (
          <div className="hero-actions">
            <button className="btn btn--primary btn--large" onClick={() => setShowInput(true)}>
              开始测试
            </button>
            <button
              className="btn btn--secondary"
              onClick={() => navigate('/gallery')}
            >
              浏览人格图鉴
            </button>
          </div>
        )}

        <div className="hero-stats">
          <span>共 {personalities.length} 种人格</span>
          <span className="hero-dot">·</span>
          <span>30 道题</span>
          <span className="hero-dot">·</span>
          <span>仅供娱乐</span>
        </div>
      </section>

      {/* Personality gallery on homepage */}
      <section className="types-section">
        <Link to="/gallery" className="types-title-link">
          <h2 className="types-title">全部人格图鉴</h2>
          <span className="types-title-arrow">→</span>
        </Link>
        <p className="types-subtitle">共 {personalities.length} 种人格，点击查看详情</p>
        <div className="types-grid">
          {personalities.map((p) => (
            <PersonalityCard
              key={p.code}
              personality={p}
              onClick={() => navigate(`/types/${p.code}`)}
            />
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2 className="faq-title">常见问题</h2>
        <div className="faq-list">
          <details className="faq-item">
            <summary>科广TI 是什么？和 MBTI 有什么区别？</summary>
            <p>科广TI（科广 Type Indicator）是一个娱乐向人格测试，基于五大模型、十五维度交叉计算，匹配 27 种独特人格标签。与 MBTI 的四维度二分法不同，科广TI 采用更细的三级评估，并加入隐藏支线和特殊触发机制，结果更具戏剧性和趣味性。它不是心理学工具，纯粹为了好玩。</p>
          </details>
          <details className="faq-item">
            <summary>测试需要多长时间？</summary>
            <p>约 30 道主线题 + 2 道隐藏支线触发题，通常 5–8 分钟即可完成。题目每次随机排列，所以每次体验略有不同。</p>
          </details>
          <details className="faq-item">
            <summary>测试结果准确吗？</summary>
            <p>本测试仅供娱乐，不构成任何心理学、医学或职业建议。所有人格描述均为戏谑风格，请勿当真。如果你觉得结果像你，那是巧合；如果觉得不像，那也是巧合。</p>
          </details>
          <details className="faq-item">
            <summary>我的数据会被上传吗？</summary>
            <p>所有计算都在你的浏览器本地完成（纯前端），我们不收集、不存储、不上传任何答题数据。你的人格秘密只有你自己知道。</p>
          </details>
          <details className="faq-item">
            <summary>什么是隐藏人格？怎么触发？</summary>
            <p>测试中包含 2 道特殊触发题，如果你的回答满足特定条件，系统会跳过常规人格匹配，直接为你分配一个隐藏人格。具体触发条件是秘密，答题时请跟随直觉。</p>
          </details>
          <details className="faq-item">
            <summary>可以分享测试结果吗？</summary>
            <p>可以。结果页提供"保存图片分享"功能，会生成一张包含你的人格类型和维度得分的图片，方便分享到社交媒体。</p>
          </details>
          <details className="faq-item">
            <summary>为什么我每次测出来的结果不一样？</summary>
            <p>题目顺序每次随机排列，不同的答题节奏可能影响你的选择。另外，如果你的维度得分处于边界值附近，微小的变化就可能匹配到不同的人格类型。这也是测试有趣的地方。</p>
          </details>
        </div>
      </section>

      {/* Popularity ranking */}
      {hotList.length > 0 && (
        <section className="faq-section">
          <h2 className="faq-title">人格热度榜</h2>
          <div className="chart-list">
            {hotList.map((item, i) => {
              const maxCount = hotList[0]?.count ?? 1;
              const barWidth = (item.count / maxCount) * 100;
              return (
                <div key={item.code} className="chart-row" style={{ cursor: 'pointer' }} onClick={() => navigate(`/types/${item.code}`)}>
                  <div className="chart-rank">{i + 1}</div>
                  <div className="chart-label">
                    <span className="chart-code">{item.code}</span>
                    <span className="chart-name">{item.name}</span>
                  </div>
                  <div className="chart-bar-wrap">
                    <div
                      className={`chart-bar ${i < 3 ? 'chart-bar--hot' : ''}`}
                      style={{ width: `${Math.max(barWidth, 3)}%` }}
                    />
                  </div>
                  <div className="chart-count">{item.count}</div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
