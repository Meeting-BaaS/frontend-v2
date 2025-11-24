"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { axiosDeleteInstance } from "@/lib/api-client";
import { DELETE_BOT_DATA } from "@/lib/api-routes";
import { genericError } from "@/lib/errors";

interface DeleteBotDataDialogProps {
  botUuid: string;
  botName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteBotDataDialog({
  botUuid,
  botName,
  open,
  onOpenChange,
}: DeleteBotDataDialogProps) {
  const router = useRouter();
  const [typedText, setTypedText] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading || typedText !== "delete") return;

    try {
      setLoading(true);

      await axiosDeleteInstance(DELETE_BOT_DATA(botUuid), {
        params: {
          delete_from_provider: true, // Default to true to delete from transcription provider too
        },
      });

      toast.success("Bot data deleted successfully");
      router.push("/bots");
      onCancel(false);
    } catch (error) {
      console.error("Error deleting bot data", error);
      toast.error(error instanceof Error ? error.message : genericError);
    } finally {
      setLoading(false);
    }
  };

  const onCancel = (updatedOpen: boolean) => {
    if (updatedOpen || loading) {
      return;
    }
    setTypedText("");
    onOpenChange(updatedOpen);
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Delete Bot Data</DialogTitle>
          <DialogDescription className="sr-only">
            Delete all data associated with this bot.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} noValidate>
          <div className="space-y-6 pb-8">
            <div className="flex flex-col gap-1">
              <p>
                Are you sure you want to delete all data for bot{" "}
                <span className="font-semibold">{botName}</span>?
              </p>
              <p className="text-sm text-destructive">
                <span className="font-bold">Warning:</span> This action cannot
                be undone. This will delete:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 space-y-1">
                <li>All artifacts (video, audio, transcriptions, etc.)</li>
                <li>Transcription data from the transcription provider</li>
                <li>All associated speaker, participant data</li>
                <li>Custom transcription API key, if configured</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold">Note:</span> Bot metadata will
                remain in the database for audit purposes.
              </p>
            </div>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="delete-confirmation">
                  Type{" "}
                  <Badge
                    variant="warning"
                    className="flex items-center gap-2 py-1 text-sm"
                  >
                    delete
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-3 [&_svg]:size-3 [&_svg]:text-foreground"
                      asChild
                    >
                      <CopyButton text="delete" />
                    </Button>
                  </Badge>{" "}
                  to confirm
                </FieldLabel>
                <FieldContent>
                  <Input
                    value={typedText}
                    id="delete-confirmation"
                    onChange={(e) => setTypedText(e.target.value)}
                    disabled={loading}
                    aria-label="Type 'delete' to confirm"
                    aria-required="true"
                  />
                </FieldContent>
              </Field>
            </FieldGroup>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="destructive"
              disabled={loading || typedText !== "delete"}
              aria-busy={loading}
              aria-disabled={loading}
              aria-label={loading ? "Deleting" : "Delete"}
            >
              {loading ? (
                <>
                  <Spinner /> Deleting
                </>
              ) : (
                <>
                  <Trash2 /> Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
