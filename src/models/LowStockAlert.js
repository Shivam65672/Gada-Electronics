import mongoose from "mongoose";

const LowStockAlertSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productName: { type: String, required: true },
    sku: { type: String, required: true },
    currentQuantity: { type: Number, required: true },
    threshold: { type: Number, required: true },
    isRead: { type: Boolean, default: false },
    isResolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

LowStockAlertSchema.index({ isResolved: 1, createdAt: -1 });

export const LowStockAlert =
  mongoose.models.LowStockAlert ||
  mongoose.model("LowStockAlert", LowStockAlertSchema);
