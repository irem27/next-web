const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

async function testAuth() {
  const prisma = new PrismaClient();
  
  const user = await prisma.user.findUnique({
    where: { email: "admin@alamira.com" }
  });
  
  if (!user) {
    console.log("❌ User not found");
    return;
  }
  
  console.log("User found:", user.email);
  console.log("Stored hash:", user.password);
  
  const password = "ALAmira2026!.";
  const isValid = await bcrypt.compare(password, user.password);
  
  console.log("Password valid:", isValid);
  
  await prisma.$disconnect();
}

testAuth();
