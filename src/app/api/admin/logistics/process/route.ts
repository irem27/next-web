import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULT_SECTION = {
  title: "How We Work",
  description:
    "Discover our streamlined process that ensures efficiency and excellence at every step of the way.",
};

const DEFAULT_STEPS = [
  {
    number: "01",
    title: "Order Placement",
    description:
      "Clients place orders through our online platform, email, or direct contact. We verify details, confirm pricing, and create a tailored shipping schedule.",
    icon: "order",
    colorTheme: "blue",
    isDark: false,
    hasImage: true,
    image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400&q=80",
    imageAlt: "Customer placing an order on mobile device",
    badgeText: null,
    order: 0,
  },
  {
    number: "02",
    title: "Route Planning",
    description:
      "Our logistics experts analyze the best available routes and select optimal carriers to plan your shipment delivery path efficiently.",
    icon: "route",
    colorTheme: "green",
    isDark: false,
    hasImage: false,
    image: null,
    imageAlt: null,
    badgeText: "Optimized Routes",
    order: 1,
  },
  {
    number: "03",
    title: "Secure Packaging",
    description:
      "Professional handling and secure packaging to protect your goods during transit across all transport modes.",
    icon: "package",
    colorTheme: "blue",
    isDark: true,
    hasImage: false,
    image: null,
    imageAlt: null,
    badgeText: "Safe Transit",
    order: 2,
  },
  {
    number: "04",
    title: "Tracking and Monitoring",
    description:
      "Real-time GPS tracking and monitoring systems keep you informed about your shipment's location at every checkpoint.",
    icon: "tracking",
    colorTheme: "orange",
    isDark: false,
    hasImage: false,
    image: null,
    imageAlt: null,
    badgeText: "Real-Time GPS",
    order: 3,
  },
  {
    number: "05",
    title: "Delivery and Confirmation",
    description:
      "Safe delivery to your destination with proof of delivery, digital confirmation and comprehensive documentation.",
    icon: "delivery",
    colorTheme: "purple",
    isDark: false,
    hasImage: true,
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&q=80",
    imageAlt: "Delivery truck completing a shipment",
    badgeText: null,
    order: 4,
  },
];

export async function GET() {
  try {
    let section = await prisma.logisticsProcessSection.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!section) {
      section = await prisma.logisticsProcessSection.create({
        data: { ...DEFAULT_SECTION, isActive: true },
      });
    }

    let steps = await prisma.logisticsProcessStep.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    if (steps.length === 0) {
      await prisma.$transaction(
        DEFAULT_STEPS.map((step) =>
          prisma.logisticsProcessStep.create({ data: { ...step, isActive: true } })
        )
      );
      steps = await prisma.logisticsProcessStep.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      });
    }

    return NextResponse.json({ section, steps });
  } catch (error) {
    console.error("Error fetching logistics process:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === "section") {
      const { id, title, description } = body;
      let section;
      if (id) {
        section = await prisma.logisticsProcessSection.update({
          where: { id },
          data: { title, description, updatedAt: new Date() },
        });
      } else {
        section = await prisma.logisticsProcessSection.create({
          data: { title, description, isActive: true },
        });
      }
      return NextResponse.json(section);
    }

    if (type === "step") {
      const { id, number, title, description, image, imageAlt, icon, badgeText, colorTheme, isDark, hasImage, order } = body;
      let step;
      if (id) {
        step = await prisma.logisticsProcessStep.update({
          where: { id },
          data: { number, title, description, image, imageAlt, icon, badgeText, colorTheme, isDark, hasImage, order: Number(order), updatedAt: new Date() },
        });
      } else {
        const maxOrder = await prisma.logisticsProcessStep.aggregate({ _max: { order: true } });
        step = await prisma.logisticsProcessStep.create({
          data: {
            number, title, description, image, imageAlt, icon, badgeText, colorTheme, isDark: isDark ?? false, hasImage: hasImage ?? false,
            order: order != null ? Number(order) : (maxOrder._max.order ?? -1) + 1,
            isActive: true,
          },
        });
      }
      return NextResponse.json(step);
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Error saving logistics process:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await prisma.logisticsProcessStep.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting logistics process step:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
