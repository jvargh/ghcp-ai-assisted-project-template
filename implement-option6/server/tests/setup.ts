import { beforeEach } from "vitest";
import { sqlite } from "../src/db/index.js";
import { migrate } from "../src/db/migrate.js";

// Run migrations once
migrate();

beforeEach(() => {
  // Clear all data between tests
  sqlite.exec("DELETE FROM answers");
  sqlite.exec("DELETE FROM survey_responses");
  sqlite.exec("DELETE FROM options");
  sqlite.exec("DELETE FROM questions");
  sqlite.exec("DELETE FROM surveys");
  sqlite.exec("DELETE FROM users");
});
