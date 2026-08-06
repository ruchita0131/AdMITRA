
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import Sidebar from './components/Sidebar';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  const demo = localStorage.getItem('demo') === 'true';
  if (!token && !demo) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen" style={{ background: '#0c0c10' }}>
      <Sidebar />
      <main className="flex-1 ml-56 p-8 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/campaigns" element={<Campaigns />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
