import SortSelect from "@/components/common/SortSelect";

const SORT_OPTIONS = [
  { label: "Newest", value: "date:desc" },
  { label: "Oldest", value: "date:asc" },
  { label: "Title A-Z", value: "title:asc" },
  { label: "Title Z-A", value: "title:desc" },
] as const;

export default function NewsSort() {
  return <SortSelect sortOptions={SORT_OPTIONS} />;
}
