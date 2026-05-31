import { NextRequest, NextResponse } from "next/server";
import { updateCar, deleteCar } from "@/lib/cars";
import { getSession } from "@/lib/session";

async function requireAdmin() {
  const session = await getSession();
  if (!session.admin) return null;
  return session.admin;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const id = Number(params.id);
  const body = await req.json();
  await updateCar(id, body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await deleteCar(Number(params.id));
  return NextResponse.json({ ok: true });
}
