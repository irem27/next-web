import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Quote section getir
export async function GET() {
  try {
    let section = await prisma.quoteSection.findFirst({
      where: { isActive: true },
    });

    // Create default if not exists
    if (!section) {
      section = await prisma.quoteSection.create({
        data: {
          title: "Get a logistics quote tailored to your shipment",
          description: "Tell us your origin, destination, and cargo details. Our team will provide a clear, competitive logistics solution.",
          primaryButtonText: "Request a Quote",
          primaryButtonLink: "/contact",
          secondaryButtonText: "Contact our team",
          secondaryButtonLink: "/contact",
          image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
          isActive: true,
        },
      });
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error("Quote section fetch error:", error);
    return NextResponse.json({ error: "Quote section yüklenemedi" }, { status: 500 });
  }
}

// POST - Quote section güncelle
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    let section = await prisma.quoteSection.findFirst();

    if (section) {
      section = await prisma.quoteSection.update({
        where: { id: section.id },
        data: {
          title: data.title,
          description: data.description,
          primaryButtonText: data.primaryButtonText,
          primaryButtonLink: data.primaryButtonLink,
          secondaryButtonText: data.secondaryButtonText,
          secondaryButtonLink: data.secondaryButtonLink,
          image: data.image,
        },
      });
    } else {
      section = await prisma.quoteSection.create({
        data: {
          title: data.title,
          description: data.description,
          primaryButtonText: data.primaryButtonText,
          primaryButtonLink: data.primaryButtonLink,
          secondaryButtonText: data.secondaryButtonText,
          secondaryButtonLink: data.secondaryButtonLink,
          image: data.image,
          isActive: true,
        },
      });
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error("Quote section save error:", error);
    return NextResponse.json({ error: "Quote section kaydedilemedi" }, { status: 500 });
  }
}
