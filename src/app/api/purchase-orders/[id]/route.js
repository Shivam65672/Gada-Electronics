import { connectDB } from "@/lib/mongodb";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { PurchaseOrder } from "@/models/PurchaseOrder";
import { updateProductStock } from "@/lib/inventory-service";
import { requireAuth } from "@/lib/auth";

export async function GET(_request, { params }) {
  try {
    await connectDB();
    const userId = await requireAuth();
    const { id } = await params;
    const order = await PurchaseOrder.findOne({ _id: id, userId }).populate(
      "supplier",
      "name email phone address"
    );
    if (!order) return apiError("Purchase order not found", 404);
    return apiSuccess(order);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return handleApiError(error);
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const userId = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    const order = await PurchaseOrder.findOne({ _id: id, userId });
    if (!order) return apiError("Purchase order not found", 404);

    if (status === "received" && order.status !== "received") {
      for (const item of order.items) {
        const qtyToReceive = item.quantity - item.receivedQuantity;
        if (qtyToReceive > 0) {
          await updateProductStock({
            productId: item.product,
            quantity: qtyToReceive,
            type: "purchase",
            reference: order.orderNumber,
            referenceId: order._id,
            performedBy: userId,
            reason: "Purchase order received",
          });
          item.receivedQuantity = item.quantity;
        }
      }
      order.receivedDate = new Date();
    }

    if (status) order.status = status;
    if (notes !== undefined) order.notes = notes;
    await order.save();

    const populated = await PurchaseOrder.findById(order._id).populate(
      "supplier",
      "name email phone"
    );

    return apiSuccess(populated);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return handleApiError(error);
  }
}

export async function DELETE(_request, { params }) {
  try {
    await connectDB();
    const userId = await requireAuth();
    const { id } = await params;
    const order = await PurchaseOrder.findOneAndUpdate(
      { _id: id, userId },
      { status: "cancelled" },
      { new: true }
    );
    if (!order) return apiError("Purchase order not found", 404);
    return apiSuccess({ message: "Purchase order cancelled" });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return handleApiError(error);
  }
}
