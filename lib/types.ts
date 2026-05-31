export type Car = {
  id: number;
  name: string;
  slug: string;
  type: string;
  category: "rental" | "jual" | "keduanya";
  status: "tersedia" | "disewa" | "terjual";
  price_rent: number | null;
  price_sell: number | null;
  year: number;
  seats: number;
  transmission: string;
  fuel: string;
  badge: "POPULER" | "BARU" | "PROMO" | null;
  kondisi: "Baik Sekali" | "Baik" | "Cukup" | "Perlu Service" | null;
  kelengkapan: string | null;
  dengan_sopir: boolean;
  plat_asal: string | null;
  description: string | null;
  images: string[];
  created_at?: string;
};

export type Testimonial = {
  id: number;
  name: string;
  location: string | null;
  message: string;
  rating: number;
  photo: string | null;
  car_name: string | null;
  service: "rental" | "jual" | null;
  created_at?: string;
};
