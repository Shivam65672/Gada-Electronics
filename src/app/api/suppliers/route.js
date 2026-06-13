import { connectDB } from "@/lib/mongodb";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { Supplier } from "@/models/Supplier";
import { supplierSchema } from "@/lib/validations";

export async function GET() {
  try {
    await connectDB();
    const suppliers = await Supplier.find().sort({ name: 1 });
    return apiSuccess(suppliers);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = supplierSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message);
    }

    const supplier = await Supplier.create(parsed.data);
    return apiSuccess(supplier, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
