import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Contact Section settings
export async function GET() {
  try {
    let section = await prisma.contactSection.findFirst({
      where: { isActive: true },
    });

    if (!section) {
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

// PUT - Update Contact Section settings
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    let section = await prisma.contactSection.findFirst({
      where: { isActive: true },
    });

    if (section) {
      section = await prisma.contactSection.update({
        where: { id: section.id },
        data: {
          badgeText: body.badgeText,
          title: body.title,
          description: body.description,
          locationTitle: body.locationTitle,
          locationText: body.locationText,
          emailTitle: body.emailTitle,
          email1: body.email1,
          email2: body.email2,
          phoneTitle: body.phoneTitle,
          phone1: body.phone1,
          phone2: body.phone2,
          formTitle: body.formTitle,
          formDescription: body.formDescription,
          contactImage: body.contactImage,
        },
      });
    } else {
      section = await prisma.contactSection.create({
        data: body,
      });
    }

    return NextResponse.json(section);
  } catch (error) {
    console.error("Contact section update error:", error);
    return NextResponse.json(
      { error: "Contact section güncellenemedi" },
      { status: 500 }
    );
  }
}
