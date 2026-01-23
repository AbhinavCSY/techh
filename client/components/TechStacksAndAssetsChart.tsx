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
  // Generate historical data for the last 7 days
  const generateChartData = (): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Generate realistic data with slight variations
      const baseStacks = Math.max(15, techStackDatabase.length - Math.floor(Math.random() * 5));
      const baseAssets = Math.max(
        12,
        assetDatabase.filter((a) => a.isScanned).length - Math.floor(Math.random() * 4)
      );

      data.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
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

  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-1.5 h-20 flex items-center">
        <div className="flex-1 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
            >
              <Bar
                dataKey="techStacks"
                fill="#3b82f6"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="assetsScanned"
                fill="#10b981"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col items-center justify-center ml-2 text-xs">
          <div className="flex items-center gap-1 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-gray-700">{currentTechStacks}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-gray-700">{currentAssetsScanned}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">
            Tech Stacks & Assets Trend
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            7-day historical overview
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <div>
              <p className="text-xs text-gray-600">Tech Stacks</p>
              <p className="font-bold text-lg text-gray-900">
                {currentTechStacks}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <div>
              <p className="text-xs text-gray-600">Assets Scanned</p>
              <p className="font-bold text-lg text-gray-900">
                {currentAssetsScanned}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "12px",
            }}
            formatter={(value) => [value, ""]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            formatter={() => ""}
            content={(props) => {
              const { payload } = props;
              return (
                <div className="flex items-center justify-center gap-6 text-sm">
                  {payload?.map((entry) => (
                    <div key={entry.dataKey} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="text-gray-700">
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
          <Bar
            dataKey="techStacks"
            fill="#3b82f6"
            name="Tech Stacks"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="assetsScanned"
            fill="#10b981"
            name="Assets Scanned"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-gray-600 font-medium mb-1">
            Total Tech Stacks
          </p>
          <p className="text-2xl font-bold text-blue-900">
            {currentTechStacks}
          </p>
          <p className="text-xs text-blue-700 mt-2">Currently tracking</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs text-gray-600 font-medium mb-1">
            Assets Scanned
          </p>
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
