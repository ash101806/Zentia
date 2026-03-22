# Zentia Secondary School Test App

This is the front-end application for the Secondary School Test platform, proudly built with modern Angular (v17+) using Standalone Components and Angular Material.

## How to Start Locally

1. Open a terminal inside this directory (`school-test-app`)
2. Run `npm install` to ensure all dependencies are resolved.
3. Run `npm start` to spin up the local development server.
4. Navigate to `http://localhost:4200` in your browser.

## Features & UI Components
- **Language Switcher (`i18n`)**: English and Spanish support toggled via the Top Navigation Bar.
- **Authentication**: Simulated `AuthService` handling mock login and user state distribution. 
- **Timer & Auto-Submit**: Configurable dynamic countdown logic based on the payload fetched that automatically submits the answers securely upon timeout.
- **Review Later**: Let users mark questions explicitly to jump back to them via the Navigation dot-map.
- **Question Types Hosted:**
  - Multiple Choice
  - Open Text Response
  - Connect the Dots (Interactive matching)
- **Question Designer**: Dedicated UI for teachers to create new questions, assign them to a course and topic, provide text using Markdown, and include reference images.
- **Test Designer**: Dedicated UI for creating exam blueprints to define rules (e.g. how many questions per type/course/topic) and the ability to explicitly lock specific test questions to an exam.

## Mock Data & Testing

Since this app runs with a simulated `AuthService` and `TestService`, use the following values to explore the UI:

- **Login as Teacher**: Enter username `teacher` (any password) to access the Question and Test Designers.
- **Login as Student**: Enter any other username (e.g., `student1`) to access the Student Portal.
- **Take an Exam**: Once logged in as a student, use the magic exam code `test-123` to enter the mock exam.

## API Contracts & Configuration details
Full architectural decisions and REST JSON API Contracts have been registered and documented in the upper `AGENTS.md` file residing in the root workspace directory. All development to this specific directory must adhere to the `angularWebDev` skill detailed there.
