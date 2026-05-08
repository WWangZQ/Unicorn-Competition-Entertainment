import { useState, useEffect } from 'react';
import { getStats, type StatsData } from '../../utils/api';
import { getHistory } from '../../utils/storage';

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

  return (
    <div className="admin-section">
      <h2 className="section-title">统计数据</h2>

      {loading ? (
        <p className="text-muted">加载中...</p>
      ) : stats ? (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalParticipants}</div>
            <div className="stat-label">总参与人数</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.personalityDistribution?.length ?? 0}</div>
            <div className="stat-label">已触发人格种类</div>
          </div>
        </div>
      ) : (
        <p className="text-muted">后端未连接，使用本地数据</p>
      )}

      {stats?.personalityDistribution && stats.personalityDistribution.length > 0 && (
        <div className="admin-list" style={{ marginTop: 16 }}>
          <h3 className="section-title">人格分布</h3>
          {stats.personalityDistribution
            .sort((a, b) => b.count - a.count)
            .map((p) => (
              <div key={p.code} className="admin-item">
                <div className="admin-item-header">
                  <span className="admin-item-id">{p.code}</span>
                  <span className="admin-item-dim">{p.name}</span>
                  <span className="stat-count">{p.count} 人</span>
                </div>
              </div>
            ))}
        </div>
      )}

      <h3 className="section-title" style={{ marginTop: 24 }}>本地测试记录</h3>
      {localHistory.length === 0 ? (
        <p className="text-muted">暂无本地记录</p>
      ) : (
        <div className="admin-list">
          {localHistory.slice(0, 10).map((entry, i) => (
            <div key={i} className="admin-item">
              <div className="admin-item-header">
                <span className="admin-item-id">
                  {entry.personality?.code ?? entry.specialCode}
                </span>
                <span className="admin-item-dim">
                  {entry.personality?.name ?? entry.specialName}
                </span>
                <span className="stat-count">
                  {new Date(entry.timestamp).toLocaleString('zh-CN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
