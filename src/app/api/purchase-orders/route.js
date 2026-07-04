import { connectDB } from "@/lib/mongodb";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { PurchaseOrder } from "@/models/PurchaseOrder";
import { Product } from "@/models/Product";
import { purchaseOrderSchema } from "@/lib/validations";
import { generateOrderNumber } from "@/lib/utils";
import { requireAuth } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();
    const userId = await requireAuth();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const filter = { userId };
    if (status) filter.status = status;

    const orders = await PurchaseOrder.find(filter)
      .populate("supplier", "name email phone")
      .sort({ createdAt: -1 });

    return apiSuccess(orders);
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
    const parsed = purchaseOrderSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message);
    }

    const { supplier, items, tax = 0, expectedDeliveryDate, notes, status } =
      parsed.data;

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return apiError(`Product not found: ${item.product}`);
      }

      const totalPrice = item.quantity * item.unitPrice;
      subtotal += totalPrice;

      orderItems.push({
        product: product._id,
        productName: product.name,
        sku: product.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice,
        receivedQuantity: 0,
      });
    }

    const total = subtotal + tax;

    const order = await PurchaseOrder.create({
      userId,
      orderNumber: generateOrderNumber("PO"),
      supplier,
      items: orderItems,
      subtotal,
      tax,
      total,
      status: status || "pending",
      expectedDeliveryDate: expectedDeliveryDate
        ? new Date(expectedDeliveryDate)
        : undefined,
      notes,
      createdBy: userId,
    });

    const populated = await PurchaseOrder.findById(order._id).populate(
      "supplier",
      "name email phone"
    );

    return apiSuccess(populated, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return handleApiError(error);
  }
}
