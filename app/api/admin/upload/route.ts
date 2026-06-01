import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import cloudinary, { FOLDER } from "@/lib/cloudinary";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"];
const MAX_SIZE_MB   = 10;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "Tidak ada file yang dikirim." }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ message: "Format tidak didukung. Gunakan JPG, PNG, atau WebP." }, { status: 400 });
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json({ message: `Ukuran file maksimal ${MAX_SIZE_MB}MB.` }, { status: 400 });
    }

    // Konversi File → base64 data URI untuk Cloudinary
    const bytes  = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    // Nama file bersih sebagai public_id
    const safeName = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase()
      .slice(0, 60);

    const result = await cloudinary.uploader.upload(dataUri, {
      folder:           FOLDER,
      public_id:        `${safeName}-${Date.now()}`,
      overwrite:        false,
      resource_type:    "image",
      transformation:   [{ quality: "auto", fetch_format: "auto" }],
    });

    return NextResponse.json({
      url:       result.secure_url,
      public_id: result.public_id,
      filename:  result.public_id.split("/").pop(),
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json({ message: "Upload gagal. Coba lagi." }, { status: 500 });
  }
}
