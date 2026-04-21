# Requirements

## Core Features

### General
- [x] Survey Coordinators and Survey Respondents can define, conduct, and view surveys and survey results from a common website
- [x] Survey Coordinators can login to the app to access administrative functions, like defining a survey

### Defining a Survey
- [x] Survey Coordinator can define a survey containing 1-10 multiple choice questions
- [x] Survey Coordinator can define 1-5 mutually exclusive selections to each question
- [x] Survey Coordinator can enter a title for the survey
- [x] Survey Coordinator can click a 'Cancel' button to return to the home page without saving the survey
- [x] Survey Coordinator can click a 'Save' button to save a survey

### Conducting a Survey
- [x] Survey Coordinator can open a survey by selecting a survey from a list of previously defined surveys
- [x] Survey Coordinator can close a survey by selecting it from a list of open surveys
- [x] Survey Respondent can complete a survey by selecting it from a list of open surveys
- [x] Survey Respondent can select responses to survey questions by clicking on a radio button
- [x] Survey Respondent can see that a previously selected response will automatically be unchecked if a different response is clicked
- [x] Survey Respondent can click a 'Cancel' button to return to the home page without submitting the survey
- [x] Survey Respondent can click a 'Submit' button to submit their responses to the survey
- [x] Survey Respondent can see an error message if 'Submit' is clicked but not all questions have been responded to

### Viewing Survey Results
- [x] Survey Coordinators and Survey Respondents can select the survey to display from a list of closed surveys
- [x] Survey Coordinators and Survey Respondents can view survey results in tabular format showing the number of responses for each of the possible selections to the questions

## Bonus Features
- [x] Survey Respondents can create a unique account in the app
- [x] Survey Respondents can login to the app
- [x] Survey Respondents cannot complete the same survey more than once
- [x] Survey Coordinators and Survey Respondents can view graphical representations of survey results (e.g. pie, bar, column charts)

## Technical Requirements
- [x] TypeScript strict mode enabled
- [x] Input validation on all API endpoints (Zod)
- [x] Passwords hashed with bcrypt
- [x] JWT-based authentication
- [x] Role-based access control (coordinator / respondent)
- [x] Responsive, accessible UI (WCAG 2.1 AA)
- [x] Unit and integration tests
