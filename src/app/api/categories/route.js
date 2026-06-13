import { connectDB } from "@/lib/mongodb";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { Category } from "@/models/Category";
import { categorySchema } from "@/lib/validations";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 });
    return apiSuccess(categories);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message);
    }

    const { name, description, isActive } = parsed.data;
    const slug = slugify(name);

    const existing = await Category.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
      return apiError("Category already exists");
    }

    const category = await Category.create({
      name,
      slug,
      description,
      isActive: isActive ?? true,
    });

    return apiSuccess(category, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
