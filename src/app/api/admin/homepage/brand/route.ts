import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Brand section getir
export async function GET() {
  try {
    let section = await prisma.brandSection.findFirst({
      where: { isActive: true },
    });

    // Create default if not exists
    if (!section) {
      section = await prisma.brandSection.create({
        data: {
          badgeText: "Featured Brand",
          title: "ALAMIRA Rice",
          subtitle: "Pure Rice, Pure Life",
          description: "Premium quality Basmati and Sella rice products grown with care and tradition. Experience the finest rice from our family to yours. Each grain tells a story of dedication, quality, and authentic taste.",
          buttonText: "Visit Alamira Rice",
          buttonLink: "/alamira-rice",
          button2Text: "Manage Content",
          button2Link: "/dashboard/alamira",
          isActive: true,
        },
      });
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error("Brand section fetch error:", error);
    return NextResponse.json({ error: "Brand section yüklenemedi" }, { status: 500 });
  }
}

// POST - Brand section güncelle
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    let section = await prisma.brandSection.findFirst();

    if (section) {
      section = await prisma.brandSection.update({
        where: { id: section.id },
        data: {
          badgeText: data.badgeText,
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          buttonText: data.buttonText,
          buttonLink: data.buttonLink,
          button2Text: data.button2Text,
          button2Link: data.button2Link,
        },
      });
    } else {
      section = await prisma.brandSection.create({
        data: {
          badgeText: data.badgeText,
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          buttonText: data.buttonText,
          buttonLink: data.buttonLink,
          button2Text: data.button2Text,
          button2Link: data.button2Link,
          isActive: true,
        },
      });
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error("Brand section save error:", error);
    return NextResponse.json({ error: "Brand section kaydedilemedi" }, { status: 500 });
  }
}
