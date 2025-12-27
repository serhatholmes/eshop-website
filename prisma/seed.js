const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const products = [
  {
    title: "Minimal Saat",
    description: "Mat gövde, değiştirilebilir kayış ve günlük kullanım konforu.",
    price: "2.450 TL",
    image: "/images/slide1.jpg",
  },
  {
    title: "Gri Seri",
    description: "Hafif kasa, sessiz mekanizma ve net kadran tasarımı.",
    price: "2.750 TL",
    image: "/images/slide2.jpg",
  },
  {
    title: "Gece Mavisi",
    description: "Suya dayanıklı gövde ve parlak indekslerle stil sahibi.",
    price: "3.150 TL",
    image: "/images/slide3.jpg",
  },
  {
    title: "Klasik Çelik",
    description: "Paslanmaz çelik kayış ve ince çizgili kadran.",
    price: "3.450 TL",
    image: "/images/slide1.jpg",
  },
  {
    title: "Günlük Deri",
    description: "Hakiki deri kayış ve günlük kombinlere uyumlu renkler.",
    price: "2.900 TL",
    image: "/images/slide2.jpg",
  },
  {
    title: "Spor Hibrit",
    description: "Adım sayar, hafif silikon kayış ve dayanıklı kasa.",
    price: "3.050 TL",
    image: "/images/slide3.jpg",
  },
  {
    title: "Rose Edition",
    description: "Rose gold detaylar ve minimal kadran tasarımı.",
    price: "3.600 TL",
    image: "/images/slide1.jpg",
  },
  {
    title: "Siyah Mat",
    description: "Parlamayan yüzey, yüksek okunabilirlik ve modern siluet.",
    price: "3.250 TL",
    image: "/images/slide2.jpg",
  },
  {
    title: "Pilot Serisi",
    description: "Büyük kadran, belirgin indeksler ve dayanıklı cam.",
    price: "3.800 TL",
    image: "/images/slide3.jpg",
  },
  {
    title: "Gece Yolcusu",
    description: "Lüminesans detaylar ve şık silikon kayış.",
    price: "3.150 TL",
    image: "/images/slide1.jpg",
  },
];

async function main() {
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: products });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
