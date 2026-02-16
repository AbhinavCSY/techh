import { useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThreatItem {
  id: string;
  title: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  source: string;
  date: string;
  description: string;
  tags: string[];
  viewCount?: number;
  relatedCount?: number;
}

interface TopViewedIntel {
  title: string;
  count: number;
  relatedCount: number;
  date: string;
}

const threatFilters = [
  { id: "cyber-news", label: "Cyber News" },
  { id: "dark-web", label: "Dark Web" },
  { id: "cve", label: "CVE" },
  { id: "ransomware", label: "Ransomware" },
  { id: "hacktivism", label: "Hacktivism" },
];

const sampleThreats: ThreatItem[] = [
  {
    id: "1",
    title: "CVE-2026-2548: WAYOS FBM-2200 Command Injection Vulnerability",
    type: "CVE",
    severity: "critical",
    source: "WAYOS FBM-2200 version 24.10.19",
    date: "1-1 0 0",
    description:
      "A command injection vulnerability exists in WAYOS FBM-2200 version 24.10.19 in the upm_interface_upm_udp_interface_or upmm_max_app_arguments, a remote attacker can inject arbitrary commands. Successful exploitation allows for unauthorized...",
    tags: ["CVE", "CVSS 9.3"],
  },
  {
    id: "2",
    title: "CVE-2026-2544: LuLu UI Command Injection Vulnerability",
    type: "CVE",
    severity: "high",
    source: "yuml-fe LuLu UI",
    date: "16 Feb, 2026 01:46:00 PM 0",
    description:
      "A command injection vulnerability exists in yuml-fe LuLu UI version 3.0.5. Specifically, the child_process_exec function within the run.js file is susceptible to manipulation, allowing for the injection of arbitrary operating system commands. This vulnerability can be exploited remotely...",
    tags: ["CVE", "CVSS 7.3"],
  },
  {
    id: "3",
    title: "CVE-2026-2542: Total VPN Unquoted Search Path Vulnerability",
    type: "CVE",
    severity: "medium",
    source: "Total VPN 0.5.2.8 on Windows",
    date: "VUL-1847-78030",
    description:
      "A Total VPN 0.5.2.8 running on Windows system has been discovered in Total VPN version 0.5.2.8 running on Windows systems. The flaw, identified as an unquoted search path vulnerability, resides within the win_service exe located in the Total VPN installation directory. Exploiting this vulnerability involves manipulating the search path...",
    tags: ["VUL", "CVSS 5.1"],
  },
];

const topViewedIntel: TopViewedIntel[] = [
  {
    title: "Ransomware",
    count: 0,
    relatedCount: 0,
    date: "21 Jan, 2025 09:50:02 PM 0",
  },
  {
    title: "arabian (apt.73) Ransomware Attack on ICICI Back",
    count: 11,
    relatedCount: 30,
    date: "21 Jan, 2025 09:50:02 PM 0",
  },
  {
    title: "Dark Web",
    count: 0,
    relatedCount: 0,
    date: "20 Mar, 2025 08:10:00 PM 0",
  },
  {
    title: "Oracle Cloud Breach: 6 Million User Records Stolen, Extortion Attempt",
    count: 51,
    relatedCount: 3233,
    date: "20 Mar, 2025 08:10:00 PM 0",
  },
  {
    title: "Hacktivism",
    count: 0,
    relatedCount: 0,
    date: "30 Jan, 2026 08:27:21 AM 0",
  },
  {
    title: "AIA Bank Targeted for Alleged Fund Transfer",
    count: 42,
    relatedCount: 531755,
    date: "30 Jan, 2026 08:27:21 AM 0",
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "bg-red-100 text-red-700";
    case "high":
      return "bg-orange-100 text-orange-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "low":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function ThreatIntel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const totalItems = 53227;

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
    setCurrentPage(1);
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Threat Feeds
          </h1>
          <p className="text-sm text-gray-600">
            Access real-time threat intel from our community monitored and
            updated underground sources.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by Keyword ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {threatFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => toggleFilter(filter.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    selectedFilters.includes(filter.id)
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between text-sm text-gray-600 border-b border-gray-200 pb-4">
              <span>
                {startItem} - {endItem} of {totalItems.toLocaleString()}
              </span>
              <div className="flex items-center gap-2">
                <span>1 / 12130</span>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Next
                </button>
              </div>
            </div>

            {/* Threat Items */}
            <div className="space-y-4">
              {sampleThreats.map((threat, index) => (
                <div
                  key={threat.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {/* Badge and Title */}
                  <div className="flex items-start gap-3 mb-2">
                    <span className={cn(
                      "inline-block px-2 py-1 rounded text-xs font-semibold whitespace-nowrap mt-0.5",
                      threat.severity === "critical"
                        ? "bg-red-100 text-red-700"
                        : threat.severity === "high"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-yellow-100 text-yellow-700"
                    )}>
                      {threat.severity === "critical" ? "New" : ""}
                    </span>
                    <h3 className="text-sm font-semibold text-gray-900 flex-1">
                      {threat.title}
                    </h3>
                  </div>

                  {/* Source and Metadata */}
                  <div className="text-xs text-gray-500 space-y-1 mb-3">
                    <p>
                      <span className="font-medium">{threat.source}</span>
                    </p>
                    <p>{threat.date}</p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {threat.description}
                  </p>

                  {/* Tags and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {threat.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>👁 1</span>
                      <span>0</span>
                      <span>0</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between py-4 border-t border-gray-200">
              <span className="text-xs text-gray-600">
                {startItem} - {endItem} of {totalItems.toLocaleString()}
              </span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">
                  Previous
                </button>
                <span className="text-xs text-gray-600">
                  {currentPage} / 2130
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-3 py-1 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <h3 className="text-sm font-bold text-gray-900 mb-4">
                Top Viewed Intel
              </h3>
              <div className="space-y-4">
                {topViewedIntel.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer transition-colors",
                      ["Ransomware", "Dark Web", "Hacktivism"].includes(
                        item.title
                      )
                        ? "bg-gray-50 border border-gray-200"
                        : "bg-purple-50 border border-purple-200 hover:bg-purple-100"
                    )}
                  >
                    <h4 className="text-xs font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h4>
                    {item.count > 0 && (
                      <>
                        <p className="text-xs text-gray-600 mb-1">
                          <span className="font-medium">{item.count}</span> IDX,{" "}
                          <span className="font-medium">
                            ADV-1945-531755
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.relatedCount} related · {item.date}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
