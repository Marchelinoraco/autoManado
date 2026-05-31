import { NextRequest, NextResponse } from "next/server";
import slugify from "@/lib/slugify";
import { createCar, getCars } from "@/lib/cars";
import { getSession } from "@/lib/session";

export async function GET() {
  const cars = await getCars();
  return NextResponse.json(cars);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // generate slug from name
  const slug = slugify(body.name);
  const id = await createCar({ ...body, slug, images: body.images ?? [] });

  return NextResponse.json({ id, slug }, { status: 201 });
}
