import StrapiButton from "@/components/common/strapi-button";

interface HeaderUserActionProps {
  className?: string;
  buttonClassName?: string;
}

export default function HeaderUserAction({
  className,
  buttonClassName,
}: HeaderUserActionProps) {
  return (
    <div className={className}>
      <StrapiButton
        variant="Ghost"
        color="#0B0B0C"
        href="/signin"
        className={`hover:bg-[#0B0B0C] hover:text-white! ${buttonClassName ?? ""}`}
      >
        Sign in
      </StrapiButton>
      <StrapiButton
        href="/signup"
        className={`from-electric-violet to-rose bg-linear-to-r text-white hover:opacity-90 ${buttonClassName ?? ""}`}
      >
        Try for free
      </StrapiButton>
    </div>
  );
}
