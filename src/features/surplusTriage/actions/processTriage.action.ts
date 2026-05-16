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
  let redirectUrl = "";

  try {
    const match = base64Image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      throw new Error("Invalid image format from camera");
    }
    const mimeType = match[1];
    const base64Data = match[2];

    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "surplus-triage",
    });
    const publicUrl = uploadResponse.secure_url;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
      generationConfig: { responseMimeType: "application/json" }
    });

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
      Estimate the quantity (number of items or portions) visible in the image.
      Provide a freshnessScore from 1 to 100 based on visual condition.
      
      Respond with a JSON object matching this schema:
      {
        "productName": "string",
        "description": "string",
        "dynamicPrice": number,
        "tier": "Tier 1" | "Tier 2",
        "quantity": number,
        "freshnessScore": number
      }
    `;

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

    const queryParams = new URLSearchParams({
      data: JSON.stringify(parsedResult),
      imageUrl: publicUrl,
    });

    redirectUrl = `/merchant/approval?${queryParams.toString()}`;

  } catch (error) {
    console.error("Triage extraction system error:", error);
    throw new Error("Failed to process triage due to internal AI generation issues.");
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }
}