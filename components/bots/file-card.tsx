"use client";

import { format } from "date-fns";
import { Download, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { parseDateString } from "@/lib/date-helpers";
import { cn } from "@/lib/utils";

interface FileCardProps {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  title: string;
  date: string | null;
  url: string | null;
  fileName: string;
  isVideo?: boolean;
  hasTranscription?: boolean;
  botUuid?: string;
  fileTitleClassName?: string;
}

export function FileCard({
  icon: Icon,
  iconColor,
  title,
  date,
  url,
  fileName,
  isVideo = false,
  fileTitleClassName,
  botUuid,
  hasTranscription = false,
}: FileCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    if (isDownloading) return;
    if (!url) return;

    setIsDownloading(true);

    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        toast.success("File downloaded successfully");
      })
      .catch((error) => {
        console.error("Failed to download file", error);
        toast.error("Failed to download file.");
      })
      .finally(() => {
        setIsDownloading(false);
      });
  };

  return (
    <Card className="flex flex-row items-center gap-4 p-4">
      <GradientIcon color={iconColor} className="flex-shrink-0" size="md">
        <Icon className="size-5" />
      </GradientIcon>
      <div className="flex-1 min-w-0">
        <div className={cn("font-medium truncate", fileTitleClassName)}>
          {title}
        </div>
        {date && (
          <div className="text-xs text-muted-foreground">
            {format(parseDateString(date), "MMM d, yyyy h:mm a")}
          </div>
        )}
      </div>
      {isVideo && url && botUuid && (
        <Button
          variant="outline"
          size="icon"
          asChild
          aria-label={`View ${title}`}
        >
          <Link
            href={hasTranscription ? `/viewer/${botUuid}` : url}
            target="_blank"
          >
            <Eye className="size-4" />
          </Link>
        </Button>
      )}
      <Button
        variant="outline"
        size="icon"
        onClick={handleDownload}
        disabled={isDownloading || !url}
        aria-label={`Download ${title}`}
      >
        {isDownloading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Download className="size-4" />
        )}
      </Button>
    </Card>
  );
}
