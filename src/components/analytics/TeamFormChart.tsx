"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartPoint = {
  matchId: number;
  opponent: string;
  result: "W" | "D" | "L";
  rollingPointsPerGame: number;
};

export const TeamFormChart = ({ data }: { data: ChartPoint[] }) => {
  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-zinc-500">
        Not enough data available
      </div>
    );
  }

  return (
    <div className="h-72 max-w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis
            dataKey="opponent"
            tick={{
              fill: "#a1a1aa",
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={[0, 3]}
            ticks={[0, 1, 2, 3]}
            tick={{
              fill: "#a1a1aa",
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              background: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: "8px",
            }}
            labelStyle={{
              color: "#ffffff",
            }}
            formatter={(value) => [`${Number(value).toFixed(2)} PPG`, "Form"]}
          />

          <Line
            type="monotone"
            dataKey="rollingPointsPerGame"
            stroke="currentColor"
            strokeWidth={3}
            dot={{
              r: 4,
              fill: "currentColor",
            }}
            activeDot={{
              r: 6,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
