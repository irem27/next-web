import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULT_ITEMS = [
  {
    number: "01",
    label: "By Road",
    title: "Transport Solutions\nFor Business to Solve Any\nDelivery Problems",
    description:
      "Logistics is the Process of Planning, Moving, and Storing Goods and Services with Minute Attention to Details. From Packaging to Maintenance to Transportation.",
    buttonText: "More Info",
    buttonLink: "#contact",
    order: 0,
  },
  {
    number: "02",
    label: "By Air",
    title: "Air Freight Solutions\nFast & Reliable Global\nAir Cargo Services",
    description:
      "Our air freight services offer time-definite deliveries worldwide. We partner with leading airlines to provide competitive rates and flexible scheduling for your urgent shipments.",
    buttonText: "More Info",
    buttonLink: "#contact",
    order: 1,
  },
  {
    number: "03",
    label: "By Sea",
    title: "Ocean Freight Solutions\nCost-Effective Maritime\nShipping Services",
    description:
      "Full container load (FCL) and less than container load (LCL) shipping services across all major trade lanes. Reliable transit times with real-time cargo tracking.",
    buttonText: "More Info",
    buttonLink: "#contact",
    order: 2,
  },
];

export async function GET() {
  try {
    let items = await prisma.logisticsServiceItem.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    if (items.length === 0) {
      await prisma.$transaction(
        DEFAULT_ITEMS.map((item) =>
          prisma.logisticsServiceItem.create({ data: { ...item, isActive: true } })
        )
      );
      items = await prisma.logisticsServiceItem.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      });
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching logistics services:", error);
    return NextResponse.json(
      { error: "Failed to fetch logistics services" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, number, label, title, description, buttonText, buttonLink, order } = body;

    let item;
    if (id) {
      item = await prisma.logisticsServiceItem.update({
        where: { id },
        data: { number, label, title, description, buttonText, buttonLink, order, updatedAt: new Date() },
      });
    } else {
      const maxOrder = await prisma.logisticsServiceItem.aggregate({ _max: { order: true } });
      item = await prisma.logisticsServiceItem.create({
        data: {
          number,
          label,
          title,
          description,
          buttonText,
          buttonLink,
          order: order ?? (maxOrder._max.order ?? -1) + 1,
          isActive: true,
        },
      });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error saving logistics service item:", error);
    return NextResponse.json(
      { error: "Failed to save logistics service item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.logisticsServiceItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting logistics service item:", error);
    return NextResponse.json(
      { error: "Failed to delete logistics service item" },
      { status: 500 }
    );
  }
}
