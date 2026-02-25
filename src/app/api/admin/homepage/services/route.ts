import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Tüm servisleri getir
export async function GET() {
  try {
    const services = await prisma.serviceItem.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error("Services fetch error:", error);
    return NextResponse.json({ error: "Servisler yüklenemedi" }, { status: 500 });
  }
}

// POST - Yeni servis ekle veya güncelle
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (data.id) {
      // Update existing
      const service = await prisma.serviceItem.update({
        where: { id: data.id },
        data: {
          number: data.number,
          title: data.title,
          heading: data.heading,
          subheading: data.subheading,
          description: data.description,
          features: data.features,
          image: data.image,
          icon: data.icon,
          order: data.order || 0,
          isActive: data.isActive ?? true,
        },
      });
      return NextResponse.json(service);
    } else {
      // Create new
      const service = await prisma.serviceItem.create({
        data: {
          number: data.number || "01",
          title: data.title,
          heading: data.heading,
          subheading: data.subheading,
          description: data.description,
          features: data.features,
          image: data.image,
          icon: data.icon,
          order: data.order || 0,
          isActive: true,
        },
      });
      return NextResponse.json(service);
    }
  } catch (error) {
    console.error("Service save error:", error);
    return NextResponse.json({ error: "Servis kaydedilemedi" }, { status: 500 });
  }
}

// DELETE - Servis sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    await prisma.serviceItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Service delete error:", error);
    return NextResponse.json({ error: "Servis silinemedi" }, { status: 500 });
  }
}
