"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { fetchApi } from "@/lib/fetch-client";
import { formatDateTime } from "@/lib/utils";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");

  const loadData = () => {
    const resolved = filter === "resolved" ? "true" : "false";
    fetchApi(`/api/alerts?resolved=${resolved}`)
      .then((data) => {
        setAlerts(data.alerts);
        setUnreadCount(data.unreadCount);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [filter]);

  const markAsRead = async (ids) => {
    await fetchApi("/api/alerts", {
      method: "PATCH",
      body: JSON.stringify({ alertIds: ids, action: "read" }),
    });
    loadData();
  };

  const markAsResolved = async (ids) => {
    await fetchApi("/api/alerts", {
      method: "PATCH",
      body: JSON.stringify({ alertIds: ids, action: "resolve" }),
    });
    loadData();
  };

  const markAllRead = () => {
    const unreadIds = alerts.filter((a) => !a.isRead).map((a) => a._id);
    if (unreadIds.length > 0) markAsRead(unreadIds);
  };

  return (
    <div>
      <PageHeader
        title="Low Stock Alerts"
        description="Products that need restocking"
        action={
          filter === "active" && unreadCount > 0 ? (
            <Button variant="outline" onClick={markAllRead}>
              <CheckCheck className="mr-2 h-4 w-4" /> Mark All Read
            </Button>
          ) : undefined
        }
      />

      <div className="mb-4 flex gap-2">
        <Button
          variant={filter === "active" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("active")}
        >
          Active Alerts
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </Button>
        <Button
          variant={filter === "resolved" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("resolved")}
        >
          Resolved
        </Button>
      </div>

      {loading ? (
        <p className="text-center py-12 text-muted-foreground">Loading alerts...</p>
      ) : alerts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">
              {filter === "active" ? "No active alerts" : "No resolved alerts"}
            </p>
            <p className="text-sm text-muted-foreground">
              {filter === "active"
                ? "All products are above their low stock threshold"
                : "No alerts have been resolved yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card
              key={alert._id}
              className={
                !alert.isRead && !alert.isResolved
                  ? "border-yellow-300 bg-yellow-50/50"
                  : ""
              }
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-full p-2 ${alert.currentQuantity === 0 ? "bg-red-100" : "bg-yellow-100"}`}
                  >
                    <Bell
                      className={`h-5 w-5 ${alert.currentQuantity === 0 ? "text-red-600" : "text-yellow-600"}`}
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{alert.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      SKU: {alert.sku} • Alert triggered{" "}
                      {formatDateTime(alert.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Current / Threshold
                    </p>
                    <p className="text-lg font-bold">
                      <span
                        className={
                          alert.currentQuantity === 0
                            ? "text-red-600"
                            : "text-yellow-600"
                        }
                      >
                        {alert.currentQuantity}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        / {alert.threshold}
                      </span>
                    </p>
                  </div>
                  {filter === "active" && (
                    <div className="flex gap-2">
                      {!alert.isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRead([alert._id])}
                        >
                          Mark Read
                        </Button>
                      )}
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => markAsResolved([alert._id])}
                      >
                        Resolve
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
