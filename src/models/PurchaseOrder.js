import mongoose from "mongoose";

const PurchaseOrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  productName: { type: String, required: true },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 },
  receivedQuantity: { type: Number, default: 0, min: 0 },
});

const PurchaseOrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    orderNumber: { type: String, required: true, unique: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    items: [PurchaseOrderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "ordered", "received", "cancelled"],
      default: "pending",
    },
    orderDate: { type: Date, default: Date.now },
    expectedDeliveryDate: { type: Date },
    receivedDate: { type: Date },
    notes: { type: String, trim: true },
    createdBy: { type: String, trim: true },
  },
  { timestamps: true }
);

export const PurchaseOrder =
  mongoose.models.PurchaseOrder ||
  mongoose.model("PurchaseOrder", PurchaseOrderSchema);
