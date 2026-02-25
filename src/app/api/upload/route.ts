import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "uploads";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dosya adını benzersiz yap
    const uniqueName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    const filePath = path.join(uploadDir, uniqueName);

    // Klasörü oluştur
    await mkdir(uploadDir, { recursive: true });

    // Dosyayı kaydet
    await writeFile(filePath, buffer);

    // Public URL'i döndür
    const url = `/uploads/${folder}/${uniqueName}`;

    return NextResponse.json({ url, name: file.name });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
