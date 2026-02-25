import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Tüm aktif blog yazılarını getir (public)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");

    // SQLite case-insensitive arama için lowercase kullanıyoruz
    let posts;
    
    if (search && search.trim().length > 0) {
      const searchLower = search.toLowerCase();
      const allPosts = await prisma.blogPost.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      });
      
      // Client-side case-insensitive filtering
      posts = allPosts.filter(post => 
        post.title?.toLowerCase().includes(searchLower) ||
        post.content?.toLowerCase().includes(searchLower) ||
        post.excerpt?.toLowerCase().includes(searchLower)
      );
    } else {
      posts = await prisma.blogPost.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Blog posts fetch error:", error);
    return NextResponse.json(
      { error: "Blog yazıları yüklenemedi" },
      { status: 500 }
    );
  }
}
