"use client";

import { useEffect, useState } from "react";
import { Plus, CheckCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchApi } from "@/lib/fetch-client";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusVariant = {
  pending: "warning",
  ordered: "default",
  received: "success",
  cancelled: "destructive",
};

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([{ product: "", quantity: "1", unitPrice: "" }]);
  const [tax, setTax] = useState("0");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    Promise.all([
      fetchApi("/api/purchase-orders"),
      fetchApi("/api/suppliers"),
      fetchApi("/api/products"),
    ])
      .then(([ords, sups, prods]) => {
        setOrders(ords);
        setSuppliers(sups);
        setProducts(prods);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const addItem = () => {
    setItems([...items, { product: "", quantity: "1", unitPrice: "" }]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    if (field === "product") {
      const prod = products.find((p) => p._id === value);
      if (prod) updated[index].unitPrice = String(prod.purchasePrice);
    }
    setItems(updated);
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      await fetchApi("/api/purchase-orders", {
        method: "POST",
        body: JSON.stringify({
          supplier: supplierId,
          items: items.map((i) => ({
            product: i.product,
            quantity: parseInt(i.quantity),
            unitPrice: parseFloat(i.unitPrice),
          })),
          tax: parseFloat(tax),
          notes,
        }),
      });
      setDialogOpen(false);
      loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setSaving(false);
    }
  };

  const markReceived = async (id) => {
    if (!confirm("Mark this order as received? This will update inventory.")) return;
    await fetchApi(`/api/purchase-orders/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: "received" }),
    });
    loadData();
  };

  return (
    <div>
      <PageHeader
        title="Purchase Orders"
        description="Create and manage purchase orders from suppliers"
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Order
          </Button>
        }
      />

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No purchase orders yet
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-mono font-medium">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>{order.supplier?.name}</TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>{order.items.length} item(s)</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[order.status] || "default"}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {order.status !== "received" && order.status !== "cancelled" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markReceived(order._id)}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" /> Receive
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Supplier *</Label>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Order Items</Label>
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-3 gap-2">
                  <Select
                    value={item.product}
                    onValueChange={(v) => updateItem(index, "product", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p._id} value={p._id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Unit Price"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addItem}>
                + Add Item
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tax (₹)</Label>
                <Input
                  type="number"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <Button
              onClick={handleCreate}
              disabled={saving || !supplierId}
              className="w-full"
            >
              {saving ? "Creating..." : "Create Purchase Order"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
