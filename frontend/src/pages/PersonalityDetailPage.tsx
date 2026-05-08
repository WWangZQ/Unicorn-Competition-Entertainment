import { useParams, useNavigate } from 'react-router-dom';
import { personalities, specialPersonalities } from '../data/personalities';
import { ALL_DIMENSION_IDS, DIMENSIONS } from '../data/dimensions';
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

  // Standard personality
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

      <section className="pd-profile">
        <h2 className="section-title">理想维度分布</h2>
        <div className="dim-list">
          {ALL_DIMENSION_IDS.map((id: DimensionId) => {
            const d = DIMENSIONS[id];
            const score = personality!.profile[id];
            return (
              <div key={id} className="dim-row">
                <div className="dim-info">
                  <span className="dim-name">{d.name}</span>
                  <span className="dim-model">{d.model}</span>
                </div>
                <div className="dim-bar-wrap">
                  <div className="dim-bar">
                    <div
                      className="dim-fill"
                      style={{ width: `${(score / 4) * 100}%` }}
                    />
                  </div>
                  <span className="dim-score">{score}/4</span>
                </div>
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
