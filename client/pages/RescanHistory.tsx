import { useState, useEffect, useRef } from "react";
import { ChevronLeft, Search, Filter } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RescanRecord {
  id: string;
  issueName: string;
  module: string;
  scanStatus: "Completed" | "In Progress" | "Failed";
  rescannedBy: string;
  rescannedOn: string;
  scanner: string;
  severity?: "Critical" | "High" | "Medium" | "Low";
}

// Mock data for rescan history
const mockRescanHistory: RescanRecord[] = [
  {
    id: "RSC-829",
    issueName: "Suspicious open port found",
    module: "Network Scanner",
    scanStatus: "Completed",
    rescannedBy: "Automation User 2",
    rescannedOn: "17 Feb, 2026 01:27:37 PM",
    scanner: "Network Scanner",
    severity: "Critical",
  },
  {
    id: "RSC-828",
    issueName: "Atlassian Jira iconURIServer - Cross-Site Scripting Server - Sql",
    module: "Web App Scanner",
    scanStatus: "Completed",
    rescannedBy: "Automation User 2",
    rescannedOn: "17 Feb, 2026 01:25:33 PM",
    scanner: "Web App Scanner",
    severity: "High",
  },
  {
    id: "RSC-827",
    issueName: "Missing cross-origin-resource-policy header",
    module: "Web App Scanner",
    scanStatus: "Completed",
    rescannedBy: "Automation User 2",
    rescannedOn: "17 Feb, 2026 01:25:32 PM",
    scanner: "Web App Scanner",
    severity: "Medium",
  },
  {
    id: "RSC-826",
    issueName: "Lucky13 (CVE-2013-0168)",
    module: "SSL Scanner",
    scanStatus: "Completed",
    rescannedBy: "Mohammad Ansar",
    rescannedOn: "16 Feb, 2026 01:00:07 PM",
    scanner: "SSL Scanner",
    severity: "High",
  },
  {
    id: "RSC-825",
    issueName: "Cookies without HttpOnly attribute - Detect",
    module: "Web App Scanner",
    scanStatus: "Completed",
    rescannedBy: "Automation User 2",
    rescannedOn: "04 Feb, 2026 01:25:12 PM",
    scanner: "Web App Scanner",
    severity: "Medium",
  },
  {
    id: "RSC-824",
    issueName: "Cookies without HttpOnly attribute - Detect",
    module: "Web App Scanner",
    scanStatus: "Completed",
    rescannedBy: "Automation User 2",
    rescannedOn: "03 Feb, 2026 01:26:44 PM",
    scanner: "Web App Scanner",
    severity: "Low",
  },
  {
    id: "RSC-823",
    issueName: "SQL Injection Vulnerability",
    module: "Web App Scanner",
    scanStatus: "In Progress",
    rescannedBy: "Automation User 2",
    rescannedOn: "02 Feb, 2026 04:15:20 PM",
    scanner: "Web App Scanner",
  },
  {
    id: "RSC-822",
    issueName: "Cross-Site Request Forgery (CSRF)",
    module: "Web App Scanner",
    scanStatus: "Failed",
    rescannedBy: "Automation User 1",
    rescannedOn: "01 Feb, 2026 02:30:15 PM",
    scanner: "Web App Scanner",
  },
];

export default function RescanHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const processedStateRef = useRef<string | null>(null);
  const [activeTab, setActiveTab] = useState<"Events" | "Incidents">("Events");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rescanRecords, setRescanRecords] = useState<RescanRecord[]>(mockRescanHistory);
  const itemsPerPage = 25;

  // Handle incoming CVE from navigation state or localStorage
  useEffect(() => {
    const state = location.state as any;
    let cveData = state;

    // If state is not available, check localStorage
    if (!cveData || !cveData.cveId) {
      const storedData = localStorage.getItem("pendingCVEScan");
      if (storedData) {
        try {
          cveData = JSON.parse(storedData);
          // Clear the stored data so we don't add it multiple times
          localStorage.removeItem("pendingCVEScan");
        } catch (e) {
          cveData = null;
        }
      }
    }

    if (cveData && cveData.cveId && cveData.cveName) {
      const stateKey = `${cveData.cveId}-${cveData.timestamp || "new"}`;

      // Check if we've already processed this state to avoid duplicates
      if (processedStateRef.current !== stateKey) {
        processedStateRef.current = stateKey;

        const newRecord: RescanRecord = {
          id: `RSC-${Math.floor(Math.random() * 10000)}`,
          issueName: cveData.cveName,
          module: cveData.scanner,
          scanStatus: "In Progress",
          rescannedBy: "Automation User 2",
          rescannedOn: new Date().toLocaleString(),
          scanner: cveData.scanner,
        };

        console.log("Adding new record:", newRecord);

        // Add new record to the beginning
        setRescanRecords((prev) => [newRecord, ...prev]);

        // Change status to Completed after 2 seconds
        const timeout = setTimeout(() => {
          setRescanRecords((prev) =>
            prev.map((record) =>
              record.id === newRecord.id
                ? { ...record, scanStatus: "Completed" }
                : record
            )
          );
        }, 2000);

        return () => clearTimeout(timeout);
      }
    }
  }, [location]);

  // Filter records - only show completed ones
  const completedRecords = rescanRecords.filter(
    (record) => record.scanStatus === "Completed"
  );

  // Count not scanned (In Progress + Failed)
  const notScannedCount = rescanRecords.length - completedRecords.length;

  // Filter records based on search term
  const filteredRecords = completedRecords.filter(
    (record) =>
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.issueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.scanner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1 w-fit">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            Completed
          </Badge>
        );
      case "In Progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1 w-fit">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            In Progress
          </Badge>
        );
      case "Failed":
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1 w-fit">
            <span className="w-2 h-2 bg-red-600 rounded-full"></span>
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  const getSeverityBadge = (severity?: string) => {
    switch (severity) {
      case "Critical":
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1 w-fit">
            <span className="w-2 h-2 bg-red-600 rounded-full"></span>
            Critical
          </Badge>
        );
      case "High":
        return (
          <Badge className="bg-orange-100 text-orange-800 flex items-center gap-1 w-fit">
            <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
            High
          </Badge>
        );
      case "Medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1 w-fit">
            <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
            Medium
          </Badge>
        );
      case "Low":
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1 w-fit">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            Low
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="p-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Rescan History</h1>
          <button className="ml-auto p-1 hover:bg-gray-100 rounded transition-colors">
            <span className="text-gray-600 text-sm">⚙️</span>
          </button>
        </div>

        {/* Summary Stats */}
        <div className="px-4 pb-4 flex gap-6 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-600">Daily Quota Consumed</span>
            <span className="text-2xl font-bold text-gray-900">3,600</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600">Event Rescans Requested</span>
            <span className="text-2xl font-bold text-gray-900">6</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600">No Scan Results</span>
            <span className="text-2xl font-bold text-gray-900">3</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-600">Successful Scans</span>
            <span className="text-2xl font-bold text-green-600">3</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="bg-transparent border-b-0 p-0 gap-8">
            <TabsTrigger
              value="Events"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-0 py-3 font-medium"
            >
              Events
            </TabsTrigger>
            <TabsTrigger
              value="Incidents"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-0 py-3 font-medium"
            >
              Incidents
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Controls and Table */}
      <div className="flex-1 flex flex-col bg-white m-4 rounded-lg border border-gray-200">
        {/* Search and Filter */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 border border-gray-300">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter</span>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300 text-sm font-medium flex items-center gap-1">
            <span>📅</span>
            <span>Date</span>
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Rescan ID
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Issue Name & Module
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Threat
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Rescanned On
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {record.id}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex flex-col gap-1">
                        <a href="#" className="text-blue-600 hover:underline">
                          {record.issueName}
                        </a>
                        <span className="text-xs text-gray-500">{record.scanner}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">{getSeverityBadge(record.severity)}</td>
                    <td className="px-6 py-3 text-gray-600">{record.rescannedOn}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-gray-500">
                    No scanned results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="flex-1">
            <span className="text-sm text-gray-600">
              {startIndex + 1}-{Math.min(endIndex, filteredRecords.length)} of{" "}
              {filteredRecords.length}
            </span>
            {notScannedCount > 0 && (
              <div className="text-xs text-gray-500 mt-2">
                <span className="font-medium">{notScannedCount} assets Not Scanned</span>
                <button className="text-blue-600 hover:underline ml-2">
                  click to view details
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </button>
            <span className="text-sm text-gray-600">
              {currentPage}/{totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
