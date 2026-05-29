import Link from "next/link";
import { Button } from "@/components/shadcn-ui/button";
import { ArrowRight, Calendar } from "lucide-react";

const newsItems = [
  {
    id: 1,
    category: "Event",
    date: "Dec 15, 2021",
    title:
      "HMT dizim.ai lot vao top 20 TechFest 2021 - Cuoc thi doi moi sang tao quoc gia",
    gradient: "from-electric-violet to-azure-radiance",
  },
  {
    id: 2,
    category: "News",
    date: "Dec 30, 2021",
    title:
      "Nen tang digital marketing HMT dizim.ai chinh thuc ra mat phien ban v3.0",
    gradient: "from-rose to-electric-violet",
  },
  {
    id: 3,
    category: "Event",
    date: "Jan 15, 2022",
    title:
      'Ra mat su kien "Cung chuc tan xuan Nham Dan 2022" - AI Speaker song dong',
    gradient: "from-azure-radiance to-rose",
  },
];

export default function NewsSection() {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-foreground mb-12 text-center text-3xl font-bold md:text-4xl">
          Latest News
        </h2>

        <div className="mb-12 grid gap-8 md:grid-cols-3">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="border-border overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              <div
                className={`aspect-video bg-linear-to-br ${item.gradient} relative flex items-center justify-center`}
              >
                <span className="text-4xl">📰</span>
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-rose text-xs font-semibold tracking-wider uppercase">
                    {item.category}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Calendar className="h-3 w-3" />
                    {item.date}
                  </span>
                </div>
                <h3 className="text-foreground line-clamp-2 leading-snug font-semibold">
                  {item.title}
                </h3>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            variant="outline"
            className="border-electric-violet text-electric-violet hover:bg-electric-violet rounded-full px-8 hover:text-white"
          >
            <Link href="/news">
              View More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
