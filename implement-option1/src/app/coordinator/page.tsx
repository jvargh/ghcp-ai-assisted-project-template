"use client";

import { useCallback, useEffect, useReducer } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SurveyList } from "@/components/survey-list";
import { ErrorMessage } from "@/components/messages";
import type { Survey } from "@/types";
import { fetchSurveys, updateSurveyStatusRequest } from "@/services/survey-service";

interface State {
  surveys: Survey[];
  loading: boolean;
  actionInProgress: boolean;
  error: string | null;
}

type Action =
  | { type: "LOADING" }
  | { type: "LOADED"; surveys: Survey[] }
  | { type: "ACTION_START" }
  | { type: "ACTION_ERROR"; error: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true, error: null };
    case "LOADED":
      return { surveys: action.surveys, loading: false, actionInProgress: false, error: null };
    case "ACTION_START":
      return { ...state, actionInProgress: true, error: null };
    case "ACTION_ERROR":
      return { ...state, actionInProgress: false, error: action.error };
  }
}

export default function CoordinatorPage() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, { surveys: [], loading: true, actionInProgress: false, error: null });
  const [refreshKey, setRefreshKey] = useReducer((k: number) => k + 1, 0);

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "LOADING" });
    fetchSurveys().then((data) => {
      if (!cancelled) {
        dispatch({ type: "LOADED", surveys: data });
      }
    });
    return () => { cancelled = true; };
  }, [refreshKey]);

  const reload = useCallback(() => setRefreshKey(), []);

  const handleOpen = async (survey: Survey) => {
    dispatch({ type: "ACTION_START" });
    try {
      await updateSurveyStatusRequest(survey.id, "open");
      reload();
    } catch (err) {
      dispatch({ type: "ACTION_ERROR", error: err instanceof Error ? err.message : "Failed to open survey" });
    }
  };

  const handleClose = async (survey: Survey) => {
    dispatch({ type: "ACTION_START" });
    try {
      await updateSurveyStatusRequest(survey.id, "closed");
      reload();
    } catch (err) {
      dispatch({ type: "ACTION_ERROR", error: err instanceof Error ? err.message : "Failed to close survey" });
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const draftSurveys = state.surveys.filter((s) => s.status === "draft");
  const openSurveys = state.surveys.filter((s) => s.status === "open");
  const closedSurveys = state.surveys.filter((s) => s.status === "closed");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Survey Coordinator</h1>
        <div className="flex gap-3">
          <Link
            href="/coordinator/surveys/new"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Survey
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {state.error && <ErrorMessage message={state.error} />}

      {state.loading ? (
        <p className="text-gray-500 text-center py-8">Loading...</p>
      ) : (
        <>
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Draft Surveys</h2>
            <SurveyList
              surveys={draftSurveys}
              emptyMessage="No draft surveys."
              actionLabel="Open"
              onAction={handleOpen}
              actionsDisabled={state.actionInProgress}
            />
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Open Surveys</h2>
            <SurveyList
              surveys={openSurveys}
              emptyMessage="No open surveys."
              actionLabel="Close"
              onAction={handleClose}
              actionsDisabled={state.actionInProgress}
            />
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Closed Surveys</h2>
            <SurveyList
              surveys={closedSurveys}
              emptyMessage="No closed surveys."
              actionLabel="View Results"
              getActionHref={(s) => `/surveys/${s.id}/results`}
            />
          </section>
        </>
      )}
    </div>
  );
}
