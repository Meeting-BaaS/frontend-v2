import { cn } from "@/lib/utils";

interface NameValuePairProps {
  title: string | React.ReactNode;
  titleClassName?: string;
  valueClassName?: string;
  value: string | React.ReactNode;
  containerClassName?: string;
}

export function NameValuePair({
  title,
  titleClassName,
  valueClassName,
  value,
  containerClassName,
}: NameValuePairProps) {
  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      <div
        className={cn(
          "text-muted-foreground text-xs uppercase",
          titleClassName,
        )}
      >
        {title}
      </div>
      <span className={cn("text-sm font-normal", valueClassName)}>{value}</span>
    </div>
  );
}
