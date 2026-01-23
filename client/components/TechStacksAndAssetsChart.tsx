import { useState } from "react";
import { techStackDatabase, assetDatabase } from "@/data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Maximize2, X } from "lucide-react";

interface ChartDataPoint {
  date: string;
  techStacks: number;
  assetsScanned: number;
}

interface TechStacksAndAssetsChartProps {
  compact?: boolean;
}

export function TechStacksAndAssetsChart({
  compact = false,
}: TechStacksAndAssetsChartProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Generate historical data for the last 7 days
  const generateChartData = (): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Generate realistic data with slight variations
      const baseStacks = Math.max(
        15,
        techStackDatabase.length - Math.floor(Math.random() * 5)
      );
      const baseAssets = Math.max(
        12,
        assetDatabase.filter((a) => a.isScanned).length -
          Math.floor(Math.random() * 4)
      );

      // Format date as dd/mm/yyyy
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      data.push({
        date: `${day}/${month}/${year}`,
        techStacks: baseStacks,
        assetsScanned: baseAssets,
      });
    }

    return data;
  };

  const chartData = generateChartData();

  // Calculate current values
  const currentTechStacks = techStackDatabase.length;
  const currentAssetsScanned = assetDatabase.filter((a) => a.isScanned).length;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-xs">
          <p className="font-semibold text-gray-900 mb-2">📅 {label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-gray-700">
                {entry.name}: <span className="font-bold">{entry.value}</span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const ChartContent = ({ fullSize = false }: { fullSize?: boolean }) => (
    <>
      {fullSize && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 text-lg">📦 Stacks Summary</h3>
          <p className="text-xs text-gray-600 mt-1">
            7-day historical overview with daily metrics
          </p>
        </div>
      )}

      <ResponsiveContainer
        width="100%"
        height={fullSize ? 300 : 60}
      >
        <BarChart
          data={chartData}
          margin={
            fullSize
              ? { top: 10, right: 30, left: 0, bottom: 40 }
              : { top: 0, right: 2, left: 0, bottom: 0 }
          }
        >
          {fullSize && (
            <>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={{ stroke: "#e5e7eb" }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={{ stroke: "#e5e7eb" }}
                label={{ value: "Count", angle: -90, position: "insideLeft", offset: 10 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.05)" }} />
            </>
          )}
          {fullSize && (
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              content={(props) => {
                const { payload } = props;
                return (
                  <div className="flex items-center justify-center gap-8 text-sm mt-4">
                    {payload?.map((entry) => (
                      <div key={entry.dataKey} className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: entry.color }}
                        ></div>
                        <span className="text-gray-700 font-medium">
                          {entry.dataKey === "techStacks"
                            ? "Tech Stacks"
                            : "Assets Scanned"}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
          )}
          <Bar
            dataKey="techStacks"
            fill="#3b82f6"
            name="Tech Stacks"
            radius={fullSize ? [4, 4, 0, 0] : [1, 1, 0, 0]}
            maxBarSize={fullSize ? 16 : 8}
          />
          <Bar
            dataKey="assetsScanned"
            fill="#10b981"
            name="Assets Scanned"
            radius={fullSize ? [4, 4, 0, 0] : [1, 1, 0, 0]}
            maxBarSize={fullSize ? 16 : 8}
          />
        </BarChart>
      </ResponsiveContainer>
    </>
  );

  if (compact) {
    return (
      <>
        <div className="bg-white rounded-lg border border-gray-200 p-1.5 flex flex-col h-20 overflow-hidden">
          <div className="flex items-center justify-between mb-1 flex-shrink-0">
            <p className="text-xs font-semibold text-gray-700">📦 Stacks Summary</p>
            <button
              onClick={() => setIsExpanded(true)}
              className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
              title="Expand"
            >
              <Maximize2 className="w-3.5 h-3.5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChartContent fullSize={false} />
          </div>
        </div>

        {/* Expanded Modal */}
        {isExpanded && (
          <div
            className="fixed inset-0 z-50 overflow-hidden"
            onClick={() => setIsExpanded(false)}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <div
              className="absolute right-0 top-0 bottom-0 w-full max-w-4xl bg-white shadow-xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                <h2 className="text-lg font-semibold text-gray-900">
                  📦 Stacks Summary
                </h2>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6">
                <ChartContent fullSize={true} />

                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded bg-blue-500"></div>
                      <p className="text-xs text-gray-600 font-semibold">
                        Tech Stacks
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">
                      {currentTechStacks}
                    </p>
                    <p className="text-xs text-blue-700 mt-2">
                      Currently tracking
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded bg-green-500"></div>
                      <p className="text-xs text-gray-600 font-semibold">
                        Assets Scanned
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-green-900">
                      {currentAssetsScanned}
                    </p>
                    <p className="text-xs text-green-700 mt-2">
                      {Math.round(
                        (currentAssetsScanned / assetDatabase.length) * 100
                      )}% of total
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <ChartContent fullSize={true} />

      {/* Legend and Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <p className="text-xs text-gray-600 font-semibold">Tech Stacks</p>
          </div>
          <p className="text-2xl font-bold text-blue-900">
            {currentTechStacks}
          </p>
          <p className="text-xs text-blue-700 mt-2">Currently tracking</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <p className="text-xs text-gray-600 font-semibold">
              Assets Scanned
            </p>
          </div>
          <p className="text-2xl font-bold text-green-900">
            {currentAssetsScanned}
          </p>
          <p className="text-xs text-green-700 mt-2">
            {Math.round(
              (currentAssetsScanned / assetDatabase.length) * 100
            )}% of total
          </p>
        </div>
      </div>
    </div>
  );
}
