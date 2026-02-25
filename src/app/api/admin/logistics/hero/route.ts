import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    let hero = await prisma.logisticsHero.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!hero) {
      hero = await prisma.logisticsHero.create({
        data: {
          badge: "Leading Logistics Provider",
          title: "LOGI CRAFT",
          subtitle: "Crafting Your Logistics Success",
          description:
            "Leading global logistics provider delivering comprehensive transport, freight, and supply chain solutions. From packaging to final delivery, we handle every detail with precision.",
          backgroundImage:
            "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920&q=80",
          searchPlaceholder: "Track My Shipment",
          button1Text: "Delivery & coverage",
          button1Link: "#services",
          button2Text: "Costs Calculators",
          button2Link: "#solutions",
          isActive: true,
        },
      });
    }

    return NextResponse.json(hero);
  } catch (error) {
    console.error("Error fetching logistics hero:", error);
    return NextResponse.json(
      { error: "Failed to fetch logistics hero" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      badge,
      title,
      subtitle,
      description,
      backgroundImage,
      searchPlaceholder,
      button1Text,
      button1Link,
      button2Text,
      button2Link,
    } = body;

    let hero;
    if (id) {
      hero = await prisma.logisticsHero.update({
        where: { id },
        data: {
          badge,
          title,
          subtitle,
          description,
          backgroundImage,
          searchPlaceholder,
          button1Text,
          button1Link,
          button2Text,
          button2Link,
          updatedAt: new Date(),
        },
      });
    } else {
      hero = await prisma.logisticsHero.create({
        data: {
          badge,
          title,
          subtitle,
          description,
          backgroundImage,
          searchPlaceholder,
          button1Text,
          button1Link,
          button2Text,
          button2Link,
          isActive: true,
        },
      });
    }

    return NextResponse.json(hero);
  } catch (error) {
    console.error("Error saving logistics hero:", error);
    return NextResponse.json(
      { error: "Failed to save logistics hero" },
      { status: 500 }
    );
  }
}
