import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Contact Section ayarlarını getir (public)
export async function GET() {
  try {
    let section = await prisma.contactSection.findFirst({
      where: { isActive: true },
    });

    if (!section) {
      // Default değerlerle oluştur
      section = await prisma.contactSection.create({
        data: {
          badgeText: "Contact Us",
          title: "Talk To The Team Behind The Grains",
          description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
          locationTitle: "Location",
          locationText: "Lorem ipsum dolor sit amet, consectetuer",
          emailTitle: "Email Us",
          email1: "info@mail.com",
          email2: "info@mail.com",
          phoneTitle: "Phone",
          phone1: "(000)-000-0000",
          phone2: "(000)-000-0000",
          formTitle: "Get In Touch With Rice Crops",
          formDescription: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed Lorem ipsum dolor sit amet, consectetuer adipiscing elit, consectetuer adipiscing elit.",
          isActive: true,
        },
      });
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error("Contact section fetch error:", error);
    return NextResponse.json(
      { error: "Contact section yüklenemedi" },
      { status: 500 }
    );
  }
}

// POST - İletişim formu gönder (public)
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

    // E-posta formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Geçerli bir e-posta adresi giriniz" },
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

    return NextResponse.json({ 
      success: true, 
      message: "Mesajınız başarıyla gönderildi" 
    }, { status: 201 });
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json(
      { error: "Mesaj gönderilemedi" },
      { status: 500 }
    );
  }
}
