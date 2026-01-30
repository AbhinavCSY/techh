import { useState } from "react";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Slide {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  notes?: string;
}

const slides: Slide[] = [
  {
    title: "Tech Stack Inventory Management",
    subtitle: "Comprehensive Asset Tracking & Dependency Analysis",
    content: (
      <div className="space-y-6 text-center">
        <div className="text-6xl mb-4">📚</div>
        <p className="text-2xl text-gray-700">
          Stay in Control of Your Technology Dependencies
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-left mt-6">
          <p className="text-gray-700">
            A comprehensive platform to monitor, analyze, and manage your tech
            stacks, identify vulnerabilities, and track end-of-life software
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Key Features",
    subtitle: "What You Can Do",
    content: (
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900">
            Inventory Management
          </h3>
          <p className="text-sm text-gray-700">
            Track all tech stacks and assets across your organization
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
          <div className="text-3xl mb-2">🔗</div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900">
            Dependency Visualization
          </h3>
          <p className="text-sm text-gray-700">
            See how technologies are interconnected and related
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
          <div className="text-3xl mb-2">🚨</div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900">
            Vulnerability Detection
          </h3>
          <p className="text-sm text-gray-700">
            Identify CVEs and security risks in your dependencies
          </p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
          <div className="text-3xl mb-2">⏳</div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900">
            EOL Tracking
          </h3>
          <p className="text-sm text-gray-700">
            Monitor end-of-life dates for your technologies
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Core Capabilities",
    subtitle: "What Makes This Platform Powerful",
    content: (
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Advanced Filtering & Sorting
            </h4>
            <p className="text-gray-700">
              Filter by tech stack, asset type, vulnerability status, and more
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Multiple View Options
            </h4>
            <p className="text-gray-700">
              Switch between card view and table view for different use cases
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Interactive Dependency Graphs
            </h4>
            <p className="text-gray-700">
              Visualize complex relationships and dependencies in real-time
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              4
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Data Export & Reporting
            </h4>
            <p className="text-gray-700">
              Export data in multiple formats (CSV, JSON, PDF) for reporting
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Benefits & Value",
    subtitle: "Why Your Team Needs This",
    content: (
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border-2 border-green-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-700 mb-3">
            🛡️ Risk Mitigation
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Identify security vulnerabilities early</li>
            <li>✓ Stay compliant with security standards</li>
            <li>✓ Reduce exposure to CVEs</li>
          </ul>
        </div>

        <div className="bg-white border-2 border-blue-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-700 mb-3">
            ⚡ Operational Efficiency
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Centralized inventory management</li>
            <li>✓ Quick dependency lookups</li>
            <li>✓ Automated risk assessment</li>
          </ul>
        </div>

        <div className="bg-white border-2 border-purple-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-700 mb-3">
            👥 Team Collaboration
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Shared visibility across teams</li>
            <li>✓ Easy documentation sharing</li>
            <li>✓ Data-driven decisions</li>
          </ul>
        </div>

        <div className="bg-white border-2 border-orange-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-700 mb-3">
            💰 Cost Savings
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Avoid security incidents</li>
            <li>✓ Plan tech upgrades better</li>
            <li>✓ Optimize your tech stack</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    title: "How to Get Started",
    subtitle: "Step-by-Step Guide",
    content: (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            1️⃣ Access the Dashboard
          </h3>
          <p className="text-gray-700">
            Navigate to the Asset Inventory section to see all your tech stacks
            and assets
          </p>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            2️⃣ Explore & Filter
          </h3>
          <p className="text-gray-700">
            Use the filter bar to narrow down results by tech stack, status, or
            risk level
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            3️⃣ View Dependencies
          </h3>
          <p className="text-gray-700">
            Click on any tech stack to see its dependencies and relationships in
            an interactive graph
          </p>
        </div>

        <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-lg border border-pink-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            4️⃣ Export & Share
          </h3>
          <p className="text-gray-700">
            Export data in your preferred format (CSV, JSON, or PDF) for
            reporting and sharing
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Scanning Assets",
    subtitle: "How to Identify Vulnerabilities",
    content: (
      <div className="space-y-4">
        <div className="bg-blue-50 p-5 rounded-lg border-2 border-blue-300">
          <h4 className="font-semibold text-blue-900 mb-3 text-lg">
            🔍 What is Asset Scanning?
          </h4>
          <p className="text-gray-700 mb-3">
            Scanning is the process of analyzing your technology assets to identify known security vulnerabilities (CVEs), check for deprecated versions, and assess overall risk.
          </p>
          <ul className="text-sm text-gray-700 space-y-1 ml-4">
            <li>✓ Detects known CVEs in your tech stack</li>
            <li>✓ Identifies end-of-life (EOL) versions</li>
            <li>✓ Assesses security risk levels</li>
            <li>✓ Generates vulnerability reports</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-900 mb-2">Scanned Assets</h4>
            <p className="text-sm text-gray-700">
              Complete analysis performed with known vulnerabilities identified
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-900 mb-2">Unscanned Assets</h4>
            <p className="text-sm text-gray-700">
              Pending analysis - run scan to identify vulnerabilities
            </p>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
          <h4 className="font-semibold text-green-900 mb-2">✨ Quick Tip</h4>
          <p className="text-sm text-gray-700">
            Select specific assets or scan your entire inventory at once using the "Scan Selected Assets" button
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Understanding Scan Results",
    subtitle: "Interpreting Vulnerability Findings",
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h3 className="font-bold text-red-700 mb-2">🔴 Critical</h3>
            <p className="text-sm text-gray-700">
              Severe vulnerabilities requiring immediate action
            </p>
            <div className="text-xs text-gray-600 mt-2">
              CVSS Score: 9.0+
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-bold text-orange-700 mb-2">🟠 High</h3>
            <p className="text-sm text-gray-700">
              Serious vulnerabilities needing prompt attention
            </p>
            <div className="text-xs text-gray-600 mt-2">
              CVSS Score: 7.0-8.9
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-bold text-yellow-700 mb-2">🟡 Medium</h3>
            <p className="text-sm text-gray-700">
              Moderate vulnerabilities to address soon
            </p>
            <div className="text-xs text-gray-600 mt-2">
              CVSS Score: 4.0-6.9
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-bold text-green-700 mb-2">🟢 Low</h3>
            <p className="text-sm text-gray-700">
              Minor vulnerabilities, lower priority
            </p>
            <div className="text-xs text-gray-600 mt-2">
              CVSS Score: 0.1-3.9
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 p-4 rounded-lg border-2 border-indigo-300">
          <h4 className="font-semibold text-indigo-900 mb-2">📊 Reading the CVE Pie Chart</h4>
          <p className="text-sm text-gray-700">
            View the "CVEs Pie Chart" widget to see the breakdown of your vulnerabilities by severity, helping you prioritize remediation efforts
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Rescan & Updates",
    subtitle: "Keeping Your Security Data Fresh",
    content: (
      <div className="space-y-4">
        <div className="bg-blue-50 p-5 rounded-lg border-2 border-blue-300">
          <h4 className="font-semibold text-blue-900 mb-3 text-lg">
            🔄 What is Rescanning?
          </h4>
          <p className="text-gray-700 mb-3">
            Rescanning re-analyzes your assets to discover new vulnerabilities, verify if previously found issues still exist, and update your risk profile after applying patches or upgrades.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-2">
              ⏱️ After Updates
            </h4>
            <p className="text-sm text-gray-700">
              Rescan after upgrading technologies to confirm vulnerabilities are resolved
            </p>
          </div>
          <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
            <h4 className="font-semibold text-cyan-900 mb-2">
              📆 Regular Schedule
            </h4>
            <p className="text-sm text-gray-700">
              Run weekly or monthly scans to catch newly discovered vulnerabilities
            </p>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
          <h4 className="font-semibold text-green-900 mb-2">✅ Rescan Benefits</h4>
          <ul className="text-sm text-gray-700 space-y-1 ml-4">
            <li>✓ Discover newly published CVEs</li>
            <li>✓ Verify patch effectiveness</li>
            <li>✓ Track remediation progress</li>
            <li>✓ Maintain current security posture</li>
          </ul>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-300">
          <h4 className="font-semibold text-orange-900 mb-2">💡 Best Practice</h4>
          <p className="text-sm text-gray-700">
            Rescan at least monthly, or immediately after any technology upgrades or patches
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Key Metrics & Analytics",
    subtitle: "What You Can Monitor",
    content: (
      <div className="grid grid-cols-2 gap-6">
        <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
          <div className="text-5xl font-bold text-red-600 mb-2">CVEs</div>
          <p className="text-gray-700 mb-3">
            View vulnerability distribution across your stack
          </p>
          <div className="text-xs text-gray-600">
            Critical, High, Medium, Low breakdowns
          </div>
        </div>

        <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-5xl font-bold text-yellow-600 mb-2">EOL</div>
          <p className="text-gray-700 mb-3">
            Track end-of-life dates for tech components
          </p>
          <div className="text-xs text-gray-600">
            Active, Warning, Critical status tracking
          </div>
        </div>

        <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-5xl font-bold text-blue-600 mb-2">Assets</div>
          <p className="text-gray-700 mb-3">
            Monitor your complete asset inventory
          </p>
          <div className="text-xs text-gray-600">
            Total count and scan status overview
          </div>
        </div>

        <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
          <div className="text-5xl font-bold text-green-600 mb-2">Graphs</div>
          <p className="text-gray-700 mb-3">
            Visualize complex dependency networks
          </p>
          <div className="text-xs text-gray-600">
            Interactive force-layout visualization
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Scanning Workflow",
    subtitle: "Step-by-Step Process",
    content: (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-300">
          <h4 className="text-lg font-semibold text-blue-900 mb-4">
            How to Perform a Scan
          </h4>
          <ol className="space-y-3">
            <li className="flex gap-3">
              <span className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                1
              </span>
              <div>
                <p className="font-semibold text-gray-900">
                  Navigate to Asset Inventory
                </p>
                <p className="text-sm text-gray-700">
                  Go to the main dashboard and view your assets
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                2
              </span>
              <div>
                <p className="font-semibold text-gray-900">
                  Select Assets to Scan
                </p>
                <p className="text-sm text-gray-700">
                  Choose individual assets or select all to scan
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                3
              </span>
              <div>
                <p className="font-semibold text-gray-900">
                  Click "Scan Selected Assets"
                </p>
                <p className="text-sm text-gray-700">
                  Initiate the scan process
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                4
              </span>
              <div>
                <p className="font-semibold text-gray-900">
                  Review Scan Results
                </p>
                <p className="text-sm text-gray-700">
                  Examine detected vulnerabilities and priorities
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-blue-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                5
              </span>
              <div>
                <p className="font-semibold text-gray-900">
                  Take Action & Remediate
                </p>
                <p className="text-sm text-gray-700">
                  Update, patch, or remove vulnerable components
                </p>
              </div>
            </li>
          </ol>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-300">
          <h4 className="font-semibold text-purple-900 mb-2">📊 View Scan Metrics</h4>
          <p className="text-sm text-gray-700">
            After scanning, check the "Scanned vs Unscanned" metrics in your dashboard to track scan coverage
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Viewing Dependencies in Detail",
    subtitle: "Interactive Graph Features",
    content: (
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">
            🔍 Hover for Details
          </h4>
          <p className="text-sm text-gray-700">
            Hover over nodes to see detailed information about each technology
            or dependency
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-2">
            🎯 Click to Highlight
          </h4>
          <p className="text-sm text-gray-700">
            Click on a node to highlight its direct relationships and impact
            across the network
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-900 mb-2">
            ↔️ Pan & Zoom
          </h4>
          <p className="text-sm text-gray-700">
            Use mouse wheel to zoom and drag to pan around the graph for better
            navigation
          </p>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h4 className="font-semibold text-orange-900 mb-2">
            📍 Blast Radius
          </h4>
          <p className="text-sm text-gray-700">
            Identify cascading impacts when a technology is removed or updated
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Best Practices",
    subtitle: "Tips for Maximum Value",
    content: (
      <div className="space-y-4">
        <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
          <h4 className="font-semibold text-gray-900 mb-1">
            Scan Regularly
          </h4>
          <p className="text-sm text-gray-700">
            Run weekly or monthly scans to catch newly published CVEs before they
            become critical issues
          </p>
        </div>

        <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
          <h4 className="font-semibold text-gray-900 mb-1">
            Rescan After Updates
          </h4>
          <p className="text-sm text-gray-700">
            Always rescan assets immediately after applying patches or upgrading
            technologies to verify fixes
          </p>
        </div>

        <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded">
          <h4 className="font-semibold text-gray-900 mb-1">
            Prioritize Remediation
          </h4>
          <p className="text-sm text-gray-700">
            Focus on critical and high-severity vulnerabilities first, then work
            down the priority list
          </p>
        </div>

        <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded">
          <h4 className="font-semibold text-gray-900 mb-1">
            Export & Share Reports
          </h4>
          <p className="text-sm text-gray-700">
            Use CSV, JSON, or PDF exports to share findings with security teams
            and stakeholders
          </p>
        </div>

        <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
          <h4 className="font-semibold text-gray-900 mb-1">
            Keep Inventory Current
          </h4>
          <p className="text-sm text-gray-700">
            Maintain accurate asset and tech stack records to ensure scans capture
            everything you need to monitor
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Summary & Next Steps",
    subtitle: "What You've Learned",
    content: (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Key Takeaways</h3>
          <ul className="space-y-2 text-sm">
            <li>✓ Centralize and control your tech stack inventory</li>
            <li>✓ Scan regularly to identify and mitigate security risks</li>
            <li>✓ Rescan after updates to verify vulnerability fixes</li>
            <li>✓ Visualize complex dependency relationships</li>
            <li>✓ Make data-driven technology decisions</li>
            <li>✓ Improve organizational compliance and security</li>
          </ul>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg border-2 border-gray-300">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Ready to Start?</h3>
          <p className="text-gray-700 mb-4">
            Head to the Asset Inventory section and begin exploring your tech
            stack data today!
          </p>
          <div className="bg-white p-3 rounded border border-gray-300">
            <p className="text-sm text-gray-600">
              💡 <strong>Tip:</strong> Start with the interactive dependency
              graph to visualize your most critical technologies
            </p>
          </div>
        </div>
      </div>
    ),
  },
];

export default function TechStackSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const slide = slides[currentSlide];
  const progress = ((currentSlide + 1) / slides.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Tech Stack Feature Overview
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Slide Container */}
          <div className="min-h-96 p-12 bg-gradient-to-br from-slate-50 to-white">
            {/* Slide Title */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-xl text-gray-600">{slide.subtitle}</p>
              )}
            </div>

            {/* Slide Content */}
            <div className="mb-8">{slide.content}</div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Navigation */}
          <div className="bg-gray-50 px-12 py-6 flex items-center justify-between">
            <Button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                Slide {currentSlide + 1} of {slides.length}
              </span>
            </div>

            <Button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Slide Thumbnails */}
          <div className="bg-white border-t border-gray-200 px-12 py-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Navigate to Slide
            </p>
            <div className="flex gap-2 flex-wrap">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-12 h-12 rounded-lg font-semibold text-sm transition-all ${
                    currentSlide === index
                      ? "bg-blue-600 text-white shadow-lg scale-110"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">💡 Tip:</span> Use arrow keys or
              buttons to navigate
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">👆 Tip:</span> Click on slide
              numbers to jump ahead
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">📊 Tip:</span> All features are
              available in the Dashboard
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
