import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Image from "next/image";
import type { BlockShowsSection } from "@/types/home-page";
import { STRAPI_URL } from "@/lib/utils";

const demoShows = [
  {
    id: 1,
    host: "Sarah K.",
    title: "Summer Collection Launch",
    viewers: "2.4k",
    gradient: "from-rose to-electric-violet",
    image: "🌴",
  },
  {
    id: 2,
    host: "Mike Chen",
    title: "Tech Gadgets Review",
    viewers: "1.8k",
    gradient: "from-electric-violet to-azure-radiance",
    image: "💻",
  },
  {
    id: 3,
    host: "Emma L.",
    title: "Fitness Gear Live Sale",
    viewers: "3.1k",
    gradient: "from-rose to-amber-500",
    image: "🏋️",
  },
  {
    id: 4,
    host: "Alex R.",
    title: "Home Decor Ideas Live",
    viewers: "956",
    gradient: "from-azure-radiance to-rose",
    image: "🏠",
  },
];

export default function ShowsSection({
  title,
  description,
}: BlockShowsSection) {
  return (
    <section className="bg-linear-to-b from-[#FAFCFF] via-[#FAFCFF]/80 to-transparent py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-foreground mb-3 text-3xl font-bold md:text-4xl">
              {title}
            </h2>
            {description && (
              <p className="text-muted-foreground max-w-lg">{description}</p>
            )}
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <button className="border-border hover:bg-secondary flex h-10 w-10 items-center justify-center rounded-full border transition-colors">
              <ChevronLeft className="text-muted-foreground h-5 w-5" />
            </button>
            <button className="border-border hover:bg-secondary flex h-10 w-10 items-center justify-center rounded-full border transition-colors">
              <ChevronRight className="text-muted-foreground h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {demoShows.map((show) => (
            <div
              key={show.id}
              className="group relative aspect-3/4 cursor-pointer overflow-hidden rounded-2xl"
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${show.gradient} flex items-center justify-center`}
              >
                <span className="text-6xl">{show.image}</span>
              </div>

              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

              <div className="bg-rose absolute top-3 left-3 flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold text-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                LIVE
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1 rounded bg-black/50 px-2 py-0.5 text-[10px] text-white">
                <Eye className="h-3 w-3" />
                {show.viewers}
              </div>

              <div className="absolute right-4 bottom-4 left-4">
                <p className="mb-1 text-xs font-medium text-white/80">
                  {show.host}
                </p>
                <p className="text-sm leading-tight font-semibold text-white">
                  {show.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
