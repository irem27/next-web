import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Bu endpoint varsayılan admin kullanıcıyı oluşturur
// Sadece hiç kullanıcı yoksa çalışır
export async function POST() {
  try {
    const hashedPassword = await bcrypt.hash("ALAmira2026!.", 12);

    const user = await prisma.user.upsert({
      where: { email: "admin@alamira.com" },
      update: {
        password: hashedPassword,
        role: "admin",
        isActive: true,
      },
      create: {
        email: "admin@alamira.com",
        password: hashedPassword,
        name: "Admin",
        role: "admin",
        isActive: true,
      },
    });

    return NextResponse.json({
      message: "Admin kullanıcı oluşturuldu/güncellendi",
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Seed işlemi başarısız" },
      { status: 500 }
    );
  }
}
