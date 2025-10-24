import { cn } from "@/lib/utils";

interface PageHeadingProps {
  title: string;
  description?: string;
  containerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function PageHeading({
  title,
  description,
  containerClassName,
  titleClassName,
  descriptionClassName,
}: PageHeadingProps) {
  return (
    <div
      className={cn("flex flex-col justify-center gap-2", containerClassName)}
    >
      <h1
        className={cn(
          "scroll-m-20 text-[1.8rem] font-medium tracking-[-0.045rem]",
          titleClassName,
        )}
      >
        {title}
      </h1>
      {description && (
        <p
          className={cn(
            "pt-2 text-sm text-muted-foreground",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
