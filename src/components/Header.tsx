"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Search, X, Sparkles } from "lucide-react";
import { useRouter, type Route } from "@/router/Router";
import { openDesignChat } from "@/lib/designChat";

const NAV_ITEMS: { label: string; route: Route; path: string }[] = [
  { label: "Home", route: { name: "home" }, path: "/" },
  { label: "Portfolio", route: { name: "portfolio" }, path: "/portfolio" },
  { label: "Collections", route: { name: "collections" }, path: "/collections" },
  { label: "About", route: { name: "about" }, path: "/about" },
  { label: "Contact", route: { name: "contact" }, path: "/contact" },
];

export function Header({ onOpenSearch }: { onOpenSearch: () => void }) {
  const { navigate } = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (item: { path: string }) => {
    if (!pathname) return false;
    if (item.path === "/") return pathname === "/";
    return pathname === item.path || pathname.startsWith(item.path);
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-charcoal-900 text-ivory-100">
        <div className="container-lux py-2.5 text-center text-[11px] font-light tracking-widest">
          BESPOKE DESIGNS, CRAFTED BY APPOINTMENT — WORLDWIDE CONSULTATIONS
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-ivory-50/95 shadow-sm backdrop-blur-md"
            : "bg-ivory-50/80 backdrop-blur-sm"
        }`}
      >
        <div className="container-lux">
          <div className="flex items-center justify-between py-4">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden text-charcoal-700"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <button
              type="button"
              onClick={() => navigate({ name: "home" })}
              className="flex-1 text-center lg:flex-none lg:mr-8"
            >
              <span className="font-logo text-2xl font-medium tracking-ultra text-charcoal-900 lg:text-3xl">
                PÁTAK MUNDI
              </span>
            </button>

            {/* Desktop nav */}
            <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => navigate(item.route)}
                  className={`group relative text-[13px] font-medium uppercase tracking-widest transition-colors ${
                    isActive(item)
                      ? "text-champagne-700"
                      : "text-charcoal-700 hover:text-champagne-600"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-champagne-500 transition-all duration-300 ${
                      isActive(item) ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 lg:gap-2 lg:flex-none">
              <IconButton label="Search the portfolio" onClick={onOpenSearch}>
                <Search size={20} />
              </IconButton>
              <button
                type="button"
                onClick={() => openDesignChat()}
                className="ml-1 hidden items-center gap-2 border border-charcoal-900 px-4 py-2.5 text-[11px] font-medium uppercase tracking-widest text-charcoal-900 transition-all hover:bg-charcoal-900 hover:text-ivory-50 sm:flex"
              >
                <Sparkles size={14} strokeWidth={1.5} />
                Design With Us
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div
            className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[80%] max-w-sm bg-ivory-50 shadow-2xl animate-slide-in-left">
            <div className="flex items-center justify-between border-b border-charcoal-100 p-5">
              <span className="font-logo text-xl tracking-widest text-charcoal-900">
                PÁTAK MUNDI
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="text-charcoal-500"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col p-5">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    navigate(item.route);
                    setMobileOpen(false);
                  }}
                  className={`border-b border-charcoal-100 py-4 text-left font-serif text-xl transition-colors ${
                    isActive(item) ? "text-champagne-700" : "text-charcoal-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  openDesignChat();
                }}
                className="mt-4 flex items-center justify-center gap-2 bg-charcoal-900 py-4 text-xs font-medium uppercase tracking-widest text-ivory-50"
              >
                <Sparkles size={14} strokeWidth={1.5} />
                Design With Us
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function IconButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="relative flex h-10 w-10 items-center justify-center text-charcoal-700 transition-colors hover:text-champagne-600"
    >
      {children}
    </button>
  );
}
