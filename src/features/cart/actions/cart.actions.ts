"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { MOCK_PRODUCTS } from "@/data/mockProducts";

export async function getCartAction() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              merchant: {
                select: { name: true },
              },
            },
          },
        },
        orderBy: { id: "asc" },
      },
    },
  });

  return cart;
}

export async function addToCartAction(productId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Must be logged in to add to cart" };
  }

  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
      });
    }

    // Auto-seed product if it doesn't exist in DB (using MOCK_PRODUCTS)
    const dbProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!dbProduct) {
      const mock = MOCK_PRODUCTS.find(p => p.id === productId);
      if (mock) {
        let merchant = await prisma.user.findFirst({ where: { role: "MERCHANT" } });
        if (!merchant) {
           merchant = await prisma.user.create({ 
             data: { name: mock.merchantName, email: "mock@merchant.com", hashedPassword: "", role: "MERCHANT" }
           });
        }
        await prisma.product.create({
          data: {
            id: mock.id,
            title: mock.name,
            description: mock.fullDescription,
            startPrice: mock.originalPrice,
            endPrice: mock.discountedPrice,
            tier: mock.tier === "tier1" ? "TIER_1" : "TIER_2",
            expiresAt: new Date(mock.expiresAt),
            merchantId: merchant.id,
          }
        });
      } else {
        return { error: "Product not found" };
      }
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + 1 },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity: 1 },
      });
    }

    revalidatePath("/cart");
    revalidatePath(`/product/${productId}`);
    return { success: true };
  } catch (error) {
    console.error("Add to cart error:", error);
    return { error: "Failed to add to cart" };
  }
}

export async function updateCartItemQuantityAction(itemId: string, quantity: number) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update quantity" };
  }
}

export async function removeCartItemAction(itemId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await prisma.cartItem.delete({ where: { id: itemId } });
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    return { error: "Failed to remove item" };
  }
}
