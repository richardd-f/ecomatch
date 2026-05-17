import Link from "next/link";
import { Leaf, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center px-4 py-20 text-center animate-in fade-in zoom-in-95 duration-1000">
      
      <div className="relative mb-6 animate-[bounce_3s_infinite]">
        <div className="w-20 h-20 rounded-2xl bg-[#2F5D50] flex items-center justify-center shadow-sm transition-transform hover:rotate-6">
          <Leaf className="w-10 h-10 text-white" />
        </div>
        
        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#D4A373] flex items-center justify-center shadow-md border-4 border-white transition-transform hover:scale-110">
          <SearchX className="w-5 h-5 text-white" />
        </div>
      </div>

      <h1 className="text-4xl mb-4 text-[#1E293B] font-extrabold tracking-tight">
        Page Not Found
      </h1>
      
      <p className="text-base md:text-lg max-w-md mx-auto mb-8 text-[#1E293B]/80 leading-relaxed">
        Oops! We couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
      </p>

      {/* Apply hover:-translate-y-1 for a tactile, physics-based button interaction */}
      <Link
        href="/"
        className="px-6 py-3.5 rounded-xl text-white bg-[#2F5D50] font-semibold flex items-center gap-2 transition-all duration-300 hover:bg-[#2F5D50]/90 hover:-translate-y-1 hover:shadow-lg shadow-sm"
      >
        Return to Marketplace
      </Link>
    </div>
  );
}