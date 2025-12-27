export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type ParamPromise = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: ParamPromise) {
  try {
    const { id } = await params;
    const body = await request.json();
    const product = await prisma.product.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        price: body.price,
        image: body.image,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("PUT /api/products/[id] error", error);
    return NextResponse.json(
      { error: "Ürün güncellenemedi" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: ParamPromise) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ id });
  } catch (error) {
    console.error("DELETE /api/products/[id] error", error);
    return NextResponse.json(
      { error: "Ürün silinemedi" },
      { status: 500 }
    );
  }
}
