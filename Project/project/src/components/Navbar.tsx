import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Home, Users, DollarSign } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="text-2xl font-bold text-gradient">
              SettleUp
            </Link>
            <div className="hidden md:flex gap-6">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-purple-600 transition flex items-center gap-2"
              >
                <Home size={18} />
                Dashboard
              </Link>
              <Link
                to="/groups"
                className="text-gray-700 hover:text-purple-600 transition flex items-center gap-2"
              >
                <Users size={18} />
                Groups
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-700 hidden sm:block">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
