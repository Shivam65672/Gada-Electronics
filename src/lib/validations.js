import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  description: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
});

export const supplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required").max(200),
  contactPerson: z.string().max(100).optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  pincode: z.string().max(10).optional(),
  gstNumber: z.string().max(20).optional(),
  notes: z.string().max(1000).optional(),
  isActive: z.boolean().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200),
  sku: z.string().min(1, "SKU is required").max(50),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required").max(100),
  description: z.string().max(2000).optional(),
  purchasePrice: z.number().min(0, "Purchase price must be positive"),
  sellingPrice: z.number().min(0, "Selling price must be positive"),
  quantity: z.number().min(0, "Quantity cannot be negative").optional(),
  supplier: z.string().min(1, "Supplier is required"),
  lowStockThreshold: z.number().min(0).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().optional(),
});

export const stockMovementSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  type: z.enum(["stock_in", "stock_out", "adjustment"]),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  reason: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
});

export const purchaseOrderItemSchema = z.object({
  product: z.string().min(1),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
});

export const purchaseOrderSchema = z.object({
  supplier: z.string().min(1, "Supplier is required"),
  items: z.array(purchaseOrderItemSchema).min(1, "At least one item is required"),
  tax: z.number().min(0).optional(),
  expectedDeliveryDate: z.string().optional(),
  notes: z.string().max(1000).optional(),
  status: z.enum(["pending", "ordered", "received", "cancelled"]).optional(),
});

export const saleItemSchema = z.object({
  product: z.string().min(1),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0).optional(),
});

export const saleSchema = z.object({
  items: z.array(saleItemSchema).min(1, "At least one item is required"),
  discount: z.number().min(0).optional(),
  tax: z.number().min(0).optional(),
  paymentMethod: z.enum(["cash", "card", "upi", "bank_transfer", "other"]).optional(),
  customerName: z.string().max(200).optional(),
  customerPhone: z.string().max(20).optional(),
  customerEmail: z.string().email().optional().or(z.literal("")),
  notes: z.string().max(1000).optional(),
});
