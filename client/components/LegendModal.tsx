import React from "react";
import { X } from "lucide-react";

interface LegendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LegendModal({ isOpen, onClose }: LegendModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Graph Legend</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X width="20" height="20" className="text-gray-500" />
          </button>
        </div>

        {/* Legend Items */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700 mb-2">Technologies</p>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Direct Tech</p>
              <p className="text-sm text-gray-600">Main technology you're viewing</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-indigo-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Related Tech</p>
              <p className="text-sm text-gray-600">Dependencies or derived tech</p>
            </div>
          </div>

          <hr className="my-3" />

          <p className="text-sm font-semibold text-gray-700 mb-2">Vendors</p>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-purple-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Primary Vendor</p>
              <p className="text-sm text-gray-600">Organization providing tech</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-violet-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Parent Vendor</p>
              <p className="text-sm text-gray-600">Parent organization</p>
            </div>
          </div>

          <hr className="my-3" />

          <p className="text-sm font-semibold text-gray-700 mb-2">Issues</p>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-red-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Critical Issue</p>
              <p className="text-sm text-gray-600">Highest severity</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-orange-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">High Issue</p>
              <p className="text-sm text-gray-600">High severity</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-amber-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-900">Medium Issue</p>
              <p className="text-sm text-gray-600">Medium severity</p>
            </div>
          </div>

          <hr className="my-3" />

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 mt-0.5 flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                <path d="M7 10L12 15L17 10" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Relationships</p>
              <p className="text-sm text-gray-600">Uses, Implements, DerivedFrom, etc.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
