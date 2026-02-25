import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULTS: Record<string, {
  brandName: string;
  brandDescription: string;
  newsletterTitle: string;
  accentColor: string;
  copyrightText: string;
  topLinks: string;
  serviceLinks: string;
  workingHours: string;
}> = {
  alamira: {
    brandName: "ALAMIRA",
    brandDescription: "Premium quality rice, grown with care and tradition. Experience the finest rice from our family to yours.",
    newsletterTitle: "Rice Grown With\nIntegrity And Love",
    accentColor: "#868792",
    copyrightText: "© 2026 ALAMIRA. All Rights Reserved.",
    topLinks: JSON.stringify([
      { label: "About Us", href: "/about" },
      { label: "Products", href: "/products" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ]),
    serviceLinks: JSON.stringify([
      { label: "Premium Basmati Rice", href: "/products" },
      { label: "Jasmine Rice", href: "/products" },
      { label: "Organic Rice", href: "/products" },
      { label: "Wholesale", href: "/contact" },
    ]),
    workingHours: JSON.stringify([
      { day: "Mon-Fri", hours: "8:00 AM - 7:00 PM" },
      { day: "Sunday", hours: "2:00 PM - 9:00 PM" },
      { day: "Saturday", hours: "Close" },
    ]),
  },
  logistics: {
    brandName: "LOGISTICS",
    brandDescription: "Reliable logistics and transportation solutions. Connecting businesses worldwide with seamless supply chain management.",
    newsletterTitle: "Delivering Excellence\nAcross The Globe",
    accentColor: "#f06721",
    copyrightText: "© 2026 Imperial Logistics. All Rights Reserved.",
    topLinks: JSON.stringify([
      { label: "About Us", href: "/about" },
      { label: "Services", href: "/logistics-landing#services" },
      { label: "News", href: "/logistics-landing#news" },
      { label: "Contact", href: "/contact" },
    ]),
    serviceLinks: JSON.stringify([
      { label: "Road Freight", href: "/logistics-landing" },
      { label: "Sea Freight", href: "/logistics-landing" },
      { label: "Air Freight", href: "/logistics-landing" },
      { label: "Warehousing", href: "/logistics-landing" },
    ]),
    workingHours: JSON.stringify([
      { day: "Mon-Fri", hours: "8:00 AM - 6:00 PM" },
      { day: "Saturday", hours: "9:00 AM - 2:00 PM" },
      { day: "Sunday", hours: "Close" },
    ]),
  },
};

export async function GET(request: NextRequest) {
  try {
    const siteKey = request.nextUrl.searchParams.get("siteKey") || "alamira";

    let config = await prisma.footerConfig.findFirst({
      where: { siteKey, isActive: true },
    });

    if (!config) {
      const defaults = DEFAULTS[siteKey] || DEFAULTS.alamira;
      config = await prisma.footerConfig.create({
        data: { siteKey, ...defaults, isActive: true },
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error fetching footer config:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const config = await prisma.footerConfig.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error updating footer config:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
