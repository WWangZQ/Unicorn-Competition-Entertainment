import { useState, useEffect } from 'react';
import { questions as defaultQuestions, hiddenQuestions as defaultHidden, type Question, type Option } from '../../data/questions';
import { DIMENSIONS, ALL_DIMENSION_IDS } from '../../data/dimensions';
import type { DimensionId } from '../../data/dimensions';

const STORAGE_KEY = 'kgti_admin_questions';

function loadQuestions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as { main: Question[]; hidden: Question[] };
  } catch {}
  return { main: defaultQuestions, hidden: defaultHidden };
}

function saveQuestions(main: Question[], hidden: Question[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ main, hidden }));
}

function emptyQuestion(): Question {
  return { id: '', text: '', dimension: 'S1', options: [{ text: '', score: 0 }, { text: '', score: 1 }, { text: '', score: 2 }] };
}

export default function QuestionManager() {
  const [mainQuestions, setMainQuestions] = useState<Question[]>([]);
  const [hiddenQs, setHiddenQs] = useState<Question[]>([]);
  const [tab, setTab] = useState<'main' | 'hidden'>('main');
  const [editing, setEditing] = useState<Question | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const data = loadQuestions();
    setMainQuestions(data.main);
    setHiddenQs(data.hidden);
  }, []);

  const questions = tab === 'main' ? mainQuestions : hiddenQs;

  const persist = (m: Question[], h: Question[]) => {
    saveQuestions(m, h);
    setMainQuestions(m);
    setHiddenQs(h);
  };

  const handleSave = (q: Question) => {
    if (isNew) {
      const updated = [...questions, q];
      persist(tab === 'main' ? updated : mainQuestions, tab === 'hidden' ? updated : hiddenQs);
    } else {
      const updated = questions.map((x) => (x.id === q.id ? q : x));
      persist(tab === 'main' ? updated : mainQuestions, tab === 'hidden' ? updated : hiddenQs);
    }
    setEditing(null);
    setIsNew(false);
  };

  const handleDelete = (id: string) => {
    const filtered = questions.filter((q) => q.id !== id);
    const m = tab === 'main' ? filtered : mainQuestions;
    const h = tab === 'hidden' ? filtered : hiddenQs;
    persist(m, h);
  };

  const startNew = () => {
    setEditing(emptyQuestion());
    setIsNew(true);
  };

  if (editing) {
    return <QuestionForm question={editing} isNew={isNew} onSave={handleSave} onCancel={() => { setEditing(null); setIsNew(false); }} />;
  }

  return (
    <div className="admin-section">
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <div className="admin-tabs" style={{ marginBottom: 0, flex: 1 }}>
          <button className={`admin-tab ${tab === 'main' ? 'admin-tab--active' : ''}`} onClick={() => setTab('main')}>
            主线题 ({mainQuestions.length})
          </button>
          <button className={`admin-tab ${tab === 'hidden' ? 'admin-tab--active' : ''}`} onClick={() => setTab('hidden')}>
            隐藏触发题 ({hiddenQs.length})
          </button>
        </div>
        <button className="btn btn--primary" onClick={startNew}>+ 添加题目</button>
      </div>

      <div className="admin-list">
        {questions.map((q) => (
          <div key={q.id} className="admin-item">
            <div className="admin-item-header">
              <span className="admin-item-id">{q.id}</span>
              <span className="admin-item-dim">{DIMENSIONS[q.dimension]?.name ?? q.dimension}</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                <button className="btn btn--ghost" onClick={() => setEditing(q)}>编辑</button>
                <button className="btn btn--ghost" onClick={() => handleDelete(q.id)} style={{ color: 'var(--accent)' }}>删除</button>
              </div>
            </div>
            <p className="admin-item-text">{q.text}</p>
            <div className="admin-item-options">
              {q.options.map((opt, j) => (
                <span key={j} className="admin-opt">
                  {String.fromCharCode(65 + j)}. {opt.text} <em>({opt.score}分)</em>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Inline question editor
function QuestionForm({ question, isNew, onSave, onCancel }: {
  question: Question;
  isNew: boolean;
  onSave: (q: Question) => void;
  onCancel: () => void;
}) {
  const [id, setId] = useState(question.id);
  const [text, setText] = useState(question.text);
  const [dimension, setDimension] = useState<DimensionId>(question.dimension);
  const [options, setOptions] = useState<Option[]>(question.options.map((o) => ({ ...o })));

  const handleSubmit = () => {
    if (!id.trim() || !text.trim()) return;
    onSave({ id: id.trim(), text: text.trim(), dimension, options });
  };

  return (
    <div className="admin-section">
      <h3 style={{ marginBottom: 16 }}>{isNew ? '添加题目' : '编辑题目'}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 600 }}>
        <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          ID
          <input className="input" style={{ width: '100%', marginTop: 4 }} value={id} onChange={(e) => setId(e.target.value)} placeholder="q1" />
        </label>
        <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          题目文本
          <textarea className="input" style={{ width: '100%', marginTop: 4, minHeight: 60, resize: 'vertical' }} value={text} onChange={(e) => setText(e.target.value)} placeholder="题目内容" />
        </label>
        <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          维度
          <select className="input" style={{ width: '100%', marginTop: 4 }} value={dimension} onChange={(e) => setDimension(e.target.value as DimensionId)}>
            {ALL_DIMENSION_IDS.map((d) => (
              <option key={d} value={d}>{d} - {DIMENSIONS[d].name}</option>
            ))}
          </select>
        </label>
        {options.map((opt, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, minWidth: 20 }}>{String.fromCharCode(65 + i)}.</span>
            <input className="input" style={{ flex: 1 }} value={opt.text} onChange={(e) => {
              const next = [...options];
              next[i] = { ...next[i], text: e.target.value };
              setOptions(next);
            }} placeholder={`选项 ${String.fromCharCode(65 + i)}`} />
            <input className="input" type="number" style={{ width: 60, textAlign: 'center' }} value={opt.score} min={0} max={2} onChange={(e) => {
              const next = [...options];
              next[i] = { ...next[i], score: Number(e.target.value) };
              setOptions(next);
            }} />
            <span style={{ fontSize: 12, color: 'var(--text-weak)' }}>分</span>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn--primary" onClick={handleSubmit}>保存</button>
          <button className="btn btn--secondary" onClick={onCancel}>取消</button>
        </div>
      </div>
    </div>
  );
}
