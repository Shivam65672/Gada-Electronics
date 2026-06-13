import { connectDB } from "@/lib/mongodb";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { getStockSummary } from "@/lib/inventory-service";
import { LowStockAlert } from "@/models/LowStockAlert";
import { Sale } from "@/models/Sale";
import { PurchaseOrder } from "@/models/PurchaseOrder";

export async function GET() {
  try {
    await connectDB();

    const [stockSummary, unreadAlerts, recentSales, pendingOrders] =
      await Promise.all([
        getStockSummary(),
        LowStockAlert.countDocuments({ isResolved: false, isRead: false }),
        Sale.find().sort({ saleDate: -1 }).limit(5),
        PurchaseOrder.find({ status: { $in: ["pending", "ordered"] } })
          .populate("supplier", "name")
          .limit(5),
      ]);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyRevenue = await Sale.aggregate([
      { $match: { saleDate: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    return apiSuccess({
      stockSummary,
      unreadAlerts,
      monthlyRevenue: monthlyRevenue[0]?.total || 0,
      recentSales,
      pendingOrders,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
