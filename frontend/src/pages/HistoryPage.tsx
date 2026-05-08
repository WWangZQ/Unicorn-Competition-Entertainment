import { useNavigate } from 'react-router-dom';
import { getHistory } from '../utils/storage';
import type { HistoryEntry } from '../utils/storage';

function formatDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const history = getHistory();

  return (
    <div className="page">
      <button className="btn btn--ghost" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        ← 返回
      </button>

      <h1 className="page-title">我的测试记录</h1>
      <p className="page-sub">
        共 {history.length} 条记录
      </p>

      {history.length === 0 ? (
        <div className="text-muted" style={{ textAlign: 'center', padding: 48 }}>
          还没有测试记录，<button className="btn btn--primary" onClick={() => navigate('/quiz')}>开始测试</button>
        </div>
      ) : (
        <div className="history-list">
          {history.map((entry: HistoryEntry, i: number) => {
            const code = entry.personality?.code ?? entry.specialCode ?? '????';
            const name = entry.personality?.name ?? entry.specialName ?? '未知';
            const isSpecial = entry.specialCode !== null;

            return (
              <div key={i} className="history-item" onClick={() => navigate('/types/' + code)}>
                <div className="history-item-left">
                  <span className={`history-code ${isSpecial ? 'history-code--special' : ''}`}>{code}</span>
                  <div>
                    <span className="history-name">{entry.nickname} · {name}</span>
                    <span className="history-date">{formatDate(entry.timestamp)}</span>
                  </div>
                </div>
                <div className="history-item-right">
                  {entry.similarity != null && (
                    <span className="history-sim">匹配 {entry.similarity}%</span>
                  )}
                  <span className="history-arrow">→</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
