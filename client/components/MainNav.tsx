import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavProduct {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

const navProducts: NavProduct[] = [
  { id: "xvigil", label: "Xvigil", icon: "🎯" },
  { id: "bevigil", label: "BeVigil", icon: "👁️", active: true },
  { id: "svigil", label: "SVigil", icon: "🛡️" },
  { id: "threat-intel", label: "Threat Intel", icon: "⚠️" },
  { id: "asset-inv", label: "Asset Inventory", icon: "📦" },
];

const navMenuItems: NavItem[] = [
  { id: "dashboards", label: "Dashboards", icon: "📊", path: "/" },
  { id: "events", label: "Events", icon: "📋", path: "/events", badge: 15 },
  { id: "incidents", label: "Incidents", icon: "🚨", path: "/incidents" },
  { id: "capabilities", label: "All Capabilities", icon: "⚡", path: "/capabilities" },
  { id: "favourites", label: "Favourites", icon: "⭐", path: "/favourites" },
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
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-blue-600">CloudSEK</span>
            <span className="text-gray-300 text-xl">×</span>
            <span className="text-xl font-bold text-purple-600">BeVigil</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 flex-1 ml-8">
          {navSections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleNavClick(section.path)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                location.pathname === section.path
                  ? "bg-blue-100 text-blue-900"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <span>{section.icon}</span>
              <span>{section.label}</span>
              {section.badge && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                  {section.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4 ml-auto">
          <button className="text-gray-600 hover:text-gray-900">🔍</button>
          <button className="text-gray-600 hover:text-gray-900">🔔</button>
          <button className="text-gray-600 hover:text-gray-900">👤</button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-2 space-y-1 max-h-96 overflow-y-auto">
            {navSections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleNavClick(section.path)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === section.path
                    ? "bg-blue-100 text-blue-900"
                    : "text-gray-700 hover:bg-gray-100",
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
  );
}
