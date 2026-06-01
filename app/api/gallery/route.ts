import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const rows = await query<{
      id: number;
      filename: string;
      url: string;
      public_id: string;
      size: number;
      width: number | null;
      height: number | null;
      created_at: string;
    }>("SELECT id, filename, url, size, width, height, created_at FROM gallery ORDER BY created_at DESC LIMIT 12");

    return NextResponse.json(rows.map((r) => ({
      id: r.id,
      filename: r.filename,
      url: r.url,
      size: r.size,
      width: r.width,
      height: r.height,
      createdAt: r.created_at,
    })));
  } catch (err) {
    console.error("Gallery fetch error:", err);
    return NextResponse.json([]);
  }
}
