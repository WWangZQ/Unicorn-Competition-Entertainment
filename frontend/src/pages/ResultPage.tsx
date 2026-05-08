import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLatestResult, getNickname } from '../utils/storage';
import { getModelScores, getModelLabel } from '../utils/scoring';
import { ALL_DIMENSION_IDS, DIMENSIONS, scoreToLevel } from '../data/dimensions';
import ShareCard from '../components/ShareCard';
import type { DimensionId } from '../data/dimensions';

export default function ResultPage() {
  const navigate = useNavigate();
  const result = getLatestResult();
  const nickname = getNickname() ?? '匿名';

  useEffect(() => {
    if (!result) {
      navigate('/quiz');
    }
  }, [result, navigate]);

  if (!result) return null;

  const isSpecial = result.specialCode !== null;
  const modelScores = getModelScores(result.dimensionScores);

  return (
    <div className="page result-page">
      <div className="result-header">
        {isSpecial ? (
          <>
            <div className="result-code result-code--special">{result.specialCode}</div>
            <h1 className="result-name">{result.specialName}</h1>
            <p className="result-tagline">{result.specialTagline}</p>
          </>
        ) : result.personality ? (
          <>
            <div className="result-code">{result.personality.code}</div>
            <h1 className="result-name">{result.personality.name}</h1>
            <p className="result-tagline">{result.personality.tagline}</p>
            <div className="result-meta">
              <span>匹配度 <strong>{result.similarity}%</strong></span>
              <span className="hero-dot">·</span>
              <span>{DIMENSIONS[result.personality.dimension]?.model} · {DIMENSIONS[result.personality.dimension]?.name}</span>
            </div>
          </>
        ) : null}
      </div>

      {/* Dimension breakdown */}
      <section className="result-dims">
        <h2 className="section-title">维度分析</h2>
        <div className="dim-list">
          {ALL_DIMENSION_IDS.map((id: DimensionId) => {
            const dim = DIMENSIONS[id];
            const score = result.dimensionScores[id];
            const level = scoreToLevel(score);
            const maxScore = 4;
            return (
              <div key={id} className="dim-row">
                <div className="dim-info">
                  <span className="dim-name">{dim.name}</span>
                  <span className="dim-model">{dim.model}</span>
                </div>
                <div className="dim-bar-wrap">
                  <div className="dim-bar">
                    <div
                      className="dim-fill"
                      style={{ width: `${(score / maxScore) * 100}%` }}
                    />
                  </div>
                  <span className={`dim-level dim-level--${level.toLowerCase()}`}>{level}</span>
                  <span className="dim-score">{score}/{maxScore}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Model summary */}
      <section className="result-models">
        <h2 className="section-title">五大模型</h2>
        <div className="model-bars">
          {Object.entries(modelScores).map(([key, score]) => (
            <div key={key} className="model-row">
              <span className="model-label">{getModelLabel(key)}</span>
              <div className="model-track">
                <div
                  className="model-fill"
                  style={{ width: `${(score / 12) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Share card */}
      <section className="result-share">
        <h2 className="section-title">分享你的结果</h2>
        <ShareCard result={result} nickname={nickname} />
      </section>

      <div className="result-actions">
        <button className="btn btn--primary" onClick={() => navigate('/quiz')}>
          重新测试
        </button>
        <button className="btn btn--secondary" onClick={() => navigate('/gallery')}>
          查看图鉴
        </button>
      </div>
    </div>
  );
}
