"use server";

import { v2 as cloudinary } from "cloudinary";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { redirect } from "next/navigation";
import { TriageResult } from "../interfaces/triage.interface";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function processTriageAction(base64Image: string) {
  // Buat variabel penampung URL redirect di luar blok try-catch
  let redirectUrl = "";

  try {
    // 1. Ekstrak data base64 murni dan Mime Type dari react-webcam string secara instan
    // Format react-webcam: "data:image/jpeg;base64,/9j/4AAQ..."
    const match = base64Image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      throw new Error("Invalid image format from camera");
    }
    const mimeType = match[1];
    const base64Data = match[2];

    // 2. Upload ke Cloudinary untuk arsip URL gambar
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "surplus-triage",
    });
    const publicUrl = uploadResponse.secure_url;

    // 3. Inisialisasi Gemini Vision dengan mengaktifkan Fitur NATIVE JSON Mode
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" } // <--- Memaksa Gemini merespons JSON murni tanpa markdown wrapper
    });

    // Konteks Waktu Operasional Lokal
    const now = new Date();
    const currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;
    const closingTime = "22:00";

    const systemPrompt = `
      You are an AI assistant for a surplus food triage system.
      Analyze the provided image of the food product.
      The current time is ${currentTime} and the store's closing time is ${closingTime}.
      Determine the dynamic pricing based on how close it is to closing time and the perceived condition of the food.
      The price must be in rupiah. Use $1 = Rp 15,500 as the exchange rate.
      Classify the food into either "Tier 1" (high quality, relatively fresh) or "Tier 2" (nearing expiry, slightly degraded visual appeal).
      
      Respond with a JSON object matching this schema:
      {
        "productName": "string",
        "description": "string",
        "dynamicPrice": number,
        "tier": "Tier 1" | "Tier 2"
      }
    `;

    // Ambil data base64Data murni yang sudah kita potong di langkah ke-1 (Tanpa Network Re-fetch!)
    const result = await model.generateContent([
      systemPrompt,
      {
        inlineData: {
          data: base64Data,
          mimeType,
        },
      },
    ]);

    const text = result.response.text();
    const parsedResult: TriageResult = JSON.parse(text.trim());

    // 4. Siapkan URL tujuan, jangan panggil fungsi redirect() di dalam blok try ini
    const queryParams = new URLSearchParams({
      data: JSON.stringify(parsedResult),
      imageUrl: publicUrl,
    });

    redirectUrl = `/merchant/approval?${queryParams.toString()}`;

  } catch (error) {
    console.error("Triage extraction system error:", error);
    throw new Error("Failed to process triage due to internal AI generation issues.");
  }

  // 5. Panggil fungsi redirect() AMAN di luar blok try-catch agar Next.js bisa memproses rute halaman dengan normal
  if (redirectUrl) {
    redirect(redirectUrl);
  }
}