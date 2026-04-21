"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSurveySchema, type CreateSurveyInput } from "@/lib/validation";
import { generateId } from "@/lib/id";

interface SurveyFormProps {
  onSubmit: (data: CreateSurveyInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function SurveyForm({ onSubmit, onCancel, isSubmitting }: SurveyFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSurveyInput>({
    resolver: zodResolver(createSurveySchema),
    defaultValues: {
      title: "",
      questions: [
        {
          id: generateId(),
          text: "",
          selections: [
            { id: generateId(), text: "" },
            { id: generateId(), text: "" },
          ],
        },
      ],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({ control, name: "questions" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Survey Title
        </label>
        <input
          id="title"
          type="text"
          {...register("title")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter survey title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Questions</h3>
          {questionFields.length < 10 && (
            <button
              type="button"
              onClick={() =>
                appendQuestion({
                  id: generateId(),
                  text: "",
                  selections: [
                    { id: generateId(), text: "" },
                    { id: generateId(), text: "" },
                  ],
                })
              }
              className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              Add Question
            </button>
          )}
        </div>

        {errors.questions && typeof errors.questions.message === "string" && (
          <p className="text-sm text-red-600">{errors.questions.message}</p>
        )}

        {questionFields.map((field, qIndex) => (
          <QuestionField
            key={field.id}
            qIndex={qIndex}
            register={register}
            control={control}
            errors={errors}
            onRemove={questionFields.length > 1 ? () => removeQuestion(qIndex) : undefined}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Saving..." : "Save"}
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

// --- Sub-component for individual question ---

interface QuestionFieldProps {
  qIndex: number;
  register: ReturnType<typeof useForm<CreateSurveyInput>>["register"];
  control: ReturnType<typeof useForm<CreateSurveyInput>>["control"];
  errors: ReturnType<typeof useForm<CreateSurveyInput>>["formState"]["errors"];
  onRemove?: () => void;
}

function QuestionField({ qIndex, register, control, errors, onRemove }: QuestionFieldProps) {
  const {
    fields: selectionFields,
    append: appendSelection,
    remove: removeSelection,
  } = useFieldArray({ control, name: `questions.${qIndex}.selections` });

  const questionErrors = errors.questions?.[qIndex];

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex items-start justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700">
          Question {qIndex + 1}
        </label>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        )}
      </div>

      <input
        type="text"
        {...register(`questions.${qIndex}.text`)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
        placeholder="Enter question text"
      />
      {questionErrors?.text && (
        <p className="text-sm text-red-600 mb-2">{questionErrors.text.message}</p>
      )}

      {/* Selections */}
      <div className="ml-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase">Selections</span>
          {selectionFields.length < 5 && (
            <button
              type="button"
              onClick={() => appendSelection({ id: generateId(), text: "" })}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              + Add Selection
            </button>
          )}
        </div>

        {questionErrors?.selections && typeof questionErrors.selections.message === "string" && (
          <p className="text-sm text-red-600">{questionErrors.selections.message}</p>
        )}

        {selectionFields.map((selField, sIndex) => (
          <div key={selField.id} className="flex items-center gap-2">
            <input
              type="text"
              {...register(`questions.${qIndex}.selections.${sIndex}.text`)}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={`Selection ${sIndex + 1}`}
            />
            {selectionFields.length > 1 && (
              <button
                type="button"
                onClick={() => removeSelection(sIndex)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
