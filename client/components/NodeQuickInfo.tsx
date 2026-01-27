import React, { useState, useEffect, useRef } from "react";
import { Expand, AlertCircle, CalendarX } from "lucide-react";
import { Technology } from "@/data/dependencyGraphData";

interface NodeQuickInfoProps {
  tech: Technology | null;
  position: { x: number; y: number };
  onExpand: () => void;
  onClose: () => void;
}

export function NodeQuickInfo({
  tech,
  position,
  onExpand,
  onClose,
}: NodeQuickInfoProps) {
  const [adjustedPos, setAdjustedPos] = useState({ x: 0, y: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownRef.current) return;

    const rect = dropdownRef.current.getBoundingClientRect();
    let x = position.x;
    let y = position.y;

    // Adjust horizontal position
    if (x + rect.width > window.innerWidth - 10) {
      x = window.innerWidth - rect.width - 10;
    }
    if (x < 10) {
      x = 10;
    }

    // Adjust vertical position
    if (y + rect.height > window.innerHeight - 10) {
      y = window.innerHeight - rect.height - 10;
    }
    if (y < 10) {
      y = 10;
    }

    setAdjustedPos({ x, y });
  }, [position]);

  if (!tech) return null;

  // Calculate statistics
  const totalVersions = tech.versions.length;
  const eolVersions = tech.versions.filter((v) => v.eol).length;
  const totalCVEs = tech.versions.reduce((sum, v) => sum + v.cves.length, 0);

  // Get status
  const getStatus = () => {
    if (eolVersions === totalVersions) return "All EOL";
    if (totalCVEs > 0) return `${totalCVEs} CVEs`;
    return "Active";
  };

  const getStatusColor = () => {
    if (eolVersions === totalVersions) return "text-red-600";
    if (totalCVEs > 0) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div
      ref={dropdownRef}
      className="fixed z-30 bg-white rounded-lg shadow-xl border border-gray-200 pointer-events-auto"
      style={{
        left: `${adjustedPos.x}px`,
        top: `${adjustedPos.y}px`,
        minWidth: "250px",
        maxWidth: "300px",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm truncate">
            {tech.product}
          </h4>
          <p className="text-xs text-gray-600 truncate">{tech.vendor}</p>
        </div>
        <button
          onClick={onExpand}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
          title="View details"
        >
          <Expand width="16" height="16" className="text-blue-600" />
        </button>
      </div>

      {/* Quick Stats */}
      <div className="px-4 py-3 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Versions:</span>
          <span className="font-medium text-gray-900">{totalVersions}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Status:</span>
          <span className={`font-medium ${getStatusColor()}`}>
            {getStatus()}
          </span>
        </div>

        {eolVersions > 0 && (
          <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
            <CalendarX width="14" height="14" className="text-orange-600 flex-shrink-0" />
            <span className="text-xs text-orange-700">
              {eolVersions} version{eolVersions !== 1 ? "s" : ""} EOL
            </span>
          </div>
        )}

        {totalCVEs > 0 && (
          <div className="flex items-center gap-2 border-t border-gray-100 pt-1">
            <AlertCircle width="14" height="14" className="text-red-600 flex-shrink-0" />
            <span className="text-xs text-red-700">
              {totalCVEs} CVE{totalCVEs !== 1 ? "s" : ""} found
            </span>
          </div>
        )}
      </div>

      {/* Action */}
      <div className="px-4 py-2 bg-gray-50 rounded-b-lg border-t border-gray-100">
        <button
          onClick={onExpand}
          className="w-full px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          View Full Details
        </button>
      </div>
    </div>
  );
}
