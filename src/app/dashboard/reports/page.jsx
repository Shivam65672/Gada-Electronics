"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PageHeader } from "@/components/layout/sidebar";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchApi } from "@/lib/fetch-client";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, ShoppingBag, Package, TrendingUp } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function ReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/api/reports")
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="text-center py-12 text-muted-foreground">Loading reports...</p>
    );
  }

  if (!data) {
    return (
      <p className="text-center py-12 text-muted-foreground">Failed to load reports</p>
    );
  }

  const revenueChange =
    data.lastMonthSales.totalRevenue > 0
      ? Math.round(
          ((data.monthlySales.totalRevenue - data.lastMonthSales.totalRevenue) /
            data.lastMonthSales.totalRevenue) *
            100
        )
      : 0;

  const salesChartData = data.salesByDay.map((d) => ({
    date: d._id.slice(5),
    revenue: d.revenue,
    sales: d.count,
  }));

  const categoryChartData = data.categoryBreakdown.map((c) => ({
    name: c._id,
    value: c.totalValue,
  }));

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        description="Business insights and performance metrics"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(data.monthlySales.totalRevenue)}
          icon={DollarSign}
          trend={{ value: revenueChange, label: "vs last month" }}
        />
        <StatCard
          title="Total Sales"
          value={data.monthlySales.totalSales}
          description={`${data.monthlySales.totalItems} items sold`}
          icon={ShoppingBag}
        />
        <StatCard
          title="Inventory Value"
          value={formatCurrency(data.stockSummary.totalValue)}
          description={`${data.stockSummary.totalProducts} products`}
          icon={Package}
        />
        <StatCard
          title="Low Stock Items"
          value={data.stockSummary.lowStockCount}
          icon={TrendingUp}
          variant={data.stockSummary.lowStockCount > 0 ? "warning" : "success"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily Revenue (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            {salesChartData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No sales data yet
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis
                    fontSize={12}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inventory by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryChartData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No category data yet
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categoryChartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            {data.topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No sales data yet
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    type="category"
                    dataKey="productName"
                    width={120}
                    fontSize={11}
                  />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar
                    dataKey="totalRevenue"
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Low Stock Products</CardTitle>
          </CardHeader>
          <CardContent>
            {data.lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                All products are well stocked
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Threshold</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.lowStockProducts.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category?.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.quantity === 0 ? "destructive" : "warning"
                          }
                        >
                          {product.quantity}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.lowStockThreshold}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
