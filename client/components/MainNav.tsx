import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavProduct {
  id: string;
  label: string;
  icon: string;
}

interface NavItem {
  id: string;
  label: string;
  path: string;
  badge?: number;
  hasDropdown?: boolean;
}

const navProducts: NavProduct[] = [
  { id: "xvigil", label: "Xvigil", icon: "🎯" },
  { id: "bevigil", label: "BeVigil", icon: "👁️" },
  { id: "svigil", label: "SVigil", icon: "🛡️" },
  { id: "asset-inv", label: "Asset Inventory", icon: "📦" },
  { id: "threat-intel", label: "Threat Intel", icon: "⚠️" },
];

const navMenuItems: NavItem[] = [
  { id: "menu", label: "Menu", path: "/", hasDropdown: true },
  { id: "dashboards", label: "Dashboards", path: "/", hasDropdown: true },
  { id: "events", label: "Events", path: "/events", badge: 15 },
  { id: "incidents", label: "Incidents", path: "/incidents" },
  { id: "capabilities", label: "All Capabilities", path: "/", hasDropdown: true },
  { id: "favourites", label: "Favourites", path: "/", hasDropdown: true },
];

export function MainNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine which product is active based on current path
  const isAssetInventoryActive = location.pathname === "/";
  const activeProduct = isAssetInventoryActive ? "asset-inv" : "bevigil";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center h-16 px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-gray-600 hover:text-gray-900 mr-4"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Left Section: Logo and Products */}
        <div className="flex items-center gap-8 flex-1">
          {/* CloudSEK Logo Box */}
          <div className="flex-shrink-0">
            <span className="text-white bg-blue-600 px-3 py-1.5 rounded font-bold text-sm">
              CloudSEK
            </span>
          </div>

          {/* Product Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-2">
            {navProducts.map((product) => (
              <button
                key={product.id}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                  product.id === activeProduct
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-100"
                )}
                title={product.label}
              >
                {product.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Center: Menu Items with Tilted Design - Hidden on mobile */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center ml-8">
          {navMenuItems.map((item) => (
            <div
              key={item.id}
              className="relative group"
            >
              <button
                onClick={() => navigate(item.path)}
                className={cn(
                  "relative overflow-hidden transition-all duration-200",
                  "flex items-center gap-2 px-4 py-2 rounded-lg",
                  "text-sm font-medium whitespace-nowrap",
                  location.pathname === item.path
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <span>{item.label}</span>
                {item.hasDropdown && (
                  <ChevronDown
                    size={16}
                    className="transition-transform group-hover:rotate-180"
                  />
                )}
                {item.badge && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            </div>
          ))}
        </nav>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-4 ml-auto flex-shrink-0">
          {/* Search */}
          <button className="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Support */}
          <button className="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          {/* Notifications */}
          <button className="relative text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              15
            </span>
          </button>

          {/* Profile */}
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
              AR
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-gray-900">Abhinav</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-3 space-y-1 max-h-96 overflow-y-auto">
            {/* Products */}
            <div className="py-2 border-b border-gray-200">
              <p className="text-xs font-semibold text-gray-500 px-3 py-1 uppercase tracking-wide">
                Products
              </p>
              <div className="grid grid-cols-2 gap-2">
                {navProducts.map((product) => (
                  <button
                    key={product.id}
                    className={cn(
                      "px-3 py-2 rounded text-sm font-medium transition-colors text-center",
                      product.id === activeProduct
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {product.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <p className="text-xs font-semibold text-gray-500 px-3 py-1 uppercase tracking-wide">
                Menu
              </p>
              {navMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                  className={cn(
                    "w-full text-left flex items-center justify-between px-3 py-2 rounded text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "bg-blue-100 text-blue-900"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <span>{item.label}</span>
                  <div className="flex items-center gap-2">
                    {item.hasDropdown && <ChevronDown size={14} />}
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
