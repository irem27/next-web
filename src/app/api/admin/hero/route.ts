import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST - Hero Section verilerini oluştur/güncelle
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title, subtitle, description, buttonText, buttonLink, backgroundImage, heroImage, logoUrl, brand } = body;

    let heroSection;
    if (id) {
      // Güncelle
      heroSection = await prisma.heroSection.update({
        where: { id },
        data: {
          title,
          subtitle,
          description,
          buttonText,
          buttonLink,
          backgroundImage,
          heroImage,
          logoUrl,
          updatedAt: new Date(),
        },
      });
    } else {
      // Oluştur
      heroSection = await prisma.heroSection.create({
        data: {
          title,
          subtitle,
          description,
          buttonText,
          buttonLink,
          backgroundImage,
          heroImage,
          logoUrl,
          isActive: true,
        },
      });
    }
    return NextResponse.json(heroSection);
  } catch (error) {
    console.error("Error creating/updating hero section:", error);
    return NextResponse.json(
      { error: "Failed to create/update hero section" },
      { status: 500 }
    );
  }
}

// GET - Hero Section verilerini getir
export async function GET() {
  try {
    let heroSection = await prisma.heroSection.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    // Eğer veri yoksa, varsayılan değerlerle oluştur
    if (!heroSection) {
      heroSection = await prisma.heroSection.create({
        data: {
          title: "Pure Rice, Pure Life – Welcome To Organic",
          subtitle: "Explore Our Rice Fields",
          description:
            "Grow with an earth-friendly promise. Organic rice is grown with care to ensure purity, sustainability, and natural goodness.",
          buttonText: "Explore Our Rice Fields",
          buttonLink: "/products",
          backgroundImage: "/images/hero-bg.svg",
          heroImage: "/images/hero-farmer.svg",
          logoUrl: "/images/logo.svg",
          isActive: true,
        },
      });
    }

    return NextResponse.json(heroSection);
  } catch (error) {
    console.error("Error fetching hero section:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero section" },
      { status: 500 }
    );
  }
}

// PUT - Hero Section verilerini güncelle
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, subtitle, description, buttonText, buttonLink, backgroundImage, heroImage, logoUrl } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const heroSection = await prisma.heroSection.update({
      where: { id },
      data: {
        title,
        subtitle,
        description,
        buttonText,
        buttonLink,
        backgroundImage,
        heroImage,
        logoUrl,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(heroSection);
  } catch (error) {
    console.error("Error updating hero section:", error);
    return NextResponse.json(
      { error: "Failed to update hero section" },
      { status: 500 }
    );
  }
}
