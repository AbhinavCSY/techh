import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavSection {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

const navSections: NavSection[] = [
  { id: 'home', label: 'Dashboard', icon: '📊', path: '/' },
  { id: 'events', label: 'Events', icon: '📋', path: '/events', badge: 15 },
  { id: 'webapps', label: 'Web Applications', icon: '🌐', path: '/web-apps' },
  { id: 'watchwords', label: 'Watchwords', icon: '👁️', path: '/watchwords' },
  { id: 'exposure', label: 'Exposure', icon: '⚠️', path: '/exposure' },
  { id: 'assets', label: 'Asset Configuration', icon: '⚙️', path: '/assets' },
];

export function MainNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-blue-600">CloudSEK</span>
              <span className="text-gray-300 text-xl">×</span>
              <span className="text-xl font-bold text-purple-600">BeVigil</span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900">🔍</button>
            <button className="text-gray-600 hover:text-gray-900">🔔</button>
            <button className="text-gray-600 hover:text-gray-900">👤</button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <nav className="px-4 py-2 space-y-1">
              {navSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleNavClick(section.path)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    location.pathname === section.path
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span>{section.icon}</span>
                    {section.label}
                  </div>
                  {section.badge && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2">
                      {section.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-16 w-60 h-[calc(100vh-4rem)] border-r border-gray-200 bg-white overflow-y-auto">
        <nav className="p-4 space-y-2">
          {navSections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleNavClick(section.path)}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                location.pathname === section.path
                  ? 'bg-blue-100 text-blue-900'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{section.icon}</span>
                <span>{section.label}</span>
              </div>
              {section.badge && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {section.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Wrapper - adds margin for sidebar */}
      <div className="lg:ml-60" />
    </>
  );
}
