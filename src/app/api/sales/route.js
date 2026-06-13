import { connectDB } from "@/lib/mongodb";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { Sale } from "@/models/Sale";
import { Product } from "@/models/Product";
import { saleSchema } from "@/lib/validations";
import { generateOrderNumber } from "@/lib/utils";
import { updateProductStock } from "@/lib/inventory-service";
import { requireAuth } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const filter = {};
    if (startDate || endDate) {
      filter.saleDate = {};
      if (startDate) {
        filter.saleDate.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.saleDate.$lte = new Date(endDate);
      }
    }

    const sales = await Sale.find(filter)
      .populate("items.product", "name sku sellingPrice")
      .sort({ saleDate: -1 })
      .limit(limit);

    return apiSuccess(sales);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const userId = await requireAuth();
    const body = await request.json();
    const parsed = saleSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message);
    }

    const {
      items,
      discount = 0,
      tax = 0,
      paymentMethod = "cash",
      customerName,
      customerPhone,
      customerEmail,
      notes,
    } = parsed.data;

    const saleItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return apiError(`Product not found: ${item.product}`);
      }

      if (product.quantity < item.quantity) {
        return apiError(
          `Insufficient stock for ${product.name}. Available: ${product.quantity}`
        );
      }

      const unitPrice = item.unitPrice ?? product.sellingPrice;
      const totalPrice = item.quantity * unitPrice;
      subtotal += totalPrice;

      saleItems.push({
        product: product._id,
        productName: product.name,
        sku: product.sku,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      });
    }

    const total = subtotal - discount + tax;

    const sale = await Sale.create({
      saleNumber: generateOrderNumber("SALE"),
      items: saleItems,
      subtotal,
      discount,
      tax,
      total,
      paymentMethod,
      customerName,
      customerPhone,
      customerEmail,
      notes,
      soldBy: userId,
    });

    for (const item of saleItems) {
      await updateProductStock({
        productId: item.product,
        quantity: item.quantity,
        type: "sale",
        reference: sale.saleNumber,
        referenceId: sale._id,
        performedBy: userId,
        reason: "Sale",
      });
    }

    return apiSuccess(sale, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return handleApiError(error);
  }
}
