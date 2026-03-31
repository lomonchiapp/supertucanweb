import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/admin/hooks/useAuth';
import AdminLogin from '@/admin/AdminLogin';
import AdminLayout from '@/admin/AdminLayout';
import ModelList from '@/admin/components/ModelList';
import ModelEditor from '@/admin/components/ModelEditor';
import CategoryManager from '@/admin/components/CategoryManager';

export default function AdminRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="font-[system-ui] min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Cargando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="models" replace />} />
        <Route path="models" element={<ModelList />} />
        <Route path="models/:id" element={<ModelEditor />} />
        <Route path="categories" element={<CategoryManager />} />
      </Route>
    </Routes>
  );
}
