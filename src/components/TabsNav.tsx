"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/products", label: "Ürünler" },
  { href: "/contact", label: "İletişim" },
];

export function TabsNav() {
  const pathname = usePathname();

  return (
    <nav className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <div className="flex items-center justify-center gap-2 rounded-full border border-[#6b3f1f]/30 bg-white/70 p-1 shadow-lg shadow-[#6b3f1f]/20 backdrop-blur">
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
                  ? "bg-[#6b3f1f] text-[#f8edd8] shadow shadow-[#6b3f1f]/40"
                  : "text-[#2c1a0c] hover:bg-white"
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
