import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
 
  {
    title: "Gece Yolcusu",
    description: "Lüminesans detaylar ve şık silikon kayış.",
    price: "3.150 TL",
    image: "/images/slide1.jpg",
    collectionSlug: "sevgililer-gunu-ozel-urunleri",
  },
];

async function main() {
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: products });
}

main().finally(() => prisma.$disconnect());
