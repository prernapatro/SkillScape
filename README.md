# SkillScape

SkillScape is a career and skill analysis application that helps users identify their existing skills, analyze their profile against potential career roles, identify skill gaps, and generate a structured learning roadmap.

The application processes resume or profile information and compares identified skills with a predefined knowledge base of roles and required skills. It can then determine matching skills, missing skills, and potential career paths.

## Features

* Resume parsing and text extraction
* Support for uploaded documents such as PDF and DOCX files
* Skill extraction from resume content
* Role and career-family analysis
* Identification of matching and missing skills
* Career role recommendations based on skill matches
* Personalized skill-gap analysis
* Learning roadmap generation
* Dashboard-related analysis and insights

## How It Works

SkillScape follows a simple analysis flow:

```text
Resume / Profile Input
        ↓
Resume Text Extraction
        ↓
Skill Extraction
        ↓
Role & Career Analysis
        ↓
Matched Skills + Missing Skills
        ↓
Career Insights
        ↓
Learning Roadmap
```

The application analyzes the skills present in a user's resume or profile and compares them against skills associated with different career roles.

For example, the system contains role definitions for areas such as:

* Software Development
* Frontend Development
* Backend Development
* Full Stack Development
* Security
* Retail
* Education

Based on the available skills and selected or inferred role, the application identifies the skills the user already possesses and the skills they may need to develop.

## Tech Stack

### Backend

* Node.js
* Express.js

### Libraries and Tools

* Multer — file upload handling
* pdf-parse — PDF text extraction
* Mammoth — DOCX text extraction
* csv-parse — CSV parsing
* XLSX — Excel file handling
* CORS — cross-origin resource sharing
* Morgan — HTTP request logging
* dotenv — environment variable management
* Nodemon — development server

## Project Structure

```text
SkillScape/
│
├── .env.example
├── .gitignore
├── README.md
│
├── app.js
├── server.js
│
├── analysisController.js
├── dashboardController.js
├── datasetController.js
├── parseResumeController.js
├── uploadController.js
│
├── roadmapGenerator.js
├── skillMatcher.js
│
├── implementation_plan.md
│
├── package.json
└── package-lock.json
```

## Core Components

### Resume Parsing

The application processes uploaded resume files and extracts text that can be used for further analysis.

Supported document-processing libraries include:

* `pdf-parse` for PDF files
* `mammoth` for DOCX files

### Skill Analysis

The application analyzes extracted resume text to identify relevant skills.

Skills are normalized and compared against a predefined knowledge base containing:

* Career roles
* Required skills for each role
* Career families
* Skill synonyms

For example, variations such as `ReactJS` and `React.js` can be mapped to a standardized skill name.

### Role Analysis

The system compares identified skills with predefined career roles.

It can:

* Infer a relevant career family based on the user's skills
* Analyze a user-selected target role
* Calculate skill matches
* Identify missing skills
* Suggest potential career directions

### Learning Roadmap

Based on the identified skill gaps, SkillScape generates a roadmap to help users understand which skills they may need to develop for their selected or inferred career path.

## Running the Project Locally

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm

### 1. Clone the Repository

```bash
git clone https://github.com/prernapatro/SkillScape.git
```

### 2. Navigate to the Project Directory

```bash
cd SkillScape
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file using the provided example:

```bash
cp .env.example .env
```

On Windows, you can create the `.env` file manually and copy the values from `.env.example`.

### 5. Start the Development Server

```bash
npm run dev
```

The development server uses Nodemon.

Alternatively, you can start the application using:

```bash
npm start
```

The server runs on:

```text
http://localhost:3001
```

unless a different `PORT` value is specified in the environment variables.

## API

The Express application exposes API routes under:

```text
/api
```

The root endpoint can be used to verify that the backend is running.

```text
GET /
```

Expected response:

```json
{
  "name": "career-ai-backend",
  "status": "ok"
}
```

## Environment Variables

The application supports environment variables such as:

```text
PORT
CORS_ORIGIN
UPLOAD_MAX_MB
NODE_ENV
```

Refer to `.env.example` for the available configuration.

## Current Status

This repository currently contains the backend and core analysis logic for SkillScape, including resume parsing, skill analysis, role matching, and roadmap generation.

The project is still under development and can be expanded with additional features such as:

* Improved AI-based skill extraction
* Larger and more dynamic career datasets
* More detailed role recommendations
* Personalized learning resources
* User authentication
* Persistent user profiles
* Enhanced dashboard visualizations
* Integration with real-world job descriptions

## Project Purpose

SkillScape was built to explore how resume analysis, skill matching, and structured career data can be used to help users better understand their current skills and potential learning paths.

## Author

**Prerna Patro**

GitHub: https://github.com/prernapatro
