import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Tüm hero slide'ları getir
export async function GET() {
  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(slides);
  } catch (error) {
    console.error("Hero slides fetch error:", error);
    return NextResponse.json({ error: "Slide'lar yüklenemedi" }, { status: 500 });
  }
}

// POST - Yeni slide ekle veya güncelle
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (data.id) {
      // Update existing
      const slide = await prisma.heroSlide.update({
        where: { id: data.id },
        data: {
          brand: data.brand,
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          image: data.image,
          ctaText: data.ctaText,
          ctaLink: data.ctaLink,
          order: data.order || 0,
          isActive: data.isActive ?? true,
        },
      });
      return NextResponse.json(slide);
    } else {
      // Create new
      const slide = await prisma.heroSlide.create({
        data: {
          brand: data.brand || "alamira",
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          image: data.image,
          ctaText: data.ctaText,
          ctaLink: data.ctaLink,
          order: data.order || 0,
          isActive: true,
        },
      });
      return NextResponse.json(slide);
    }
  } catch (error) {
    console.error("Hero slide save error:", error);
    return NextResponse.json({ error: "Slide kaydedilemedi" }, { status: 500 });
  }
}

// DELETE - Slide sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    await prisma.heroSlide.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hero slide delete error:", error);
    return NextResponse.json({ error: "Slide silinemedi" }, { status: 500 });
  }
}
