import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Bu endpoint varsayılan admin kullanıcıyı oluşturur
// Sadece hiç kullanıcı yoksa çalışır
export async function POST() {
  try {
    // Kullanıcı var mı kontrol et
    const userCount = await prisma.user.count();

    if (userCount > 0) {
      return NextResponse.json(
        { message: "Kullanıcı zaten mevcut", exists: true },
        { status: 200 }
      );
    }

    // Varsayılan admin şifresini hashle
    const hashedPassword = await bcrypt.hash("ALAmira2026!.", 12);

    // Varsayılan admin kullanıcı oluştur
    const user = await prisma.user.create({
      data: {
        email: "admin@alamira.com",
        password: hashedPassword,
        name: "Admin",
        role: "admin",
      },
    });

    return NextResponse.json({
      message: "Varsayılan admin kullanıcı oluşturuldu",
      user: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Seed işlemi başarısız" },
      { status: 500 }
    );
  }
}
