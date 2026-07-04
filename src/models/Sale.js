import mongoose from "mongoose";

const SaleItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  productName: { type: String, required: true },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 },
});

const SaleSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    saleNumber: { type: String, required: true, unique: true },
    items: [SaleItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "bank_transfer", "other"],
      default: "cash",
    },
    customerName: { type: String, trim: true },
    customerPhone: { type: String, trim: true },
    customerEmail: { type: String, trim: true, lowercase: true },
    notes: { type: String, trim: true },
    soldBy: { type: String, trim: true },
    saleDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

SaleSchema.index({ saleDate: -1 });

export const Sale =
  mongoose.models.Sale || mongoose.model("Sale", SaleSchema);
