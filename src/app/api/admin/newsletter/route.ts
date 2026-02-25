import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const active = request.nextUrl.searchParams.get("active");
    const where =
      active === "true"
        ? { isActive: true }
        : active === "false"
          ? { isActive: false }
          : {};

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(subscribers);
  } catch (error) {
    console.error("Newsletter subscribers fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { id, isActive } = body as { id?: string; isActive?: boolean };

    if (!id || typeof isActive !== "boolean") {
      return NextResponse.json({ error: "id and isActive are required" }, { status: 400 });
    }

    const updated = await prisma.newsletterSubscriber.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Newsletter subscriber update error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID gerekli" }, { status: 400 });

    await prisma.newsletterSubscriber.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter subscriber delete error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

