# 🍃 EcoMatch: AI-Powered Food Rescue

An AI-powered logistics and marketplace application designed to eradicate commercial food waste. EcoMatch instantly bridges the gap between surplus inventory and community need using a dual-sided platform powered by Vision AI.

Engineered for high performance within a 24-hour hackathon constraint, this application prioritizes clean architecture, strict domain boundaries, and zero-friction UX.

## 🚀 The Core Innovation
Merchants face too much friction when donating or discounting food at closing time. EcoMatch eliminates manual data entry. A merchant simply photographs their unsold food; our integrated **Vision AI engine** analyzes the visual profile and automatically categorizes it:
*   **Tier 1 (Safe for Consumption):** Auto-generates a time-sensitive, discounted listing for local consumers.
*   **Tier 2 (Agricultural/Compost):** Routes organic waste to local farmers/breeders for free bulk pickup.

## ✨ Key Features
*   **Zero-Friction Merchant POS:** Upload a photo, let the AI calculate the condition, price range, and category, and publish in 3 clicks.
*   **Geolocation Dynamic Feed:** Consumers and farmers see surplus inventory nearest to their location.
*   **Integrated Payments (Tier 1):** Frictionless checkout via Midtrans (QRIS, GoPay, etc.) for discounted meals.
*   **QR-Code Claim System (Tier 2):** Streamlined logistics for farmers to claim and pick up organic waste safely.
*   **Clean Architecture:** Built using "Package by Feature" principles to ensure scalability and separation of concerns.

## 🛠 Tech Stack & Architecture

We strictly avoided over-engineering. We utilized a monolithic Next.js architecture with a robust ORM to prevent the operational overhead of managing separate frontend and backend microservices, while maintaining isolated feature domains.

*   **Framework:** Next.js 16.2 (App Router, Server Actions)
*   **Language:** TypeScript
*   **Database:** PostgreSQL managed by Prisma ORM (`@prisma/client`, `@prisma/adapter-pg`)
*   **Authentication:** NextAuth v5 (Auth.js) with Prisma Adapter
*   **Image Pipeline:** Cloudinary (Rapid processing & CDN delivery)
*   **Styling & UI:** Tailwind CSS v4, Lucide React, GSAP (for micro-interactions)
*   **Validation:** Zod (Strict schema validation for AI payloads and API routes)

## 📁 Project Structure (Package by Feature)

Instead of dumping files into a massive `components` layer, we use Domain-Driven Design (DDD) principles adapted for Next.js:

```text
src/
├── app/                  # Next.js App Router (Page composition only)
├── components/           # Global, dumb UI components (Buttons, Inputs)
├── features/             # Isolated feature domains
│   ├── auth/             # Login/Register actions and UI
│   ├── inventory/        # Merchant Cloudinary upload & AI analysis
│   ├── marketplace/      # Consumer feed and filtering logic
│   ├── checkout/         # Midtrans integration and Cart UI
│   └── pickup/           # Tier 2 QR code generation and scanning
└── lib/                  # Shared utilities (Prisma client, Cloudinary config)


