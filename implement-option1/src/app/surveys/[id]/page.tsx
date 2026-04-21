"use client";

import { useEffect, useReducer, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SurveyResponseForm } from "@/components/survey-response-form";
import { ErrorMessage } from "@/components/messages";
import type { Survey } from "@/types";
import { fetchSurveyById, submitSurveyResponse } from "@/services/survey-service";

interface State {
  survey: Survey | null;
  error: string | null;
}

type Action =
  | { type: "LOADED"; survey: Survey }
  | { type: "ERROR"; error: string };

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case "LOADED":
      return { survey: action.survey, error: null };
    case "ERROR":
      return { survey: null, error: action.error };
  }
}

export default function TakeSurveyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, { survey: null, error: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchSurveyById(params.id)
      .then((data) => {
        if (cancelled) return;
        if (data.status !== "open") {
          dispatch({ type: "ERROR", error: "This survey is not currently open for responses." });
          return;
        }
        dispatch({ type: "LOADED", survey: data });
      })
      .catch(() => {
        if (!cancelled) {
          dispatch({ type: "ERROR", error: "Survey not found." });
        }
      });
    return () => { cancelled = true; };
  }, [params.id]);

  const handleSubmit = async (answers: Record<string, string>) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await submitSurveyResponse(params.id, answers);
      router.push("/surveys?submitted=true");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit response");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (state.error && !state.survey) {
    return <ErrorMessage message={state.error} />;
  }

  if (!state.survey) {
    return <p className="text-gray-500 text-center py-8">Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {submitError && <ErrorMessage message={submitError} />}
      <SurveyResponseForm
        survey={state.survey}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/")}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
