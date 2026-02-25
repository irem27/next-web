import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Stats section ve items getir
export async function GET() {
  try {
    let section = await prisma.statsSection.findFirst({
      where: { isActive: true },
    });

    // Create default if not exists
    if (!section) {
      section = await prisma.statsSection.create({
        data: {
          title: "Let's See Our Progress",
          description: "Charting Our Course. Taking Stock of Our Journey, Embracing Growth, and Paving the Way Forward.",
          buttonText: "More Info",
          buttonLink: "#about",
          isActive: true,
        },
      });
    }

    const items = await prisma.statItem.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ section, items });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json({ error: "İstatistikler yüklenemedi" }, { status: 500 });
  }
}

// POST - Stats section veya item güncelle/ekle
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (data.type === "section") {
      // Update or create section
      let section = await prisma.statsSection.findFirst();
      
      if (section) {
        section = await prisma.statsSection.update({
          where: { id: section.id },
          data: {
            title: data.title,
            description: data.description,
            buttonText: data.buttonText,
            buttonLink: data.buttonLink,
          },
        });
      } else {
        section = await prisma.statsSection.create({
          data: {
            title: data.title,
            description: data.description,
            buttonText: data.buttonText,
            buttonLink: data.buttonLink,
            isActive: true,
          },
        });
      }
      return NextResponse.json(section);
    } else {
      // Stats item
      if (data.id) {
        const item = await prisma.statItem.update({
          where: { id: data.id },
          data: {
            value: data.value,
            label: data.label,
            suffix: data.suffix,
            order: data.order || 0,
            isActive: data.isActive ?? true,
          },
        });
        return NextResponse.json(item);
      } else {
        const item = await prisma.statItem.create({
          data: {
            value: data.value,
            label: data.label,
            suffix: data.suffix,
            order: data.order || 0,
            isActive: true,
          },
        });
        return NextResponse.json(item);
      }
    }
  } catch (error) {
    console.error("Stats save error:", error);
    return NextResponse.json({ error: "İstatistik kaydedilemedi" }, { status: 500 });
  }
}

// DELETE - Stat item sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    await prisma.statItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Stat item delete error:", error);
    return NextResponse.json({ error: "İstatistik silinemedi" }, { status: 500 });
  }
}
