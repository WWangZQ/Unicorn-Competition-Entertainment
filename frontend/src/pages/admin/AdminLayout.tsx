import { Outlet, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('kgti_admin_auth');
    navigate('/');
  };

  return (
    <div className="page admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>管理后台</h1>
        <button className="btn btn--ghost" onClick={handleLogout}>退出</button>
      </div>
      <Outlet />
    </div>
  );
}
