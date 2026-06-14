"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Card, CardContent } from "@/components/ui/card";
import { fetchApi } from "@/lib/fetch-client";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [items, setItems] = useState([{ product: "", quantity: "1" }]);
  const [discount, setDiscount] = useState("0");
  const [tax, setTax] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const loadData = () => {
    Promise.all([fetchApi("/api/sales"), fetchApi("/api/products")])
      .then(([s, p]) => {
        setSales(s);
        setProducts(p);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      const prod = products.find((p) => p._id === item.product);
      if (!prod) return sum;
      return sum + prod.sellingPrice * (parseInt(item.quantity) || 0);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal - (parseFloat(discount) || 0) + (parseFloat(tax) || 0);

  const addItem = () => setItems([...items, { product: "", quantity: "1" }]);

  const removeItem = (index) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      await fetchApi("/api/sales", {
        method: "POST",
        body: JSON.stringify({
          items: items.map((i) => ({
            product: i.product,
            quantity: parseInt(i.quantity),
          })),
          discount: parseFloat(discount),
          tax: parseFloat(tax),
          paymentMethod,
          customerName,
          customerPhone,
        }),
      });
      setDialogOpen(false);
      setItems([{ product: "", quantity: "1" }]);
      setDiscount("0");
      setTax("0");
      setCustomerName("");
      setCustomerPhone("");
      loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create sale");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Sales"
        description="Record sales and track revenue"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() =>
                window.open("https://billing-go.vercel.app/", "_blank", "noopener,noreferrer")
              }
            >
              <ExternalLink className="mr-0 h-4 w-4" />
              Want Bill?
            </Button>

            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-0 h-4 w-4" />
              New Sale
            </Button>
          </div>
        }
      />

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sale #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : sales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No sales recorded yet
                </TableCell>
              </TableRow>
            ) : (
              sales.map((sale) => (
                <TableRow key={sale._id}>
                  <TableCell className="font-mono font-medium">
                    {sale.saleNumber}
                  </TableCell>
                  <TableCell>{formatDateTime(sale.saleDate)}</TableCell>
                  <TableCell>{sale.customerName || "Walk-in"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {sale.paymentMethod.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {formatCurrency(sale.total)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedSale(sale);
                        setViewDialogOpen(true);
                      }}
                    >
                      View
                    </Button>
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
            <DialogTitle>New Sale</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Customer Phone</Label>
                <Input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Items *</Label>
              {items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Select
                    value={item.product}
                    onValueChange={(v) => updateItem(index, "product", v)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p._id} value={p._id}>
                          {p.name} — {formatCurrency(p.sellingPrice)} (Stock:{" "}
                          {p.quantity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    className="w-20"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addItem}>
                + Add Item
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Discount (₹)</Label>
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Tax (₹)</Label>
                <Input
                  type="number"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Payment</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardContent className="p-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Discount</span>
                  <span>-{formatCurrency(parseFloat(discount) || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>+{formatCurrency(parseFloat(tax) || 0)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="text-green-600">{formatCurrency(total)}</span>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleCreate}
              disabled={saving || items.every((i) => !i.product)}
              className="w-full"
            >
              {saving ? "Processing..." : "Complete Sale"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Sale Details
            </DialogTitle>
          </DialogHeader>

          {selectedSale && (
            <>
              <p>
                Customer: {selectedSale.customerName}
              </p>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {selectedSale.items.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell>{formatCurrency(item.totalPrice)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 space-y-1 text-right">
                <p>
                  Discount :
                  {formatCurrency(selectedSale.discount)}
                </p>

                <p>
                  Tax :
                  {formatCurrency(selectedSale.tax)}
                </p>

                <h3 className="font-bold text-lg">
                  Grand Total :
                  {formatCurrency(selectedSale.total)}
                </h3>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
