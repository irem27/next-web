import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Tek mesajı getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const submission = await prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Mesaj bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Contact submission fetch error:", error);
    return NextResponse.json(
      { error: "Mesaj yüklenemedi" },
      { status: 500 }
    );
  }
}

// PUT - Mesajı okundu olarak işaretle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const submission = await prisma.contactSubmission.update({
      where: { id },
      data: {
        isRead: body.isRead ?? true,
      },
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Contact submission update error:", error);
    return NextResponse.json(
      { error: "Mesaj güncellenemedi" },
      { status: 500 }
    );
  }
}

// DELETE - Mesajı sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.contactSubmission.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact submission delete error:", error);
    return NextResponse.json(
      { error: "Mesaj silinemedi" },
      { status: 500 }
    );
  }
}
