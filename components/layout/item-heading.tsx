import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
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
        "flex flex-col sm:flex-row items-center gap-2 md:gap-6 max-w-5/6 lg:max-w-4xl",
        containerClassName,
      )}
    >
      <div className="p-0.5 border-2 border-border dark:border-foreground/50 rounded-[1.25rem] flex-shrink-0">
        {gradientIcon}
      </div>
      <div className="flex flex-col items-center sm:items-start mt-4 sm:mt-0 min-w-0 flex-1 max-w-full">
        <span
          className={cn(
            "text-md text-muted-foreground font-semibold",
            titleClassName,
          )}
        >
          {title}
        </span>
        <div className="flex gap-1 items-center group w-full max-w-full">
          <h1
            className={cn(
              "scroll-m-20 text-[1.8rem] font-medium tracking-[-0.045rem] truncate min-w-0",
              nameClassName,
            )}
          >
            {name}
          </h1>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="opacity-0 -mt-2 ml-2 -translate-x-2 delay-200 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 flex-shrink-0"
          >
            <CopyButton text={name} />
          </Button>
        </div>
      </div>
    </div>
  );
}
