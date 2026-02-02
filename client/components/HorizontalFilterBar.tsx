import { useState } from "react";
import { FilterState, ViewType, GroupingType } from "@/hooks/useFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Filter, Download, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface HorizontalFilterBarProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  viewType: ViewType;
  onViewTypeChange: (view: ViewType) => void;
  onExport?: (format: "csv" | "json" | "pdf") => void;
  grouping?: string;
}

export function HorizontalFilterBar({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  viewType,
  onViewTypeChange,
  onExport,
}: HorizontalFilterBarProps) {
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  return (
    <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
      {/* Main Filter Bar */}
      <div className="px-6 py-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <Input
              placeholder="Search by name, version, IP..."
              value={filters.searchTerm}
              onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
              className="text-sm"
            />
          </div>

          {/* Filter Button with Dropdown */}
          <div className="relative group">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
            >
              <Filter className="w-4 h-4" />
              Filter
              {hasActiveFilters && (
                <Badge className="ml-1 bg-blue-100 text-blue-800">
                  {getActiveFilterCount(filters)}
                </Badge>
              )}
            </Button>

            {showFilterPanel && (
              <div className="absolute left-0 mt-0 w-96 bg-white border border-gray-200 rounded-lg shadow-lg p-4 space-y-4 z-50">
                {/* Risk Level */}
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">
                    Risk Level
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "critical", color: "bg-red-100 text-red-800" },
                      { value: "high", color: "bg-orange-100 text-orange-800" },
                      {
                        value: "medium",
                        color: "bg-yellow-100 text-yellow-800",
                      },
                      { value: "low", color: "bg-green-100 text-green-800" },
                    ].map(({ value, color }) => (
                      <button
                        key={value}
                        onClick={() => toggleArrayFilter("riskLevels", value)}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                          filters.riskLevels.includes(value)
                            ? `${color} ring-2 ring-gray-400`
                            : "bg-white border border-gray-300 text-gray-700 hover:border-gray-400",
                        )}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Type */}
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">
                    Tech Stack Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "framework",
                      "language",
                      "database",
                      "devops",
                      "library",
                    ].map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          toggleArrayFilter("techStackTypes", type)
                        }
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                          filters.techStackTypes.includes(type)
                            ? "bg-blue-500 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:border-blue-500",
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* EOL Status */}
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">
                    EOL Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "eol", label: "⚠️ EOL" },
                      { value: "upgradable", label: "🔄 Upgradable" },
                      { value: "current", label: "✓ Current" },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => toggleArrayFilter("eolStatus", value)}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                          filters.eolStatus.includes(value)
                            ? "bg-blue-500 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:border-blue-500",
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CVE Severity */}
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">
                    CVE Severity
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "critical", emoji: "🔴" },
                      { value: "high", emoji: "🟠" },
                      { value: "medium", emoji: "🟡" },
                      { value: "low", emoji: "🟢" },
                    ].map(({ value, emoji }) => (
                      <button
                        key={value}
                        onClick={() =>
                          toggleArrayFilter("cveSeverities", value)
                        }
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                          filters.cveSeverities.includes(value)
                            ? "bg-blue-500 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:border-blue-500",
                        )}
                      >
                        {emoji} {value}
                      </button>
                    ))}
                  </div>
                </div>

                {hasActiveFilters && (
                  <Button
                    onClick={() => {
                      onClearFilters();
                      setShowFilterPanel(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                  >
                    <X className="w-3 h-3 mr-2" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* View Type Switch */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => onViewTypeChange("card")}
              className={cn(
                "px-3 py-1.5 rounded font-medium text-sm transition-all whitespace-nowrap",
                viewType === "card"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900",
              )}
            >
              📋 Card
            </button>
            <button
              onClick={() => onViewTypeChange("table")}
              className={cn(
                "px-3 py-1.5 rounded font-medium text-sm transition-all whitespace-nowrap",
                viewType === "table"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900",
              )}
            >
              📊 Table
            </button>
            <button
              onClick={() => onViewTypeChange("graph")}
              className={cn(
                "px-3 py-1.5 rounded font-medium text-sm transition-all whitespace-nowrap",
                viewType === "graph"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900",
              )}
            >
              🔗 Graph
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-gray-400 cursor-pointer"
          >
            <option value="risk">Risk Level</option>
            <option value="cve-count">CVE Count</option>
            <option value="asset-count">Asset Count</option>
            <option value="recency">Recently Added</option>
          </select>

          {/* Export Button */}
          <div className="relative group">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
              <ChevronDown className="w-4 h-4" />
            </Button>

            <div className="absolute right-0 mt-0 w-40 bg-white border border-gray-200 rounded-lg shadow-lg p-2 hidden group-hover:block z-50">
              {["csv", "json", "pdf"].map((format) => (
                <button
                  key={format}
                  onClick={() => onExport?.(format as "csv" | "json" | "pdf")}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  Export as {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="px-6 pb-3 flex flex-wrap gap-2">
          {filters.searchTerm && (
            <FilterChip
              label={`Search: ${filters.searchTerm}`}
              onRemove={() => onFilterChange({ searchTerm: "" })}
            />
          )}
          {filters.riskLevels.map((level) => (
            <FilterChip
              key={`risk-${level}`}
              label={level}
              onRemove={() =>
                onFilterChange({
                  riskLevels: filters.riskLevels.filter((r) => r !== level),
                })
              }
            />
          ))}
          {filters.techStackTypes.map((type) => (
            <FilterChip
              key={`type-${type}`}
              label={type}
              onRemove={() =>
                onFilterChange({
                  techStackTypes: filters.techStackTypes.filter(
                    (t) => t !== type,
                  ),
                })
              }
            />
          ))}
          {filters.eolStatus.map((status) => (
            <FilterChip
              key={`eol-${status}`}
              label={status}
              onRemove={() =>
                onFilterChange({
                  eolStatus: filters.eolStatus.filter((s) => s !== status),
                })
              }
            />
          ))}
          {filters.cveSeverities.map((severity) => (
            <FilterChip
              key={`cve-${severity}`}
              label={severity}
              onRemove={() =>
                onFilterChange({
                  cveSeverities: filters.cveSeverities.filter(
                    (s) => s !== severity,
                  ),
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );

  function toggleArrayFilter(
    field:
      | "techStackTypes"
      | "assetTypes"
      | "riskLevels"
      | "eolStatus"
      | "cveSeverities",
    value: string,
  ) {
    const currentArray = filters[field];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value];
    onFilterChange({ [field]: newArray });
  }
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <Badge className="bg-blue-100 text-blue-800 pr-1">
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="ml-2 hover:text-blue-600 text-blue-700"
      >
        ×
      </button>
    </Badge>
  );
}

function getActiveFilterCount(filters: FilterState) {
  let count = 0;
  if (filters.searchTerm) count++;
  if (filters.techStackTypes.length > 0) count += filters.techStackTypes.length;
  if (filters.assetTypes.length > 0) count += filters.assetTypes.length;
  if (filters.riskLevels.length > 0) count += filters.riskLevels.length;
  if (filters.eolStatus.length > 0) count += filters.eolStatus.length;
  if (filters.cveSeverities.length > 0) count += filters.cveSeverities.length;
  if (filters.timeFilter !== "month") count++;
  return count;
}
