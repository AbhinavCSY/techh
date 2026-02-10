import { techStackDatabase } from "@/data/mockData";
import { Shield } from "lucide-react";

interface VulnerableLibrariesWidgetProps {
  compact?: boolean;
}

export function VulnerableLibrariesWidget({
  compact = false,
}: VulnerableLibrariesWidgetProps) {
  // Calculate vulnerable libraries by severity
  const vulnerableByType = {
    critical: techStackDatabase.filter((ts) =>
      ts.cves.some((c) => c.severity === "critical"),
    ).length,
    high: techStackDatabase.filter((ts) =>
      ts.cves.some((c) => c.severity === "high"),
    ).length,
    medium: techStackDatabase.filter((ts) =>
      ts.cves.some((c) => c.severity === "medium"),
    ).length,
    low: techStackDatabase.filter((ts) =>
      ts.cves.some((c) => c.severity === "low"),
    ).length,
  };

  const totalVulnerable = Object.values(vulnerableByType).reduce(
    (a, b) => a + b,
    0,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-gray-600" />
        <h4 className="font-semibold text-gray-900 text-sm">
          Vulnerable Tech Stacks ({totalVulnerable})
        </h4>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* High Severity */}
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-red-600">
            {vulnerableByType.high}
          </span>
          <span className="text-xs text-gray-600 mt-1">High</span>
        </div>

        {/* Medium Severity */}
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-orange-600">
            {vulnerableByType.medium}
          </span>
          <span className="text-xs text-gray-600 mt-1">Medium</span>
        </div>

        {/* Low Severity */}
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-yellow-600">
            {vulnerableByType.low}
          </span>
          <span className="text-xs text-gray-600 mt-1">Low</span>
        </div>
      </div>
    </div>
  );
}
