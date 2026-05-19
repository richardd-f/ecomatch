import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new (PrismaClient as any)({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Clean up existing data (urutan penting karena foreign key) ───
  // await prisma.orderItem.deleteMany();
  // await prisma.order.deleteMany();
  // await prisma.cartItem.deleteMany();
  // await prisma.cart.deleteMany();
  // await prisma.productImage.deleteMany();
  // await prisma.product.deleteMany();
  // await prisma.user.deleteMany();

  // ─── Users ───────────────────────────────────────────────────────

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Merchants
  const merchant1 = await prisma.user.upsert({
    where: { email: "sari@warungmbaksari.com" },
    update: {},
    create: {
      name: "Warung Mbak Sari",
      email: "sari@warungmbaksari.com",
      hashedPassword,
      role: "MERCHANT",
      latitude: -7.2575,   // Surabaya
      longitude: 112.7521,
    },
  });

  const merchant2 = await prisma.user.upsert({
    where: { email: "bumi@kafehijau.com" },
    update: {},
    create: {
      name: "Kafe Bumi Hijau",
      email: "bumi@kafehijau.com",
      hashedPassword,
      role: "MERCHANT",
      latitude: -7.2657,
      longitude: 112.7418,
    },
  });

  const merchant3 = await prisma.user.upsert({
    where: { email: "roti@nusantara.com" },
    update: {},
    create: {
      name: "Bakeri Roti Nusantara",
      email: "roti@nusantara.com",
      hashedPassword,
      role: "MERCHANT",
      latitude: -7.2489,
      longitude: 112.7689,
    },
  });

  const merchant4 = await prisma.user.upsert({
    where: { email: "tini@dapursehat.com" },
    update: {},
    create: {
      name: "Dapur Sehat Bu Tini",
      email: "tini@dapursehat.com",
      hashedPassword,
      role: "MERCHANT",
      latitude: -7.2712,
      longitude: 112.7345,
    },
  });

  // Consumers
  const consumer1 = await prisma.user.upsert({
    where: { email: "budi@gmail.com" },
    update: {},
    create: {
      name: "Budi Santoso",
      email: "budi@gmail.com",
      hashedPassword,
      role: "CONSUMER",
      latitude: -7.2600,
      longitude: 112.7500,
    },
  });

  const consumer2 = await prisma.user.upsert({
    where: { email: "dewi@gmail.com" },
    update: {},
    create: {
      name: "Dewi Rahayu",
      email: "dewi@gmail.com",
      hashedPassword,
      role: "CONSUMER",
      latitude: -7.2550,
      longitude: 112.7450,
    },
  });

  console.log("✅ Users upserted");

  // ─── Products ─────────────────────────────────────────────────────

  const now = new Date();
  const in3h  = new Date(now.getTime() + 3  * 60 * 60 * 1000);
  const in6h  = new Date(now.getTime() + 6  * 60 * 60 * 1000);
  const in12h = new Date(now.getTime() + 12 * 60 * 60 * 1000);
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Products use create() since they don't have a unique field we can match on besides id,
  // and we've already deleted them all above. Using create is safe here.
  const product1 = await prisma.product.create({
    data: {
      merchantId: merchant1.id,
      title: "Nasi Bungkus Ayam Surplus",
      description:
        "5 bungkus nasi ayam goreng sisa makan siang. Dimasak jam 11 pagi, masih layak konsumsi. Cocok untuk dikonsumsi langsung atau diberikan ke orang yang membutuhkan. Pickup di warung kami, Jl. Rungkut Madya.",
      startPrice: 18000,
      endPrice: 7000,
      tier: "TIER_1",
      status: "AVAILABLE",
      quantity: 5,
      freshnessScore: 82,
      expiresAt: in6h,
      images: {
        create: [
          {
            imgUrl:
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
            isPrimary: true,
          },
        ],
      },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      merchantId: merchant1.id,
      title: "Ampas Tahu & Kulit Tahu Segar",
      description:
        "±3 kg ampas tahu dan kulit tahu dari produksi hari ini. Sangat cocok sebagai pakan maggot BSF atau bahan kompos. Bebas bahan kimia, segar dari proses produksi pagi hari.",
      startPrice: 5000,
      endPrice: 0,
      tier: "TIER_2",
      status: "AVAILABLE",
      quantity: 3,
      freshnessScore: 95,
      expiresAt: in12h,
      images: {
        create: [
          {
            imgUrl:
              "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=600&q=80",
            isPrimary: true,
          },
        ],
      },
    },
  });

  // ── Merchant 2 products (Kafe Bumi Hijau) ──
  const product3 = await prisma.product.create({
    data: {
      merchantId: merchant2.id,
      title: "Salad Bowl & Sandwich Sisa Lunch",
      description:
        "3 porsi salad bowl dan 2 sandwich yang belum terjual saat lunch. Sayuran masih segar, dressing terpisah. Layak konsumsi hingga malam ini. Ambil di kasir kafe, tunjukkan QR code.",
      startPrice: 45000,
      endPrice: 18000,
      tier: "TIER_1",
      status: "AVAILABLE",
      quantity: 5,
      freshnessScore: 88,
      expiresAt: in6h,
      images: {
        create: [
          {
            imgUrl:
              "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
            isPrimary: true,
          },
          {
            imgUrl:
              "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80",
            isPrimary: false,
          },
        ],
      },
    },
  });

  const product4 = await prisma.product.create({
    data: {
      merchantId: merchant2.id,
      title: "Ampas Kopi & Kulit Buah Campur",
      description:
        "±5 kg ampas kopi segar + kulit jeruk, kulit semangka, dan biji buah dari blender minuman. Ideal untuk eco-enzyme, kompos, atau pakan maggot BSF. Dipisahkan per jenis jika dibutuhkan.",
      startPrice: 10000,
      endPrice: 0,
      tier: "TIER_2",
      status: "AVAILABLE",
      quantity: 5,
      freshnessScore: 90,
      expiresAt: in24h,
      images: {
        create: [
          {
            imgUrl:
              "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80",
            isPrimary: true,
          },
        ],
      },
    },
  });

  // ── Merchant 3 products (Bakeri Roti Nusantara) ──
  const product5 = await prisma.product.create({
    data: {
      merchantId: merchant3.id,
      title: "Assorted Roti Surplus — Paket Hemat",
      description:
        "1 kantong berisi ±8 potong roti berbagai jenis: roti tawar, roti manis isi coklat, roti keju, dan croissant. Dipanggang pagi hari, masih empuk dan lezat. Tidak ada bahan pengawet.",
      startPrice: 60000,
      endPrice: 22000,
      tier: "TIER_1",
      status: "AVAILABLE",
      quantity: 4,
      freshnessScore: 79,
      expiresAt: in12h,
      images: {
        create: [
          {
            imgUrl:
              "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
            isPrimary: true,
          },
          {
            imgUrl:
              "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&q=80",
            isPrimary: false,
          },
        ],
      },
    },
  });

  const product6 = await prisma.product.create({
    data: {
      merchantId: merchant3.id,
      title: "Sisa Adonan & Remahan Roti",
      description:
        "±2 kg sisa adonan roti yang tidak jadi dipanggang + remahan roti dari rak display. Sangat baik untuk pakan ternak, cacing tanah, atau campuran kompos. Bebas telur untuk yang alergi.",
      startPrice: 8000,
      endPrice: 0,
      tier: "TIER_2",
      status: "AVAILABLE",
      quantity: 2,
      freshnessScore: 70,
      expiresAt: in3h,
      images: {
        create: [
          {
            imgUrl:
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
            isPrimary: true,
          },
        ],
      },
    },
  });

  // ── Merchant 4 products (Dapur Sehat Bu Tini) ──
  const product7 = await prisma.product.create({
    data: {
      merchantId: merchant4.id,
      title: "Catering Box Makan Siang — 3 Porsi",
      description:
        "3 box makan siang sisa pesanan catering yang dibatalkan. Menu: nasi putih, ayam bakar, tempe goreng, sayur bening, dan kerupuk. Dimasak jam 10 pagi. Masih panas dan lezat!",
      startPrice: 35000,
      endPrice: 12000,
      tier: "TIER_1",
      status: "AVAILABLE",
      quantity: 3,
      freshnessScore: 91,
      expiresAt: in3h,
      images: {
        create: [
          {
            imgUrl:
              "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&q=80",
            isPrimary: true,
          },
        ],
      },
    },
  });

  const product8 = await prisma.product.create({
    data: {
      merchantId: merchant4.id,
      title: "Sayuran Sisa Prep: Batang Bayam & Wortel",
      description:
        "±4 kg potongan batang bayam, kulit wortel, dan ujung buncis dari persiapan dapur hari ini. Sangat cocok untuk pakan maggot BSF (protein tinggi) atau dijadikan kaldu sayur. Kondisi bersih dan segar.",
      startPrice: 12000,
      endPrice: 0,
      tier: "TIER_2",
      status: "AVAILABLE",
      quantity: 4,
      freshnessScore: 96,
      expiresAt: in24h,
      images: {
        create: [
          {
            imgUrl:
              "https://images.unsplash.com/photo-1557844352-761f2565b576?w=600&q=80",
            isPrimary: true,
          },
          {
            imgUrl:
              "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=600&q=80",
            isPrimary: false,
          },
        ],
      },
    },
  });

  console.log("✅ Products created");

  // ─── Cart & Cart Items (untuk consumer1) ──────────────────────────

  const cart1 = await prisma.cart.upsert({
    where: { userId: consumer1.id },
    update: {},
    create: {
      userId: consumer1.id,
      items: {
        create: [
          { productId: product1.id, quantity: 2 },
          { productId: product5.id, quantity: 1 },
        ],
      },
    },
  });

  console.log("✅ Cart created");

  // ─── Orders (contoh order sudah PAID) ────────────────────────────

  const order1 = await prisma.order.upsert({
    where: { id: "ORDER-SEED-DEMO-001" },
    update: {},
    create: {
      id: "ORDER-SEED-DEMO-001",
      userId: consumer2.id,
      grossAmount: 22000,
      status: "PAID",
      claimStatus: "PENDING",
      snapToken: null,
      midtransTransactionId: "SEED-TXN-001",
      paymentType: "qris",
      transactionStatus: "settlement",
      items: {
        create: [
          {
            productId: product5.id,
            quantity: 1,
            priceAtPurchase: 22000,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.upsert({
    where: { id: "ORDER-SEED-DEMO-002" },
    update: {},
    create: {
      id: "ORDER-SEED-DEMO-002",
      userId: consumer1.id,
      grossAmount: 7000,
      status: "PENDING",
      claimStatus: "PENDING",
      snapToken: "SEED-SNAP-TOKEN-ABC123",
      items: {
        create: [
          {
            productId: product1.id,
            quantity: 1,
            priceAtPurchase: 7000,
          },
        ],
      },
    },
  });

  console.log("✅ Orders created");

  console.log("\n🎉 Seeding selesai!\n");
  console.log("═══════════════════════════════════════════");
  console.log("📋 AKUN YANG BISA DIPAKAI:");
  console.log("───────────────────────────────────────────");
  console.log("🏪 MERCHANT:");
  console.log("   Email    : sari@warungmbaksari.com");
  console.log("   Password : password123");
  console.log("   ---");
  console.log("   Email    : bumi@kafehijau.com");
  console.log("   Password : password123");
  console.log("   ---");
  console.log("   Email    : roti@nusantara.com");
  console.log("   Password : password123");
  console.log("   ---");
  console.log("   Email    : tini@dapursehat.com");
  console.log("   Password : password123");
  console.log("───────────────────────────────────────────");
  console.log("🛍️  CONSUMER:");
  console.log("   Email    : budi@gmail.com");
  console.log("   Password : password123");
  console.log("   ---");
  console.log("   Email    : dewi@gmail.com");
  console.log("   Password : password123");
  console.log("───────────────────────────────────────────");
  console.log("🔑 Merchant invite code : HACKFEST2026");
  console.log("═══════════════════════════════════════════\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });