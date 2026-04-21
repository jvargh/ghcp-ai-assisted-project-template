import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listSurveys, updateSurveyStatus } from "../api/client";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import type { SurveyListItem, ApiError } from "../types";

export default function SurveyListPage() {
  const [surveys, setSurveys] = useState<SurveyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status") ?? undefined;

  useEffect(() => {
    loadSurveys();
  }, [statusFilter]);

  async function loadSurveys() {
    setLoading(true);
    setError("");
    try {
      const data = await listSurveys(statusFilter);
      setSurveys(data.surveys);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.error?.message ?? "Failed to load surveys");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(
    surveyId: number,
    newStatus: "open" | "closed"
  ) {
    setActionError("");
    try {
      await updateSurveyStatus(surveyId, newStatus);
      await loadSurveys();
    } catch (err) {
      const apiErr = err as ApiError;
      setActionError(apiErr.error?.message ?? "Failed to update survey status");
    }
  }

  function getStatusBadgeClass(status: string): string {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "open":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  const title = statusFilter
    ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Surveys`
    : "All Surveys";

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex gap-2">
          <Link
            to="/surveys"
            className={`px-3 py-1.5 rounded text-sm ${
              !statusFilter
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </Link>
          {["draft", "open", "closed"].map((s) => (
            <Link
              key={s}
              to={`/surveys?status=${s}`}
              className={`px-3 py-1.5 rounded text-sm ${
                statusFilter === s
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Link>
          ))}
        </div>
      </div>

      {actionError && <ErrorMessage message={actionError} />}

      {surveys.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          No surveys found.
        </p>
      ) : (
        <div className="space-y-4">
          {surveys.map((survey) => (
            <div
              key={survey.id}
              className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between hover:shadow-sm transition-shadow"
            >
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {survey.title}
                </h2>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                      survey.status
                    )}`}
                  >
                    {survey.status}
                  </span>
                  <span>{survey.questionCount} questions</span>
                  <span>{survey.responseCount} responses</span>
                </div>
              </div>

              <div className="flex gap-2">
                {survey.status === "open" && (
                  <Link
                    to={`/surveys/${survey.id}/take`}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Take Survey
                  </Link>
                )}

                {survey.status === "closed" && (
                  <Link
                    to={`/surveys/${survey.id}/results`}
                    className="px-3 py-1.5 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                  >
                    View Results
                  </Link>
                )}

                {user?.role === "coordinator" &&
                  survey.status === "draft" && (
                    <button
                      onClick={() => handleStatusChange(survey.id, "open")}
                      className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Open
                    </button>
                  )}

                {user?.role === "coordinator" &&
                  survey.status === "open" && (
                    <button
                      onClick={() => handleStatusChange(survey.id, "closed")}
                      className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Close
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
