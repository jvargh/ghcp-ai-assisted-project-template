import {
  createSurvey,
  updateSurveyStatus,
  submitResponse,
  getAllSurveys,
} from "@/lib/store";
import type { CreateSurveyInput } from "@/lib/validation";

const seedSurveys: CreateSurveyInput[] = [
  {
    title: "Team Retrospective Q1",
    questions: [
      {
        id: "q1",
        text: "How was the overall sprint velocity?",
        selections: [
          { id: "s1", text: "Excellent" },
          { id: "s2", text: "Good" },
          { id: "s3", text: "Average" },
          { id: "s4", text: "Poor" },
        ],
      },
      {
        id: "q2",
        text: "How effective was team communication?",
        selections: [
          { id: "s5", text: "Very effective" },
          { id: "s6", text: "Somewhat effective" },
          { id: "s7", text: "Needs improvement" },
        ],
      },
    ],
  },
  {
    title: "Product Feedback Survey",
    questions: [
      {
        id: "q1",
        text: "How satisfied are you with the product?",
        selections: [
          { id: "s1", text: "Very satisfied" },
          { id: "s2", text: "Satisfied" },
          { id: "s3", text: "Neutral" },
          { id: "s4", text: "Unsatisfied" },
        ],
      },
      {
        id: "q2",
        text: "Would you recommend this product?",
        selections: [
          { id: "s5", text: "Definitely" },
          { id: "s6", text: "Maybe" },
          { id: "s7", text: "No" },
        ],
      },
      {
        id: "q3",
        text: "How often do you use the product?",
        selections: [
          { id: "s8", text: "Daily" },
          { id: "s9", text: "Weekly" },
          { id: "s10", text: "Monthly" },
          { id: "s11", text: "Rarely" },
        ],
      },
    ],
  },
  {
    title: "Lunch Preferences",
    questions: [
      {
        id: "q1",
        text: "What type of cuisine do you prefer?",
        selections: [
          { id: "s1", text: "Italian" },
          { id: "s2", text: "Mexican" },
          { id: "s3", text: "Asian" },
          { id: "s4", text: "American" },
          { id: "s5", text: "Mediterranean" },
        ],
      },
    ],
  },
];

export function seedDevelopmentData(): void {
  // Only seed if store is empty
  if (getAllSurveys().length > 0) return;

  // Survey 1: Closed with responses
  const survey1 = createSurvey(seedSurveys[0]);
  updateSurveyStatus(survey1.id, "open");
  submitResponse(survey1.id, { q1: "s1", q2: "s5" });
  submitResponse(survey1.id, { q1: "s2", q2: "s5" });
  submitResponse(survey1.id, { q1: "s2", q2: "s6" });
  submitResponse(survey1.id, { q1: "s3", q2: "s7" });
  updateSurveyStatus(survey1.id, "closed");

  // Survey 2: Open (accepting responses)
  const survey2 = createSurvey(seedSurveys[1]);
  updateSurveyStatus(survey2.id, "open");
  submitResponse(survey2.id, { q1: "s1", q2: "s5", q3: "s8" });
  submitResponse(survey2.id, { q1: "s2", q2: "s6", q3: "s9" });

  // Survey 3: Draft
  createSurvey(seedSurveys[2]);
}
