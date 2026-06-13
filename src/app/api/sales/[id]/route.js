import { connectDB } from "@/lib/mongodb";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { Sale } from "@/models/Sale";

export async function GET(_request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const sale = await Sale.findById(id);
    if (!sale) return apiError("Sale not found", 404);
    return apiSuccess(sale);
  } catch (error) {
    return handleApiError(error);
  }
}
