import { useState } from 'react';
import { FilterState, ViewType, GroupingType } from '@/hooks/useFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Filter, Download, ChevronDown } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  viewType: ViewType;
  onViewTypeChange: (view: ViewType) => void;
  grouping: GroupingType;
  onGroupingChange: (grouping: GroupingType) => void;
  onExport?: (format: 'csv' | 'json' | 'pdf') => void;
}

export function FilterPanel({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  viewType,
  onViewTypeChange,
  grouping,
  onGroupingChange,
  onExport,
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-700" />
          <h2 className="text-sm font-semibold text-gray-900">Filters & Views</h2>
          {hasActiveFilters && (
            <Badge className="bg-blue-100 text-blue-800">
              {getActiveFilterCount(filters)} active
            </Badge>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 text-xs font-medium"
        >
          {isExpanded ? 'Hide' : 'Show'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {/* Search */}
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-2">
              Search
            </label>
            <Input
              placeholder="Search by name, version, IP..."
              value={filters.searchTerm}
              onChange={(e) =>
                onFilterChange({ searchTerm: e.target.value })
              }
              className="text-sm"
            />
          </div>

          {/* Tech Stack Type */}
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-2">
              Tech Stack Type
            </label>
            <div className="flex flex-wrap gap-2">
              {['framework', 'language', 'database', 'devops', 'library'].map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => toggleArrayFilter('techStackTypes', type)}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                      filters.techStackTypes.includes(type)
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-500'
                    )}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Asset Type */}
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-2">
              Asset Type
            </label>
            <div className="flex flex-wrap gap-2">
              {['ip', 'domain', 'app', 'cloud-resource'].map((type) => (
                <button
                  key={type}
                  onClick={() => toggleArrayFilter('assetTypes', type)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                    filters.assetTypes.includes(type)
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-500'
                  )}
                >
                  {type.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Risk Level */}
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-2">
              Risk Level
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'critical', color: 'bg-red-100 text-red-800' },
                { value: 'high', color: 'bg-orange-100 text-orange-800' },
                { value: 'medium', color: 'bg-yellow-100 text-yellow-800' },
                { value: 'low', color: 'bg-green-100 text-green-800' },
              ].map(({ value, color }) => (
                <button
                  key={value}
                  onClick={() => toggleArrayFilter('riskLevels', value)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                    filters.riskLevels.includes(value)
                      ? `${color} ring-2 ring-gray-400`
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                  )}
                >
                  {value}
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
                { value: 'eol', label: '⚠️ EOL' },
                { value: 'upgradable', label: '🔄 Upgradable' },
                { value: 'current', label: '✓ Current' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => toggleArrayFilter('eolStatus', value)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                    filters.eolStatus.includes(value)
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-500'
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
                { value: 'critical', emoji: '🔴' },
                { value: 'high', emoji: '🟠' },
                { value: 'medium', emoji: '🟡' },
                { value: 'low', emoji: '🟢' },
              ].map(({ value, emoji }) => (
                <button
                  key={value}
                  onClick={() => toggleArrayFilter('cveSeverities', value)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium transition-colors',
                    filters.cveSeverities.includes(value)
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-500'
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
              Time Range
            </label>
            <Select
              value={filters.timeFilter}
              onValueChange={(value) =>
                onFilterChange({ timeFilter: value as any })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Type Toggle */}
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-2">
              View
            </label>
            <div className="flex gap-2">
              {['card', 'table'].map((view) => (
                <button
                  key={view}
                  onClick={() => onViewTypeChange(view as ViewType)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-xs font-medium transition-colors',
                    viewType === view
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-500'
                  )}
                >
                  {view === 'card' ? '📋' : '📊'} {view === 'card' ? 'Card' : 'Table'}
                </button>
              ))}
            </div>
          </div>

          {/* Grouping Toggle */}
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-2">
              Group By
            </label>
            <div className="flex gap-2">
              {[
                { value: 'tech-stack' as GroupingType, label: '📦 Tech Stack' },
                { value: 'asset' as GroupingType, label: '🖥️ Asset' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => onGroupingChange(value)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-xs font-medium transition-colors',
                    grouping === value
                      ? 'bg-green-500 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-green-500'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-2">
              Sort By
            </label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) =>
                onFilterChange({ sortBy: value as any })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="risk">Risk Level (Highest First)</SelectItem>
                <SelectItem value="cve-count">CVE Count</SelectItem>
                <SelectItem value="asset-count">Asset Count</SelectItem>
                <SelectItem value="recency">Recently Added</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Export */}
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-2">
              Export
            </label>
            <div className="flex gap-2">
              {['csv', 'json', 'pdf'].map((format) => (
                <Button
                  key={format}
                  size="sm"
                  variant="outline"
                  onClick={() => onExport?.(format as 'csv' | 'json' | 'pdf')}
                  className="text-xs"
                >
                  <Download className="w-3 h-3 mr-1" />
                  {format.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              onClick={onClearFilters}
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

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.searchTerm && (
            <FilterChip label={`Search: ${filters.searchTerm}`} onRemove={() => onFilterChange({ searchTerm: '' })} />
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
                    (t) => t !== type
                  ),
                })
              }
            />
          ))}
          {filters.assetTypes.map((type) => (
            <FilterChip
              key={`asset-${type}`}
              label={type}
              onRemove={() =>
                onFilterChange({
                  assetTypes: filters.assetTypes.filter((t) => t !== type),
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
                    (s) => s !== severity
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
    field: 'techStackTypes' | 'assetTypes' | 'riskLevels' | 'eolStatus' | 'cveSeverities',
    value: string
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

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

function getActiveFilterCount(filters: FilterState) {
  let count = 0;
  if (filters.searchTerm) count++;
  if (filters.techStackTypes.length > 0) count += filters.techStackTypes.length;
  if (filters.assetTypes.length > 0) count += filters.assetTypes.length;
  if (filters.riskLevels.length > 0) count += filters.riskLevels.length;
  if (filters.eolStatus.length > 0) count += filters.eolStatus.length;
  if (filters.cveSeverities.length > 0) count += filters.cveSeverities.length;
  if (filters.timeFilter !== 'month') count++;
  return count;
}
