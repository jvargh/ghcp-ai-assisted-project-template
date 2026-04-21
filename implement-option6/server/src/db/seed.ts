import bcrypt from "bcryptjs";
import { db } from "./index.js";
import { users, surveys, questions, options } from "./schema.js";
import { migrate } from "./migrate.js";

const SALT_ROUNDS = 10;

async function seed(): Promise<void> {
  migrate();

  const coordinatorHash = await bcrypt.hash("password123", SALT_ROUNDS);
  const respondentHash = await bcrypt.hash("password123", SALT_ROUNDS);

  // Create users
  db.insert(users)
    .values([
      {
        email: "coordinator@example.com",
        passwordHash: coordinatorHash,
        name: "Alice Coordinator",
        role: "coordinator",
      },
      {
        email: "respondent@example.com",
        passwordHash: respondentHash,
        name: "Bob Respondent",
        role: "respondent",
      },
    ])
    .run();

  // Create a sample survey
  const surveyResult = db
    .insert(surveys)
    .values({
      title: "Developer Satisfaction Survey",
      status: "open",
      createdBy: 1,
    })
    .returning()
    .get();

  const questionTexts = [
    "How satisfied are you with your current development tools?",
    "How would you rate the team's code review process?",
    "How effective is the project's testing strategy?",
  ];

  const optionSets = [
    ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"],
    ["Poor", "Fair", "Good", "Very Good", "Excellent"],
    ["Not Effective", "Slightly Effective", "Moderately Effective", "Very Effective", "Extremely Effective"],
  ];

  for (let qi = 0; qi < questionTexts.length; qi++) {
    const questionText = questionTexts[qi]!;
    const optionSet = optionSets[qi]!;

    const question = db
      .insert(questions)
      .values({
        surveyId: surveyResult.id,
        text: questionText,
        orderIndex: qi,
      })
      .returning()
      .get();

    for (let oi = 0; oi < optionSet.length; oi++) {
      db.insert(options)
        .values({
          questionId: question.id,
          text: optionSet[oi]!,
          orderIndex: oi,
        })
        .run();
    }
  }

  // Create a closed survey with some results
  const closedSurvey = db
    .insert(surveys)
    .values({
      title: "Office Environment Feedback",
      status: "closed",
      createdBy: 1,
    })
    .returning()
    .get();

  const closedQuestion = db
    .insert(questions)
    .values({
      surveyId: closedSurvey.id,
      text: "How comfortable is the office workspace?",
      orderIndex: 0,
    })
    .returning()
    .get();

  for (let i = 0; i < 3; i++) {
    db.insert(options)
      .values({
        questionId: closedQuestion.id,
        text: ["Uncomfortable", "Average", "Comfortable"][i]!,
        orderIndex: i,
      })
      .run();
  }

  console.log("Database seeded successfully!");
}

seed().catch(console.error);
