import { connectDB } from "@/lib/mongodb";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { StockMovement } from "@/models/StockMovement";
import { stockMovementSchema } from "@/lib/validations";
import { updateProductStock } from "@/lib/inventory-service";
import { requireAuth } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const filter = {};
    if (productId) filter.product = productId;
    if (type) filter.type = type;

    const movements = await StockMovement.find(filter)
      .populate("product", "name sku")
      .sort({ createdAt: -1 })
      .limit(limit);

    return apiSuccess(movements);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const userId = await requireAuth();
    const body = await request.json();
    const parsed = stockMovementSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message);
    }

    const { productId, type, quantity, reason, notes } = parsed.data;

    const product = await updateProductStock({
      productId,
      quantity: type === "adjustment" ? quantity : quantity,
      type,
      reason,
      notes,
      performedBy: userId,
    });

    return apiSuccess(product, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return handleApiError(error);
  }
}
