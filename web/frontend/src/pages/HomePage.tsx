import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveNickname, getNickname } from '../utils/storage';
import { personalities } from '../data/personalities';

export default function HomePage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(getNickname() ?? '');
  const [showInput, setShowInput] = useState(false);

  const handleStart = () => {
    if (nickname.trim()) {
      saveNickname(nickname.trim());
    }
    navigate('/quiz');
  };

  return (
    <div className="page home-page">
      <section className="hero">
        <h1 className="hero-title">
          <span className="hero-brand">科广TI</span>
          <span className="hero-sub">港科广专属人格测试</span>
        </h1>
        <p className="hero-desc">
          5大模型 · 15个维度 · 27种人格<br />
          找到你在港科广的真实人设
        </p>

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
    </div>
  );
}
