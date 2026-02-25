import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Tüm brand slide'ları getir
export async function GET() {
  try {
    const slides = await prisma.brandSlide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(slides);
  } catch (error) {
    console.error("Error fetching brand slides:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand slides" },
      { status: 500 }
    );
  }
}

// POST - Yeni brand slide ekle
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Mevcut en yüksek order'ı bul
    const maxOrder = await prisma.brandSlide.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newSlide = await prisma.brandSlide.create({
      data: {
        title: body.title,
        subtitle: body.subtitle || null,
        description: body.description || null,
        buttonText: body.buttonText || null,
        buttonLink: body.buttonLink || null,
        backgroundImage: body.backgroundImage || null,
        theme: body.theme || "dark",
        accentColor: body.accentColor || "blue",
        icon: body.icon || "default",
        order: (maxOrder?.order ?? -1) + 1,
        isActive: body.isActive ?? true,
        brand: body.brand || "alamira",
      },
    });

    return NextResponse.json(newSlide);
  } catch (error) {
    console.error("Error creating brand slide:", error);
    return NextResponse.json(
      { error: "Failed to create brand slide" },
      { status: 500 }
    );
  }
}

// PUT - Brand slide güncelle
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Slide ID is required" },
        { status: 400 }
      );
    }

    const updatedSlide = await prisma.brandSlide.update({
      where: { id: body.id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        buttonText: body.buttonText,
        buttonLink: body.buttonLink,
        backgroundImage: body.backgroundImage,
        theme: body.theme,
        accentColor: body.accentColor,
        icon: body.icon,
        order: body.order,
        isActive: body.isActive,
        brand: body.brand || "alamira",
      },
    });

    return NextResponse.json(updatedSlide);
  } catch (error) {
    console.error("Error updating brand slide:", error);
    return NextResponse.json(
      { error: "Failed to update brand slide" },
      { status: 500 }
    );
  }
}

// DELETE - Brand slide sil
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Slide ID is required" },
        { status: 400 }
      );
    }

    await prisma.brandSlide.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting brand slide:", error);
    return NextResponse.json(
      { error: "Failed to delete brand slide" },
      { status: 500 }
    );
  }
}
