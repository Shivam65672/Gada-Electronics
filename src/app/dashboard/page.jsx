"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchApi } from "@/lib/fetch-client";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi("/api/dashboard")
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Failed to load dashboard data.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const { stockSummary, unreadAlerts, monthlyRevenue, recentSales, pendingOrders } =
    data;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your inventory and business performance"
        action={
          <Button
            variant="outline"
            onClick={async () => {
              await fetch("/api/seed", { method: "POST" });
              window.location.reload();
            }}
          >
            Seed Sample Data
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={stockSummary.totalProducts}
          description={`${stockSummary.totalQuantity} units in stock`}
          icon={Package}
        />
        <StatCard
          title="Inventory Value"
          value={formatCurrency(stockSummary.totalValue)}
          description="At purchase price"
          icon={DollarSign}
          variant="success"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(monthlyRevenue)}
          description="This month"
          icon={TrendingUp}
          variant="default"
        />
        <StatCard
          title="Low Stock Alerts"
          value={stockSummary.lowStockCount}
          description={`${unreadAlerts} unread alerts`}
          icon={AlertTriangle}
          variant={stockSummary.lowStockCount > 0 ? "warning" : "default"}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Sales</CardTitle>
            <Link href="/dashboard/sales">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentSales.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sales yet</p>
            ) : (
              <div className="space-y-3">
                {recentSales.map((sale) => (
                  <div
                    key={sale._id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{sale.saleNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {sale.customerName || "Walk-in"} •{" "}
                        {formatDateTime(sale.saleDate)}
                      </p>
                    </div>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(sale.total)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Pending Purchase Orders</CardTitle>
            <Link href="/dashboard/purchase-orders">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {pendingOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending orders</p>
            ) : (
              <div className="space-y-3">
                {pendingOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.supplier?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="warning">{order.status}</Badge>
                      <p className="mt-1 text-sm font-semibold">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {stockSummary.outOfStockCount > 0 && (
        <Card className="mt-6 border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-4 p-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div>
              <p className="font-semibold text-red-800">
                {stockSummary.outOfStockCount} products are out of stock
              </p>
              <p className="text-sm text-red-600">
                Review your inventory and create purchase orders to restock.
              </p>
            </div>
            <Link href="/dashboard/alerts" className="ml-auto">
              <Button variant="destructive" size="sm">
                View Alerts
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
