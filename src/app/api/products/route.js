import { connectDB } from "@/lib/mongodb";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { Product } from "@/models/Product";
import { productSchema } from "@/lib/validations";
import { DEFAULT_LOW_STOCK_THRESHOLD } from "@/lib/constants";
import { updateProductStock } from "@/lib/inventory-service";
import { requireAuth } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();
    const userId = await requireAuth();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const lowStock = searchParams.get("lowStock");

    const filter = { userId };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    let products = await Product.find(filter)
      .populate("category", "name slug")
      .populate("supplier", "name email phone")
      .sort({ createdAt: -1 });

    if (lowStock === "true") {
      products = products.filter((p) => p.quantity <= p.lowStockThreshold);
    }

    return apiSuccess(products);
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
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message);
    }

    const existing = await Product.findOne({ 
      sku: parsed.data.sku.toUpperCase(),
      userId 
    });
    if (existing) {
      return apiError("Product with this SKU already exists");
    }

    const { quantity = 0, ...productData } = parsed.data;

    const product = await Product.create({
      ...productData,
      userId,
      sku: productData.sku.toUpperCase(),
      quantity: 0,
      lowStockThreshold:
        productData.lowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD,
    });

    if (quantity > 0) {
      await updateProductStock({
        productId: product._id,
        quantity,
        type: "stock_in",
        reason: "Initial stock",
      });
    }

    const populated = await Product.findById(product._id)
      .populate("category", "name slug")
      .populate("supplier", "name email phone");

    return apiSuccess(populated, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return apiError("Unauthorized", 401);
    }
    return handleApiError(error);
  }
}
