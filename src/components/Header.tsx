import Image from "next/image";
import Link from "next/link";

export const socialLinks = [
  {
    href: "https://www.instagram.com/tiridesigns",
    label: "Instagram",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="4" y="4" width="16" height="16" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "https://www.facebook.com/",
    label: "Facebook",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="currentColor"
      >
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.79c0-2.5 1.5-3.88 3.8-3.88 1.1 0 2.25.2 2.25.2v2.48h-1.27c-1.25 0-1.64.78-1.64 1.58V12h2.79l-.45 2.89h-2.34v6.99A10 10 0 0 0 22 12" />
      </svg>
    ),
  },
  {
    href: "mailto:info@tiridesigns.com",
    label: "Email",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
        <path d="m3.5 7 7.7 5.14a2 2 0 0 0 2.1 0L21 7" />
      </svg>
    ),
  },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#6b3f1f]/50 bg-[#6b3f1f] text-[#f8edd8] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          aria-label="Ana sayfa"
          className="group flex items-center gap-3"
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white transition group-hover:scale-[1.03]">
            <Image
              src="/images/tridesignlogo.png"
              alt="TriDesigns logo"
              fill
              sizes="40px"
              className="object-cover"
              priority
            />
          </div>
        </Link>
        <div className="text-center text-base font-semibold uppercase tracking-[0.3em] text-[#f8edd8] sm:text-md">
          TiriDesigns
        </div>
        <nav className="flex items-center gap-2">
          {socialLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-2 text-sm font-medium text-[#f8edd8] transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/25"
            >
              <span className="text-[#f8edd8] transition group-hover:text-white">
                {item.icon}
              </span>
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
