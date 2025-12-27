import Link from "next/link";

import { Footer } from "@/components/Footer";
import { Header, socialLinks } from "@/components/Header";
import { TabsNav } from "@/components/TabsNav";

const GETFORM_ENDPOINT = "https://getform.io/f/your-getform-endpoint";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#e9b76d] text-[#2c1a0c]">
      <Header />
      <div className="py-5 sm:py-6">
        <TabsNav />
      </div>
      <main className="flex flex-1 items-center justify-center px-4 pb-10 sm:pb-12">
        <div className="w-full max-w-7xl rounded-3xl border border-[#6b3f1f]/30 bg-[#f3d89b] p-6 shadow-2xl sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-3 lg:items-start">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-semibold sm:text-4xl">Iletisim</h1>
              <p className="mt-3 text-[#3b2414]">
                Formu doldurun, ekibimiz en kisa sürede dönüş yapsin.
              </p>

              <form
                action={GETFORM_ENDPOINT}
                method="POST"
                className="mt-8 space-y-5"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-medium text-[#2c1a0c]">
                    Ad Soyad
                    <input
                      type="text"
                      name="name"
                      required
                      className="rounded-xl border border-[#6b3f1f]/30 bg-white/80 px-4 py-3 text-base text-[#2c1a0c] placeholder:text-[#72552e] focus:border-[#6b3f1f] focus:outline-none focus:ring-2 focus:ring-[#6b3f1f]/40"
                      placeholder="Örn: Deniz Kaya"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-[#2c1a0c]">
                    E-posta
                    <input
                      type="email"
                      name="email"
                      required
                      className="rounded-xl border border-[#6b3f1f]/30 bg-white/80 px-4 py-3 text-base text-[#2c1a0c] placeholder:text-[#72552e] focus:border-[#6b3f1f] focus:outline-none focus:ring-2 focus:ring-[#6b3f1f]/40"
                      placeholder="ornek@mail.com"
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-2 text-sm font-medium text-[#2c1a0c]">
                  Mesaj
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="rounded-xl border border-[#6b3f1f]/30 bg-white/80 px-4 py-3 text-base text-[#2c1a0c] placeholder:text-[#72552e] focus:border-[#6b3f1f] focus:outline-none focus:ring-2 focus:ring-[#6b3f1f]/40"
                    placeholder="Mesajinizi yazin..."
                  />
                </label>
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#6b3f1f] px-6 py-3 text-center text-base font-semibold text-[#f8edd8] shadow-lg shadow-[#6b3f1f]/30 transition hover:-translate-y-0.5 hover:shadow-[#6b3f1f]/50 sm:w-auto sm:px-8"
                >
                  Gönder
                </button>
              </form>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-[#6b3f1f]/30 bg-white/70 p-5 text-sm text-[#2c1a0c] shadow-inner shadow-[#6b3f1f]/10">
              <p className="text-base font-semibold text-[#6b3f1f]">
                Sosyal medya
              </p>
              <p className="text-[#3b2414]">
                Dilerseniz sosyal hesaplardan da ulasabilirsiniz.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {socialLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2 rounded-full border border-[#6b3f1f]/30 bg-white/80 px-3 py-2 text-sm font-medium text-[#2c1a0c] transition hover:-translate-y-0.5 hover:border-[#6b3f1f]/60 hover:bg-white"
                  >
                    <span className="text-[#6b3f1f] transition group-hover:text-[#4d2a14]">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-6 text-xs text-[#72552e]">
            Not: GETFORM endpointinizi `GETFORM_ENDPOINT` sabitinde güncelleyin.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
