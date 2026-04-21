"use client";

import { useState } from "react";
import type { Survey } from "@/types";

interface SurveyResponseFormProps {
  survey: Survey;
  onSubmit: (answers: Record<string, string>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function SurveyResponseForm({
  survey,
  onSubmit,
  onCancel,
  isSubmitting,
}: SurveyResponseFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (questionId: string, selectionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectionId }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all questions answered
    const unanswered = survey.questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      setError("All questions must be answered before submitting.");
      return;
    }

    onSubmit(answers);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{survey.title}</h2>
        <p className="text-sm text-gray-500 mt-1">
          Answer all questions and click Submit.
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {survey.questions.map((question, qIndex) => (
          <div
            key={question.id}
            className="p-4 border border-gray-200 rounded-lg bg-white"
          >
            <p className="font-medium text-gray-900 mb-3">
              {qIndex + 1}. {question.text}
            </p>
            <div className="space-y-2 ml-4">
              {question.selections.map((selection) => (
                <label
                  key={selection.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={selection.id}
                    checked={answers[question.id] === selection.id}
                    onChange={() => handleSelect(question.id, selection.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    {selection.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
