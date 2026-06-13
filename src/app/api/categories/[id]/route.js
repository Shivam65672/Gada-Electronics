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

export async function GET(_request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const category = await Category.findById(id);
    if (!category) return apiError("Category not found", 404);
    return apiSuccess(category);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.errors[0].message);
    }

    const { name, description, isActive } = parsed.data;
    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug: slugify(name), description, isActive },
      { new: true, runValidators: true }
    );

    if (!category) return apiError("Category not found", 404);
    return apiSuccess(category);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return apiError("Category not found", 404);
    return apiSuccess({ message: "Category deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
