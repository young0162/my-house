import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CheckoutResponse, CheckoutSection } from "@/types/checkout";

const imageBaseUrl = process.env.PRODUCT_IMAGE_BASE_URL ?? "";
const buildImageUrl = (filename: string) =>
  imageBaseUrl ? `${imageBaseUrl}/${filename}` : filename;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const checkout = await prisma.checkout.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      source: true,
      status: true,
      items: {
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          productId: true,
          quantity: true,
          product: {
            select: {
              name: true,
              price: true,
              isFreeShipping: true,
              image: true,
              brand: { select: { id: true, name: true } },
              productImages: {
                where: { type: "THUMBNAIL" },
                orderBy: { sortOrder: "asc" },
                take: 1,
                select: { url: true },
              },
            },
          },
          options: {
            select: {
              optionValue: {
                select: {
                  value: true,
                  type: { select: { name: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!checkout || checkout.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (checkout.status !== "PENDING") {
    return NextResponse.json({ error: "Checkout is no longer available" }, { status: 409 });
  }

  const sectionMap = new Map<number, CheckoutSection>();

  for (const item of checkout.items) {
    const { product } = item;
    const thumbnail = product.productImages[0]?.url ?? product.image;
    const optionLabel = item.options
      .map((o) => `${o.optionValue.type.name}: ${o.optionValue.value}`)
      .join(" / ");

    const itemView = {
      id: item.id,
      productId: item.productId,
      image: buildImageUrl(thumbnail),
      brand: product.brand.name,
      name: product.name,
      optionLabel,
      price: product.price,
      quantity: item.quantity,
      isFreeShipping: product.isFreeShipping,
      deliveryMethod: product.isFreeShipping ? "무료배송" : "일반배송",
    };

    const brandId = product.brand.id;
    if (sectionMap.has(brandId)) {
      const section = sectionMap.get(brandId)!;
      section.items.push(itemView);
      section.count = section.items.length;
    } else {
      sectionMap.set(brandId, {
        id: `brand-${brandId}`,
        label: product.brand.name,
        count: 1,
        items: [itemView],
      });
    }
  }

  const sections = [...sectionMap.values()];
  const totalProductPrice = sections
    .flatMap((s) => s.items)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 0;
  const finalPrice = totalProductPrice + shippingFee;
  const pointEarned = Math.floor(finalPrice * 0.001);

  const response: CheckoutResponse = {
    id: checkout.id,
    source: checkout.source,
    status: checkout.status,
    totalProductPrice,
    shippingFee,
    finalPrice,
    pointEarned,
    sections,
  };

  return NextResponse.json(response);
}
