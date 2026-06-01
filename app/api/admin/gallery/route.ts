import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import cloudinary, { FOLDER } from "@/lib/cloudinary";

export async function GET() {
  try {
    const result = await cloudinary.api.resources({
      type:        "upload",
      prefix:      FOLDER,
      max_results: 200,
      resource_type: "image",
    });

    const images = result.resources.map((r: {
      public_id: string;
      secure_url: string;
      bytes: number;
      created_at: string;
      width: number;
      height: number;
    }) => ({
      public_id:  r.public_id,
      filename:   r.public_id.split("/").pop(),
      url:        r.secure_url,
      size:       r.bytes,
      createdAt:  r.created_at,
      width:      r.width,
      height:     r.height,
    }));

    // Terbaru dulu
    images.sort((a: { createdAt: string }, b: { createdAt: string }) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(images);
  } catch (err) {
    console.error("Cloudinary gallery error:", err);
    return NextResponse.json([]);
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session.admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { public_id } = await req.json();

  if (!public_id || !String(public_id).startsWith(FOLDER)) {
    return NextResponse.json({ message: "public_id tidak valid." }, { status: 400 });
  }

  try {
    await cloudinary.uploader.destroy(public_id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "Gagal menghapus gambar." }, { status: 500 });
  }
}
