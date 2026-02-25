import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

const DEFAULTS = {
  title: "Ready to Experience Pure Rice?",
  description:
    "Discover our premium collection of Basmati and Sella rice. Taste the difference that quality and care makes.",
  primaryButtonText: "View Our Products",
  primaryButtonLink: "/products",
  secondaryButtonText: "Contact Us",
  secondaryButtonLink: "/contact",
  isActive: true,
};

export async function GET(request: NextRequest) {
  try {
    const siteKey = request.nextUrl.searchParams.get("siteKey") || "about";

    let cta = await prisma.aboutCtaSection.findFirst({
      where: { siteKey },
    });

    if (!cta) {
      cta = await prisma.aboutCtaSection.create({
        data: { siteKey, ...DEFAULTS },
      });
    }

    return NextResponse.json(cta);
  } catch (error) {
    console.error("Error fetching about CTA:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const {
      id,
      siteKey = "about",
      title,
      description,
      primaryButtonText,
      primaryButtonLink,
      secondaryButtonText,
      secondaryButtonLink,
      isActive,
    } = body;

    if (id) {
      const updated = await prisma.aboutCtaSection.update({
        where: { id },
        data: {
          title,
          description,
          primaryButtonText,
          primaryButtonLink,
          secondaryButtonText,
          secondaryButtonLink,
          isActive,
          updatedAt: new Date(),
        },
      });
      return NextResponse.json(updated);
    }

    const createdOrUpdated = await prisma.aboutCtaSection.upsert({
      where: { siteKey },
      create: {
        siteKey,
        title: title ?? DEFAULTS.title,
        description: description ?? DEFAULTS.description,
        primaryButtonText: primaryButtonText ?? DEFAULTS.primaryButtonText,
        primaryButtonLink: primaryButtonLink ?? DEFAULTS.primaryButtonLink,
        secondaryButtonText: secondaryButtonText ?? DEFAULTS.secondaryButtonText,
        secondaryButtonLink: secondaryButtonLink ?? DEFAULTS.secondaryButtonLink,
        isActive: typeof isActive === "boolean" ? isActive : true,
      },
      update: {
        title: title ?? DEFAULTS.title,
        description: description ?? DEFAULTS.description,
        primaryButtonText: primaryButtonText ?? DEFAULTS.primaryButtonText,
        primaryButtonLink: primaryButtonLink ?? DEFAULTS.primaryButtonLink,
        secondaryButtonText: secondaryButtonText ?? DEFAULTS.secondaryButtonText,
        secondaryButtonLink: secondaryButtonLink ?? DEFAULTS.secondaryButtonLink,
        isActive: typeof isActive === "boolean" ? isActive : true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(createdOrUpdated);
  } catch (error) {
    console.error("Error updating about CTA:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

