"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { OrderPaymentButton } from "@/features/checkout/components/OrderPaymentButton";
import { QRModal } from "@/components/QRModal";
import { ShoppingBag, QrCode, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface OrderCardProps {
  order: any; // We'll pass the Prisma order with items and products
}

export function OrderCard({ order }: OrderCardProps) {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const isPaid = order.status === "PAID";
  const isPending = order.status === "PENDING";
  const isCanceled = order.status === "CANCELED";
  const isExpired = order.status === "EXPIRED";

  const getStatusBadge = () => {
    if (isPaid) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" /> Paid
        </span>
      );
    }
    if (isPending) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
          <Clock className="w-3.5 h-3.5" /> Pending Payment
        </span>
      );
    }
    if (isCanceled) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
          <XCircle className="w-3.5 h-3.5" /> Canceled
        </span>
      );
    }
    if (isExpired) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
          <AlertCircle className="w-3.5 h-3.5" /> Expired
        </span>
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#1E293B]/10 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-[#F2EFE7]/30 px-5 py-4 border-b border-[#1E293B]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs text-[#1E293B]/60 font-medium mb-1">
            Order Date: {format(new Date(order.createdAt), "MMM d, yyyy • HH:mm")}
          </p>
          <p className="text-sm font-bold text-[#1E293B] font-mono">
            {order.id}
          </p>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      {/* Items */}
      <div className="p-5 flex flex-col gap-4">
        {order.items.map((item: any) => {
          const imgUrl = item.product.images?.find((img: any) => img.isPrimary)?.imgUrl || item.product.images?.[0]?.imgUrl;
          return (
            <div key={item.id} className="flex items-start gap-4 pb-4 border-b border-[#1E293B]/5 last:border-0 last:pb-0">
              <div className="w-14 h-14 rounded-xl bg-[#F2EFE7] overflow-hidden flex items-center justify-center shrink-0">
                {imgUrl ? (
                  <img src={imgUrl} alt={item.product.title} className="w-full h-full object-cover" />
                ) : (
                  <ShoppingBag className="w-5 h-5 text-[#1E293B]/20" />
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-[#1E293B] text-sm line-clamp-1">{item.product.title}</h3>
                <p className="text-xs text-[#1E293B]/60 mt-0.5">
                  Qty: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                {item.priceAtPurchase > 0 ? (
                  <p className="text-sm font-bold text-[#1E293B]">
                    Rp {(item.priceAtPurchase * item.quantity).toLocaleString("id-ID")}
                  </p>
                ) : (
                  <p className="text-sm font-bold text-[#2F5D50]">FREE</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer / Actions */}
      <div className="p-5 bg-gray-50 border-t border-[#1E293B]/5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
        <div className="w-full sm:w-auto">
          <p className="text-xs text-[#1E293B]/60 mb-0.5">Total Amount</p>
          <p className="text-lg font-extrabold text-[#1E293B]">
            Rp {order.grossAmount.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
          {isPending && order.snapToken && (
            <OrderPaymentButton snapToken={order.snapToken} />
          )}

          {isPaid && (
            <>
              <button
                onClick={() => setIsQRModalOpen(true)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-white border-2 border-[#1E293B] text-[#1E293B] font-bold hover:bg-[#1E293B] hover:text-white transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <QrCode className="w-4 h-4" /> Show QR
              </button>
              
              <QRModal 
                orderId={order.id} 
                isOpen={isQRModalOpen} 
                onClose={() => setIsQRModalOpen(false)} 
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
