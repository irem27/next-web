import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULT_WORDS = [
  "LogiCraft", "Shipping", "Delivery", "Logistics",
  "LogiCraft", "Budget", "Delivery", "LogiCraft",
  "Shipping", "Delivery", "Logistics", "LogiCraft",
];

export async function GET() {
  try {
    let words = await prisma.logisticsMarqueeWord.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    if (words.length === 0) {
      await prisma.$transaction(
        DEFAULT_WORDS.map((word, i) =>
          prisma.logisticsMarqueeWord.create({ data: { word, order: i, isActive: true } })
        )
      );
      words = await prisma.logisticsMarqueeWord.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      });
    }

    return NextResponse.json(words);
  } catch (error) {
    console.error("Error fetching marquee words:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, word, order } = body;

    let item;
    if (id) {
      item = await prisma.logisticsMarqueeWord.update({
        where: { id },
        data: { word, order: Number(order), updatedAt: new Date() },
      });
    } else {
      const maxOrder = await prisma.logisticsMarqueeWord.aggregate({ _max: { order: true } });
      item = await prisma.logisticsMarqueeWord.create({
        data: {
          word,
          order: order != null ? Number(order) : (maxOrder._max.order ?? -1) + 1,
          isActive: true,
        },
      });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error saving marquee word:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await prisma.logisticsMarqueeWord.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting marquee word:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
