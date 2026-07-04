import { connectDB } from "@/lib/mongodb";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { Supplier } from "@/models/Supplier";
import { supplierSchema } from "@/lib/validations";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const userId = await requireAuth();
    const suppliers = await Supplier.find({ userId }).sort({ name: 1 });
    return apiSuccess(suppliers);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return handleApiError(error);
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const userId = await requireAuth();
    const body = await request.json();
    const parsed = supplierSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message);
    }

    const supplier = await Supplier.create({ ...parsed.data, userId });
    return apiSuccess(supplier, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return handleApiError(error);
  }
}
