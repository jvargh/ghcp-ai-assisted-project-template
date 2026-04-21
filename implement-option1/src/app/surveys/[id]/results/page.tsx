"use client";

import { useEffect, useReducer } from "react";
import { useParams } from "next/navigation";
import { SurveyResultsTable } from "@/components/survey-results-table";
import { ErrorMessage } from "@/components/messages";
import type { SurveyResults } from "@/types";
import { fetchSurveyResults } from "@/services/survey-service";

interface State {
  results: SurveyResults | null;
  error: string | null;
}

type Action =
  | { type: "LOADED"; results: SurveyResults }
  | { type: "ERROR"; error: string };

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case "LOADED":
      return { results: action.results, error: null };
    case "ERROR":
      return { results: null, error: action.error };
  }
}

export default function SurveyResultsPage() {
  const params = useParams<{ id: string }>();
  const [state, dispatch] = useReducer(reducer, { results: null, error: null });

  useEffect(() => {
    let cancelled = false;
    fetchSurveyResults(params.id)
      .then((data) => {
        if (!cancelled) dispatch({ type: "LOADED", results: data });
      })
      .catch(() => {
        if (!cancelled) dispatch({ type: "ERROR", error: "Failed to load survey results." });
      });
    return () => { cancelled = true; };
  }, [params.id]);

  if (state.error) {
    return <ErrorMessage message={state.error} />;
  }

  if (!state.results) {
    return <p className="text-gray-500 text-center py-8">Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <SurveyResultsTable results={state.results} />
    </div>
  );
}
