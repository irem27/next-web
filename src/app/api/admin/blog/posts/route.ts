import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - All blog posts
export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { date: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST - Create new post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, image, author, featured } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    // Check if slug exists
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || "",
        content: content || "",
        image: image || "/images/blog-1.svg",
        author: author || "Admin",
        featured: featured || false,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}

// PUT - Update post
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, slug, excerpt, content, image, author, featured, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // If featured, unfeature others
    if (featured) {
      await prisma.blogPost.updateMany({
        where: { featured: true, id: { not: id } },
        data: { featured: false },
      });
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        image,
        author,
        featured,
        isActive,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
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

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
