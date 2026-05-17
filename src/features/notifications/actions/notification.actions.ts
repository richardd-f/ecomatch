"use server";

import webpush from "web-push";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { PushSubscriptionObj, NotificationPayload } from "@/interfaces/notification.types";

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U";
const privateVapidKey = process.env.VAPID_PRIVATE_KEY || "Wb1A3N-BzvPymhQ5N0V1P2_b1B7wJ9G-QfL8H4W_p0Y";

webpush.setVapidDetails(
  "mailto:test@example.com",
  publicVapidKey,
  privateVapidKey
);

export async function subscribeToNotificationsAction(subscription: PushSubscriptionObj, latitude?: number, longitude?: number) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        pushSubscription: JSON.stringify(subscription),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to subscribe:", error);
    return { error: "Failed to save subscription" };
  }
}

function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function notifyNearbyUsersAction(merchantLat: number, merchantLon: number, payload: NotificationPayload, radiusKm: number = 10) {
  try {
    const users = await prisma.user.findMany({
      where: {
        pushSubscription: { not: null },
        latitude: { not: null },
        longitude: { not: null },
      },
    });

    const nearbyUsers = users.filter((user) => {
      if (user.latitude === null || user.longitude === null) return false;
      const distance = getDistanceInKm(merchantLat, merchantLon, user.latitude, user.longitude);
      return distance <= radiusKm;
    });

    const notifications = nearbyUsers.map(async (user) => {
      try {
        if (!user.pushSubscription) return;
        const sub = JSON.parse(user.pushSubscription) as PushSubscriptionObj;
        await webpush.sendNotification(sub, JSON.stringify(payload));
      } catch (err) {
        console.error(`Failed to notify user ${user.id}:`, err);
      }
    });

    await Promise.all(notifications);
    return { success: true, notifiedCount: nearbyUsers.length };
  } catch (error) {
    console.error("Failed to notify users:", error);
    return { error: "Failed to dispatch notifications" };
  }
}
