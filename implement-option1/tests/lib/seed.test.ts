import { seedDevelopmentData } from "@/lib/seed";
import { getAllSurveys, getSurveysByStatus, resetStore } from "@/lib/store";

describe("seedDevelopmentData", () => {
  beforeEach(() => {
    resetStore();
  });

  it("seeds three surveys in different states", () => {
    seedDevelopmentData();

    const all = getAllSurveys();
    expect(all).toHaveLength(3);

    expect(getSurveysByStatus("draft")).toHaveLength(1);
    expect(getSurveysByStatus("open")).toHaveLength(1);
    expect(getSurveysByStatus("closed")).toHaveLength(1);
  });

  it("does not re-seed if data already exists", () => {
    seedDevelopmentData();
    seedDevelopmentData(); // second call should be no-op

    expect(getAllSurveys()).toHaveLength(3);
  });
});
