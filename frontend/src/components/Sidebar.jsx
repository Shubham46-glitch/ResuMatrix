import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, BarChart2, Settings, Upload, HelpCircle, LogOut, FileText, Mic } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: History, label: 'Analysis History', path: '/history' },
    { icon: Mic, label: 'Mock Interviews', path: '/interview/history' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 bg-matrix-bg border-r border-matrix-border h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-matrix-accent p-2 rounded-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">ResuMatrix</h1>
            <p className="text-[10px] text-matrix-text-muted tracking-widest uppercase mt-0.5">Premium AI Analysis</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-matrix-accent text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                : 'text-matrix-text-muted hover:text-white hover:bg-matrix-panel'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        ))}

        <div className="pt-8">
          <Link
            to="/upload"
            className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium transition-colors ${
              isActive('/upload')
                ? 'bg-matrix-accent text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                : 'bg-matrix-panel text-matrix-text hover:bg-matrix-accent hover:text-white border border-matrix-border hover:border-transparent'
            }`}
          >
            <Upload className="h-4 w-4" />
            Upload New Resume
          </Link>
        </div>
      </nav>

      {/* Footer Nav */}
      <div className="p-4 space-y-2 mb-4 border-t border-matrix-border mt-auto">
        <Link to="/help" className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-matrix-text-muted hover:text-white hover:bg-matrix-panel transition-colors text-sm font-medium">
          <HelpCircle className="h-5 w-5" />
          Help Center
        </Link>
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-matrix-text-muted hover:text-matrix-warning hover:bg-matrix-panel transition-colors text-sm font-medium"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
