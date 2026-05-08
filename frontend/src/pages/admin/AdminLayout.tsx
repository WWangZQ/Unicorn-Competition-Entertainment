import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.removeItem('kgti_admin_auth');
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/admin/questions' && (location.pathname === '/admin' || location.pathname.startsWith('/admin/questions'))) return true;
    return location.pathname.startsWith(path);
  };

  const tabs = [
    { path: '/admin/questions', label: '题目管理' },
    { path: '/admin/personalities', label: '人格管理' },
    { path: '/admin/stats', label: '数据统计' },
  ];

  return (
    <div className="page admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>管理后台</h1>
        <button className="btn btn--ghost" onClick={handleLogout}>退出登录</button>
      </div>

      <div className="admin-tabs">
        {tabs.map((t) => (
          <button
            key={t.path}
            className={`admin-tab ${isActive(t.path) ? 'admin-tab--active' : ''}`}
            onClick={() => navigate(t.path)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Outlet />
    </div>
  );
}
