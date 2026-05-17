"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProductAction(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "MERCHANT") {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const startPrice = parseFloat(formData.get("startPrice") as string);
  const endPrice = parseFloat(formData.get("endPrice") as string);
  const tier = formData.get("tier") as "TIER_1" | "TIER_2";
  const expiresAt = new Date(formData.get("expiresAt") as string);
  const imageUrls = JSON.parse(formData.get("imageUrls") as string) as string[];

  if (!title || !description || isNaN(startPrice) || isNaN(endPrice) || !tier || !expiresAt || imageUrls.length === 0) {
    return { error: "All fields are required." };
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
        merchantId: session.user.id,
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