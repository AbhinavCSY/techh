import { useMemo, useState } from "react";
import { assetDatabase } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface WebApp {
  id: string;
  name: string;
  url: string;
  status: "secure" | "not-secure" | "unreachable" | "redirected" | "error";
  statusMessage: string;
  statusCode?: number;
  issues: {
    critical: number;
    high: number;
    medium: number;
  };
  lastScanned: Date;
  thumbnail?: string;
}

// Convert assets to web apps
const convertAssetsToWebApps = (): WebApp[] => {
  const statuses: Array<WebApp["status"]> = [
    "secure",
    "not-secure",
    "unreachable",
    "redirected",
    "error",
  ];

  return assetDatabase.map((asset, idx) => ({
    id: asset.id,
    name: asset.name,
    url: `https://${asset.name.toLowerCase().replace(/\s+/g, "-")}.com`,
    status: statuses[idx % statuses.length],
    statusMessage: [
      "Site is secure",
      "Site is not secure",
      "Unreachable",
      "Redirected to another domain",
      "Error loading site",
    ][idx % 5],
    statusCode: [200, 403, 500, 301, 502][idx % 5],
    issues: {
      critical: Math.floor(Math.random() * 3),
      high: Math.floor(Math.random() * 5),
      medium: Math.floor(Math.random() * 8),
    },
    lastScanned: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  }));
};

const getStatusColor = (status: WebApp["status"]) => {
  switch (status) {
    case "secure":
      return {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        icon: "✓",
      };
    case "not-secure":
      return {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-700",
        icon: "✕",
      };
    case "unreachable":
      return {
        bg: "bg-gray-50",
        border: "border-gray-200",
        text: "text-gray-700",
        icon: "?",
      };
    case "redirected":
      return {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-700",
        icon: "→",
      };
    case "error":
      return {
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-700",
        icon: "!",
      };
  }
};

export default function WebApplications() {
  const [sortBy, setSortBy] = useState<"name" | "status" | "issues">("name");
  const webApps = useMemo(() => {
    const apps = convertAssetsToWebApps();

    if (sortBy === "issues") {
      return apps.sort(
        (a, b) =>
          b.issues.critical +
          b.issues.high -
          (a.issues.critical + a.issues.high),
      );
    } else if (sortBy === "status") {
      const statusOrder = {
        "not-secure": 0,
        error: 1,
        unreachable: 2,
        redirected: 3,
        secure: 4,
      };
      return apps.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    }

    return apps.sort((a, b) => a.name.localeCompare(b.name));
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-6 py-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Web Applications
              </h1>
              <p className="text-gray-600 mt-1">
                Total count of similar-looking Web App Groups: {webApps.length}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Sort Web Apps by Group count
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Assets
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg">
                Tags
              </button>
            </div>

            <div className="flex-1 max-w-xs">
              <input
                type="text"
                placeholder="Search for Web App URL"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortBy("status")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  sortBy === "status"
                    ? "bg-blue-100 text-blue-900 border border-blue-300"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
                )}
              >
                Status
              </button>
              <button
                onClick={() => setSortBy("issues")}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  sortBy === "issues"
                    ? "bg-blue-100 text-blue-900 border border-blue-300"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
                )}
              >
                Issues
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {webApps.map((app) => {
            const statusInfo = getStatusColor(app.status);
            const totalIssues =
              app.issues.critical + app.issues.high + app.issues.medium;

            return (
              <div
                key={app.id}
                className={cn(
                  "rounded-lg border p-4 transition-all hover:shadow-lg cursor-pointer",
                  statusInfo.bg,
                  statusInfo.border,
                  "border",
                )}
              >
                {/* Header with Status */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-gray-900 truncate">
                      {app.name}
                    </h3>
                    <p className="text-xs text-gray-600 truncate mt-1">
                      {app.url}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full font-bold text-lg",
                      statusInfo.text,
                      app.status === "secure"
                        ? "bg-green-100"
                        : app.status === "not-secure"
                          ? "bg-red-100"
                          : app.status === "unreachable"
                            ? "bg-gray-100"
                            : app.status === "redirected"
                              ? "bg-yellow-100"
                              : "bg-orange-100",
                    )}
                  >
                    {statusInfo.icon}
                  </div>
                </div>

                {/* Status Message */}
                <div className="mb-3 p-2 bg-white bg-opacity-60 rounded">
                  <p className="text-xs font-medium text-gray-700">
                    {app.statusMessage}
                  </p>
                  {app.statusCode && (
                    <p className="text-xs text-gray-600 mt-1">
                      HTTP {app.statusCode}
                    </p>
                  )}
                </div>

                {/* Issues Summary */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {app.issues.critical > 0 && (
                    <div className="bg-red-100 rounded p-2 text-center">
                      <p className="text-xs font-bold text-red-900">
                        {app.issues.critical}
                      </p>
                      <p className="text-xs text-red-700">Critical</p>
                    </div>
                  )}
                  {app.issues.high > 0 && (
                    <div className="bg-orange-100 rounded p-2 text-center">
                      <p className="text-xs font-bold text-orange-900">
                        {app.issues.high}
                      </p>
                      <p className="text-xs text-orange-700">High</p>
                    </div>
                  )}
                  {app.issues.medium > 0 && (
                    <div className="bg-yellow-100 rounded p-2 text-center">
                      <p className="text-xs font-bold text-yellow-900">
                        {app.issues.medium}
                      </p>
                      <p className="text-xs text-yellow-700">Medium</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-300 border-opacity-50">
                  <span className="text-xs text-gray-600">
                    Scanned{" "}
                    {Math.floor(
                      (Date.now() - app.lastScanned.getTime()) / (1000 * 60),
                    )}
                    m ago
                  </span>
                  {totalIssues > 0 && (
                    <span className="text-xs font-semibold text-red-700">
                      {totalIssues} issues
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
