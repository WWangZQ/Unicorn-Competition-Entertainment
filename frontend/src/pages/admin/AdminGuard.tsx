import { useState } from 'react';

const SESSION_KEY = 'kgti_admin_auth';

function isAuthed(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

interface Props {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: Props) {
  const [authed, setAuthed] = useState(isAuthed);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (input === 'kgti2026') {
      sessionStorage.setItem(SESSION_KEY, '1');
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!authed) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: 64 }}>
        <h2 style={{ marginBottom: 16 }}>管理端登录</h2>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <input
            className="input"
            type="password"
            placeholder="输入管理密码"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            autoFocus
          />
          <button className="btn btn--primary" onClick={handleLogin}>
            进入
          </button>
        </div>
        {error && <p style={{ color: 'var(--accent)', marginTop: 12, fontSize: 14 }}>密码错误</p>}
      </div>
    );
  }

  return <>{children}</>;
}
