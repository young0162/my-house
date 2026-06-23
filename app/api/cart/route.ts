import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CartSectionType } from "@/types/cart";

const imageBaseUrl = process.env.PRODUCT_IMAGE_BASE_URL ?? "";
const buildImageUrl = (filename: string) =>
  imageBaseUrl ? `${imageBaseUrl}/${filename}` : filename;

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const carts = await prisma.cart.findMany({
    where: {
      userId: session.user.id,
      product: { isActive: true },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      productId: true,
      count: true,
      product: {
        select: {
          id: true,
          image: true,
          name: true,
          price: true,
          isFreeShipping: true,
          brand: { select: { id: true, name: true } },
          productImages: {
            where: { type: "THUMBNAIL" },
            orderBy: { sortOrder: "asc" },
            take: 1,
            select: { url: true },
          },
        },
      },
      cartOptions: {
        orderBy: { id: "asc" },
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
  });

  const sectionMap = new Map<number, CartSectionType>();

  for (const cart of carts) {
    const { brand, productImages, image, name, price, isFreeShipping } = cart.product;
    const thumbnail = productImages[0]?.url ?? image;
    const optionLabel = cart.cartOptions
      .map((co) => `${co.optionValue.type.name}: ${co.optionValue.value}`)
      .join(" / ");

    const item = {
      id: cart.id,
      productId: cart.productId,
      image: buildImageUrl(thumbnail),
      brand: brand.name,
      name,
      optionLabel,
      price,
      quantity: cart.count,
      isFreeShipping,
      deliveryDate: "주문 후 3~5일 이내 출고",
      deliveryMethod: isFreeShipping ? "무료배송" : "일반배송",
    };

    if (sectionMap.has(brand.id)) {
      const section = sectionMap.get(brand.id)!;
      section.items.push(item);
      section.count = section.items.length;
    } else {
      sectionMap.set(brand.id, {
        id: `brand-${brand.id}`,
        label: brand.name,
        count: 1,
        items: [item],
      });
    }
  }

  return NextResponse.json({ sections: [...sectionMap.values()] });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { productId, optionValueIds } = body;

  if (
    typeof productId !== "number" ||
    !Array.isArray(optionValueIds) ||
    optionValueIds.length === 0 ||
    optionValueIds.some((id) => typeof id !== "number")
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId, isActive: true },
    select: {
      id: true,
      productOptions: {
        select: {
          productOptionValues: {
            select: { optionValueId: true },
          },
        },
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // 상품에 속한 모든 optionValueId 집합
  const validOptionValueIds = new Set(
    product.productOptions.flatMap((po) =>
      po.productOptionValues.map((pov) => pov.optionValueId),
    ),
  );

  // 요청한 옵션 값이 모두 해당 상품에 속하는지 검증
  if (optionValueIds.some((id: number) => !validOptionValueIds.has(id))) {
    return NextResponse.json({ error: "Invalid option value" }, { status: 400 });
  }

  // 옵션 타입 수와 선택한 옵션 수가 일치하는지 검증
  if (optionValueIds.length !== product.productOptions.length) {
    return NextResponse.json({ error: "All options must be selected" }, { status: 400 });
  }

  const userId = session.user.id;
  const requestedSet = new Set<number>(optionValueIds);

  // 같은 상품의 기존 카트 중 옵션 조합이 동일한 row 찾기
  const existingCarts = await prisma.cart.findMany({
    where: { userId, productId },
    select: {
      id: true,
      count: true,
      cartOptions: { select: { optionValueId: true } },
    },
  });

  const matched = existingCarts.find((cart) => {
    const cartSet = new Set(cart.cartOptions.map((co) => co.optionValueId));
    return (
      cartSet.size === requestedSet.size &&
      [...requestedSet].every((id) => cartSet.has(id))
    );
  });

  if (matched) {
    await prisma.cart.update({
      where: { id: matched.id },
      data: { count: matched.count + 1 },
    });
    return NextResponse.json({ success: true });
  }

  await prisma.$transaction(async (tx) => {
    const cart = await tx.cart.create({
      data: { userId, productId, count: 1 },
    });
    await tx.cartOption.createMany({
      data: optionValueIds.map((optionValueId: number) => ({
        cartId: cart.id,
        optionValueId,
      })),
    });
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
