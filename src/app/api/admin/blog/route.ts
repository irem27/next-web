import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Blog Section settings and posts
export async function GET() {
  try {
    // Get section settings
    let section = await prisma.blogSection.findFirst({
      where: { isActive: true },
    });

    if (!section) {
      section = await prisma.blogSection.create({
        data: {
          badgeText: "Our Blog",
          title: "Stories Of Rice Crops & Organic",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
          buttonText: "View All Blogs",
          buttonLink: "/blog",
          isActive: true,
        },
      });
    }

    // Get posts
    let posts = await prisma.blogPost.findMany({
      where: { isActive: true },
      orderBy: { date: "desc" },
      take: 10,
    });

    // If no posts, create defaults
    if (posts.length === 0) {
      const defaultPosts = [
        { 
          title: "Explore The World Of Clean Farming, Honest Food, And Natural Living.",
          slug: "clean-farming-natural-living",
          excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
          image: "/images/blog-1.svg",
          author: "John Doe",
          featured: true,
        },
        { 
          title: "Explore The World",
          slug: "explore-the-world",
          excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt.",
          image: "/images/blog-2.svg",
          author: "John Doe",
          featured: false,
        },
        { 
          title: "Rice Farming Techniques",
          slug: "rice-farming-techniques",
          excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt.",
          image: "/images/blog-3.svg",
          author: "John Doe",
          featured: false,
        },
      ];

      for (const post of defaultPosts) {
        await prisma.blogPost.create({ data: post });
      }

      posts = await prisma.blogPost.findMany({
        where: { isActive: true },
        orderBy: { date: "desc" },
      });
    }

    return NextResponse.json({ section, posts });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog data" },
      { status: 500 }
    );
  }
}

// PUT - Update section settings
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, badgeText, title, description, buttonText, buttonLink } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const section = await prisma.blogSection.update({
      where: { id },
      data: {
        badgeText,
        title,
        description,
        buttonText,
        buttonLink,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error("Error updating blog section:", error);
    return NextResponse.json(
      { error: "Failed to update blog section" },
      { status: 500 }
    );
  }
}

// POST - Create new blog post
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
      return NextResponse.json({ error: "Bu slug zaten kullanılıyor" }, { status: 400 });
    }

    // If featured, unfeature others
    if (featured) {
      await prisma.blogPost.updateMany({
        where: { featured: true },
        data: { featured: false },
      });
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

// DELETE - Delete blog post
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

// PATCH - Update blog post
export async function PATCH(request: Request) {
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
