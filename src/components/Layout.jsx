import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, FileText, Briefcase, Bell, History, Settings, 
  LogOut, Menu, X, ChevronDown, Sparkles, Plus, ClipboardList, FileCheck
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'My Resumes', href: '/resumes', icon: FileText },
  { name: 'Job Discovery', href: '/jobs', icon: Briefcase },
  { name: 'Job Alerts', href: '/job-alerts', icon: Bell },
  { name: 'Analysis History', href: '/history', icon: History },
  { name: 'Application Queue', href: '/queue', icon: ClipboardList },
  { name: 'My Applications', href: '/applications', icon: FileCheck },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isPro = user?.subscription_status === 'pro' || user?.subscription_status === 'lifetime';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
        transform transition-transform duration-200 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">JobMatch AI</span>
            <button 
              className="ml-auto lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Build Resume CTA */}
          <div className="px-4 py-4">
            <NavLink
              to="/resume-builder"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              Build Resume
            </NavLink>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-2 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1
                  transition-colors duration-150
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Subscription banner */}
          {!isPro && (
            <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white">
              <p className="font-semibold mb-1">Upgrade to Pro</p>
              <p className="text-sm text-indigo-100 mb-3">Unlimited analyses, job alerts, and more!</p>
              <NavLink 
                to="/pricing"
                className="block w-full py-2 bg-white text-indigo-600 rounded-lg text-center font-medium hover:bg-indigo-50 transition-colors"
              >
                View Plans
              </NavLink>
            </div>
          )}

          {/* User menu */}
          <div className="border-t border-gray-200 p-4">
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-700 font-semibold">
                    {user?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 py-2 bg-white rounded-lg shadow-lg border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Plan</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {user?.subscription_status || 'Free'}
                      {isPro && ' ✨'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar (mobile) */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center gap-4 px-4 py-3">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">JobMatch AI</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
