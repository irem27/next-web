const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

async function seed() {
  const prisma = new PrismaClient();
  
  try {
    const hashedPassword = await bcrypt.hash("ALAmira2026!.", 12);
    
    const user = await prisma.user.upsert({
      where: { email: "admin@alamira.com" },
      update: { password: hashedPassword },
      create: {
        email: "admin@alamira.com",
        password: hashedPassword,
        name: "Admin",
        role: "admin",
      },
    });
    
    console.log("✅ Admin user created/updated:", user.email);
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
