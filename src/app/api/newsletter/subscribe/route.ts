import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json({ message: "Already subscribed" }, { status: 200 });
      }
      // Reactivate subscription
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: { isActive: true },
      });
      return NextResponse.json({ message: "Subscription reactivated" }, { status: 200 });
    }

    // Create new subscriber
    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    return NextResponse.json({ message: "Successfully subscribed" }, { status: 201 });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
