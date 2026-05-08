import { useState, useEffect } from 'react';
import { questions as defaultQuestions, hiddenQuestions as defaultHidden } from '../../data/questions';
import { DIMENSIONS } from '../../data/dimensions';

export default function QuestionManager() {
  const [mainQuestions, setMainQuestions] = useState(defaultQuestions);
  const [hiddenQs, setHiddenQs] = useState(defaultHidden);
  const [tab, setTab] = useState<'main' | 'hidden'>('main');

  useEffect(() => {
    const stored = localStorage.getItem('kgti_admin_questions');
    if (stored) {
      const data = JSON.parse(stored);
      setMainQuestions(data.main ?? defaultQuestions);
      setHiddenQs(data.hidden ?? defaultHidden);
    }
  }, []);

  const questions = tab === 'main' ? mainQuestions : hiddenQs;

  return (
    <div className="admin-section">
      <div className="admin-tabs">
        <button
          className={`admin-tab ${tab === 'main' ? 'admin-tab--active' : ''}`}
          onClick={() => setTab('main')}
        >
          主线题 ({mainQuestions.length})
        </button>
        <button
          className={`admin-tab ${tab === 'hidden' ? 'admin-tab--active' : ''}`}
          onClick={() => setTab('hidden')}
        >
          隐藏触发题 ({hiddenQs.length})
        </button>
      </div>

      <div className="admin-list">
        {questions.map((q) => (
          <div key={q.id} className="admin-item">
            <div className="admin-item-header">
              <span className="admin-item-id">{q.id}</span>
              <span className="admin-item-dim">{DIMENSIONS[q.dimension]?.name ?? q.dimension}</span>
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
