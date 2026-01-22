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
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileOpen(false);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo and Product Navigation */}
        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900 mr-2"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* CloudSEK Logo */}
          <div className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
            <span className="text-white font-bold text-sm">CloudSEK</span>
          </div>

          {/* Product Divider */}
          <span className="text-gray-300 text-lg mx-1">×</span>

          {/* Products */}
          <nav className="hidden md:flex items-center gap-0">
            {navProducts.map((product, idx) => (
              <div key={product.id} className="flex items-center">
                <button
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                    product.active
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900",
                  )}
                >
                  <span>{product.icon}</span>
                  <span>{product.label}</span>
                </button>
                {idx < navProducts.length - 1 && (
                  <span className="text-gray-300">|</span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Menu and Right Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              <span>☰ Menu</span>
              <ChevronDown
                size={16}
                className={cn(
                  "transition-transform",
                  menuOpen && "rotate-180"
                )}
              />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {navMenuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.path)}
                    className={cn(
                      "w-full flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b border-gray-100 last:border-0",
                      location.pathname === item.path
                        ? "bg-blue-50 text-blue-900"
                        : "text-gray-700 hover:bg-gray-50",
                    )}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Actions */}
          <button className="text-gray-600 hover:text-gray-900 transition-colors">🔍</button>
          <button className="relative text-gray-600 hover:text-gray-900 transition-colors">
            🔔
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">15</span>
          </button>
          <button className="text-gray-600 hover:text-gray-900 transition-colors">👤</button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-2 space-y-1 max-h-96 overflow-y-auto">
            {/* Products */}
            <div className="py-2 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-600 px-3 py-1 uppercase tracking-wide">Products</p>
              {navProducts.map((product) => (
                <button
                  key={product.id}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    product.active
                      ? "bg-blue-100 text-blue-900"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <span>{product.icon}</span>
                  <span>{product.label}</span>
                </button>
              ))}
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <p className="text-xs font-semibold text-gray-600 px-3 py-1 uppercase tracking-wide">Menu</p>
              {navMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "bg-blue-100 text-blue-900"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    {item.label}
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
