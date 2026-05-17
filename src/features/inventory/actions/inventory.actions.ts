"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProductAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "MERCHANT") {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const startPrice = parseFloat(formData.get("startPrice") as string);
  const tier = formData.get("tier") as "TIER_1" | "TIER_2";
  const endPriceStr = formData.get("endPrice") as string | null;
  const endPrice = tier === "TIER_2" ? 0 : (endPriceStr ? parseFloat(endPriceStr) : NaN);
  const expiresAt = new Date(formData.get("expiresAt") as string);
  const imageUrls = JSON.parse(formData.get("imageUrls") as string) as string[];
  const quantity = parseInt(formData.get("quantity") as string);
  const freshnessScore = parseInt(formData.get("freshnessScore") as string);
  const estimatedVolume = parseFloat(formData.get("estimatedVolume") as string);
  const ecologicalClassificationStr = formData.get("ecologicalClassification") as string;
  const ecologicalClassification = ecologicalClassificationStr ? ecologicalClassificationStr.split(",").map(s => s.trim()).filter(s => s.length > 0) : [];
  const pickupNotes = formData.get("pickupNotes") as string | null;

  if (!title || !description || isNaN(startPrice) || isNaN(endPrice) || !tier || !expiresAt || imageUrls.length === 0) {
    return { error: "All fields are required." };
  }

  // Verify the merchant user exists in the database
  const merchantUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true }
  });

  if (!merchantUser) {
    console.error("Merchant not found in DB. Session user ID:", session.user.id);
    return { error: "Your account was not found. Please log out and log back in." };
  }

  try {
    const product = await prisma.product.create({
      data: {
        title,
        description,
        startPrice,
        endPrice,
        tier,
        expiresAt,
        quantity: isNaN(quantity) ? 1 : quantity,
        freshnessScore: isNaN(freshnessScore) ? null : freshnessScore,
        estimatedVolume: isNaN(estimatedVolume) ? null : estimatedVolume,
        ecologicalClassification,
        pickupNotes: pickupNotes || null,
        merchantId: merchantUser.id,
        images: {
          create: imageUrls.map((url, i) => ({
            imgUrl: url,
            isPrimary: i === 0,
          })),
        },
      },
    });

    revalidatePath("/merchant");
    return { success: true, productId: product.id };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create product." };
  }
}

export async function updateProductAction(productId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "MERCHANT") {
    return { error: "Unauthorized" };
  }

  // Verify ownership
  const existing = await prisma.product.findUnique({
    where: { id: productId },
    select: { merchantId: true }
  });

  if (!existing || existing.merchantId !== session.user.id) {
    return { error: "Product not found or unauthorized." };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const startPrice = parseFloat(formData.get("startPrice") as string);
  const tier = formData.get("tier") as "TIER_1" | "TIER_2";
  const endPriceStr = formData.get("endPrice") as string | null;
  const endPrice = tier === "TIER_2" ? 0 : (endPriceStr ? parseFloat(endPriceStr) : NaN);
  const expiresAt = new Date(formData.get("expiresAt") as string);
  const imageUrls = JSON.parse(formData.get("imageUrls") as string) as string[];
  const quantity = parseInt(formData.get("quantity") as string);
  const freshnessScore = parseInt(formData.get("freshnessScore") as string);

  if (!title || !description || isNaN(startPrice) || isNaN(endPrice) || !tier || !expiresAt || imageUrls.length === 0) {
    return { error: "All fields are required." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Update product info
      await tx.product.update({
        where: { id: productId },
        data: {
          title,
          description,
          startPrice,
          endPrice,
          tier,
          expiresAt,
          quantity: isNaN(quantity) ? 1 : quantity,
          freshnessScore: isNaN(freshnessScore) ? null : freshnessScore,
        },
      });

      // Update images
      // First, delete all existing images
      await tx.productImage.deleteMany({
        where: { productId }
      });
      // Then, create new ones
      await tx.productImage.createMany({
        data: imageUrls.map((url, i) => ({
          productId,
          imgUrl: url,
          isPrimary: i === 0,
        }))
      });
    });

    revalidatePath("/merchant");
    revalidatePath(`/merchant/products/${productId}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update product." };
  }
}

export async function deleteProductAction(productId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "MERCHANT") {
    return { error: "Unauthorized" };
  }

  // Verify ownership
  const existing = await prisma.product.findUnique({
    where: { id: productId },
    select: { merchantId: true }
  });

  if (!existing || existing.merchantId !== session.user.id) {
    return { error: "Product not found or unauthorized." };
  }

  try {
    await prisma.product.delete({
      where: { id: productId }
    });

    revalidatePath("/merchant");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete product. It may have active orders." };
  }
}