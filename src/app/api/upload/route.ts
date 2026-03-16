import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const hasCloudinary =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Cloudinary ENV varsa Cloudinary'ye yükle
    if (hasCloudinary) {
      const result = await new Promise<{ secure_url: string; public_id: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: `im-admin/${folder}`, resource_type: "auto" },
              (error, result) => {
                if (error || !result) return reject(error);
                resolve(result as { secure_url: string; public_id: string });
              }
            )
            .end(buffer);
        }
      );
      return NextResponse.json({ url: result.secure_url, name: file.name });
    }

    // Cloudinary yoksa yerel dosya sistemine kaydet (dev / fallback)
    const uniqueName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, uniqueName), buffer);
    const url = `/uploads/${folder}/${uniqueName}`;
    return NextResponse.json({ url, name: file.name });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file", detail: String(error) },
      { status: 500 }
    );
  }
}
