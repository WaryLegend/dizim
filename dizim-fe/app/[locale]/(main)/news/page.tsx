import { Button } from "@/components/shadcn-ui/button";

const newsItems = [
  {
    id: 1,
    category: "Event",
    title:
      "HMT dizim.ai lot vao top 20 TechFest 2021 - Cuoc thi doi moi sang tao quoc gia",
    description:
      "We are proud to announce that HMT dizim.ai has been selected as one of the top 20 innovative startups at TechFest 2021.",
    date: "Dec 15, 2021",
    gradient: "from-electric-violet to-azure-radiance",
  },
  {
    id: 2,
    category: "News",
    title:
      "Nen tang digital marketing HMT dizim.ai chinh thuc ra mat phien ban v3.0 ngay 30/12/2021",
    description:
      "The latest version brings new AI features, improved video templates, and enhanced multi-channel distribution capabilities.",
    date: "Dec 30, 2021",
    gradient: "from-rose to-electric-violet",
  },
  {
    id: 3,
    category: "Events",
    title:
      "Ra mat su kien Cung chuc tan xuan Nham Dan 2022 - tao to chuc va nhan hoa voi AI Speaker song dong",
    description:
      "Celebrate the Lunar New Year with our special AI Speaker event, featuring virtual hosts and interactive experiences.",
    date: "Jan 25, 2022",
    gradient: "from-azure-radiance to-rose",
  },
  {
    id: 4,
    category: "Product Update",
    title: "Introducing new AI Speaker voices and languages",
    description:
      "We have expanded our AI Speaker library with 10 new voices supporting Vietnamese, English, and Japanese.",
    date: "Feb 10, 2022",
    gradient: "from-blue-gem to-electric-violet",
  },
  {
    id: 5,
    category: "Partnership",
    title: "Strategic partnership with leading content creators",
    description:
      "Dizim.ai partners with top content creators to provide professional video templates for all industries.",
    date: "Mar 1, 2022",
    gradient: "from-electric-violet to-rose",
  },
  {
    id: 6,
    category: "Tutorial",
    title: "How to create viral video content in 5 minutes",
    description:
      "Learn the secrets of viral content creation with our step-by-step guide using Dizim.ai platform.",
    date: "Mar 15, 2022",
    gradient: "from-azure-radiance to-electric-violet",
  },
];

export default function NewsPage() {
  return (
    <div className="bg-background min-h-screen">
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
              Latest News
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              Stay updated with the latest news, product updates, and events
              from Dizim.ai
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((item) => (
              <article
                key={item.id}
                className="border-border group cursor-pointer overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                <div
                  className={`h-48 bg-linear-to-br ${item.gradient} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-medium text-white/50 transition-transform group-hover:scale-110">
                      News Image
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-rose text-xs font-medium tracking-wider uppercase">
                      {item.category}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {item.date}
                    </span>
                  </div>
                  <h3 className="text-foreground group-hover:text-primary mb-2 line-clamp-2 font-semibold transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary rounded-full px-8 hover:text-white"
            >
              Load More
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
