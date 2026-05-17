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
              images: true,
            },
          },
        },
        orderBy: { id: "asc" },
      },
    },
  });

  return cart;
}

export async function addToCartAction(productId: string, requestedQuantity: number = 1) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Must be logged in to add to cart" };
  }

  try {
    // Verify user exists in DB (JWT may hold stale ID after re-seed)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true }
    });

    if (!user) {
      return { error: "Your account was not found. Please log out and log back in." };
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id },
      });
    }

    // Auto-seed product if it doesn't exist in DB (using MOCK_PRODUCTS)
    let dbProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!dbProduct) {
      const mock = MOCK_PRODUCTS.find(p => p.id === productId);
      if (mock) {
        let merchant = await prisma.user.findFirst({ where: { role: "MERCHANT" } });
        if (!merchant) {
           merchant = await prisma.user.create({ 
             data: { name: mock.merchantName, email: "mock@merchant.com", hashedPassword: "", role: "MERCHANT" }
           });
        }
        dbProduct = await prisma.product.create({
          data: {
            id: mock.id,
            title: mock.name,
            description: mock.fullDescription,
            startPrice: mock.originalPrice,
            endPrice: mock.discountedPrice,
            tier: mock.tier === "tier1" ? "TIER_1" : "TIER_2",
            expiresAt: new Date(mock.expiresAt),
            merchantId: merchant.id,
            quantity: mock.quantity || 1,
          }
        });
      } else {
        return { error: "Product not found" };
      }
    }

    const finalQuantity = Math.min(requestedQuantity, dbProduct.quantity);

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: finalQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity: finalQuantity },
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
