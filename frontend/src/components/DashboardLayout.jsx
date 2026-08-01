import { Outlet, Link, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Settings, User } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);

  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-matrix-bg text-matrix-text font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col">
        {/* Top Navbar */}
        <header className="h-20 border-b border-matrix-border flex items-center justify-between px-8 bg-matrix-bg/95 backdrop-blur z-10 sticky top-0">
          <div className="flex items-center gap-6 text-sm font-medium">
             <Link to="/dashboard" className={`${location.pathname === '/dashboard' ? 'text-white border-b-2 border-matrix-accent pb-1' : 'text-matrix-text-muted hover:text-white transition-colors'}`}>Dashboard</Link>
             <Link to="/history" className={`${location.pathname === '/history' ? 'text-white border-b-2 border-matrix-accent pb-1' : 'text-matrix-text-muted hover:text-white transition-colors'}`}>History</Link>
             <Link to="/analytics" className={`${location.pathname === '/analytics' ? 'text-white border-b-2 border-matrix-accent pb-1' : 'text-matrix-text-muted hover:text-white transition-colors'}`}>Analytics</Link>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => alert("No new notifications")}
              className="text-matrix-text-muted hover:text-white transition-colors"
            >
              <Bell className="h-5 w-5" />
            </button>
            <Link to="/settings" className="text-matrix-text-muted hover:text-white transition-colors">
              <Settings className="h-5 w-5" />
            </Link>
            <Link to="/settings" className="h-8 w-8 rounded-full bg-matrix-accent flex items-center justify-center text-sm font-bold text-white shadow-lg overflow-hidden border border-matrix-border hover:ring-2 hover:ring-matrix-accent transition-all cursor-pointer">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
              ) : user?.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <User className="h-4 w-4" />
              )}
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
