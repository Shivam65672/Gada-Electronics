import { connectDB } from "@/lib/mongodb";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { Sale } from "@/models/Sale";
import { requireAuth } from "@/lib/auth";

export async function GET(_request, { params }) {
  try {
    await connectDB();
    const userId = await requireAuth();
    const { id } = await params;
    const sale = await Sale.findOne({ _id: id, userId });
    if (!sale) return apiError("Sale not found", 404);
    return apiSuccess(sale);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return handleApiError(error);
  }
}
