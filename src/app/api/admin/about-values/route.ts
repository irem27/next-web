import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

const DEFAULT_SECTION = {
  badgeText: "Unsere Werte",
  title: "Was uns besonders macht",
  isActive: true,
};

const DEFAULT_ITEMS = [
  {
    title: "Leidenschaft",
    description: "Jedes Detail wird mit Hingabe und Qualitätsbewusstsein umgesetzt.",
    icon: "heart",
    order: 0,
    isActive: true,
  },
  {
    title: "Integrität",
    description: "Transparente Prozesse und verlässliche Partnerschaften – von Anfang bis Ende.",
    icon: "shield",
    order: 1,
    isActive: true,
  },
  {
    title: "Nachhaltigkeit",
    description: "Wir handeln verantwortungsvoll und denken langfristig – für Menschen und Umwelt.",
    icon: "globe",
    order: 2,
    isActive: true,
  },
  {
    title: "Gemeinschaft",
    description: "Wir fördern Zusammenarbeit und bauen langfristige Beziehungen auf.",
    icon: "users",
    order: 3,
    isActive: true,
  },
];

export async function GET(request: NextRequest) {
  try {
    const siteKey = request.nextUrl.searchParams.get("siteKey") || "about";

    let section = await prisma.aboutValuesSection.findFirst({
      where: { siteKey },
    });

    if (!section) {
      section = await prisma.aboutValuesSection.create({
        data: { siteKey, ...DEFAULT_SECTION },
      });
    }

    let items = await prisma.aboutValueItem.findMany({
      where: { siteKey },
      orderBy: { order: "asc" },
    });

    if (items.length === 0) {
      await prisma.$transaction(
        DEFAULT_ITEMS.map((i) =>
          prisma.aboutValueItem.create({ data: { siteKey, ...i } })
        )
      );
      items = await prisma.aboutValueItem.findMany({
        where: { siteKey },
        orderBy: { order: "asc" },
      });
    }

    return NextResponse.json({ section, items });
  } catch (error) {
    console.error("Error fetching about values:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const siteKey = (body.siteKey as string) || "about";
    const nextSection = body.section as { badgeText?: string; title?: string; isActive?: boolean } | undefined;
    const nextItems = (body.items as Array<{
      id?: string;
      title: string;
      description?: string | null;
      icon?: string | null;
      order?: number | null;
      isActive?: boolean | null;
    }>) || [];

    const section = await prisma.aboutValuesSection.upsert({
      where: { siteKey },
      create: {
        siteKey,
        badgeText: nextSection?.badgeText ?? DEFAULT_SECTION.badgeText,
        title: nextSection?.title ?? DEFAULT_SECTION.title,
        isActive: typeof nextSection?.isActive === "boolean" ? nextSection.isActive : true,
      },
      update: {
        badgeText: nextSection?.badgeText ?? DEFAULT_SECTION.badgeText,
        title: nextSection?.title ?? DEFAULT_SECTION.title,
        isActive: typeof nextSection?.isActive === "boolean" ? nextSection.isActive : true,
        updatedAt: new Date(),
      },
    });

    const existing = await prisma.aboutValueItem.findMany({ where: { siteKey } });
    const keepIds = new Set<string>();

    const normalized = nextItems
      .filter((i) => i && typeof i.title === "string" && i.title.trim() !== "")
      .map((i, idx) => ({
        ...i,
        title: i.title.trim(),
        order: typeof i.order === "number" ? i.order : idx,
        icon: (i.icon || "heart").toString(),
        isActive: typeof i.isActive === "boolean" ? i.isActive : true,
      }));

    await prisma.$transaction(async (tx) => {
      for (const item of normalized) {
        if (item.id) {
          keepIds.add(item.id);
          await tx.aboutValueItem.update({
            where: { id: item.id },
            data: {
              title: item.title,
              description: item.description ?? null,
              icon: item.icon,
              order: Number(item.order),
              isActive: item.isActive,
              updatedAt: new Date(),
            },
          });
        } else {
          const created = await tx.aboutValueItem.create({
            data: {
              siteKey,
              title: item.title,
              description: item.description ?? null,
              icon: item.icon,
              order: Number(item.order),
              isActive: item.isActive,
            },
          });
          keepIds.add(created.id);
        }
      }

      const toDelete = existing
        .map((e) => e.id)
        .filter((id) => !keepIds.has(id));

      if (toDelete.length > 0) {
        await tx.aboutValueItem.deleteMany({ where: { id: { in: toDelete } } });
      }
    });

    const items = await prisma.aboutValueItem.findMany({
      where: { siteKey },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ section, items });
  } catch (error) {
    console.error("Error updating about values:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

