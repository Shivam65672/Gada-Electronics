import { connectDB } from "@/lib/mongodb";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { Product } from "@/models/Product";
import { productSchema } from "@/lib/validations";

export async function GET(_request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id)
      .populate("category", "name slug")
      .populate("supplier", "name email phone");
    if (!product) return apiError("Product not found", 404);
    return apiSuccess(product);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message);
    }

    const { quantity: _quantity, ...updateData } = parsed.data;

    const product = await Product.findByIdAndUpdate(
      id,
      { ...updateData, sku: updateData.sku.toUpperCase() },
      { new: true, runValidators: true }
    )
      .populate("category", "name slug")
      .populate("supplier", "name email phone");

    if (!product) return apiError("Product not found", 404);
    return apiSuccess(product);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    if (!product) return apiError("Product not found", 404);
    return apiSuccess({ message: "Product deactivated" });
  } catch (error) {
    return handleApiError(error);
  }
}
