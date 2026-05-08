import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory } from '../utils/storage';
import { getIdentityId, getDeviceId, fetchIdentityResults } from '../utils/identity';
import { specialPersonalities } from '../data/personalities';
import type { HistoryEntry } from '../utils/storage';

function formatDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const [allEntries, setAllEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const local = getHistory();

    const identityId = getIdentityId();
    if (!identityId) {
      setAllEntries(local);
      setLoading(false);
      return;
    }

    // Fetch cross-device results from backend
    fetchIdentityResults(identityId)
      .then((remote) => {
        // Convert remote results to HistoryEntry format
        const remoteEntries: (HistoryEntry & { _deviceId: string })[] = remote.map((r) => {
          let dimensionScores: Record<string, number> = {};
          try { dimensionScores = JSON.parse(r.dimension_scores); } catch {}
          const isSpecial = specialPersonalities.some((s) => s.code === r.personality_code);
          return {
            nickname: r.nickname,
            personality: isSpecial ? null : {
              code: r.personality_code,
              name: r.personality_name,
              tagline: '',
              description: '',
              dimension: 'S1' as any,
              model: '',
              profile: dimensionScores,
            },
            similarity: r.similarity ?? 0,
            dimensionScores,
            specialCode: isSpecial ? r.personality_code : null,
            specialName: isSpecial ? r.personality_name : null,
            specialTagline: null,
            timestamp: new Date(r.created_at).getTime(),
            _deviceId: r.device_id,
          };
        });

        // Merge: local + remote (exclude current device from remote, it's already in localStorage)
        const myDeviceId = getDeviceId();
        const merged = [...local];
        remoteEntries.forEach((re) => {
          if ((re as any)._deviceId !== myDeviceId) {
            merged.push(re);
          }
        });

        merged.sort((a, b) => b.timestamp - a.timestamp);
        setAllEntries(merged);
      })
      .catch(() => setAllEntries(local))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <button className="btn btn--ghost" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        ← 返回
      </button>

      <h1 className="page-title">我的测试记录</h1>
      <p className="page-sub">
        共 {allEntries.length} 条记录{getIdentityId() ? '（含关联设备）' : ''}
      </p>

      {loading ? (
        <p className="text-muted" style={{ textAlign: 'center', padding: 48 }}>加载中...</p>
      ) : allEntries.length === 0 ? (
        <div className="text-muted" style={{ textAlign: 'center', padding: 48 }}>
          还没有测试记录，<button className="btn btn--primary" onClick={() => navigate('/quiz')}>开始测试</button>
        </div>
      ) : (
        <div className="history-list">
          {allEntries.map((entry: HistoryEntry, i: number) => {
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
                  {entry.similarity != null && entry.similarity > 0 && (
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
