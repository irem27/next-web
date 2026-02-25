import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULT_SECTION = {
  title: "Let's See Our Progress",
  description:
    "Creating Our Counter: Taking Stock of Our Journey, Embracing Growth, and Finding the Way Forward. Let's Pause, Reflect, and Renew Our Commitment to Progress.",
  buttonText: "More Info",
  buttonLink: "#about",
};

const DEFAULT_ITEMS = [
  { value: 323, suffix: "K", label: "Shipments Delivered", order: 0 },
  { value: 210, suffix: "K", label: "Happy Clients", order: 1 },
  { value: 1247, suffix: "", label: "Expert Partners", order: 2 },
  { value: 64127, suffix: "", label: "Deliveries On-Time", order: 3 },
];

export async function GET() {
  try {
    let section = await prisma.logisticsStatsSection.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!section) {
      section = await prisma.logisticsStatsSection.create({
        data: { ...DEFAULT_SECTION, isActive: true },
      });
    }

    let items = await prisma.logisticsStatItem.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    if (items.length === 0) {
      await prisma.$transaction(
        DEFAULT_ITEMS.map((item) =>
          prisma.logisticsStatItem.create({ data: { ...item, isActive: true } })
        )
      );
      items = await prisma.logisticsStatItem.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      });
    }

    return NextResponse.json({ section, items });
  } catch (error) {
    console.error("Error fetching logistics stats:", error);
    return NextResponse.json({ error: "Failed to fetch logistics stats" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === "section") {
      const { id, title, description, buttonText, buttonLink } = body;
      let section;
      if (id) {
        section = await prisma.logisticsStatsSection.update({
          where: { id },
          data: { title, description, buttonText, buttonLink, updatedAt: new Date() },
        });
      } else {
        section = await prisma.logisticsStatsSection.create({
          data: { title, description, buttonText, buttonLink, isActive: true },
        });
      }
      return NextResponse.json(section);
    }

    if (type === "item") {
      const { id, value, suffix, label, order } = body;
      let item;
      if (id) {
        item = await prisma.logisticsStatItem.update({
          where: { id },
          data: { value: Number(value), suffix, label, order: Number(order), updatedAt: new Date() },
        });
      } else {
        const maxOrder = await prisma.logisticsStatItem.aggregate({ _max: { order: true } });
        item = await prisma.logisticsStatItem.create({
          data: {
            value: Number(value),
            suffix,
            label,
            order: order != null ? Number(order) : (maxOrder._max.order ?? -1) + 1,
            isActive: true,
          },
        });
      }
      return NextResponse.json(item);
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Error saving logistics stats:", error);
    return NextResponse.json({ error: "Failed to save logistics stats" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await prisma.logisticsStatItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting logistics stat item:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
