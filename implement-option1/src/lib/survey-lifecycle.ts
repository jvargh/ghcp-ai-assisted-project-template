import type { SurveyStatus } from "@/types";

const validTransitions: Record<SurveyStatus, SurveyStatus[]> = {
  draft: ["open"],
  open: ["closed"],
  closed: [],
};

export function canTransition(
  from: SurveyStatus,
  to: SurveyStatus
): boolean {
  return validTransitions[from].includes(to);
}

export function transition(
  currentStatus: SurveyStatus,
  targetStatus: SurveyStatus
): SurveyStatus {
  if (!canTransition(currentStatus, targetStatus)) {
    throw new Error(
      `Invalid status transition: cannot move from "${currentStatus}" to "${targetStatus}"`
    );
  }
  return targetStatus;
}
