"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import { genericError } from "@/lib/errors"
import { cn } from "@/lib/utils"
import type { AdminListUser } from "@/types/admin-users"

interface AddAdminDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usersWithRoleUser: AdminListUser[]
  loadingUsers: boolean
  onSuccess: () => void
  refetchUsers: () => void
}

export function AddAdminDialog({
  open,
  onOpenChange,
  usersWithRoleUser,
  loadingUsers,
  onSuccess,
  refetchUsers
}: AddAdminDialogProps) {
  const [selectedUser, setSelectedUser] = useState<AdminListUser | null>(null)
  const [comboboxOpen, setComboboxOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleConfirm = async () => {
    if (!selectedUser) {
      toast.error("Please select a user")
      return
    }
    setSubmitting(true)
    try {
      const { error } = await authClient.admin.setRole({
        userId: selectedUser.id,
        role: "admin"
      })
      if (error) throw new Error(error.message)
      toast.success("User promoted to admin")
      setSelectedUser(null)
      onSuccess()
      refetchUsers()
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : genericError)
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setSelectedUser(null)
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={!submitting}
        aria-labelledby="add-admin-dialog-title"
        aria-describedby="add-admin-dialog-description"
        aria-busy={submitting}
      >
        <DialogHeader>
          <DialogTitle id="add-admin-dialog-title">Add admin</DialogTitle>
          <DialogDescription id="add-admin-dialog-description">
            Select a user to promote to admin. They will have full admin access.
          </DialogDescription>
        </DialogHeader>
        <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={comboboxOpen}
              aria-busy={loadingUsers}
              aria-label="Select user to promote to admin"
              aria-haspopup="listbox"
              className="w-full justify-between min-h-10"
              disabled={loadingUsers}
            >
              {loadingUsers ? (
                <div className="flex items-center gap-2">
                  <Spinner className="size-4 mr-2" />
                  <span>Loading users...</span>
                </div>
              ) : selectedUser ? (
                `${selectedUser.email}${selectedUser.name ? ` (${selectedUser.name})` : ""}`
              ) : (
                "Select user..."
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search by email or name..." />
              <CommandList>
                <CommandEmpty>No user found.</CommandEmpty>
                <CommandGroup>
                  {usersWithRoleUser.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={`${user.email} ${user.name ?? ""}`}
                      onSelect={() => {
                        setSelectedUser(user)
                        setComboboxOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedUser?.id === user.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="truncate">{user.email}</span>
                      {user.name ? (
                        <span className="text-muted-foreground ml-2 truncate">{user.name}</span>
                      ) : null}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedUser || submitting}
            aria-busy={submitting}
          >
            {submitting && <Spinner className="size-4 mr-2" />}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
