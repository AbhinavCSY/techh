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
      <div className="flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8">
        {/* Left Section: Logo and Products */}
        <div className="flex items-center gap-6 flex-1">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* CloudSEK Logo */}
          <div className="flex items-center gap-1">
            <span className="text-white bg-blue-600 px-2 py-1 rounded text-xs font-bold">CloudSEK</span>
          </div>

          {/* Products - Desktop Only */}
          <nav className="hidden lg:flex items-center gap-6">
            {navProducts.map((product) => (
              <button
                key={product.id}
                className={cn(
                  "text-xs font-medium transition-colors whitespace-nowrap",
                  product.active
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                <span>{product.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Center: Menu Items - Desktop Only */}
        <nav className="hidden lg:flex items-center gap-8 text-sm">
          {navMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={cn(
                "font-medium transition-colors whitespace-nowrap relative",
                location.pathname === item.path
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900",
              )}
            >
              {item.label}
              {item.badge && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-4 ml-auto">
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="relative text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold text-xs">15</span>
          </button>
          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-3 space-y-1 max-h-96 overflow-y-auto">
            {/* Products */}
            <div className="py-2 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-500 px-3 py-1 uppercase tracking-wide">Products</p>
              {navProducts.map((product) => (
                <button
                  key={product.id}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors",
                    product.active
                      ? "bg-blue-100 text-blue-900"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  {product.label}
                </button>
              ))}
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <p className="text-xs font-semibold text-gray-500 px-3 py-1 uppercase tracking-wide">Menu</p>
              {navMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className={cn(
                    "w-full text-left flex items-center justify-between px-3 py-2 rounded text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "bg-blue-100 text-blue-900"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  {item.label}
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
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
