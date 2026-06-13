import { connectDB } from "@/lib/mongodb";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { LowStockAlert } from "@/models/LowStockAlert";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const resolved = searchParams.get("resolved");

    const filter = {};
    if (resolved === "false") {
      filter.isResolved = false;
    } else if (resolved === "true") {
      filter.isResolved = true;
    }

    const alerts = await LowStockAlert.find(filter)
      .populate("product", "name sku quantity lowStockThreshold")
      .sort({ createdAt: -1 });

    const unreadCount = await LowStockAlert.countDocuments({
      isResolved: false,
      isRead: false,
    });

    return apiSuccess({ alerts, unreadCount });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { alertIds, action } = body;

    if (!alertIds || !Array.isArray(alertIds)) {
      return handleApiError(new Error("alertIds array is required"));
    }

    const update = {};
    if (action === "read") update.isRead = true;
    if (action === "resolve") {
      update.isResolved = true;
      update.isRead = true;
    }

    await LowStockAlert.updateMany({ _id: { $in: alertIds } }, update);

    return apiSuccess({ message: "Alerts updated" });
  } catch (error) {
    return handleApiError(error);
  }
}
