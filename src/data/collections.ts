export type Collection = {
  slug: string;
  image: string;
  title: string;
  description: string;
  badge: string;
};

export const collections: Collection[] = [
  {
    slug: "sevgililer-gunu-ozel-urunleri",
    image: "/images/love.jpg",
    title: "Sevgililer Günü Özel Ürünleri",
    description: "14 Şubat Sevgililer Gününe Özel 3D Baskı Koleksiyonumuz",
    badge: "Sevgililer Günü Ürünleri",
  },
  {
    slug: "together",
    image: "/images/together.jpg",
    title: "Birlikte Daha Güzel",
    description:
      "Çift ve Birlikte Olan Koleksiyonumuz",
    badge: "Birlikte Ürünleri",
  },
  {
    slug: "spor-gym",
    image: "/images/sportgym.png",
    title: "Sporculara ve Spor Sevenlere Özel Koleksiyonumuz",
    description:
      "",
    badge: "Sportgym",
  },
 
];
