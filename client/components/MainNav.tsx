import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavProduct {
  id: string;
  label: string;
}

interface NavItem {
  id: string;
  label: string;
  path: string;
  badge?: number;
}

const navProducts: NavProduct[] = [
  { id: "xvigil", label: "Xvigil" },
  { id: "bevigil", label: "BeVigil" },
  { id: "svigil", label: "SVigil" },
  { id: "asset-inv", label: "Asset Inventory" },
  { id: "threat-intel", label: "Threat Intel" },
];

const navMenuItems: NavItem[] = [
  { id: "dashboards", label: "Dashboards", path: "/" },
  { id: "events", label: "Events", path: "/events", badge: 15 },
  { id: "incidents", label: "Incidents", path: "/incidents" },
  { id: "capabilities", label: "All Capabilities", path: "/" },
];

export function MainNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isAssetInventoryActive = location.pathname === "/";
  const activeProduct = isAssetInventoryActive ? "asset-inv" : "bevigil";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 py-1">
      <div className="flex items-center h-12 px-3 gap-1">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-gray-600 hover:text-gray-900 p-1"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* CloudSEK Logo - Very Compact */}
        <div className="flex-shrink-0">
          <span className="text-white bg-blue-600 px-2 py-0.5 rounded text-xs font-bold">
            CloudSEK
          </span>
        </div>

        {/* Product Navigation - Compact */}
        <nav className="hidden md:flex items-center gap-0.5 flex-shrink-0">
          {navProducts.map((product) => (
            <button
              key={product.id}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-medium transition-all whitespace-nowrap",
                product.id === activeProduct
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100",
              )}
            >
              {product.label}
            </button>
          ))}
        </nav>

        {/* Divider */}
        <div className="hidden lg:block w-px h-5 bg-gray-300 mx-0.5 flex-shrink-0" />

        {/* Menu Items - Compact */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-shrink-0">
          {navMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all whitespace-nowrap",
                location.pathname === item.path && item.id !== "dashboards" && item.id !== "capabilities"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:bg-gray-100",
              )}
            >
              <span>{item.label}</span>
              <ChevronDown size={12} />
              {item.badge && (
                <span className="ml-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1 min-w-0" />

        {/* Right Actions - Compact */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Search Icon */}
          <button className="text-gray-600 hover:text-gray-900 p-1.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0">
            <svg
              className="w-4 h-4"
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

          {/* Support Icon */}
          <button className="text-gray-600 hover:text-gray-900 p-1.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0">
            <svg
              className="w-4 h-4"
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
          <button className="relative text-gray-600 hover:text-gray-900 p-1.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0">
            <svg
              className="w-4 h-4"
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
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
              15
            </span>
          </button>

          {/* Profile - Compact */}
          <button className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              AR
            </div>
            <div className="hidden xl:block min-w-0">
              <div className="text-xs font-semibold text-gray-900 leading-tight">
                Abhinav
              </div>
              <div className="text-xs text-gray-500 leading-tight">Admin</div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white py-2 px-2">
          <nav className="space-y-1">
            {/* Products */}
            <div className="py-1">
              <p className="text-xs font-semibold text-gray-500 px-2 py-0.5 uppercase tracking-wide">
                Products
              </p>
              <div className="grid grid-cols-2 gap-1">
                {navProducts.map((product) => (
                  <button
                    key={product.id}
                    className={cn(
                      "px-2 py-1 rounded text-xs font-medium transition-colors",
                      product.id === activeProduct
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    {product.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-500 px-2 py-0.5 uppercase tracking-wide">
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
                    "w-full text-left flex items-center justify-between px-2 py-1 rounded text-xs font-medium transition-colors",
                    location.pathname === item.path
                      ? "bg-blue-100 text-blue-900"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">
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
