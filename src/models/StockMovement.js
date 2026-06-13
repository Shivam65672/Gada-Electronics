import mongoose from "mongoose";

const StockMovementSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    type: {
      type: String,
      enum: ["stock_in", "stock_out", "adjustment", "sale", "purchase"],
      required: true,
    },
    quantity: { type: Number, required: true },
    previousQuantity: { type: Number, required: true },
    newQuantity: { type: Number, required: true },
    reason: { type: String, trim: true },
    reference: { type: String, trim: true },
    referenceId: { type: mongoose.Schema.Types.ObjectId },
    performedBy: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

StockMovementSchema.index({ product: 1, createdAt: -1 });
StockMovementSchema.index({ type: 1, createdAt: -1 });

export const StockMovement =
  mongoose.models.StockMovement ||
  mongoose.model("StockMovement", StockMovementSchema);
