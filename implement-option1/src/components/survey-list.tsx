import type { Survey } from "@/types";
import Link from "next/link";

interface SurveyListProps {
  surveys: Survey[];
  emptyMessage?: string;
  actionLabel?: string;
  getActionHref?: (survey: Survey) => string;
  onAction?: (survey: Survey) => void;
  actionsDisabled?: boolean;
}

export function SurveyList({
  surveys,
  emptyMessage = "No surveys found.",
  actionLabel,
  getActionHref,
  onAction,
  actionsDisabled,
}: SurveyListProps) {
  if (surveys.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">{emptyMessage}</p>
    );
  }

  return (
    <ul className="space-y-3">
      {surveys.map((survey) => (
        <li
          key={survey.id}
          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
        >
          <div>
            <h3 className="font-medium text-gray-900">{survey.title}</h3>
            <p className="text-sm text-gray-500 capitalize">
              Status: {survey.status}
            </p>
          </div>
          {actionLabel && getActionHref && (
            <Link
              href={getActionHref(survey)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              {actionLabel}
            </Link>
          )}
          {actionLabel && onAction && !getActionHref && (
            <button
              onClick={() => onAction(survey)}
              disabled={actionsDisabled}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {actionLabel}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
