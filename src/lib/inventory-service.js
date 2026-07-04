import { Product } from "@/models/Product";
import { StockMovement } from "@/models/StockMovement";
import { LowStockAlert } from "@/models/LowStockAlert";

export async function updateProductStock(params) {
  const {
    productId,
    quantity,
    type,
    reason,
    reference,
    referenceId,
    performedBy,
    notes,
  } = params;

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  const previousQuantity = product.quantity;
  let newQuantity;

  switch (type) {
    case "stock_in":
    case "purchase":
      newQuantity = previousQuantity + quantity;
      break;
    case "stock_out":
    case "sale":
      if (previousQuantity < quantity) {
        throw new Error(
          `Insufficient stock for ${product.name}. Available: ${previousQuantity}, Requested: ${quantity}`
        );
      }
      newQuantity = previousQuantity - quantity;
      break;
    case "adjustment":
      newQuantity = quantity;
      break;
    default:
      throw new Error("Invalid stock movement type");
  }

  if (newQuantity < 0) {
    throw new Error("Stock quantity cannot be negative");
  }

  product.quantity = newQuantity;
  await product.save();

  const movementQuantity =
    type === "adjustment"
      ? Math.abs(newQuantity - previousQuantity)
      : quantity;

  await StockMovement.create({
    userId: product.userId,
    product: product._id,
    type,
    quantity: movementQuantity,
    previousQuantity,
    newQuantity,
    reason,
    reference,
    referenceId,
    performedBy,
    notes,
  });

  await checkLowStockAlert(product);

  return product;
}

async function checkLowStockAlert(product) {
  const threshold = product.lowStockThreshold;

  if (product.quantity <= threshold) {
    const existingAlert = await LowStockAlert.findOne({
      userId: product.userId,
      product: product._id,
      isResolved: false,
    });

    if (existingAlert) {
      existingAlert.currentQuantity = product.quantity;
      existingAlert.productName = product.name;
      existingAlert.sku = product.sku;
      await existingAlert.save();
    } else {
      await LowStockAlert.create({
        userId: product.userId,
        product: product._id,
        productName: product.name,
        sku: product.sku,
        currentQuantity: product.quantity,
        threshold,
      });
    }
  } else {
    await LowStockAlert.updateMany(
      { userId: product.userId, product: product._id, isResolved: false },
      { isResolved: true }
    );
  }
}

export async function getStockSummary(userId) {
  const products = await Product.find({ userId, isActive: true });
  const totalProducts = products.length;
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalValue = products.reduce(
    (sum, p) => sum + p.quantity * p.purchasePrice,
    0
  );
  const lowStockCount = products.filter(
    (p) => p.quantity <= p.lowStockThreshold
  ).length;
  const outOfStockCount = products.filter((p) => p.quantity === 0).length;

  return {
    totalProducts,
    totalQuantity,
    totalValue,
    lowStockCount,
    outOfStockCount,
  };
}
