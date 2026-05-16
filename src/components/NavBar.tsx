'use client'
import { ShoppingCart, Leaf, Menu, X, Store, LogOut, ShoppingBag, ChevronDown } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "../features/auth/type";
import { logoutAction } from "../features/auth/actions/auth.actions";

interface NavbarProps {
  cartCount?: number;
  userName?: string;
  userRole?: UserRole;
  businessName?: string;
  onLogout?: () => void;
}

export function Navbar({ cartCount = 0, userName, userRole, businessName, onLogout }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const pathname = usePathname();

  const isMerchant = userRole === "merchant";
  const isConsumer = userRole === "consumer";

  const isActive = (href: string) => pathname === href;

  const consumerLinks = [{ label: "Marketplace", href: "/" }];
  const merchantLinks = [
    { label: "Marketplace", href: "/" },
    { label: "Dashboard", href: "/merchant" },
  ];
  const navLinks = isMerchant ? merchantLinks : consumerLinks;

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      await logoutAction();
      window.location.href = "/";
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: "#1E293B", borderColor: "#2F5D50" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#2F5D50" }}
            >
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span
              className="text-white hidden sm:block"
              style={{ fontWeight: 700, fontSize: "1.125rem", letterSpacing: "-0.02em" }}
            >
              Eco<span style={{ color: "#A4B69A" }}>Match</span>
            </span>
            {isMerchant && (
              <span
                className="hidden sm:inline-block text-xs px-1.5 py-0.5 rounded"
                style={{ backgroundColor: "rgba(164,182,154,0.2)", color: "#A4B69A", fontWeight: 600 }}
              >
                Merchant
              </span>
            )}
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-md text-sm transition-colors"
                style={{
                  color: isActive(link.href) ? "#A4B69A" : "rgba(255,255,255,0.7)",
                  backgroundColor: isActive(link.href) ? "rgba(47,93,80,0.3)" : "transparent",
                  fontWeight: isActive(link.href) ? 600 : 400,
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* Merchant portal pill for guests */}
            {!userName && (
              <Link
                href="/merchantLogin"
                className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors hover:opacity-90"
                style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <Store className="w-3 h-3" />
                Merchant Portal
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Cart — only for consumers or guests */}
            {!isMerchant && (
              <Link
                href="/cart"
                className="relative p-2 rounded-lg transition-colors hover:bg-white/10"
              >
                <ShoppingCart className="w-5 h-5 text-white" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: "#D4A373", fontSize: "0.65rem", fontWeight: 700 }}
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            )}

            {userName ? (
              <div className="hidden md:block relative">
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors hover:bg-white/10"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs"
                    style={{ backgroundColor: isMerchant ? "#2F5D50" : "#A4B69A", fontWeight: 700 }}
                  >
                    {(businessName ?? userName)[0].toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-white leading-none" style={{ fontWeight: 600 }}>
                      {isMerchant ? (businessName ?? userName) : userName}
                    </p>
                    <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.45)" }}>
                      {isMerchant ? "Merchant" : "Shopper"}
                    </p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-white/50" />
                </button>

                {/* Account dropdown */}
                {accountOpen && (
                  <div
                    className="absolute right-0 top-full mt-1 w-44 rounded-xl border shadow-lg overflow-hidden"
                    style={{ backgroundColor: "#1E293B", borderColor: "#2F5D5040" }}
                  >
                    <div className="px-3 py-2.5 border-b" style={{ borderColor: "#2F5D5030" }}>
                      <p className="text-xs text-white" style={{ fontWeight: 600 }}>
                        {isMerchant ? businessName : userName}
                      </p>
                      <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)" }}>
                        {isMerchant ? "Merchant account" : "Shopper account"}
                      </p>
                    </div>
                    {isMerchant && (
                      <Link
                        href="/merchant"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-xs transition-colors hover:bg-white/10"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        <Store className="w-3.5 h-3.5" />
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => { handleLogout(); setAccountOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-xs transition-colors hover:bg-white/10"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white transition-colors hover:bg-white/10"
                  style={{ border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  <ShoppingBag className="w-3 h-3" />
                  Shopper Login
                </Link>
                <Link
                  href="/merchantLogin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: "#2F5D50" }}
                >
                  <Store className="w-3 h-3" />
                  Merchant
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => { setMenuOpen((v) => !v); setAccountOpen(false); }}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t px-4 py-3 flex flex-col gap-1"
          style={{ backgroundColor: "#1E293B", borderColor: "#2F5D5040" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2.5 rounded-md text-sm transition-colors"
              style={{
                color: isActive(link.href) ? "#A4B69A" : "rgba(255,255,255,0.7)",
                backgroundColor: isActive(link.href) ? "rgba(47,93,80,0.3)" : "transparent",
              }}
            >
              {link.label}
            </Link>
          ))}

          <div className="border-t mt-1 pt-2" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            {userName ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs"
                    style={{ backgroundColor: isMerchant ? "#2F5D50" : "#A4B69A", fontWeight: 700 }}
                  >
                    {(businessName ?? userName)[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs text-white" style={{ fontWeight: 600 }}>
                      {isMerchant ? (businessName ?? userName) : userName}
                    </p>
                    <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)" }}>
                      {isMerchant ? "Merchant" : "Shopper"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-white/70 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm text-white/70"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Shopper Login
                </Link>
                <Link
                  href="/merchantLogin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm mt-1 text-white"
                  style={{ backgroundColor: "#2F5D50" }}
                >
                  <Store className="w-4 h-4" />
                  Merchant Portal
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
