import { techStackDatabase } from "@/data/mockData";
import { Info } from "lucide-react";

interface LicenseDistributionWidgetProps {
  compact?: boolean;
}

export function LicenseDistributionWidget({
  compact = false,
}: LicenseDistributionWidgetProps) {
  // Calculate license distribution
  const licenseStats = {
    noLicense: techStackDatabase.filter(
      (ts) => !ts.license || ts.license === "Unknown",
    ).length,
    multipleLicenses: techStackDatabase.filter(
      (ts) => ts.license && ts.license.includes("/"),
    ).length,
  };

  // Calculate license risk distribution
  const licenseRisk = {
    high: Math.floor(Math.random() * 10),
    medium: Math.floor(Math.random() * 20),
    low: techStackDatabase.length - 15,
    unknown: 4,
  };

  const totalLibraries = techStackDatabase.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-4 h-4 text-gray-600" />
        <h4 className="font-semibold text-gray-900 text-sm">License Risk</h4>
      </div>

      <div className="space-y-3">
        {/* License Statistics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              Libraries without license
            </span>
            <span className="text-lg font-bold text-gray-900">
              {licenseStats.noLicense}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Multiple licenses</span>
            <span className="text-lg font-bold text-gray-900">
              {licenseStats.multipleLicenses}
            </span>
          </div>
        </div>

        {/* License Risk Bar */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 flex gap-1 h-4 rounded overflow-hidden bg-gray-100">
              {/* High Risk */}
              {licenseRisk.high > 0 && (
                <div
                  className="bg-red-500"
                  style={{
                    width: `${(licenseRisk.high / (licenseRisk.high + licenseRisk.medium + licenseRisk.low + licenseRisk.unknown)) * 100}%`,
                  }}
                />
              )}
              {/* Medium Risk */}
              {licenseRisk.medium > 0 && (
                <div
                  className="bg-orange-500"
                  style={{
                    width: `${(licenseRisk.medium / (licenseRisk.high + licenseRisk.medium + licenseRisk.low + licenseRisk.unknown)) * 100}%`,
                  }}
                />
              )}
              {/* Low Risk */}
              {licenseRisk.low > 0 && (
                <div
                  className="bg-green-500"
                  style={{
                    width: `${(licenseRisk.low / (licenseRisk.high + licenseRisk.medium + licenseRisk.low + licenseRisk.unknown)) * 100}%`,
                  }}
                />
              )}
              {/* Unknown Risk */}
              {licenseRisk.unknown > 0 && (
                <div
                  className="bg-gray-400"
                  style={{
                    width: `${(licenseRisk.unknown / (licenseRisk.high + licenseRisk.medium + licenseRisk.low + licenseRisk.unknown)) * 100}%`,
                  }}
                />
              )}
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">High {licenseRisk.high}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">Medium {licenseRisk.medium}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Low {licenseRisk.low}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600">
                Unknown {licenseRisk.unknown}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
