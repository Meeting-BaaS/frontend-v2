import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { V1_BAAS_URL } from "@/lib/external-urls";

export const GotoV1Button = () => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="fill-foreground px-2 py-1.5"
      asChild
    >
      <Link href={V1_BAAS_URL} target="_blank" rel="noopener noreferrer">
        <span className="flex items-center gap-2">
          Access Meeting BaaS v1
          <ExternalLink aria-hidden />
        </span>
      </Link>
    </Button>
  );
};
