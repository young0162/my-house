import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { addressDbService } from "@/services/address.db";
import { UpdateUserAddressRequest } from "@/types/checkout";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const addressId = Number(id);
  if (isNaN(addressId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body: UpdateUserAddressRequest = await request.json();

  try {
    const updated = await addressDbService.updateAddress(session.user.id, addressId, body);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("[PATCH /api/me/addresses/:id]", error);
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const addressId = Number(id);
  if (isNaN(addressId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const deleted = await addressDbService.deleteAddress(session.user.id, addressId);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/me/addresses/:id]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
