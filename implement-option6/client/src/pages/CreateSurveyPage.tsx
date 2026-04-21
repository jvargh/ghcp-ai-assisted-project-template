import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSurvey } from "../api/client";
import ErrorMessage from "../components/ErrorMessage";
import type { ApiError } from "../types";

interface QuestionDraft {
  text: string;
  options: string[];
}

export default function CreateSurveyPage() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    { text: "", options: ["", ""] },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function addQuestion() {
    if (questions.length >= 10) return;
    setQuestions([...questions, { text: "", options: ["", ""] }]);
  }

  function removeQuestion(index: number) {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  }

  function updateQuestionText(index: number, text: string) {
    const updated = [...questions];
    updated[index] = { ...updated[index]!, text };
    setQuestions(updated);
  }

  function addOption(questionIndex: number) {
    const q = questions[questionIndex]!;
    if (q.options.length >= 5) return;
    const updated = [...questions];
    updated[questionIndex] = { ...q, options: [...q.options, ""] };
    setQuestions(updated);
  }

  function removeOption(questionIndex: number, optionIndex: number) {
    const q = questions[questionIndex]!;
    if (q.options.length <= 1) return;
    const updated = [...questions];
    updated[questionIndex] = {
      ...q,
      options: q.options.filter((_, i) => i !== optionIndex),
    };
    setQuestions(updated);
  }

  function updateOptionText(
    questionIndex: number,
    optionIndex: number,
    text: string
  ) {
    const updated = [...questions];
    const q = { ...updated[questionIndex]! };
    q.options = [...q.options];
    q.options[optionIndex] = text;
    updated[questionIndex] = q;
    setQuestions(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createSurvey({
        title,
        questions: questions.map((q) => ({
          text: q.text,
          options: q.options.map((text) => ({ text })),
        })),
      });
      navigate("/");
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.error?.message ?? "Failed to create survey");
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    navigate("/");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Create New Survey
      </h1>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Survey Title
          </label>
          <input
            id="title"
            type="text"
            required
            maxLength={200}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {questions.map((question, qi) => (
          <div
            key={qi}
            className="border border-gray-200 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">
                Question {qi + 1}
              </h3>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qi)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            <div>
              <label
                htmlFor={`q-${qi}`}
                className="block text-sm text-gray-600"
              >
                Question Text
              </label>
              <input
                id={`q-${qi}`}
                type="text"
                required
                maxLength={500}
                value={question.text}
                onChange={(e) => updateQuestionText(qi, e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">Options</p>
              {question.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    maxLength={200}
                    value={opt}
                    onChange={(e) =>
                      updateOptionText(qi, oi, e.target.value)
                    }
                    placeholder={`Option ${oi + 1}`}
                    aria-label={`Question ${qi + 1}, Option ${oi + 1}`}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  {question.options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(qi, oi)}
                      className="text-red-500 hover:text-red-700 text-sm"
                      aria-label={`Remove option ${oi + 1}`}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {question.options.length < 5 && (
                <button
                  type="button"
                  onClick={() => addOption(qi)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  + Add Option
                </button>
              )}
            </div>
          </div>
        ))}

        {questions.length < 10 && (
          <button
            type="button"
            onClick={addQuestion}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          >
            + Add Question
          </button>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
