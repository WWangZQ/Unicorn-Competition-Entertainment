import type { Personality } from '../data/personalities';
import { DIMENSIONS } from '../data/dimensions';

interface Props {
  personality: Personality;
  onClick?: () => void;
  highlight?: boolean;
}

export default function PersonalityCard({ personality, onClick, highlight }: Props) {
  const dim = DIMENSIONS[personality.dimension];

  return (
    <div
      className={`personality-card ${highlight ? 'personality-card--highlight' : ''}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="pc-header">
        <span className="pc-code">{personality.code}</span>
        <span className="pc-dim">{dim?.model} · {dim?.name}</span>
      </div>
      <h3 className="pc-name">{personality.name}</h3>
      <p className="pc-tagline">{personality.tagline}</p>
    </div>
  );
}
