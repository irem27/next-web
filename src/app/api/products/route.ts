import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Tüm kategorileri ve ürünleri getir (public)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");

    // If search query exists, return filtered products
    if (search && search.trim().length > 0) {
      const searchLower = search.toLowerCase();
      const allProducts = await prisma.product.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      });
      
      // Client-side case-insensitive filtering
      const filteredProducts = allProducts.filter(product => 
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      ).slice(0, 10);

      return NextResponse.json({ items: filteredProducts });
    }

    // Get section settings
    let section = await prisma.productsSection.findFirst({
      where: { isActive: true },
    });

    if (!section) {
      section = await prisma.productsSection.create({
        data: {
          badgeText: "Alamira Products",
          title: "Pure Products And Honest Practices",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
          buttonText: "View All Product",
          buttonLink: "/products",
          isActive: true,
        },
      });
    }

    // Get categories with products
    const categories = await prisma.productCategory.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json({ section, categories });
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json(
      { error: "Ürünler yüklenemedi" },
      { status: 500 }
    );
  }
}
