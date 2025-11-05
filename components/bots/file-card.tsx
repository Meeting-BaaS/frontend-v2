"use client";

import { format } from "date-fns";
import { Download, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GradientIcon } from "@/components/ui/gradient-icon";
import { Skeleton } from "@/components/ui/skeleton";
import { parseDateString } from "@/lib/date-helpers";

interface FileCardProps {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  title: string;
  date: string | null;
  url: string;
  fileName: string;
}

export function FileCard({
  icon: Icon,
  iconColor,
  title,
  date,
  url,
  fileName,
}: FileCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [size, setSize] = useState(0);

  useEffect(() => {
    if (!url) return;
    fetch(url, { method: "HEAD" })
      .then((response) => response.headers.get("Content-Length"))
      .then((size) => setSize(Number(size)))
      .catch((error) => {
        console.error("Failed to get file size", error);
      });
  }, [url]);

  const handleDownload = () => {
    if (isDownloading) return;

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
        <div className="font-medium truncate">{title}</div>
        {date && (
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span>
              {size ? (
                `${(size / 1024 / 1024).toFixed(2)} MB`
              ) : (
                <Skeleton className="w-10 h-2" />
              )}
            </span>
            <span>•</span>
            {format(parseDateString(date), "MMM d, yyyy h:mm a")}
          </div>
        )}
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={handleDownload}
        disabled={isDownloading}
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
