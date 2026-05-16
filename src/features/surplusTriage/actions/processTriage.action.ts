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
  try {
    // 1. Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "surplus-triage",
    });
    const publicUrl = uploadResponse.secure_url;

    // 2. Fetch the optimized image as array buffer to send to Gemini
    const imageResponse = await fetch(publicUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64OptImage = buffer.toString("base64");
    const mimeType = imageResponse.headers.get("content-type") || "image/jpeg";

    // 3. Initialize Gemini Vision
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Operational time context
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = `${currentHour}:${currentMinute.toString().padStart(2, "0")}`;
    const closingTime = "22:00"; // Assuming 10 PM closing for context

    const systemPrompt = `
      You are an AI assistant for a surplus food triage system.
      Analyze the provided image of the food product.
      The current time is ${currentTime} and the store's closing time is ${closingTime}.
      Determine the dynamic pricing based on how close it is to closing time and the perceived condition of the food.
      Classify the food into either "Tier 1" (high quality, relatively fresh) or "Tier 2" (nearing expiry, slightly degraded visual appeal).
      
      Respond STRICTLY with a JSON object matching this interface:
      {
        "productName": "string",
        "description": "string",
        "dynamicPrice": number,
        "tier": "Tier 1" | "Tier 2"
      }
      Do not include any other text or markdown formatting outside the JSON block. Just the JSON object.
    `;

    const result = await model.generateContent([
      systemPrompt,
      {
        inlineData: {
          data: base64OptImage,
          mimeType,
        },
      },
    ]);

    const text = result.response.text();
    
    // 4. Parse the strict JSON
    let parsedResult: TriageResult;
    try {
      // Clean potential markdown blocks
      const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      parsedResult = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse Gemini output:", text);
      throw new Error("Invalid response format from AI");
    }

    // 5. Redirect to approval page with data
    const queryParams = new URLSearchParams({
      data: JSON.stringify(parsedResult),
      imageUrl: publicUrl,
    });
    
    redirect(`/merchant/approval?${queryParams.toString()}`);

  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error; // Let Next.js handle the redirect
    }
    console.error("Error in processTriageAction:", error);
    throw new Error("Failed to process triage");
  }
}
