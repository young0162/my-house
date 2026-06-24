import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { addressDbService } from "@/services/address.db";
import { CreateUserAddressRequest } from "@/types/checkout";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const addresses = await addressDbService.getAddresses(session.user.id);
  return NextResponse.json({ addresses });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: CreateUserAddressRequest = await request.json();

  if (!body.recipientName || !body.phoneNumber || !body.address) {
    return NextResponse.json(
      { error: "recipientName, phoneNumber, address are required" },
      { status: 400 },
    );
  }

  try {
    const address = await addressDbService.createAddress(session.user.id, body);
    return NextResponse.json(address, { status: 201 });
  } catch (error) {
    console.error("[POST /api/me/addresses]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
