import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const DEFAULTS: Record<string, { title: string; description: string; infoCardTitle: string; infoCardText: string; image1: string; image1Alt: string; image2: string; image2Alt: string }> = {
  alamira: {
    title: "Rice Grown With Integrity And Love",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed Lorem ipsum dolor sit amet, consectetur adipiscing elit,",
    infoCardTitle: "Alamira Basmati Sella Rice",
    infoCardText: "Whether you are making a curry in a hurry or simple rice salad, we never compromise on purity, taste, quality or nutrition, so with Tilda you know you are in good hands.",
    image1: "/images/rice-bowl.svg",
    image1Alt: "Fresh basmati rice in a wooden bowl with green rice fields in background",
    image2: "/images/farmer-harvest.svg",
    image2Alt: "Farmer harvesting rice in golden sunlight",
  },
  about: {
    title: "About Us",
    description: "Edit this content from the admin panel. This page is independent from Alamira and Logistics.",
    infoCardTitle: "Our Story",
    infoCardText: "Use this section to tell your brand story, mission, and values. You can also set images and badges from the admin panel.",
    image1: "/images/rice-bowl.svg",
    image1Alt: "About image 1",
    image2: "/images/farmer-harvest.svg",
    image2Alt: "About image 2",
  },
  logistics: {
    title: "Delivering Excellence Across The Globe",
    description: "We provide reliable and efficient logistics solutions, connecting businesses worldwide with seamless transportation and supply chain management.",
    infoCardTitle: "Global Logistics Solutions",
    infoCardText: "From warehousing to last-mile delivery, our comprehensive logistics services ensure your goods reach their destination safely and on time.",
    image1: "/images/logistics-about-1.svg",
    image1Alt: "Modern logistics warehouse with efficient operations",
    image2: "/images/logistics-about-2.svg",
    image2Alt: "Global shipping and transportation network",
  },
};

export async function GET(request: NextRequest) {
  try {
    const siteKey = request.nextUrl.searchParams.get("siteKey") || "alamira";

    let aboutSection = await prisma.aboutSection.findFirst({
      where: { siteKey, isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!aboutSection) {
      const defaults = DEFAULTS[siteKey] || DEFAULTS.alamira;
      aboutSection = await prisma.aboutSection.create({
        data: {
          siteKey,
          badgeText: "About Us",
          title: defaults.title,
          subtitle: "",
          description: defaults.description,
          happyUsersCount: "2000+",
          happyUsersText: "Happy Users Rating",
          image1: defaults.image1,
          image1Alt: defaults.image1Alt,
          image2: defaults.image2,
          image2Alt: defaults.image2Alt,
          infoCardTitle: defaults.infoCardTitle,
          infoCardText: defaults.infoCardText,
          badgePercent: "100%",
          badgeSubtext: "Pure Rice, Pure Life",
          isActive: true,
        },
      });
    }

    return NextResponse.json(aboutSection);
  } catch (error) {
    console.error("Error fetching about section:", error);
    return NextResponse.json({ error: "Failed to fetch about section" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id, badgeText, title, subtitle, description,
      happyUsersCount, happyUsersText,
      image1, image1Alt, image2, image2Alt,
      infoCardTitle, infoCardText,
      badgePercent, badgeSubtext, isActive,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const aboutSection = await prisma.aboutSection.update({
      where: { id },
      data: {
        badgeText, title, subtitle, description,
        happyUsersCount, happyUsersText,
        image1, image1Alt, image2, image2Alt,
        infoCardTitle, infoCardText,
        badgePercent, badgeSubtext, isActive,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(aboutSection);
  } catch (error) {
    console.error("Error updating about section:", error);
    return NextResponse.json({ error: "Failed to update about section" }, { status: 500 });
  }
}
