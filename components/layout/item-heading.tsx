import { cn } from "@/lib/utils";

interface ItemHeadingProps {
  title: string;
  name: string;
  gradientIcon: React.ReactNode;
  containerClassName?: string;
  titleClassName?: string; // For the title of the item
  nameClassName?: string; // For the name of the item
}

export function ItemHeading({
  title,
  name,
  gradientIcon,
  containerClassName,
  titleClassName,
  nameClassName,
}: ItemHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center gap-2 md:gap-6",
        containerClassName,
      )}
    >
      <div className="p-0.5 border-2 border-foreground/50 rounded-[1.25rem]">
        {gradientIcon}
      </div>
      <div className="flex flex-col items-center sm:items-start mt-4 sm:mt-0">
        <span
          className={cn(
            "text-md text-muted-foreground font-semibold",
            titleClassName,
          )}
        >
          {title}
        </span>
        <h1
          className={cn(
            "scroll-m-20 text-[1.8rem] font-medium tracking-[-0.045rem]",
            nameClassName,
          )}
        >
          {name}
        </h1>
      </div>
    </div>
  );
}
