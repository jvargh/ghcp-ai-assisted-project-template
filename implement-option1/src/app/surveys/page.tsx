"use client";

import { useEffect, useReducer, useState } from "react";
import { SurveyList } from "@/components/survey-list";
import type { Survey } from "@/types";
import { fetchSurveys } from "@/services/survey-service";

interface State {
  surveys: Survey[];
  loading: boolean;
}

type Action =
  | { type: "LOADING" }
  | { type: "LOADED"; surveys: Survey[] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true };
    case "LOADED":
      return { surveys: action.surveys, loading: false };
  }
}

export default function SurveysPage() {
  const [state, dispatch] = useReducer(reducer, { surveys: [], loading: true });
  const [filter, setFilter] = useState<"all" | "open" | "closed">("open");

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "LOADING" });
    fetchSurveys(filter === "all" ? undefined : filter).then((data) => {
      if (!cancelled) {
        dispatch({ type: "LOADED", surveys: data });
      }
    });
    return () => { cancelled = true; };
  }, [filter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Surveys</h1>
      </div>

      <div className="flex gap-2">
        {(["open", "closed", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {state.loading ? (
        <p className="text-gray-500 text-center py-8">Loading...</p>
      ) : (
        <SurveyList
          surveys={state.surveys}
          emptyMessage={`No ${filter === "all" ? "" : filter + " "}surveys found.`}
          actionLabel={filter === "open" ? "Take Survey" : filter === "closed" ? "View Results" : undefined}
          getActionHref={
            filter === "open"
              ? (s) => `/surveys/${s.id}`
              : filter === "closed"
              ? (s) => `/surveys/${s.id}/results`
              : undefined
          }
        />
      )}
    </div>
  );
}
