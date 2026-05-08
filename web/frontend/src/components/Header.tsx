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
            <>
              <Link to="/admin/questions" className="nav-link">题目</Link>
              <Link to="/admin/personalities" className="nav-link">人格</Link>
              <Link to="/admin/stats" className="nav-link">统计</Link>
              <Link to="/" className="nav-link nav-link--exit">← 返回</Link>
            </>
          ) : (
            <>
              <Link to="/gallery" className="nav-link">图鉴</Link>
              <Link to="/admin" className="nav-link nav-link--subtle">管理</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
