"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/products", label: "Tüm Ürünler" },
  { href: "/contact", label: "İletişim" },
];

export function TabsNav() {
  const pathname = usePathname();

  return (
    <nav className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <div className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 shadow-lg shadow-slate-900/30 backdrop-blur">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 rounded-full px-4 py-2 text-center text-sm font-semibold transition sm:px-6 sm:py-2.5 ${
                isActive
                  ? "bg-amber-400 text-slate-950 shadow shadow-amber-400/50"
                  : "text-slate-100 hover:bg-white/10"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
