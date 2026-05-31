import { NextRequest, NextResponse } from "next/server";
import { updateTestimonial, deleteTestimonial } from "@/lib/cars";
import { getSession } from "@/lib/session";

async function requireAdmin() {
  const session = await getSession();
  return session.admin ?? null;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await updateTestimonial(Number(params.id), await req.json());
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await deleteTestimonial(Number(params.id));
  return NextResponse.json({ ok: true });
}
