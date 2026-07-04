import { connectDB } from "@/lib/mongodb";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { Supplier } from "@/models/Supplier";
import { Sale } from "@/models/Sale";
import { PurchaseOrder } from "@/models/PurchaseOrder";
import { LowStockAlert } from "@/models/LowStockAlert";
import { StockMovement } from "@/models/StockMovement";
import { requireAuth } from "@/lib/auth";

export async function POST(request) {
  try {
    await connectDB();
    const userId = await requireAuth();

    // Update all records without userId to belong to current user
    const results = await Promise.all([
      Product.updateMany({ userId: { $exists: false } }, { userId }),
      Category.updateMany({ userId: { $exists: false } }, { userId }),
      Supplier.updateMany({ userId: { $exists: false } }, { userId }),
      Sale.updateMany({ userId: { $exists: false } }, { userId }),
      PurchaseOrder.updateMany({ userId: { $exists: false } }, { userId }),
      LowStockAlert.updateMany({ userId: { $exists: false } }, { userId }),
      StockMovement.updateMany({ userId: { $exists: false } }, { userId }),
    ]);

    const summary = {
      products: results[0].modifiedCount,
      categories: results[1].modifiedCount,
      suppliers: results[2].modifiedCount,
      sales: results[3].modifiedCount,
      purchaseOrders: results[4].modifiedCount,
      lowStockAlerts: results[5].modifiedCount,
      stockMovements: results[6].modifiedCount,
      total: results.reduce((sum, r) => sum + r.modifiedCount, 0),
    };

    return apiSuccess({
      message: "Migration completed successfully",
      summary,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return handleApiError(error);
  }
}
