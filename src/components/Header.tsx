import Link from "next/link";

const socialLinks = [
  {
    href: "https://www.instagram.com/",
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
    href: "https://x.com/",
    label: "X",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="currentColor"
      >
        <path d="M19.5 4.5h-3l-3.24 4.03L9.86 4.5H4.5l6.02 7.45L4.8 19.5h3l3.41-4.25 3.62 4.25h5.17l-6.25-7.5z" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/",
    label: "LinkedIn",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="currentColor"
      >
        <path d="M4.98 3.5C4.98 4.6 4.12 5.5 3 5.5s-2-.9-2-2 0-2 2-2 2 .9 2 2zM1 21h4V7H1v14zm7-9.5c0-1.8 0-3.5-.1-4.5h3.5l.2 2h.1c.5-1.1 1.9-2.4 4.1-2.4 2.7 0 4.7 1.8 4.7 5.8V21h-4v-7.6c0-1.7-.6-2.9-2-2.9-1.1 0-1.7.8-2 1.6-.1.3-.1.8-.1 1.2V21h-4V11.5z" />
      </svg>
    ),
  },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-amber-300 via-orange-500 to-rose-600 text-xs font-semibold uppercase text-slate-950 shadow-lg shadow-amber-500/30">
            es
          </div>
        </div>
        <div className="text-center text-base font-semibold uppercase tracking-[0.3em] text-slate-50 sm:text-lg">
          Eshop Vitrin
        </div>
        <nav className="flex items-center gap-2">
          {socialLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm font-medium text-slate-50 transition hover:-translate-y-0.5 hover:border-amber-300/60 hover:bg-white/20"
            >
              <span className="text-amber-200 transition group-hover:text-amber-100">
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
