import { useParams, useNavigate } from 'react-router-dom';
import { personalities, specialPersonalities } from '../data/personalities';
import { ALL_DIMENSION_IDS, DIMENSIONS, scoreToLevel } from '../data/dimensions';
import type { DimensionId } from '../data/dimensions';

export default function PersonalityDetailPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const personality = personalities.find((p) => p.code === code);
  const special = specialPersonalities.find((s) => s.code === code);

  if (!personality && !special) {
    return (
      <div className="page">
        <div className="pd-header">
          <p className="text-muted">人格类型不存在</p>
        </div>
        <div className="pd-back">
          <button className="btn btn--secondary" onClick={() => navigate('/gallery')}>
            ← 返回图鉴
          </button>
        </div>
      </div>
    );
  }

  if (special) {
    return (
      <div className="page">
        <div className="pd-header">
          <div className="pd-code pd-code--special">{special.code}</div>
          <h1 className="pd-name">{special.name}</h1>
          <p className="pd-tagline">{special.tagline}</p>
          <div className="pd-model">触发条件：{special.trigger}</div>
        </div>
        <div className="pd-back">
          <button className="btn btn--secondary" onClick={() => navigate('/gallery')}>
            ← 返回图鉴
          </button>
        </div>
      </div>
    );
  }

  const dim = DIMENSIONS[personality!.dimension];

  return (
    <div className="page">
      <div className="pd-header">
        <div className="pd-code">{personality!.code}</div>
        <h1 className="pd-name">{personality!.name}</h1>
        <p className="pd-tagline">{personality!.tagline}</p>
        <div className="pd-model">
          {dim?.model} · {dim?.name}
        </div>
      </div>

      {/* Personality description */}
      <section className="analysis-box">
        <h2>人格描述</h2>
        <p>{personality!.description}</p>
      </section>

      {/* Dimension portrait */}
      <section className="dim-box">
        <h2>维度画像</h2>
        <div className="dim-list">
          {ALL_DIMENSION_IDS.map((id: DimensionId) => {
            const d = DIMENSIONS[id];
            const score = personality!.profile[id];
            const level = scoreToLevel(score);
            return (
              <div key={id} className="dim-item">
                <div className="dim-item-top">
                  <div className="dim-item-name">{id} {d.name}</div>
                  <div className="dim-item-score">{level}</div>
                </div>
                <p>{d.levels[level]}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="pd-back">
        <button className="btn btn--primary" onClick={() => navigate('/quiz')}>
          开始测试
        </button>
        <span style={{ margin: '0 8px' }} />
        <button className="btn btn--secondary" onClick={() => navigate('/gallery')}>
          ← 返回图鉴
        </button>
      </div>
    </div>
  );
}
