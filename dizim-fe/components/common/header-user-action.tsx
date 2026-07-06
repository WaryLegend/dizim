import StrapiButton from "@/components/common/strapi-button";

interface HeaderUserActionProps {
  className?: string;
  buttonClassName?: string;
}

export default function HeaderUserAction({
  className,
  buttonClassName = "",
}: HeaderUserActionProps) {
  return (
    <div className={className}>
      <StrapiButton
        variant="Ghost"
        href="/signin"
        className={`${buttonClassName}`}
      >
        Sign in
      </StrapiButton>
      <StrapiButton
        href="/signup"
        className={`from-electric-violet to-rose bg-linear-to-r hover:brightness-90 ${buttonClassName}`}
      >
        Try for free
      </StrapiButton>
    </div>
  );
}
