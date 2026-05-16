export interface TriageResult {
  productName: string;
  description: string;
  dynamicPrice: number;
  tier: "Tier 1" | "Tier 2";
}

export interface ProcessTriageResponse {
  success: boolean;
  data?: TriageResult;
  error?: string;
  imageUrl?: string;
}
