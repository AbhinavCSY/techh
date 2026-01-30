import { useState } from "react";
import { ChevronLeft, ChevronRight, Home, X, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Slide {
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  notes?: string;
}

// Feature details with GIF references
const featureDetails = {
  inventory: {
    title: "Complete Inventory",
    description: "Unified view of all technologies, frameworks, and services running on every asset",
    details: "Automatically discover and catalog every technology component across your entire infrastructure. Get a complete picture of software versions, frameworks, libraries, and services in one centralized dashboard.",
    gif: "https://via.placeholder.com/400x300/e3f2fd/1976d2?text=Complete+Inventory+Management"
  },
  vulnerability: {
    title: "Vulnerability Detection",
    description: "Identify CVEs, EOL versions, and security misconfigurations automatically",
    details: "Scan your tech stack against known vulnerability databases. Automatically identify outdated components, end-of-life versions, and security misconfigurations with real-time alerts and severity ratings.",
    gif: "https://via.placeholder.com/400x300/ffebee/d32f2f?text=Vulnerability+Detection"
  },
  riskScoring: {
    title: "Risk Scoring",
    description: "Enterprise and domain-level scoring with actionable prioritization",
    details: "Get actionable risk scores at the enterprise level and per domain/team. Automatically prioritize which vulnerabilities and components to address first based on impact and criticality.",
    gif: "https://via.placeholder.com/400x300/f3e5f5/7b1fa2?text=Risk+Scoring+System"
  },
  dependency: {
    title: "Dependency Mapping",
    description: "Visualize technology relationships and blast radius impact analysis",
    details: "See how technologies are interconnected and understand the cascading impact when removing or updating components. Interactive graphs show dependency chains and affected services.",
    gif: "https://via.placeholder.com/400x300/f3e5f5/6a1b9a?text=Dependency+Mapping"
  },
  compliance: {
    title: "Compliance Tracking",
    description: "Export dashboards and PDF reports for SOC 2, ISO, HIPAA, and PCI-DSS compliance",
    details: "Generate compliance-ready reports with executive summaries, risk metrics, and remediation status. Export to PDF or dashboard format for board presentations and audit requirements.",
    gif: "https://via.placeholder.com/400x300/fff3e0/e65100?text=Compliance+Reporting"
  },
  monitoring: {
    title: "Continuous Monitoring",
    description: "Track technology changes, scan regularly, and rescan after updates",
    details: "Set up automated, continuous scanning of your infrastructure. Schedule regular scans and automatic rescans after updates to stay ahead of newly discovered vulnerabilities.",
    gif: "https://via.placeholder.com/400x300/e0f2f1/00695c?text=Continuous+Monitoring"
  }
};

const slides: Slide[] = [
  {
    title: "Tech Stack Management",
    subtitle: "What It Does & Why It Matters",
    content: (
      <div className="space-y-4">
        {/* Problem & Solution */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg border-2 border-blue-800">
          <h4 className="text-lg font-bold mb-3">🎯 The Challenge</h4>
          <p className="mb-3">
            Organizations struggle to answer: <span className="italic font-semibold">"What's running on our assets, is it safe, and what should we do about it?"</span>
          </p>
          <p className="text-sm">
            Without unified visibility into tech stacks, you can't identify outdated technologies, correlate CVEs with components, or prioritize remediation effectively.
          </p>
        </div>

        {/* Business Value */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 border-2 border-green-300 p-4 rounded-lg">
            <h5 className="font-bold text-green-900 mb-2">📊 Business Value</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ Reduce breach risk by 90%+</li>
              <li>✓ Meet compliance (SOC 2, ISO, HIPAA, PCI-DSS)</li>
              <li>✓ Quantifiable security ROI</li>
              <li>✓ Executive dashboards & PDF reports</li>
            </ul>
          </div>

          <div className="bg-purple-50 border-2 border-purple-300 p-4 rounded-lg">
            <h5 className="font-bold text-purple-900 mb-2">👨‍💻 DevSecOps Benefits</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ See complete tech stack per asset</li>
              <li>✓ Identify EOL & vulnerable tech</li>
              <li>✓ Correlate tech with CVEs</li>
              <li>✓ Track changes over time</li>
            </ul>
          </div>
        </div>

        {/* CISO & Enterprise Features */}
        <div className="bg-slate-900 text-white p-4 rounded-lg border-2 border-slate-700">
          <h5 className="font-bold mb-2">🏢 Enterprise Capabilities</h5>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800 p-2 rounded text-center">
              <p className="text-xs font-semibold">Overall Risk Scoring</p>
              <p className="text-xs mt-1">Enterprise-wide assessment</p>
            </div>
            <div className="bg-slate-800 p-2 rounded text-center">
              <p className="text-xs font-semibold">Domain-Level Scoring</p>
              <p className="text-xs mt-1">Granular by team/dept</p>
            </div>
            <div className="bg-slate-800 p-2 rounded text-center">
              <p className="text-xs font-semibold">Highest Accuracy</p>
              <p className="text-xs mt-1">Zero false positives</p>
            </div>
          </div>
        </div>

        {/* Key Outcome */}
        <div className="bg-indigo-50 border-2 border-indigo-400 p-4 rounded-lg">
          <h5 className="font-bold text-indigo-900 mb-2">🚀 The Outcome</h5>
          <p className="text-sm text-gray-700">
            A unified view of all technologies running on your assets with automated risk scoring, compliance readiness, and actionable remediation guidance.
          </p>
        </div>
      </div>
    ),
  },
  {
    title: "Key Features & Capabilities",
    subtitle: "What You Get - Click to Expand",
    content: (
      <FeatureCardsSlide />
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
            Tech Stack Management Overview
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
              <span className="font-semibold">Slide 1:</span> Understand what the solution does and its business impact
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Slide 2:</span> See all the key features and capabilities
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">💡 Tip:</span> Use navigation buttons or click slide numbers
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
