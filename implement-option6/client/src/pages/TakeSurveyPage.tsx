import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSurvey, submitResponse } from "../api/client";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import type { Survey, ApiError } from "../types";

export default function TakeSurveyPage() {
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await getSurvey(Number(id));
        setSurvey(data.survey);
      } catch (err) {
        const apiErr = err as ApiError;
        setError(apiErr.error?.message ?? "Failed to load survey");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function handleOptionSelect(questionId: number, optionId: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError("");

    if (!survey?.questions) return;

    // Check all questions answered
    const unanswered = survey.questions.filter(
      (q) => answers[q.id] === undefined
    );
    if (unanswered.length > 0) {
      setSubmitError(
        "Please answer all questions before submitting."
      );
      return;
    }

    setSubmitting(true);
    try {
      const answerArray = Object.entries(answers).map(([qId, oId]) => ({
        questionId: Number(qId),
        optionId: oId,
      }));
      await submitResponse(Number(id), answerArray);
      navigate("/", {
        state: { message: "Survey submitted successfully!" },
      });
    } catch (err) {
      const apiErr = err as ApiError;
      setSubmitError(apiErr.error?.message ?? "Failed to submit response");
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    navigate("/");
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!survey) return <ErrorMessage message="Survey not found" />;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {survey.title}
      </h1>
      <p className="text-gray-500 mb-6">
        Please answer all {survey.questions?.length ?? 0} questions
      </p>

      {submitError && <ErrorMessage message={submitError} />}

      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        {survey.questions?.map((question, qi) => (
          <fieldset
            key={question.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <legend className="font-medium text-gray-900 px-2">
              {qi + 1}. {question.text}
            </legend>
            <div className="space-y-2 mt-2">
              {question.options.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50 ${
                    answers[question.id] === option.id
                      ? "bg-indigo-50"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.id}
                    checked={answers[question.id] === option.id}
                    onChange={() =>
                      handleOptionSelect(question.id, option.id)
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">{option.text}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}

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
            disabled={submitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
