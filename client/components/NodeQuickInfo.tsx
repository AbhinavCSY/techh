import React, { useState, useEffect, useRef } from "react";
import { Expand, AlertCircle, CalendarX, X } from "lucide-react";
import { Technology } from "@/data/dependencyGraphData";

interface NodeQuickInfoProps {
  tech: Technology | null;
  position: { x: number; y: number };
  onExpand: () => void;
  onClose: () => void;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export function NodeQuickInfo({
  tech,
  position,
  onExpand,
  onClose,
  containerRef,
}: NodeQuickInfoProps) {
  const [adjustedPos, setAdjustedPos] = useState({ x: 0, y: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use requestAnimationFrame to ensure accurate measurements
    const measureAndPosition = () => {
      if (!dropdownRef.current) return;

      const element = dropdownRef.current;
      const width = element.offsetWidth || 320;
      const height = element.offsetHeight || 220;

      const offsetX = 12;
      const offsetY = 12;
      const margin = 10;

      // Always use window viewport positioning for consistency
      let x = position.x + offsetX;
      let y = position.y + offsetY;

      // Clamp to viewport bounds
      x = Math.max(margin, x);
      x = Math.min(window.innerWidth - width - margin, x);

      y = Math.max(margin, y);
      y = Math.min(window.innerHeight - height - margin, y);

      setAdjustedPos({ x, y });
    };

    // Measure immediately
    measureAndPosition();

    // Also measure with a small delay for accuracy
    const timer = setTimeout(measureAndPosition, 50);

    return () => clearTimeout(timer);
  }, [position, containerRef]);

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
      className={`${containerRef ? "absolute" : "fixed"} z-30 bg-white rounded-lg shadow-2xl border border-gray-300 pointer-events-auto`}
      style={{
        left: `${adjustedPos.x}px`,
        top: `${adjustedPos.y}px`,
        width: "300px",
        transition: "all 150ms ease-out",
        boxSizing: "border-box",
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
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onExpand}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="View details"
          >
            <Expand width="16" height="16" className="text-blue-600" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Close"
          >
            <X width="16" height="16" className="text-gray-500" />
          </button>
        </div>
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
            <CalendarX
              width="14"
              height="14"
              className="text-orange-600 flex-shrink-0"
            />
            <span className="text-xs text-orange-700">
              {eolVersions} version{eolVersions !== 1 ? "s" : ""} EOL
            </span>
          </div>
        )}

        {totalCVEs > 0 && (
          <div className="flex items-center gap-2 border-t border-gray-100 pt-1">
            <AlertCircle
              width="14"
              height="14"
              className="text-red-600 flex-shrink-0"
            />
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
