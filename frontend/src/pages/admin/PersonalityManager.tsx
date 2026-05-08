import { personalities, specialPersonalities } from '../../data/personalities';
import { DIMENSIONS } from '../../data/dimensions';
import type { DimensionId } from '../../data/dimensions';

export default function PersonalityManager() {
  return (
    <div className="admin-section">
      <h2 className="section-title">标准人格 ({personalities.length})</h2>
      <div className="admin-list">
        {personalities.map((p) => (
          <div key={p.code} className="admin-item">
            <div className="admin-item-header">
              <span className="admin-item-id">{p.code}</span>
              <span className="admin-item-dim">
                {p.model} · {DIMENSIONS[p.dimension]?.name}
              </span>
            </div>
            <p className="admin-item-text"><strong>{p.name}</strong> — {p.tagline}</p>
            <div className="admin-profile">
              {(Object.entries(p.profile) as [DimensionId, number][]).map(([dim, score]) => (
                <span key={dim} className={`admin-profile-dot ${score >= 3 ? 'high' : score <= 1 ? 'low' : ''}`}>
                  {dim}:{score}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2 className="section-title" style={{ marginTop: 32 }}>特殊触发 ({specialPersonalities.length})</h2>
      <div className="admin-list">
        {specialPersonalities.map((sp) => (
          <div key={sp.code} className="admin-item">
            <div className="admin-item-header">
              <span className="admin-item-id admin-item-id--special">{sp.code}</span>
              <span className="admin-item-dim">{sp.trigger}</span>
            </div>
            <p className="admin-item-text"><strong>{sp.name}</strong> — {sp.tagline}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
