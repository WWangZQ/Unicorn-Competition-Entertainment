import { useNavigate } from 'react-router-dom';
import { MODELS } from '../data/dimensions';
import { personalities, specialPersonalities } from '../data/personalities';
import PersonalityCard from '../components/PersonalityCard';

export default function GalleryPage() {
  const navigate = useNavigate();

  // Group personalities by model
  const grouped = MODELS.map((m) => {
    const dimIds = m.dims as readonly string[];
    const members = personalities.filter((p) => dimIds.includes(p.dimension));
    return { ...m, members };
  });

  return (
    <div className="page gallery-page">
      <h1 className="page-title">人格图鉴</h1>
      <p className="page-sub">
        {personalities.length} 种标准人格 + {specialPersonalities.length} 种特殊触发
      </p>

      {grouped.map((group) => (
        <section key={group.key} className="gallery-group">
          <h2 className="section-title">
            {group.name}
            <span className="section-title-en">{group.en}</span>
          </h2>
          <div className="gallery-grid">
            {group.members.map((p) => (
              <PersonalityCard
                key={p.code}
                personality={p}
                onClick={() => navigate(`/types/${p.code}`)}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Special personalities */}
      <section className="gallery-group">
        <h2 className="section-title">
          特殊触发
          <span className="section-title-en">Special</span>
        </h2>
        <div className="gallery-grid">
          {specialPersonalities.map((sp) => (
            <div key={sp.code} className="personality-card personality-card--special">
              <div className="pc-header">
                <span className="pc-code pc-code--special">{sp.code}</span>
                <span className="pc-dim">{sp.trigger}</span>
              </div>
              <h3 className="pc-name">{sp.name}</h3>
              <p className="pc-tagline">{sp.tagline}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
