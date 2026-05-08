import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          KGTI
        </Link>
        <nav className="nav">
          {isAdmin ? (
            <Link to="/" className="nav-link nav-link--exit">← 返回首页</Link>
          ) : (
            <>
              <Link to="/history" className="nav-link">记录</Link>
              <Link to="/account" className="nav-link">账号</Link>
              <Link to="/admin" className="nav-link nav-link--subtle">管理</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
