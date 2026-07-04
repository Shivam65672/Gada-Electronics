import { connectDB } from "@/lib/mongodb";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { Product } from "@/models/Product";
import { productSchema } from "@/lib/validations";
import { requireAuth } from "@/lib/auth";

export async function GET(_request, { params }) {
  try {
    await connectDB();
    const userId = await requireAuth();
    const { id } = await params;
    const product = await Product.findOne({ _id: id, userId })
      .populate("category", "name slug")
      .populate("supplier", "name email phone");
    if (!product) return apiError("Product not found", 404);
    return apiSuccess(product);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return handleApiError(error);
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const userId = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message);
    }

    const { quantity: _quantity, ...updateData } = parsed.data;

    const product = await Product.findOneAndUpdate(
      { _id: id, userId },
      { ...updateData, sku: updateData.sku.toUpperCase() },
      { new: true, runValidators: true }
    )
      .populate("category", "name slug")
      .populate("supplier", "name email phone");

    if (!product) return apiError("Product not found", 404);
    return apiSuccess(product);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return handleApiError(error);
  }
}

export async function DELETE(_request, { params }) {
  try {
    await connectDB();
    const userId = await requireAuth();
    const { id } = await params;
    const product = await Product.findOneAndUpdate(
      { _id: id, userId },
      { isActive: false },
      { new: true }
    );
    if (!product) return apiError("Product not found", 404);
    return apiSuccess({ message: "Product deactivated" });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return handleApiError(error);
  }
}
