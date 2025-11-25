"use client";

import { useState } from "react";
import { PageHeading } from "@/components/layout/page-heading";
import { CreateApiKeyStep } from "@/components/onboarding/steps/create-api-key-step";
import { SendBotStep } from "@/components/onboarding/steps/send-bot-step";
import { StartMeetingStep } from "@/components/onboarding/steps/start-meeting-step";

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyCreated, setApiKeyCreated] = useState(false);

  const handleApiKeyCreated = (key: string) => {
    setApiKey(key);
    setApiKeyCreated(true);
    setCurrentStep(2);
  };

  const handleMeetingStarted = () => {
    setCurrentStep(3);
  };

  return (
    <div className="space-y-8">
      <PageHeading
        title="Get Started with Meeting BaaS"
        description="Follow these simple steps to send your first bot to a meeting"
      />

      <div className="space-y-8">
        <CreateApiKeyStep
          step={1}
          isActive={currentStep === 1}
          isCompleted={apiKeyCreated}
          onComplete={handleApiKeyCreated}
        />

        <StartMeetingStep
          step={2}
          isActive={currentStep === 2}
          isCompleted={currentStep > 2}
          isEnabled={apiKeyCreated}
          onComplete={handleMeetingStarted}
        />

        <SendBotStep
          step={3}
          isActive={currentStep === 3}
          isEnabled={apiKeyCreated && currentStep >= 3}
          apiKey={apiKey}
        />
      </div>
    </div>
  );
}
