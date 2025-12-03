import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

interface NameValuePairProps {
  title: string | React.ReactNode;
  titleClassName?: string;
  valueClassName?: string;
  value?: string | React.ReactNode;
  containerClassName?: string;
  copyText?: string;
}

export function NameValuePair({
  title,
  titleClassName,
  valueClassName,
  value,
  containerClassName,
  copyText,
}: NameValuePairProps) {
  const copy = copyText ?? (typeof value === "string" ? value : undefined);
  return (
    <div
      className={cn("flex flex-col gap-2 relative group", containerClassName)}
    >
      <div
        className={cn(
          "text-muted-foreground text-xs uppercase",
          titleClassName,
        )}
      >
        {title}
      </div>
      <span
        className={cn(
          "text-sm font-normal truncate",
          value ? valueClassName : "text-muted-foreground",
        )}
      >
        {value ?? "-"}
      </span>
      {copy && (
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="opacity-0 absolute -top-3 right-2 delay-200 transition-all duration-200 group-hover:opacity-100"
        >
          <CopyButton text={copy} />
        </Button>
      )}
    </div>
  );
}
