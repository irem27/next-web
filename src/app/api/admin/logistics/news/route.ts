import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULT_SECTION = {
  title: "Latest News",
  description:
    "Creating Our Counter: Taking Stock of Our Journey, Embracing Growth, and Finding the Way Forward. Let\u2019s Pause, Reflect, and Renew Our Commitment to Progress.",
};

const DEFAULT_ARTICLES = [
  {
    title: "Easing Cross-Border Trade And Customs In A Free World: The African Perspective",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&q=80",
    imageAlt: "Business professional managing cross-border trade logistics",
    link: "#",
    order: 0,
  },
  {
    title: "Easing Cross-Border Trade And Customs In A Free World: The African Perspective",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80",
    imageAlt: "Cargo containers being loaded at an international port",
    link: "#",
    order: 1,
  },
  {
    title: "Easing Cross-Border Trade And Customs In A Free World: The African Perspective",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&q=80",
    imageAlt: "Global shipping containers at a busy port terminal",
    link: "#",
    order: 2,
  },
];

export async function GET() {
  try {
    let section = await prisma.logisticsNewsSection.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!section) {
      section = await prisma.logisticsNewsSection.create({
        data: { ...DEFAULT_SECTION, isActive: true },
      });
    }

    let articles = await prisma.logisticsNewsArticle.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    if (articles.length === 0) {
      await prisma.$transaction(
        DEFAULT_ARTICLES.map((a) =>
          prisma.logisticsNewsArticle.create({ data: { ...a, isActive: true } })
        )
      );
      articles = await prisma.logisticsNewsArticle.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      });
    }

    return NextResponse.json({ section, articles });
  } catch (error) {
    console.error("Error fetching logistics news:", error);
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
        section = await prisma.logisticsNewsSection.update({
          where: { id },
          data: { title, description, updatedAt: new Date() },
        });
      } else {
        section = await prisma.logisticsNewsSection.create({
          data: { title, description, isActive: true },
        });
      }
      return NextResponse.json(section);
    }

    if (type === "article") {
      const { id, title, slug, excerpt, content, image, imageAlt, author, link, order } = body;
      let article;
      if (id) {
        article = await prisma.logisticsNewsArticle.update({
          where: { id },
          data: { title, slug: slug || null, excerpt, content, image, imageAlt, author, link, order: Number(order), updatedAt: new Date() },
        });
      } else {
        const maxOrder = await prisma.logisticsNewsArticle.aggregate({ _max: { order: true } });
        article = await prisma.logisticsNewsArticle.create({
          data: {
            title, slug: slug || null, excerpt, content, image, imageAlt, author, link,
            order: order != null ? Number(order) : (maxOrder._max.order ?? -1) + 1,
            isActive: true,
          },
        });
      }
      return NextResponse.json(article);
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Error saving logistics news:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await prisma.logisticsNewsArticle.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting logistics news article:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
