export interface ClaimedItem {
  id: string; // OrderItem ID or Order ID
  transactionId: string; // Used for the QR code
  product: {
    title: string;
    description: string;
    estimatedVolume?: number | null;
    ecologicalClassification: string[];
    pickupNotes?: string | null;
  };
  quantity: number;
  status: string;
  createdAt: Date;
}
