import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Products Section settings, categories and products
export async function GET() {
  try {
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
    let categories = await prisma.productCategory.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
    });

    // If no categories, create defaults
    if (categories.length === 0) {
      const defaultCategories = [
        { name: "Microwave Rice", slug: "microwave", order: 0 },
        { name: "Dry Rice", slug: "dry", order: 1 },
        { name: "Boil in Bag Rice", slug: "boil", order: 2 },
      ];

      for (const cat of defaultCategories) {
        await prisma.productCategory.create({
          data: cat,
        });
      }

      // Create default products
      const microwaveCat = await prisma.productCategory.findUnique({ where: { slug: "microwave" } });
      const dryCat = await prisma.productCategory.findUnique({ where: { slug: "dry" } });
      const boilCat = await prisma.productCategory.findUnique({ where: { slug: "boil" } });

      if (microwaveCat) {
        await prisma.product.createMany({
          data: [
            { name: "Alamira Basmati Rice 1kg", image: "/images/rice-bag-1.svg", categoryId: microwaveCat.id, order: 0 },
            { name: "Alamira Sella Rice 2kg", image: "/images/rice-bag-2.svg", categoryId: microwaveCat.id, order: 1 },
            { name: "Alamira Premium Rice 5kg", image: "/images/rice-bag-3.svg", categoryId: microwaveCat.id, order: 2 },
          ],
        });
      }

      if (dryCat) {
        await prisma.product.createMany({
          data: [
            { name: "Alamira Dry Basmati 1kg", image: "/images/rice-bag-1.svg", categoryId: dryCat.id, order: 0 },
            { name: "Alamira Dry Sella 2kg", image: "/images/rice-bag-2.svg", categoryId: dryCat.id, order: 1 },
          ],
        });
      }

      if (boilCat) {
        await prisma.product.createMany({
          data: [
            { name: "Alamira Boil Bag Rice", image: "/images/rice-bag-3.svg", categoryId: boilCat.id, order: 0 },
          ],
        });
      }

      categories = await prisma.productCategory.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        include: {
          products: {
            where: { isActive: true },
            orderBy: { order: "asc" },
          },
        },
      });
    }

    // Get latest 10 products
    const latestProducts = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        category: true,
      },
    });

    return NextResponse.json({ section, categories, latestProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// PUT - Update section settings
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, badgeText, title, description, buttonText, buttonLink } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const section = await prisma.productsSection.update({
      where: { id },
      data: {
        badgeText,
        title,
        description,
        buttonText,
        buttonLink,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error("Error updating products section:", error);
    return NextResponse.json(
      { error: "Failed to update products section" },
      { status: 500 }
    );
  }
}
