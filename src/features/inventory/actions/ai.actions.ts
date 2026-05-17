"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/auth";

export interface TriageResult {
  title: string;
  description: string;
  dynamicPrice: number;
  tier: "TIER_1" | "TIER_2";
  quantity: number;
  freshnessScore: number;
  estimatedVolume: number;
  ecologicalClassification: string[];
  pickupNotes: string;
}

export async function analyzeProductImageAction(imageUrl: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "MERCHANT") {
    return { error: "Unauthorized" };
  }

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL.`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");
    const mimeType = response.headers.get("content-type") || "image/jpeg";

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite", // Can be adjusted based on environment availability, using exactly what was in processTriage.action.ts
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
      Classify the food into either "TIER_1" (high quality, relatively fresh) or "TIER_2" (nearing expiry, slightly degraded visual appeal).
      Estimate the quantity (number of items or portions) visible in the image.
      Provide a freshnessScore from 1 to 100 based on visual condition.
      Estimate the volume of the food in liters or kg (estimatedVolume as a float).
      Provide an ecological classification array indicating the waste category, e.g. ["Compostable", "Organic", "Animal Feed", "Human Consumption"].
      Provide brief pickup instructions or notes for the buyer.
      
      Respond with a JSON object matching exactly this schema without any markdown wrappers:
      {
        "title": "string",
        "description": "string",
        "dynamicPrice": number,
        "tier": "TIER_1" | "TIER_2",
        "quantity": number,
        "freshnessScore": number,
        "estimatedVolume": number,
        "ecologicalClassification": ["string"],
        "pickupNotes": "string"
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

    let text = result.response.text();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedResult: TriageResult = JSON.parse(text);
    
    return { success: true, data: parsedResult };
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return { error: "Failed to analyze image using AI." };
  }
}
