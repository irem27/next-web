import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Tüm ana sayfa verilerini getir
export async function GET() {
  try {
    // Hero Slides
    const heroSlides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    // Services
    const services = await prisma.serviceItem.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    // Stats Section
    let statsSection = await prisma.statsSection.findFirst({
      where: { isActive: true },
    });

    // Stats Items
    const statsItems = await prisma.statItem.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    // Quote Section
    let quoteSection = await prisma.quoteSection.findFirst({
      where: { isActive: true },
    });

    // Brand Section
    let brandSection = await prisma.brandSection.findFirst({
      where: { isActive: true },
    });

    // Blog Section & Posts
    let blogSection = await prisma.blogSection.findFirst({
      where: { isActive: true },
    });

    const blogPosts = await prisma.blogPost.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    return NextResponse.json({
      heroSlides,
      services,
      statsSection,
      statsItems,
      quoteSection,
      brandSection,
      blogSection,
      blogPosts,
    });
  } catch (error) {
    console.error("Homepage data fetch error:", error);
    return NextResponse.json(
      { error: "Ana sayfa verileri yüklenemedi" },
      { status: 500 }
    );
  }
}
