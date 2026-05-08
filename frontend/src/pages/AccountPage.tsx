import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getIdentityId, getLinkCode, getDeviceId, clearIdentity,
  initIdentity, linkIdentity, fetchIdentityInfo, validatePassword,
  isLinked,
} from '../utils/identity';
import { getHistory } from '../utils/storage';

export default function AccountPage() {
  const navigate = useNavigate();
  const [linked, setLinked] = useState(isLinked());
  const [identityId, setIdentityId] = useState(getIdentityId());
  const [linkCode, setLinkCode] = useState(getLinkCode());
  const [identityInfo, setIdentityInfo] = useState<any>(null);

  // Create mode
  const [showCreate, setShowCreate] = useState(false);
  const [createPw, setCreatePw] = useState('');
  const [createPw2, setCreatePw2] = useState('');
  const [createError, setCreateError] = useState('');
  const [creating, setCreating] = useState(false);

  // Link mode
  const [showLink, setShowLink] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [linkPw, setLinkPw] = useState('');
  const [linkError, setLinkError] = useState('');
  const [linking, setLinking] = useState(false);

  const deviceId = getDeviceId();
  const localHistory = getHistory();

  useEffect(() => {
    if (linked && identityId) {
      fetchIdentityInfo(identityId)
        .then(setIdentityInfo)
        .catch(() => {});
    }
  }, [linked, identityId]);

  const handleCreate = async () => {
    setCreateError('');
    const err = validatePassword(createPw);
    if (err) { setCreateError(err); return; }
    if (createPw !== createPw2) { setCreateError('两次密码不一致'); return; }

    setCreating(true);
    try {
      const data = await initIdentity(createPw);
      setLinked(true);
      setIdentityId(data.identityId);
      setLinkCode(data.linkCode);
      setShowCreate(false);
    } catch (e: any) {
      setCreateError(e.message);
    }
    setCreating(false);
  };

  const handleLink = async () => {
    setLinkError('');
    if (!linkInput.trim() || !linkPw) { setLinkError('请填写完整'); return; }

    setLinking(true);
    try {
      const data = await linkIdentity(linkInput.trim(), linkPw);
      setLinked(true);
      setIdentityId(data.identityId);
      setLinkCode(data.linkCode);
      setShowLink(false);
    } catch (e: any) {
      setLinkError(e.message);
    }
    setLinking(false);
  };

  const handleUnlink = () => {
    clearIdentity();
    setLinked(false);
    setIdentityId(null);
    setLinkCode(null);
    setIdentityInfo(null);
  };

  if (!linked) {
    return (
      <div className="page" style={{ maxWidth: 480, margin: '0 auto' }}>
        <button className="btn btn--ghost" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
          ← 返回
        </button>
        <h1 className="page-title">我的账号</h1>
        <p className="page-sub">连接设备后可同步测试记录与社交数据</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="analysis-box">
            <h2>本机信息</h2>
            <p style={{ fontSize: 13, fontFamily: 'var(--font-mono)' }}>
              设备ID: {deviceId.slice(0, 8)}...{deviceId.slice(-8)}<br />
              本地记录: {localHistory.length} 条测试
            </p>
          </div>

          {showCreate ? (
            <div className="analysis-box">
              <h2>创建连接码</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input className="input" type="password" placeholder="设置密码（6位+，含字母和数字）" value={createPw} onChange={(e) => setCreatePw(e.target.value)} />
                <input className="input" type="password" placeholder="确认密码" value={createPw2} onChange={(e) => setCreatePw2(e.target.value)} />
                {createError && <p style={{ color: 'var(--accent)', fontSize: 13 }}>{createError}</p>}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn--primary" onClick={handleCreate} disabled={creating}>{creating ? '创建中...' : '创建'}</button>
                  <button className="btn btn--secondary" onClick={() => setShowCreate(false)}>取消</button>
                </div>
              </div>
            </div>
          ) : (
            <button className="btn btn--primary" onClick={() => setShowCreate(true)}>创建连接码</button>
          )}

          {showLink ? (
            <div className="analysis-box">
              <h2>连接已有设备</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input className="input" placeholder="输入连接码" value={linkInput} onChange={(e) => setLinkInput(e.target.value)} />
                <input className="input" type="password" placeholder="输入密码" value={linkPw} onChange={(e) => setLinkPw(e.target.value)} />
                {linkError && <p style={{ color: 'var(--accent)', fontSize: 13 }}>{linkError}</p>}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn--primary" onClick={handleLink} disabled={linking}>{linking ? '连接中...' : '连接'}</button>
                  <button className="btn btn--secondary" onClick={() => setShowLink(false)}>取消</button>
                </div>
              </div>
            </div>
          ) : (
            <button className="btn btn--secondary" onClick={() => setShowLink(true)}>连接已有设备</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: 560, margin: '0 auto' }}>
      <button className="btn btn--ghost" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        ← 返回
      </button>
      <h1 className="page-title">我的账号</h1>

      <div className="analysis-box">
        <h2>连接码</h2>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, letterSpacing: 3, color: 'var(--accent)', margin: '8px 0' }}>
          {linkCode}
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-weak)' }}>
          在其他设备上输入此码和密码即可连接
        </p>
      </div>

      <div className="analysis-box" style={{ marginTop: 12 }}>
        <h2>设备信息</h2>
        <p style={{ fontSize: 13, fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
          本机: {deviceId.slice(0, 8)}...{deviceId.slice(-8)}
        </p>
        {identityInfo && (
          <div className="admin-list">
            <div className="admin-item">
              <div className="admin-item-header">
                <span className="admin-item-dim">已连接设备</span>
                <span>{identityInfo.deviceCount} 台</span>
              </div>
            </div>
            <div className="admin-item">
              <div className="admin-item-header">
                <span className="admin-item-dim">关联测试记录</span>
                <span>{identityInfo.resultCount} 条</span>
              </div>
            </div>
            <div className="admin-item">
              <div className="admin-item-header">
                <span className="admin-item-dim">创建时间</span>
                <span>{identityInfo.createdAt ? new Date(identityInfo.createdAt).toLocaleString('zh-CN') : '-'}</span>
              </div>
            </div>
          </div>
        )}
        {identityInfo?.devices && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>设备列表</div>
            {identityInfo.devices.map((d: any, i: number) => (
              <div key={i} className="admin-item" style={{ marginBottom: 4 }}>
                <div className="admin-item-header">
                  <span className="admin-item-id" style={{ fontSize: 11 }}>{d.deviceId}</span>
                  <span className="admin-item-dim" style={{ fontSize: 11 }}>{d.ip}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-weak)' }}>
                  {new Date(d.lastActiveAt).toLocaleString('zh-CN')} · {d.userAgent}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <button className="btn btn--secondary" onClick={handleUnlink}>断开连接</button>
        <button className="btn btn--ghost" onClick={() => setShowLink(!showLink)} style={{ color: 'var(--text-muted)' }}>
          {showLink ? '取消' : '连接新设备'}
        </button>
      </div>

      {showLink && (
        <div className="analysis-box" style={{ marginTop: 12 }}>
          <h2>连接新设备</h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input className="input" placeholder="新设备的连接码" value={linkInput} onChange={(e) => setLinkInput(e.target.value)} />
            <input className="input" type="password" placeholder="密码" value={linkPw} onChange={(e) => setLinkPw(e.target.value)} style={{ width: 160 }} />
            <button className="btn btn--primary" onClick={handleLink} disabled={linking}>{linking ? '...' : '连接'}</button>
          </div>
          {linkError && <p style={{ color: 'var(--accent)', fontSize: 13, marginTop: 8 }}>{linkError}</p>}
          <p style={{ fontSize: 12, color: 'var(--text-weak)', marginTop: 8 }}>
            注：连接新设备后将合并记录，两台设备共享同一身份
          </p>
        </div>
      )}
    </div>
  );
}
