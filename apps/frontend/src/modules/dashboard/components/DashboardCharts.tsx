"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";

import type { DashboardPriorityChartItem, DashboardStatusChartItem } from "../dashboard.utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const statusChartConfig = {
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-pending))",
  },
  inProgress: {
    label: "In Progress",
    color: "hsl(var(--chart-in-progress))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-completed))",
  },
} satisfies ChartConfig;

const priorityChartConfig = {
  low: {
    label: "Low",
    color: "hsl(var(--chart-low))",
  },
  medium: {
    label: "Medium",
    color: "hsl(var(--chart-medium))",
  },
  high: {
    label: "High",
    color: "hsl(var(--chart-high))",
  },
} satisfies ChartConfig;

interface DashboardChartsProps {
  statusData: DashboardStatusChartItem[];
  priorityData: DashboardPriorityChartItem[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ statusData, priorityData }) => {
  const hasStatusData = statusData.some((item) => item.count > 0);
  const hasPriorityData = priorityData.some((item) => item.count > 0);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="rounded-2xl border-slate-100 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-slate-900">Task Distribution</CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          {hasStatusData ? (
            <ChartContainer
              config={statusChartConfig}
              className="mx-auto aspect-square max-h-[280px]"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={60}
                  outerRadius={100}
                  strokeWidth={0}
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.status} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="status" />} />
              </PieChart>
            </ChartContainer>
          ) : (
            <p className="py-16 text-center text-sm text-slate-500">No tasks to display yet.</p>
          )}
        </CardContent>
      </Card>
      <Card className="rounded-2xl border-slate-100 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold text-slate-900">
            Task Priority Levels
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          {hasPriorityData ? (
            <ChartContainer config={priorityChartConfig} className="aspect-auto h-[280px] w-full">
              <BarChart data={priorityData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-slate-100"
                />
                <XAxis
                  dataKey="priority"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value: string) =>
                    priorityChartConfig[value as keyof typeof priorityChartConfig]?.label ?? value
                  }
                  className="text-xs text-slate-500"
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {priorityData.map((entry) => (
                    <Cell key={entry.priority} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          ) : (
            <p className="py-16 text-center text-sm text-slate-500">No tasks to display yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
