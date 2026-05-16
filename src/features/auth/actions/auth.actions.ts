"use server";

import { signIn, signOut } from "../../../auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { RegisterFormData, MerchantRegisterFormData, LoginFormData, MerchantLoginFormData } from "../type";

export async function registerConsumerAction(data: RegisterFormData) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { error: "User already exists." };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        hashedPassword,
        role: "CONSUMER",
      },
    });

    // Auto login
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Failed to login automatically." };
    }
    return { error: "Something went wrong." };
  }
}

export async function registerMerchantAction(data: MerchantRegisterFormData) {
  try {
    // Basic verification for Hackfest
    if (data.inviteCode !== "HACKFEST2026") {
      return { error: "invalid_invite" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: data.workEmail },
    });

    if (existingUser) {
      return { error: "Merchant with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.businessName,
        email: data.workEmail,
        hashedPassword,
        role: "MERCHANT",
      },
    });

    // Auto login
    await signIn("credentials", {
      email: data.workEmail,
      password: data.password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Failed to login automatically." };
    }
    return { error: "Something went wrong." };
  }
}

export async function loginAction(data: LoginFormData) {
  try {
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}

export async function merchantLoginAction(data: MerchantLoginFormData) {
  try {
    await signIn("credentials", {
      email: data.workEmail,
      password: data.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}
export async function logoutAction() {
  await signOut();
}
