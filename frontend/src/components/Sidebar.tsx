import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Megaphone, LogOut, Activity, Zap } from 'lucide-react';

const isDemo = () => localStorage.getItem('demo') === 'true';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <aside className="w-56 flex flex-col h-screen fixed left-0 top-0 border-r"
      style={{ background: '#0e0e14', borderColor: 'rgba(255,255,255,0.06)' }}>

      {/* Logo */}
      <div className="p-5 flex items-center gap-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="p-1.5 rounded-lg" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          <Activity className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-white tracking-tight">AdMitra</span>
        {isDemo() && (
          <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 uppercase tracking-wide">Demo</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        <p className="label px-3 mt-2 mb-1">Main</p>
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </NavLink>
        <NavLink to="/campaigns" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Megaphone className="w-4 h-4" />
          Campaigns
        </NavLink>
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t space-y-1" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        {isDemo() && (
          <div className="px-3 py-2 mb-2 rounded-xl text-xs text-indigo-300"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <div className="flex items-center gap-1.5 font-semibold mb-0.5">
              <Zap className="w-3 h-3" /> Demo Mode Active
            </div>
            <p className="text-[#6a6c80]">Viewing pre-loaded sample data</p>
          </div>
        )}
        <button onClick={handleLogout}
          className="nav-item w-full text-red-400/70 hover:text-red-400 hover:bg-red-500/5">
          <LogOut className="w-4 h-4" />
          {isDemo() ? 'Exit Demo' : 'Sign Out'}
        </button>
      </div>
    </aside>
  );
}
