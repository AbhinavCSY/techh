import { cn } from "@/lib/utils";

interface ThreatBarProps {
  cves: Array<{ severity: "critical" | "high" | "medium" | "low" }>;
  unscannedCount?: number;
  className?: string;
}

export function ThreatBar({
  cves,
  unscannedCount = 0,
  className,
}: ThreatBarProps) {
  const criticalCount = cves.filter((c) => c.severity === "critical").length;
  const highCount = cves.filter((c) => c.severity === "high").length;
  const mediumCount = cves.filter((c) => c.severity === "medium").length;
  const lowCount = cves.filter((c) => c.severity === "low").length;

  const total = cves.length;
  const totalWithUnscanned = total + unscannedCount;

  if (totalWithUnscanned === 0) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="h-2 w-24 bg-green-100 rounded-full"></div>
        <span className="text-xs text-green-700 font-medium">None</span>
      </div>
    );
  }

  const criticalPercent = (criticalCount / totalWithUnscanned) * 100 || 0;
  const highPercent = (highCount / totalWithUnscanned) * 100 || 0;
  const mediumPercent = (mediumCount / totalWithUnscanned) * 100 || 0;
  const lowPercent = (lowCount / totalWithUnscanned) * 100 || 0;
  const unscannedPercent = (unscannedCount / totalWithUnscanned) * 100 || 0;

  return (
    <div className={cn("group relative w-full", className)}>
      {/* Threat Bar */}
      <div className="flex items-center gap-2">
        <div className="h-2 flex-1 rounded-full bg-gray-200 overflow-hidden flex">
          {criticalCount > 0 && (
            <div
              className="bg-red-600"
              style={{ width: `${criticalPercent}%` }}
            />
          )}
          {highCount > 0 && (
            <div
              className="bg-orange-500"
              style={{ width: `${highPercent}%` }}
            />
          )}
          {mediumCount > 0 && (
            <div
              className="bg-yellow-400"
              style={{ width: `${mediumPercent}%` }}
            />
          )}
          {lowCount > 0 && (
            <div className="bg-green-500" style={{ width: `${lowPercent}%` }} />
          )}
          {unscannedCount > 0 && (
            <div
              className="bg-gray-400"
              style={{ width: `${unscannedPercent}%` }}
            />
          )}
        </div>
        <span className="text-sm font-bold text-gray-900 whitespace-nowrap">
          {totalWithUnscanned}
        </span>
      </div>

      {/* Hover Tooltip */}
      <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-10 bg-gray-900 text-white text-xs rounded-lg p-3 w-48 shadow-lg">
        <div className="space-y-1.5">
          {criticalCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-600"></div>
              <span>Critical: {criticalCount}</span>
            </div>
          )}
          {highCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span>High: {highCount}</span>
            </div>
          )}
          {mediumCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <span>Medium: {mediumCount}</span>
            </div>
          )}
          {lowCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Low: {lowCount}</span>
            </div>
          )}
          {unscannedCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <span>Unscanned: {unscannedCount}</span>
            </div>
          )}
          <div className="pt-1.5 border-t border-gray-700 text-gray-300 text-xs">
            Total: {total} scanned, {unscannedCount} unscanned
          </div>
        </div>
        {/* Arrow */}
        <div className="absolute top-full left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
      </div>
    </div>
  );
}
