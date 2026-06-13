"use client";

import { useEffect, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, History } from "lucide-react";
import { PageHeader } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { formatDateTime } from "@/lib/utils";

const typeLabels = {
  stock_in: { label: "Stock In", variant: "success" },
  stock_out: { label: "Stock Out", variant: "destructive" },
  sale: { label: "Sale", variant: "warning" },
  purchase: { label: "Purchase", variant: "success" },
  adjustment: { label: "Adjustment", variant: "default" },
};

export default function StockPage() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [movementType, setMovementType] = useState("stock_in");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    Promise.all([
      fetchApi("/api/products"),
      fetchApi("/api/stock?limit=50"),
    ])
      .then(([prods, movs]) => {
        setProducts(prods);
        setMovements(movs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openDialog = (type) => {
    setMovementType(type);
    setProductId("");
    setQuantity("");
    setReason("");
    setNotes("");
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await fetchApi("/api/stock", {
        method: "POST",
        body: JSON.stringify({
          productId,
          type: movementType,
          quantity: parseInt(quantity),
          reason,
          notes,
        }),
      });
      setDialogOpen(false);
      loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update stock");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Stock Management"
        description="Stock in, stock out, and view movement history"
        action={
          <div className="flex gap-2">
            <Button onClick={() => openDialog("stock_in")} variant="default">
              <ArrowDownToLine className="mr-2 h-4 w-4" /> Stock In
            </Button>
            <Button onClick={() => openDialog("stock_out")} variant="outline">
              <ArrowUpFromLine className="mr-2 h-4 w-4" /> Stock Out
            </Button>
          </div>
        }
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5" /> Recent Stock Movements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Before</TableHead>
                <TableHead>After</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : movements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No stock movements yet
                  </TableCell>
                </TableRow>
              ) : (
                movements.map((mov) => {
                  const typeInfo = typeLabels[mov.type] || {
                    label: mov.type,
                    variant: "default",
                  };
                  return (
                    <TableRow key={mov._id}>
                      <TableCell className="text-xs">
                        {formatDateTime(mov.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{mov.product?.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {mov.product?.sku}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={typeInfo.variant}>{typeInfo.label}</Badge>
                      </TableCell>
                      <TableCell>{mov.quantity}</TableCell>
                      <TableCell>{mov.previousQuantity}</TableCell>
                      <TableCell className="font-semibold">{mov.newQuantity}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {mov.reason || "—"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {movementType === "stock_in" ? "Stock In" : "Stock Out"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Product *</Label>
              <Select value={productId} onValueChange={setProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p._id} value={p._id}>
                      {p.name} ({p.sku}) — Stock: {p.quantity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantity *</Label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. New shipment, Damaged goods"
              />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={saving || !productId || !quantity}
              className="w-full"
            >
              {saving
                ? "Processing..."
                : movementType === "stock_in"
                  ? "Add Stock"
                  : "Remove Stock"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
