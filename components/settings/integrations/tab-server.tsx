import { Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GradientIcon } from "@/components/ui/gradient-icon";

export async function IntegrationsTab() {
  return (
    <Card className="flex flex-row items-center gap-4 p-4 pointer-events-none opacity-50">
      <GradientIcon
        color="var(--color-baas-primary-700)"
        className="flex-shrink-0"
        size="md"
      >
        <Server className="size-5" />
      </GradientIcon>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">MCP Server</div>

        <div className="text-sm text-muted-foreground flex items-center gap-2">
          Integrate Meeting BaaS v2 MCP Server in your favourite AI agent or
          design a custom agentic workflow built on top of Meeting BaaS.
        </div>
      </div>
      <Button variant="outline" size="sm" disabled>
        Coming soon
      </Button>
    </Card>
  );
}
