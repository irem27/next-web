import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Instagram Section settings and posts
export async function GET() {
  try {
    // Get section settings
    let section = await prisma.instagramSection.findFirst({
      where: { isActive: true },
    });

    if (!section) {
      section = await prisma.instagramSection.create({
        data: {
          badgeText: "@alamira.rice",
          title: "Alamira on Instagram",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
          isActive: true,
        },
      });
    }

    // Get posts
    let posts = await prisma.instagramPost.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    // If no posts, create defaults
    if (posts.length === 0) {
      const defaultPosts = [
        { image: "/images/instagram-1.svg", alt: "Green rice fields with water irrigation channels", link: "https://instagram.com/alamira.rice", order: 0 },
        { image: "/images/instagram-2.svg", alt: "Golden rice stalks ready for harvest", link: "https://instagram.com/alamira.rice", order: 1 },
        { image: "/images/instagram-3.svg", alt: "Rice fields with mountain view in background", link: "https://instagram.com/alamira.rice", order: 2 },
        { image: "/images/instagram-1.svg", alt: "Lush green paddy fields at sunrise", link: "https://instagram.com/alamira.rice", order: 3 },
        { image: "/images/instagram-2.svg", alt: "Close up of organic rice plants", link: "https://instagram.com/alamira.rice", order: 4 },
      ];

      for (const post of defaultPosts) {
        await prisma.instagramPost.create({ data: post });
      }

      posts = await prisma.instagramPost.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      });
    }

    return NextResponse.json({ section, posts });
  } catch (error) {
    console.error("Error fetching instagram:", error);
    return NextResponse.json(
      { error: "Failed to fetch instagram data" },
      { status: 500 }
    );
  }
}

// PUT - Update section settings
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, badgeText, title, description } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const section = await prisma.instagramSection.update({
      where: { id },
      data: {
        badgeText,
        title,
        description,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error("Error updating instagram section:", error);
    return NextResponse.json(
      { error: "Failed to update instagram section" },
      { status: 500 }
    );
  }
}
