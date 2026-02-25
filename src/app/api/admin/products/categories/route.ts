import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Get all categories
export async function GET() {
  try {
    const categories = await prisma.productCategory.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, order } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const category = await prisma.productCategory.create({
      data: {
        name,
        slug,
        order: order || 0,
        isActive: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

// PUT - Update category
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, slug, order, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const category = await prisma.productCategory.update({
      where: { id },
      data: {
        name,
        slug,
        order,
        isActive,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.productCategory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
