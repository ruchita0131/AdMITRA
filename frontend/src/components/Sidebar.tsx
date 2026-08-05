import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Megaphone, Settings, LogOut, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <aside className="w-64 border-r border-border bg-surface/50 backdrop-blur-xl hidden md:flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3 border-b border-border">
        <div className="bg-primary p-1.5 rounded-lg">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">AdMitra</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <NavLink to="/dashboard" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-textMuted hover:bg-surface hover:text-textMain'}`}>
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>
        <NavLink to="/campaigns" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-textMuted hover:bg-surface hover:text-textMain'}`}>
          <Megaphone className="w-5 h-5" />
          Campaigns
        </NavLink>
      </nav>

      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-textMuted hover:bg-surface hover:text-textMain transition-all">
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-danger hover:bg-danger/10 transition-all mt-2">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
