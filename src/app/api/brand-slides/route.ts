import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Public brand slides
export async function GET() {
  try {
    const alamiraSlides = await prisma.brandSlide.findMany({
      where: { isActive: true, brand: "alamira" },
      orderBy: { order: "asc" },
    });
    const grainfoodSlides = await prisma.brandSlide.findMany({
      where: { isActive: true, brand: "grainfood" },
      orderBy: { order: "asc" },
    });

    // Eğer hiç slide yoksa varsayılanları oluştur
    if (alamiraSlides.length === 0 && grainfoodSlides.length === 0) {
      const defaultSlides = [
        {
          brand: "alamira",
          title: "ALAMIRA",
          subtitle: "Premium Rice Specialties",
          description: "Quality rice products for trade, gastronomy, and food partners worldwide",
          buttonText: "Explore Products",
          buttonLink: "/alamira-rice",
          backgroundImage: "/images/rice-bg.jpg",
          theme: "light",
          accentColor: "orange",
          icon: "rice",
          order: 0,
          isActive: true,
        },
        {
          brand: "grainfood",
          title: "GRAINFOOD",
          subtitle: "Transport, Freight & Logistics",
          description: "Professional logistics solutions for B2B, industry, and global trade",
          buttonText: "Explore Services",
          buttonLink: "/contact",
          backgroundImage: "/images/truck-bg.jpg",
          theme: "dark",
          accentColor: "blue",
          icon: "logistics",
          order: 0,
          isActive: true,
        },
      ];
      for (const slide of defaultSlides) {
        await prisma.brandSlide.create({ data: slide });
      }
    }

    // Son verileri çek
    const alamira = await prisma.brandSlide.findMany({
      where: { isActive: true, brand: "alamira" },
      orderBy: { order: "asc" },
    });
    const grainfood = await prisma.brandSlide.findMany({
      where: { isActive: true, brand: "grainfood" },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ alamira, grainfood });
  } catch (error) {
    console.error("Error fetching brand slides:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand slides" },
      { status: 500 }
    );
  }
}
