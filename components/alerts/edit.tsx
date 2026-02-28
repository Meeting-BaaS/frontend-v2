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
import { axiosPutInstance } from "@/lib/api-client"
import { UPDATE_ALERT_RULE } from "@/lib/api-routes"
import { genericError } from "@/lib/errors"
import type {
  AlertRule,
  CreateAlertRuleStep1Data,
  CreateAlertRuleStep2Data
} from "@/lib/schemas/alerts"

interface EditAlertDialogProps {
  rule: AlertRule
  open: boolean
  onOpenChange: (open: boolean) => void
}

const stepAnimation = {
  initial: { opacity: 0, x: 10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
  transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] as const }
}

export function EditAlertDialog({ rule, open, onOpenChange }: EditAlertDialogProps) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [step1Data, setStep1Data] = useState<CreateAlertRuleStep1Data | null>(null)
  const [loading, setLoading] = useState(false)

  const channels = rule.deliveryChannels as {
    email?: { recipients: string[] }
    callback?: { url: string; secret?: string }
  } | null

  const step1Defaults: Partial<CreateAlertRuleStep1Data> = {
    name: rule.name,
    alertType: rule.alertType as CreateAlertRuleStep1Data["alertType"],
    operator: rule.operator as CreateAlertRuleStep1Data["operator"],
    value: rule.value
  }

  const step2Defaults: Partial<CreateAlertRuleStep2Data> = {
    emailRecipients: channels?.email?.recipients || [],
    callbackUrl: channels?.callback?.url || "",
    callbackSecret: channels?.callback?.secret || "",
    cooldownMinutes: rule.cooldownMinutes
  }

  const handleStep1Next = (data: CreateAlertRuleStep1Data) => {
    setStep1Data(data)
    setStep(2)
  }

  const handleStep2Submit = async (data: CreateAlertRuleStep2Data) => {
    const currentStep1 = step1Data ?? step1Defaults
    if (loading) return

    const deliveryChannels: Record<string, unknown> = {}
    if (data.emailRecipients.length > 0) {
      deliveryChannels.email = { recipients: data.emailRecipients }
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
      await axiosPutInstance<unknown, null>(UPDATE_ALERT_RULE, {
        ruleId: rule.uuid,
        ...currentStep1,
        deliveryChannels,
        cooldownMinutes: data.cooldownMinutes
      })

      router.refresh()
      toast.success("Alert rule updated successfully")
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
          <DialogTitle>Edit Alert Rule {step === 2 ? "- Delivery" : ""}</DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Update the metric and threshold for this alert."
              : "Update how you want to be notified when this alert fires."}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" {...stepAnimation}>
              <FormFieldsStep1
                loading={loading}
                defaultValues={step1Data ?? step1Defaults}
                onNext={handleStep1Next}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" {...stepAnimation}>
              <FormFieldsStep2
                loading={loading}
                defaultValues={step2Defaults}
                submitLabel="Save"
                loadingLabel="Saving"
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
