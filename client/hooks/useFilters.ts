import { useMemo } from 'react';
import { usePersistentState } from './usePersistentState';
import { TechStack, Asset } from '@/data/mockData';

export type ViewType = 'card' | 'table';
export type GroupingType = 'tech-stack' | 'asset';
export type TimeFilter = 'week' | 'month' | 'quarter' | 'custom';
export type SortField = 'risk' | 'cve-count' | 'asset-count' | 'recency';

export interface FilterState {
  searchTerm: string;
  techStackTypes: string[];
  assetTypes: string[];
  riskLevels: string[];
  eolStatus: string[];
  cveSeverities: string[];
  timeFilter: TimeFilter;
  customDateRange?: [Date, Date];
  sortBy: SortField;
  sortOrder: 'asc' | 'desc';
}

const defaultFilterState: FilterState = {
  searchTerm: '',
  techStackTypes: [],
  assetTypes: [],
  riskLevels: [],
  eolStatus: [],
  cveSeverities: [],
  timeFilter: 'month',
  sortBy: 'recency',
  sortOrder: 'desc',
};

export function useFilters() {
  const [viewType, setViewType] = usePersistentState<ViewType>('viewType', 'card');
  const [grouping, setGrouping] = usePersistentState<GroupingType>(
    'grouping',
    'tech-stack'
  );
  const [filters, setFilters] = usePersistentState<FilterState>(
    'filters',
    defaultFilterState
  );

  const updateFilter = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const clearFilters = () => {
    setFilters(defaultFilterState);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchTerm !== '' ||
      filters.techStackTypes.length > 0 ||
      filters.assetTypes.length > 0 ||
      filters.riskLevels.length > 0 ||
      filters.eolStatus.length > 0 ||
      filters.cveSeverities.length > 0 ||
      filters.timeFilter !== 'month'
    );
  }, [filters]);

  return {
    viewType,
    setViewType,
    grouping,
    setGrouping,
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  };
}

export function filterTechStacks(
  items: TechStack[],
  filters: FilterState
): TechStack[] {
  return items.filter((item) => {
    // Search filter
    if (
      filters.searchTerm &&
      !item.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
      !item.version.includes(filters.searchTerm)
    ) {
      return false;
    }

    // Tech stack type filter
    if (filters.techStackTypes.length > 0 && !filters.techStackTypes.includes(item.type)) {
      return false;
    }

    // Risk level filter
    if (filters.riskLevels.length > 0 && !filters.riskLevels.includes(item.riskLevel)) {
      return false;
    }

    // EOL status filter
    if (filters.eolStatus.length > 0) {
      const isEol = item.isEOL;
      const isUpgradable = item.isUpgradable;
      const filterMatch = filters.eolStatus.some((status) => {
        if (status === 'eol') return isEol;
        if (status === 'upgradable') return isUpgradable && !isEol;
        if (status === 'current') return !isEol && !isUpgradable;
        return false;
      });
      if (!filterMatch) return false;
    }

    // CVE severity filter
    if (filters.cveSeverities.length > 0) {
      const hasSeverity = item.cves.some((cve) =>
        filters.cveSeverities.includes(cve.severity)
      );
      if (!hasSeverity && item.cves.length === 0) return false;
    }

    // Time filter
    if (filters.timeFilter !== 'month') {
      const itemDate = new Date(item.createdAt);
      const now = new Date();
      const diffDays =
        (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24);

      switch (filters.timeFilter) {
        case 'week':
          if (diffDays > 7) return false;
          break;
        case 'quarter':
          if (diffDays > 90) return false;
          break;
        case 'custom':
          if (
            filters.customDateRange &&
            (itemDate < filters.customDateRange[0] ||
              itemDate > filters.customDateRange[1])
          ) {
            return false;
          }
          break;
        default:
          if (diffDays > 30) return false;
      }
    }

    return true;
  });
}

export function filterAssets(items: Asset[], filters: FilterState): Asset[] {
  return items.filter((item) => {
    // Search filter
    if (
      filters.searchTerm &&
      !item.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Asset type filter
    if (filters.assetTypes.length > 0 && !filters.assetTypes.includes(item.type)) {
      return false;
    }

    // Risk level filter
    if (filters.riskLevels.length > 0 && !filters.riskLevels.includes(item.riskLevel)) {
      return false;
    }

    // Time filter
    if (filters.timeFilter !== 'month') {
      const itemDate = new Date(item.lastUpdated);
      const now = new Date();
      const diffDays =
        (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24);

      switch (filters.timeFilter) {
        case 'week':
          if (diffDays > 7) return false;
          break;
        case 'quarter':
          if (diffDays > 90) return false;
          break;
        case 'custom':
          if (
            filters.customDateRange &&
            (itemDate < filters.customDateRange[0] ||
              itemDate > filters.customDateRange[1])
          ) {
            return false;
          }
          break;
        default:
          if (diffDays > 30) return false;
      }
    }

    return true;
  });
}

export function sortTechStacks(items: TechStack[], sortBy: SortField, order: 'asc' | 'desc') {
  const sorted = [...items].sort((a, b) => {
    let aVal: number = 0;
    let bVal: number = 0;

    switch (sortBy) {
      case 'risk': {
        const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        aVal = riskOrder[a.riskLevel];
        bVal = riskOrder[b.riskLevel];
        break;
      }
      case 'cve-count':
        aVal = a.cves.length;
        bVal = b.cves.length;
        break;
      case 'recency':
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
        break;
      default:
        return 0;
    }

    return order === 'desc' ? bVal - aVal : aVal - bVal;
  });

  return sorted;
}

export function sortAssets(items: Asset[], sortBy: SortField, order: 'asc' | 'desc') {
  const sorted = [...items].sort((a, b) => {
    let aVal: number = 0;
    let bVal: number = 0;

    switch (sortBy) {
      case 'risk': {
        const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        aVal = riskOrder[a.riskLevel];
        bVal = riskOrder[b.riskLevel];
        break;
      }
      case 'cve-count':
        aVal = a.cveCount;
        bVal = b.cveCount;
        break;
      case 'recency':
        aVal = new Date(a.lastUpdated).getTime();
        bVal = new Date(b.lastUpdated).getTime();
        break;
      default:
        return 0;
    }

    return order === 'desc' ? bVal - aVal : aVal - bVal;
  });

  return sorted;
}
