import { useState, useEffect, useMemo } from 'react';
import { getStats, type StatsData, type PersonalityStat } from '../../utils/api';
import { getHistory } from '../../utils/storage';
import { personalities, specialPersonalities } from '../../data/personalities';

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const localHistory = getHistory();

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  // Merge backend stats with local history for fallback
  const distribution = useMemo(() => {
    if (stats?.personalityDistribution?.length) return stats.personalityDistribution;

    // Fallback: aggregate from local history
    const map = new Map<string, { code: string; name: string; count: number }>();
    localHistory.forEach((entry) => {
      const code = entry.personality?.code ?? entry.specialCode ?? '????';
      const name = entry.personality?.name ?? entry.specialName ?? '未知';
      const existing = map.get(code);
      if (existing) {
        existing.count++;
      } else {
        map.set(code, { code, name, count: 1 });
      }
    });
    // Fill in missing personalities with 0
    [...personalities, ...specialPersonalities].forEach((p) => {
      if (!map.has(p.code)) {
        map.set(p.code, { code: p.code, name: p.name, count: 0 });
      }
    });
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [stats, localHistory]);

  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <div className="admin-section">
      <h2 className="section-title">数据统计</h2>

      {loading ? (
        <p className="text-muted">加载中...</p>
      ) : null}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats?.totalParticipants ?? localHistory.length}</div>
          <div className="stat-label">总参与人数</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{distribution.filter((d) => d.count > 0).length}</div>
          <div className="stat-label">已触发人格种类</div>
        </div>
      </div>

      <h3 className="section-title" style={{ marginTop: 24 }}>人格热度分布</h3>
      {!stats && <p className="text-muted" style={{ marginBottom: 16 }}>后端未连接，使用本地数据</p>}

      <div className="chart-list">
        {distribution.map((item: PersonalityStat, i: number) => {
          const barWidth = (item.count / maxCount) * 100;
          const isHot = i < 5 && item.count > 0;
          return (
            <div key={item.code} className="chart-row">
              <div className="chart-rank">{i + 1}</div>
              <div className="chart-label">
                <span className="chart-code">{item.code}</span>
                <span className="chart-name">{item.name}</span>
              </div>
              <div className="chart-bar-wrap">
                <div
                  className={`chart-bar ${isHot ? 'chart-bar--hot' : ''}`}
                  style={{ width: `${Math.max(barWidth, item.count > 0 ? 2 : 0)}%` }}
                />
              </div>
              <div className="chart-count">{item.count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
