import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Tek blog yazısını slug'a göre getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post || !post.isActive) {
      return NextResponse.json(
        { error: "Blog yazısı bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Blog post fetch error:", error);
    return NextResponse.json(
      { error: "Blog yazısı yüklenemedi" },
      { status: 500 }
    );
  }
}
