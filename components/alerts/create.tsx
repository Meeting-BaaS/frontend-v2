"use client"

import { AnimatePresence, motion } from "motion/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { FormFieldsStep1 } from "@/components/alerts/form-fields-step1"
import { FormFieldsStep2 } from "@/components/alerts/form-fields-step2"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { axiosPostInstance } from "@/lib/api-client"
import { CREATE_ALERT_RULE } from "@/lib/api-routes"
import { genericError } from "@/lib/errors"
import {
  type CreateAlertRuleResponse,
  type CreateAlertRuleStep1Data,
  type CreateAlertRuleStep2Data,
  createAlertRuleResponseSchema
} from "@/lib/schemas/alerts"

interface CreateAlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const stepAnimation = {
  initial: { opacity: 0, x: 10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] as const }
}

export function CreateAlertDialog({ open, onOpenChange }: CreateAlertDialogProps) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [step1Data, setStep1Data] = useState<CreateAlertRuleStep1Data | null>(null)
  const [loading, setLoading] = useState(false)

  const handleStep1Next = (data: CreateAlertRuleStep1Data) => {
    setStep1Data(data)
    setStep(2)
  }

  const handleStep2Submit = async (data: CreateAlertRuleStep2Data) => {
    if (loading || !step1Data) return

    const deliveryChannels: Record<string, unknown> = {}
    const recipients = data.emailRecipients.map((r) => r.value).filter(Boolean)
    if (recipients.length > 0) {
      deliveryChannels.email = { recipients }
    }
    if (data.callbackUrl) {
      deliveryChannels.callback = {
        url: data.callbackUrl,
        ...(data.callbackSecret ? { secret: data.callbackSecret } : {})
      }
    }

    if (!deliveryChannels.email && !deliveryChannels.callback) {
      toast.error("At least one delivery channel (email or callback) is required")
      return
    }

    try {
      setLoading(true)
      const response = await axiosPostInstance<unknown, CreateAlertRuleResponse>(
        CREATE_ALERT_RULE,
        {
          ...step1Data,
          deliveryChannels,
          cooldownMinutes: data.cooldownMinutes
        },
        createAlertRuleResponseSchema
      )

      if (!response || !response.success) {
        throw new Error("Failed to create alert rule")
      }

      router.push(`/alerts/${response.data.ruleId}`)
      toast.success("Alert rule created successfully")
      handleClose(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : genericError)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = (updatedOpen: boolean) => {
    if (updatedOpen || loading) return
    setStep(1)
    setStep1Data(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" showCloseButton={!loading}>
        <DialogHeader>
          <DialogTitle>Add Alert Rule {step === 2 ? "- Delivery" : ""}</DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Configure the metric and threshold for this alert."
              : "Choose how you want to be notified when this alert fires. At least one delivery channel (email or callback) is required."}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" {...stepAnimation}>
              <FormFieldsStep1
                loading={loading}
                defaultValues={step1Data ?? undefined}
                onNext={handleStep1Next}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" {...stepAnimation}>
              <FormFieldsStep2
                loading={loading}
                submitLabel="Create"
                loadingLabel="Creating"
                onBack={() => setStep(1)}
                onSubmit={handleStep2Submit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
