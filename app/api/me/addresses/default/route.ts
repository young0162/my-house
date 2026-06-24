import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { addressDbService } from "@/services/address.db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const address = await addressDbService.getDefaultAddress(session.user.id);
  return NextResponse.json({ address });
}
