import { connectDB } from "@/lib/mongodb";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { Category } from "@/models/Category";
import { Supplier } from "@/models/Supplier";
import { Product } from "@/models/Product";

const DEFAULT_CATEGORIES = [
  { name: "Smartphones", description: "Mobile phones and smartphones" },
  { name: "Laptops", description: "Laptops and notebooks" },
  { name: "Tablets", description: "Tablets and e-readers" },
  { name: "Televisions", description: "TVs and displays" },
  { name: "Audio", description: "Headphones, speakers, and audio equipment" },
  { name: "Cameras", description: "Cameras and photography equipment" },
  { name: "Accessories", description: "Cables, chargers, cases, and accessories" },
  { name: "Components", description: "Electronic components and parts" },
  { name: "Home Appliances", description: "Home and kitchen electronics" },
  { name: "Gaming", description: "Gaming consoles and accessories" },
  { name: "Wearables", description: "Smartwatches and fitness trackers" },
];

const DEFAULT_SUPPLIERS = [
  {
    name: "Tech Distributors India",
    contactPerson: "Rajesh Kumar",
    email: "rajesh@techdist.in",
    phone: "+91 9876543210",
    city: "Mumbai",
    state: "Maharashtra",
  },
  {
    name: "Electro Wholesale Hub",
    contactPerson: "Priya Sharma",
    email: "priya@electrohub.com",
    phone: "+91 9876543211",
    city: "Delhi",
    state: "Delhi",
  },
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST() {
  try {
    await connectDB();

    const existingCategories = await Category.countDocuments();
    const existingSuppliers = await Supplier.countDocuments();
    const existingProducts = await Product.countDocuments();

    if (existingCategories > 0 || existingSuppliers > 0 || existingProducts > 0) {
      return apiSuccess({
        message: "Database already has data. Skipping seed.",
        seeded: false,
      });
    }

    const categories = await Category.insertMany(
      DEFAULT_CATEGORIES.map((c) => ({ ...c, slug: slugify(c.name), isActive: true }))
    );

    const suppliers = await Supplier.insertMany(
      DEFAULT_SUPPLIERS.map((s) => ({ ...s, isActive: true }))
    );

    const smartphoneCat = categories.find((c) => c.name === "Smartphones");
    const laptopCat = categories.find((c) => c.name === "Laptops");
    const audioCat = categories.find((c) => c.name === "Audio");
    const supplier1 = suppliers[0];

    if (smartphoneCat && laptopCat && audioCat && supplier1) {
      await Product.insertMany([
        {
          name: "Samsung Galaxy S24",
          sku: "SAM-S24-128",
          category: smartphoneCat._id,
          brand: "Samsung",
          description: "128GB, Phantom Black",
          purchasePrice: 55000,
          sellingPrice: 64999,
          quantity: 25,
          supplier: supplier1._id,
          lowStockThreshold: 5,
          isActive: true,
        },
        {
          name: "Apple iPhone 15",
          sku: "APL-IP15-128",
          category: smartphoneCat._id,
          brand: "Apple",
          description: "128GB, Blue",
          purchasePrice: 65000,
          sellingPrice: 74999,
          quantity: 15,
          supplier: supplier1._id,
          lowStockThreshold: 5,
          isActive: true,
        },
        {
          name: "Dell Inspiron 15",
          sku: "DEL-INS15-I5",
          category: laptopCat._id,
          brand: "Dell",
          description: "Intel i5, 8GB RAM, 512GB SSD",
          purchasePrice: 42000,
          sellingPrice: 49999,
          quantity: 10,
          supplier: supplier1._id,
          lowStockThreshold: 3,
          isActive: true,
        },
        {
          name: "Sony WH-1000XM5",
          sku: "SNY-WH1000XM5",
          category: audioCat._id,
          brand: "Sony",
          description: "Wireless Noise Cancelling Headphones",
          purchasePrice: 22000,
          sellingPrice: 26999,
          quantity: 8,
          supplier: supplier1._id,
          lowStockThreshold: 5,
          isActive: true,
        },
        {
          name: "Boat Airdopes 141",
          sku: "BOAT-AD141",
          category: audioCat._id,
          brand: "Boat",
          description: "True Wireless Earbuds",
          purchasePrice: 800,
          sellingPrice: 1299,
          quantity: 50,
          supplier: supplier1._id,
          lowStockThreshold: 10,
          isActive: true,
        },
      ]);
    }

    return apiSuccess({
      message: "Database seeded successfully",
      seeded: true,
      categories: categories.length,
      suppliers: suppliers.length,
      products: 5,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
