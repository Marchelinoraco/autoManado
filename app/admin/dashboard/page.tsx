import { getCars, getTestimonials } from "@/lib/cars";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [cars, testimonials] = await Promise.all([
    getCars().catch(() => []),
    getTestimonials().catch(() => []),
  ]);

  const stats = {
    total:    cars.length,
    tersedia: cars.filter((c) => c.status === "tersedia").length,
    disewa:   cars.filter((c) => c.status === "disewa").length,
    terjual:  cars.filter((c) => c.status === "terjual").length,
  };

  return (
    <DashboardClient
      initialCars={cars}
      stats={stats}
      initialTestimonials={testimonials}
    />
  );
}
