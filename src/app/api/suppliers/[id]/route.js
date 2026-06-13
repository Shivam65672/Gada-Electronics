import { connectDB } from "@/lib/mongodb";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { Supplier } from "@/models/Supplier";
import { supplierSchema } from "@/lib/validations";

export async function GET(_request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const supplier = await Supplier.findById(id);
    if (!supplier) return apiError("Supplier not found", 404);
    return apiSuccess(supplier);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const parsed = supplierSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message);
    }

    const supplier = await Supplier.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    });

    if (!supplier) return apiError("Supplier not found", 404);
    return apiSuccess(supplier);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const supplier = await Supplier.findByIdAndDelete(id);
    if (!supplier) return apiError("Supplier not found", 404);
    return apiSuccess({ message: "Supplier deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
