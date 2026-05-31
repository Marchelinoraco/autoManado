import { NextRequest, NextResponse } from "next/server";
import { getTestimonials, createTestimonial } from "@/lib/cars";
import { getSession } from "@/lib/session";

export async function GET() {
  const list = await getTestimonials();
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const id = await createTestimonial(body);
  return NextResponse.json({ id }, { status: 201 });
}
