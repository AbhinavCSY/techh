import { useState } from "react";
import { FilterState, ViewType, GroupingType } from "@/hooks/useFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, Filter, Download, ChevronDown, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

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
  grouping,
}: HorizontalFilterBarProps) {
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>(
    filters.customDateRange
      ? { from: filters.customDateRange[0], to: filters.customDateRange[1] }
      : {},
  );
  const [dateRangeStep, setDateRangeStep] = useState<"from" | "to">("from");

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

                {/* Time Filter */}
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-2">
                    Time Period
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "week", label: "📅 This Week" },
                      { value: "month", label: "📆 This Month" },
                      { value: "quarter", label: "📊 This Quarter" },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => {
                          onFilterChange({ timeFilter: value as any });
                          setSelectedDateRange({});
                        }}
                        className={cn(
                          "w-full px-3 py-2 rounded text-xs font-medium text-left transition-colors",
                          filters.timeFilter === value
                            ? "bg-blue-500 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:border-blue-500",
                        )}
                      >
                        {label}
                      </button>
                    ))}

                    {/* Custom Date Range */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className={cn(
                            "w-full px-3 py-2 rounded text-xs font-medium text-left transition-colors",
                            filters.timeFilter === "custom"
                              ? "bg-blue-500 text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:border-blue-500",
                          )}
                        >
                          <CalendarIcon className="w-3 h-3 inline mr-1" />
                          Custom Range
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <div className="p-4 space-y-4">
                          <div>
                            <label className="text-xs font-medium text-gray-700 block mb-2">
                              {dateRangeStep === "from"
                                ? "Select Start Date"
                                : "Select End Date"}
                            </label>
                            <Calendar
                              mode="single"
                              selected={
                                dateRangeStep === "from"
                                  ? selectedDateRange.from
                                  : selectedDateRange.to
                              }
                              onSelect={(date) => {
                                if (dateRangeStep === "from") {
                                  setSelectedDateRange({
                                    ...selectedDateRange,
                                    from: date,
                                  });
                                  setDateRangeStep("to");
                                } else {
                                  setSelectedDateRange({
                                    ...selectedDateRange,
                                    to: date,
                                  });
                                }
                              }}
                              disabled={(date) => {
                                if (dateRangeStep === "to" && selectedDateRange.from) {
                                  return date < selectedDateRange.from;
                                }
                                return date > new Date();
                              }}
                            />
                          </div>

                          {selectedDateRange.from && selectedDateRange.to && (
                            <div className="space-y-2">
                              <p className="text-xs text-gray-600">
                                <strong>From:</strong>{" "}
                                {format(selectedDateRange.from, "MMM d, yyyy")}
                              </p>
                              <p className="text-xs text-gray-600">
                                <strong>To:</strong>{" "}
                                {format(selectedDateRange.to, "MMM d, yyyy")}
                              </p>
                              <button
                                onClick={() => {
                                  onFilterChange({
                                    timeFilter: "custom",
                                    customDateRange: [
                                      selectedDateRange.from!,
                                      selectedDateRange.to!,
                                    ],
                                  });
                                  setShowFilterPanel(false);
                                }}
                                className="w-full py-1.5 px-2 rounded text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                              >
                                Apply Custom Range
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedDateRange({});
                                  setDateRangeStep("from");
                                }}
                                className="w-full py-1.5 px-2 rounded text-xs font-medium bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
                              >
                                Clear Selection
                              </button>
                            </div>
                          )}

                          {dateRangeStep === "to" && selectedDateRange.from && (
                            <button
                              onClick={() => setDateRangeStep("from")}
                              className="w-full py-1.5 px-2 rounded text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            >
                              Change Start Date
                            </button>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {hasActiveFilters && (
                  <Button
                    onClick={() => {
                      onClearFilters();
                      setShowFilterPanel(false);
                      setSelectedDateRange({});
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
            <div className="relative group">
              <button
                onClick={() => grouping !== "asset" && onViewTypeChange("graph")}
                disabled={grouping === "asset"}
                className={cn(
                  "px-3 py-1.5 rounded font-medium text-sm transition-all whitespace-nowrap",
                  grouping === "asset"
                    ? "text-gray-400 cursor-not-allowed"
                    : viewType === "graph"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900",
                )}
              >
                🔗 Graph
              </button>
              {grouping === "asset" && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap">
                    Coming Soon
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
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
          {filters.timeFilter !== "month" && (
            <FilterChip
              label={
                filters.timeFilter === "custom" && filters.customDateRange
                  ? `${format(filters.customDateRange[0], "MMM d")} - ${format(filters.customDateRange[1], "MMM d")}`
                  : filters.timeFilter === "week"
                    ? "This Week"
                    : filters.timeFilter === "quarter"
                      ? "This Quarter"
                      : "Custom"
              }
              onRemove={() =>
                onFilterChange({ timeFilter: "month", customDateRange: undefined })
              }
            />
          )}
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
