import { useState, useEffect } from 'react';
import { personalities as defaultPersonalities, specialPersonalities as defaultSpecials, type Personality, type SpecialPersonality } from '../../data/personalities';
import { DIMENSIONS, ALL_DIMENSION_IDS } from '../../data/dimensions';
import type { DimensionId } from '../../data/dimensions';

const STORAGE_KEY = 'kgti_admin_personalities';

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as { standard: Personality[]; special: SpecialPersonality[] };
  } catch {}
  return { standard: defaultPersonalities, special: defaultSpecials };
}

export default function PersonalityManager() {
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [specials, setSpecials] = useState<SpecialPersonality[]>([]);
  const [editing, setEditing] = useState<Personality | null>(null);
  const [editingSpecial, setEditingSpecial] = useState<SpecialPersonality | null>(null);

  useEffect(() => {
    const data = loadData();
    setPersonalities(data.standard);
    setSpecials(data.special);
  }, []);

  const persist = (p: Personality[], s: SpecialPersonality[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ standard: p, special: s }));
    setPersonalities(p);
    setSpecials(s);
  };

  const handleSaveProfile = (updated: Personality) => {
    const next = personalities.map((p) => (p.code === updated.code ? updated : p));
    persist(next, specials);
    setEditing(null);
  };

  const handleSaveSpecial = (updated: SpecialPersonality) => {
    const next = specials.map((s) => (s.code === updated.code ? updated : s));
    persist(personalities, next);
    setEditingSpecial(null);
  };

  if (editing) {
    return <ProfileEditor personality={editing} onSave={handleSaveProfile} onCancel={() => setEditing(null)} />;
  }

  if (editingSpecial) {
    return <SpecialEditor special={editingSpecial} onSave={handleSaveSpecial} onCancel={() => setEditingSpecial(null)} />;
  }

  return (
    <div className="admin-section">
      <h2 className="section-title">标准人格 ({personalities.length})</h2>
      <div className="admin-list">
        {personalities.map((p) => (
          <div key={p.code} className="admin-item">
            <div className="admin-item-header">
              <span className="admin-item-id">{p.code}</span>
              <span className="admin-item-dim">{p.model} · {DIMENSIONS[p.dimension]?.name}</span>
              <button className="btn btn--ghost" style={{ marginLeft: 'auto' }} onClick={() => setEditing(p)}>编辑</button>
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

      <h2 className="section-title" style={{ marginTop: 32 }}>特殊触发 ({specials.length})</h2>
      <div className="admin-list">
        {specials.map((sp) => (
          <div key={sp.code} className="admin-item">
            <div className="admin-item-header">
              <span className="admin-item-id admin-item-id--special">{sp.code}</span>
              <span className="admin-item-dim">{sp.trigger}</span>
              <button className="btn btn--ghost" style={{ marginLeft: 'auto' }} onClick={() => setEditingSpecial(sp)}>编辑</button>
            </div>
            <p className="admin-item-text"><strong>{sp.name}</strong> — {sp.tagline}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Profile editor for standard personalities
function ProfileEditor({ personality, onSave, onCancel }: {
  personality: Personality;
  onSave: (p: Personality) => void;
  onCancel: () => void;
}) {
  const [code, setCode] = useState(personality.code);
  const [name, setName] = useState(personality.name);
  const [tagline, setTagline] = useState(personality.tagline);
  const [description, setDescription] = useState(personality.description);
  const [model, setModel] = useState(personality.model);
  const [homeDim, setHomeDim] = useState<DimensionId>(personality.dimension);
  const [profile, setProfile] = useState<Record<DimensionId, number>>({ ...personality.profile });

  const models = ['自我模型', '情感模型', '态度模型', '行动驱力模型', '社交模型'];

  const handleSave = () => {
    onSave({ code: code.trim(), name: name.trim(), tagline: tagline.trim(), description: description.trim(), model, dimension: homeDim, profile });
  };

  return (
    <div className="admin-section">
      <h3 style={{ marginBottom: 16 }}>编辑人格：{personality.code}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 600 }}>
        <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Code
          <input className="input" style={{ width: '100%', marginTop: 4 }} value={code} onChange={(e) => setCode(e.target.value)} />
        </label>
        <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          名称
          <input className="input" style={{ width: '100%', marginTop: 4 }} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Tagline
          <input className="input" style={{ width: '100%', marginTop: 4 }} value={tagline} onChange={(e) => setTagline(e.target.value)} />
        </label>
        <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          描述
          <textarea className="input" style={{ width: '100%', marginTop: 4, minHeight: 80, resize: 'vertical' }} value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          模型
          <select className="input" style={{ width: '100%', marginTop: 4 }} value={model} onChange={(e) => setModel(e.target.value)}>
            {models.map((m) => (<option key={m} value={m}>{m}</option>))}
          </select>
        </label>
        <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          主维度
          <select className="input" style={{ width: '100%', marginTop: 4 }} value={homeDim} onChange={(e) => setHomeDim(e.target.value as DimensionId)}>
            {ALL_DIMENSION_IDS.map((d) => (
              <option key={d} value={d}>{d} - {DIMENSIONS[d].name}</option>
            ))}
          </select>
        </label>
        <div>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>维度分值 (0-4)</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 6, marginTop: 8 }}>
            {ALL_DIMENSION_IDS.map((dim) => (
              <div key={dim} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', minWidth: 32 }}>{dim}</span>
                <input className="input" type="number" min={0} max={4} style={{ width: 48, textAlign: 'center', padding: '4px 8px' }} value={profile[dim]} onChange={(e) => setProfile({ ...profile, [dim]: Number(e.target.value) })} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn--primary" onClick={handleSave}>保存</button>
          <button className="btn btn--secondary" onClick={onCancel}>取消</button>
        </div>
      </div>
    </div>
  );
}

// Editor for special personalities
function SpecialEditor({ special, onSave, onCancel }: {
  special: SpecialPersonality;
  onSave: (s: SpecialPersonality) => void;
  onCancel: () => void;
}) {
  const [code, setCode] = useState(special.code);
  const [name, setName] = useState(special.name);
  const [tagline, setTagline] = useState(special.tagline);
  const [trigger, setTrigger] = useState(special.trigger);

  const handleSave = () => {
    onSave({ code: code.trim(), name: name.trim(), tagline: tagline.trim(), trigger: trigger.trim() });
  };

  return (
    <div className="admin-section">
      <h3 style={{ marginBottom: 16 }}>编辑特殊触发：{special.code}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 600 }}>
        <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Code
          <input className="input" style={{ width: '100%', marginTop: 4 }} value={code} onChange={(e) => setCode(e.target.value)} />
        </label>
        <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          名称
          <input className="input" style={{ width: '100%', marginTop: 4 }} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Tagline
          <input className="input" style={{ width: '100%', marginTop: 4 }} value={tagline} onChange={(e) => setTagline(e.target.value)} />
        </label>
        <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          触发条件
          <input className="input" style={{ width: '100%', marginTop: 4 }} value={trigger} onChange={(e) => setTrigger(e.target.value)} />
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn--primary" onClick={handleSave}>保存</button>
          <button className="btn btn--secondary" onClick={onCancel}>取消</button>
        </div>
      </div>
    </div>
  );
}
