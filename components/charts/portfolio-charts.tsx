"use client";

import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface PerformanceChartProps {
  data: Array<{
    date: string;
    value: number;
  }>;
  title?: string;
}

/**
 * Portfolio performance chart component
 * Shows portfolio value over time as an area chart
 */
export function PerformanceChart({ data, title = "Portfolio Performance" }: PerformanceChartProps) {
  return (
    <div className="card">
      {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#cbd5e1" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorValue)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface AllocationChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  title?: string;
}

/**
 * Portfolio allocation pie chart
 * Shows asset allocation breakdown
 */
export function AllocationChart({ data, title = "Portfolio Allocation" }: AllocationChartProps) {
  const COLORS = ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444", "#ec4899", "#6366f1"];

  return (
    <div className="card">
      {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => `${entry.name}: ${entry.value.toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#cbd5e1" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface GainLossChartProps {
  data: Array<{
    name: string;
    gain: number;
    loss: number;
  }>;
  title?: string;
}

/**
 * Gain/Loss comparison chart
 * Shows gains vs losses for assets
 */
export function GainLossChart({ data, title = "Gains vs Losses" }: GainLossChartProps) {
  return (
    <div className="card">
      {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#cbd5e1" }}
          />
          <Legend />
          <Line type="monotone" dataKey="gain" stroke="#10b981" strokeWidth={2} name="Gains" />
          <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={2} name="Losses" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PerformanceChart;
