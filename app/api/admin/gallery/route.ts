import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import cloudinary, { FOLDER } from "@/lib/cloudinary";
import { query } from "@/lib/db";

export async function GET() {
  try {
    // Baca dari database — terbaru dulu
    const rows = await query<{
      id: number;
      filename: string;
      url: string;
      public_id: string;
      size: number;
      width: number | null;
      height: number | null;
      created_at: string;
    }>("SELECT * FROM gallery ORDER BY created_at DESC");

    return NextResponse.json(rows.map((r) => ({
      ...r,
      createdAt: r.created_at,
    })));
  } catch (err) {
    console.error("Gallery fetch error:", err);
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
    // Hapus dari Cloudinary
    await cloudinary.uploader.destroy(public_id);

    // Hapus dari database
    await query("DELETE FROM gallery WHERE public_id = ?", [public_id]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Gallery delete error:", err);
    return NextResponse.json({ message: "Gagal menghapus gambar." }, { status: 500 });
  }
}
