import { connectDB } from "@/lib/mongodb";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { Supplier } from "@/models/Supplier";
import { supplierSchema } from "@/lib/validations";
import { requireAuth } from "@/lib/auth";

export async function GET(_request, { params }) {
  try {
    await connectDB();
    const userId = await requireAuth();
    const { id } = await params;
    const supplier = await Supplier.findOne({ _id: id, userId });
    if (!supplier) return apiError("Supplier not found", 404);
    return apiSuccess(supplier);
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
    const parsed = supplierSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message);
    }

    const supplier = await Supplier.findOneAndUpdate(
      { _id: id, userId },
      parsed.data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!supplier) return apiError("Supplier not found", 404);
    return apiSuccess(supplier);
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
    const supplier = await Supplier.findOneAndDelete({ _id: id, userId });
    if (!supplier) return apiError("Supplier not found", 404);
    return apiSuccess({ message: "Supplier deleted" });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return handleApiError(error);
  }
}
