import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Get all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: [{ categoryId: "asc" }, { order: "asc" }],
      include: {
        category: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, image, price, categoryId, order } = body;

    if (!name || !categoryId) {
      return NextResponse.json(
        { error: "Name and categoryId are required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        image,
        price,
        categoryId,
        order: order || 0,
        isActive: true,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, image, price, categoryId, order, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        image,
        price,
        categoryId,
        order,
        isActive,
        updatedAt: new Date(),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
