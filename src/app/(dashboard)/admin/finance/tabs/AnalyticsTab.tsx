"use client";
import useAnalytics from "@/hooks/useAnalytics";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AnalyticsTab() {
  const { analyticsData } = useAnalytics();

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">📊 Company Growth — Expense vs Revenue</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={analyticsData.growthHistory}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Expense" fill="#f87171" />
          <Bar dataKey="Revenue" fill="#4ade80" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
