import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="page admin-page">
      <h1 className="page-title">管理后台</h1>
      <Outlet />
    </div>
  );
}
