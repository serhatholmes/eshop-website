export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

import { cloudinary } from "@/lib/cloudinary";

type UploadPayload = {
  url?: string;
  data?: string; // base64 data URL
  folder?: string;
};

const isValidSource = (value?: string) => {
  if (!value) return false;
  return value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:");
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as UploadPayload;
    const uploadSource = body.data ?? body.url;

    if (!isValidSource(uploadSource)) {
      return NextResponse.json(
        { error: "Geçerli bir görsel URL'si (http/https) veya base64 data girin." },
        { status: 400 }
      );
    }

    const folder = body.folder || "products";

    const result = await cloudinary.uploader.upload(uploadSource!, {
      folder,
      overwrite: false,
      resource_type: "auto",
    });

    return NextResponse.json({
      secureUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error: any) {
    console.error("POST /api/upload error", error);
    const message =
      error?.message ||
      error?.error?.message ||
      "Görsel yüklenemedi (URL'nin doğrudan görsel olduğundan emin olun).";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
