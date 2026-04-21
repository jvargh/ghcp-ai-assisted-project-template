"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SurveyForm } from "@/components/survey-form";
import { ErrorMessage } from "@/components/messages";
import { createSurveyRequest } from "@/services/survey-service";
import type { CreateSurveyInput } from "@/lib/validation";

export default function CreateSurveyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateSurveyInput) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await createSurveyRequest(data);
      router.push("/coordinator");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create survey");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Survey</h1>
      {error && <ErrorMessage message={error} />}
      <SurveyForm
        onSubmit={handleSubmit}
        onCancel={() => router.push("/coordinator")}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
