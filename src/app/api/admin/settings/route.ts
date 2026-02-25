import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Genel site ayarlarını getir
export async function GET() {
  try {
    let settings = await prisma.generalSettings.findFirst({
      where: { isActive: true },
    });

    if (!settings) {
      // Default değerlerle oluştur
      settings = await prisma.generalSettings.create({
        data: {
          siteName: "Alamira Rice",
          siteTagline: "Pure Rice, Pure Life",
          siteDescription: "Premium quality Basmati and Sella rice products",
          email: "info@alamira.com",
          phone: "(000) 000-0000",
          address: "123 Rice Street, Agriculture City",
          facebook: "https://facebook.com/alamira",
          instagram: "https://instagram.com/alamira",
          twitter: "https://twitter.com/alamira",
          metaTitle: "Alamira Rice | Premium Basmati & Sella Rice",
          metaDescription: "Pure Rice, Pure Life - Premium quality Basmati and Sella rice products grown with care.",
          metaKeywords: "rice, basmati, sella, organic, premium, alamira",
          footerText: "Alamira Rice brings you the finest quality rice, grown with integrity and love.",
          copyrightText: "© 2026 Alamira Rice. All rights reserved.",
          isActive: true,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json(
      { error: "Ayarlar yüklenemedi" },
      { status: 500 }
    );
  }
}

// PUT - Genel site ayarlarını güncelle
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    let settings = await prisma.generalSettings.findFirst({
      where: { isActive: true },
    });

    if (settings) {
      settings = await prisma.generalSettings.update({
        where: { id: settings.id },
        data: {
          siteName: body.siteName,
          siteTagline: body.siteTagline,
          siteDescription: body.siteDescription,
          logo: body.logo,
          logoAlamira: body.logoAlamira,
          logoLogistics: body.logoLogistics,
          favicon: body.favicon,
          email: body.email,
          phone: body.phone,
          address: body.address,
          facebook: body.facebook,
          instagram: body.instagram,
          twitter: body.twitter,
          youtube: body.youtube,
          linkedin: body.linkedin,
          metaTitle: body.metaTitle,
          metaDescription: body.metaDescription,
          metaKeywords: body.metaKeywords,
          footerText: body.footerText,
          copyrightText: body.copyrightText,
        },
      });
    } else {
      settings = await prisma.generalSettings.create({
        data: body,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Ayarlar güncellenemedi" },
      { status: 500 }
    );
  }
}
