import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Tüm iletişim formlarını getir
export async function GET() {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Contact submissions fetch error:", error);
    return NextResponse.json(
      { error: "Mesajlar yüklenemedi" },
      { status: 500 }
    );
  }
}

// POST - Yeni iletişim formu gönder
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validasyon
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "İsim, e-posta ve mesaj zorunludur" },
        { status: 400 }
      );
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        supportType: body.supportType || null,
        message: body.message,
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      { error: "Mesaj gönderilemedi" },
      { status: 500 }
    );
  }
}
