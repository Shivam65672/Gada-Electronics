import { connectDB } from "@/lib/mongodb";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { Product } from "@/models/Product";
import { Sale } from "@/models/Sale";
import { PurchaseOrder } from "@/models/PurchaseOrder";
import { StockMovement } from "@/models/StockMovement";
import { getStockSummary } from "@/lib/inventory-service";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const userId = await requireAuth();

    const stockSummary = await getStockSummary(userId);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [monthlySales, lastMonthSales, recentSales, recentMovements] =
      await Promise.all([
        Sale.aggregate([
          { $match: { userId, saleDate: { $gte: startOfMonth } } },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$total" },
              totalSales: { $sum: 1 },
              totalItems: { $sum: { $size: "$items" } },
            },
          },
        ]),
        Sale.aggregate([
          {
            $match: {
              userId,
              saleDate: { $gte: startOfLastMonth, $lte: endOfLastMonth },
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$total" },
              totalSales: { $sum: 1 },
            },
          },
        ]),
        Sale.find({ userId }).sort({ saleDate: -1 }).limit(5),
        StockMovement.find({ userId })
          .populate("product", "name sku")
          .sort({ createdAt: -1 })
          .limit(10),
      ]);

    const salesByDay = await Sale.aggregate([
      { $match: { userId, saleDate: { $gte: startOfMonth } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$saleDate" } },
          revenue: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const topProducts = await Sale.aggregate([
      { $match: { userId, saleDate: { $gte: startOfMonth } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          productName: { $first: "$items.productName" },
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.totalPrice" },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
    ]);

    const categoryBreakdown = await Product.aggregate([
      { $match: { userId, isActive: true } },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      {
        $group: {
          _id: "$categoryInfo.name",
          productCount: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalValue: { $sum: { $multiply: ["$quantity", "$purchasePrice"] } },
        },
      },
      { $sort: { totalValue: -1 } },
    ]);

    const pendingOrders = await PurchaseOrder.countDocuments({
      userId,
      status: { $in: ["pending", "ordered"] },
    });

    const lowStockProducts = await Product.find({
      userId,
      isActive: true,
      $expr: { $lte: ["$quantity", "$lowStockThreshold"] },
    })
      .populate("category", "name")
      .limit(10);

    return apiSuccess({
      stockSummary,
      monthlySales: monthlySales[0] || {
        totalRevenue: 0,
        totalSales: 0,
        totalItems: 0,
      },
      lastMonthSales: lastMonthSales[0] || { totalRevenue: 0, totalSales: 0 },
      salesByDay,
      topProducts,
      categoryBreakdown,
      pendingOrders,
      lowStockProducts,
      recentSales,
      recentMovements,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return handleApiError(error);
  }
}
