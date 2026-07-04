import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    slug: { type: String, required: true, lowercase: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
