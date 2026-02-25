import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - All Instagram posts
export async function GET() {
  try {
    const posts = await prisma.instagramPost.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching instagram posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch instagram posts" },
      { status: 500 }
    );
  }
}

// POST - Create new post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image, alt, link, order } = body;

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // Get max order if not provided
    let postOrder = order;
    if (postOrder === undefined) {
      const maxOrder = await prisma.instagramPost.findFirst({
        orderBy: { order: "desc" },
      });
      postOrder = (maxOrder?.order ?? -1) + 1;
    }

    const post = await prisma.instagramPost.create({
      data: {
        image,
        alt: alt || "",
        link: link || "https://instagram.com/alamira.rice",
        order: postOrder,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating instagram post:", error);
    return NextResponse.json(
      { error: "Failed to create instagram post" },
      { status: 500 }
    );
  }
}

// PUT - Update post
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, image, alt, link, order, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const post = await prisma.instagramPost.update({
      where: { id },
      data: {
        image,
        alt,
        link,
        order,
        isActive,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating instagram post:", error);
    return NextResponse.json(
      { error: "Failed to update instagram post" },
      { status: 500 }
    );
  }
}

// DELETE - Delete post
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.instagramPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting instagram post:", error);
    return NextResponse.json(
      { error: "Failed to delete instagram post" },
      { status: 500 }
    );
  }
}
