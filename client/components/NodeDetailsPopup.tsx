import React from "react";
import { X, AlertCircle, CalendarX, Package, Building2 } from "lucide-react";
import {
  Technology,
  getVendorAccountability,
  dependencyGraphData,
} from "@/data/dependencyGraphData";

interface NodeDetailsPopupProps {
  tech: Technology | null;
  onClose: () => void;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export function NodeDetailsPopup({
  tech,
  onClose,
  containerRef,
}: NodeDetailsPopupProps) {
  if (!tech) return null;

  // Calculate statistics
  const totalVersions = tech.versions.length;
  const eolVersions = tech.versions.filter((v) => v.eol).length;
  const cveVersions = tech.versions.filter((v) => v.cves.length > 0).length;
  const totalCVEs = tech.versions.reduce((sum, v) => sum + v.cves.length, 0);
  const allCVEs = Array.from(new Set(tech.versions.flatMap((v) => v.cves)));

  // Get status
  const getStatus = () => {
    if (eolVersions === totalVersions) return "All versions EOL";
    if (cveVersions > 0) return "Has CVEs";
    return "Active";
  };

  const getStatusColor = () => {
    const status = getStatus();
    if (status === "All versions EOL") return "bg-red-100 text-red-800";
    if (status === "Has CVEs") return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const wrapperClass = containerRef
    ? "absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
    : "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40";

  return (
    <div className={wrapperClass}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-gray-200">
          <div className="flex items-start gap-3 flex-1">
            <Package
              width="24"
              height="24"
              className="text-blue-600 mt-1 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg break-words">
                {tech.product}
              </h3>
              <p className="text-sm text-gray-600 break-words">{tech.vendor}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
          >
            <X width="20" height="20" className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Status Badge */}
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
          >
            {getStatus()}
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalVersions}
              </div>
              <div className="text-xs text-gray-600">Versions</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-600">{totalCVEs}</div>
              <div className="text-xs text-gray-600">CVEs</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {eolVersions}
              </div>
              <div className="text-xs text-gray-600">EOL</div>
            </div>
          </div>

          {/* CVEs Section */}
          {allCVEs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle width="16" height="16" className="text-red-600" />
                <h4 className="font-medium text-sm text-gray-900">
                  Vulnerabilities
                </h4>
              </div>
              <div className="bg-red-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                <div className="space-y-1">
                  {allCVEs.map((cve) => (
                    <div key={cve} className="text-sm text-red-800 font-mono">
                      {cve}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* EOL Versions Section */}
          {eolVersions > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CalendarX width="16" height="16" className="text-orange-600" />
                <h4 className="font-medium text-sm text-gray-900">
                  End of Life
                </h4>
              </div>
              <div className="space-y-1">
                {tech.versions
                  .filter((v) => v.eol)
                  .map((v) => (
                    <div
                      key={v.version}
                      className="bg-orange-50 rounded p-2 text-sm text-orange-800"
                    >
                      <div className="font-medium">{v.version}</div>
                      {v.eol_date && (
                        <div className="text-xs text-orange-700">
                          {new Date(v.eol_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Active Versions Section */}
          <div>
            <h4 className="font-medium text-sm text-gray-900 mb-2">
              Active Versions
            </h4>
            <div className="space-y-1">
              {tech.versions
                .filter((v) => !v.eol)
                .map((v) => (
                  <div
                    key={v.version}
                    className="bg-green-50 rounded p-2 text-sm text-green-800"
                  >
                    <div className="font-medium">{v.version}</div>
                    {v.cves.length > 0 && (
                      <div className="text-xs text-green-700">
                        {v.cves.length} CVE{v.cves.length !== 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Vendor Accountability Section (RFC) */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building2 width="16" height="16" className="text-purple-600" />
              <h4 className="font-medium text-sm text-gray-900">
                Vendor Accountability
              </h4>
            </div>
            {(() => {
              const accountability = getVendorAccountability(
                tech.id,
                dependencyGraphData,
              );
              if (!accountability) return null;

              return (
                <div className="space-y-2">
                  {accountability.primary && (
                    <div className="bg-purple-50 rounded p-2 text-sm">
                      <div className="font-medium text-purple-900">
                        Primary Vendor (Accountable)
                      </div>
                      <div className="text-purple-700 text-xs mt-0.5">
                        {accountability.primary.name}
                      </div>
                    </div>
                  )}
                  {accountability.parent && (
                    <div className="bg-violet-50 rounded p-2 text-sm">
                      <div className="font-medium text-violet-900">
                        Parent Organization
                      </div>
                      <div className="text-violet-700 text-xs mt-0.5">
                        {accountability.parent.name}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
