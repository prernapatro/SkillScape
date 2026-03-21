# Full-Stack Integration Implementation Plan

## Proposed Changes

### Backend
- **[MODIFY] [backend/routes/uploadRoutes.js](file:///c:/Users/LENOVO/OneDrive/Desktop/career-ai-app/backend/routes/uploadRoutes.js)**: Add `multer` to handle `POST /upload-resume` and save files cleanly.
- **[MODIFY] [backend/routes/parseRoutes.js](file:///c:/Users/LENOVO/OneDrive/Desktop/career-ai-app/backend/routes/parseRoutes.js)**: Integrate `pdf-parse` and `mammoth` for a `POST /parse-resume` endpoint to read text content.
- **[MODIFY] [backend/routes/index.js](file:///c:/Users/LENOVO/OneDrive/Desktop/career-ai-app/backend/routes/index.js)**: Ensure `/analyze-profile`, `/generate-roadmap`, and `/rewrite-resume` are correctly mounted.
- **[NEW] `backend/controllers/analysisController.js`**:
  - `POST /analyze-profile`: Loads [data/sample_career_dataset.json](file:///c:/Users/LENOVO/OneDrive/Desktop/career-ai-app/data/sample_career_dataset.json), extracts user skills using keyword matching against dataset dictionaries, and compares them missing/matched.
  - `POST /generate-roadmap`: Uses existing [roadmapGenerator.js](file:///c:/Users/LENOVO/OneDrive/Desktop/career-ai-app/backend/utils/roadmapGenerator.js).
  - `POST /rewrite-resume`: Connects to existing [resumeRewriter.js](file:///c:/Users/LENOVO/OneDrive/Desktop/career-ai-app/backend/services/resumeRewriter.js).

### Frontend
- **[MODIFY] [frontend/pages/dashboard.js](file:///c:/Users/LENOVO/OneDrive/Desktop/career-ai-app/frontend/pages/dashboard.js)**:
  - Replace static mock data with React `useState` and `useEffect` hooks relying entirely on backend JSON responses.
  - Add sequential `fetch/axios` sequence on file upload: `/upload-resume` ➔ `/parse-resume` ➔ `/analyze-profile` ➔ `/generate-roadmap`.
  - Add CSS Loading spinner state.
  - Add the **Interactive Modal Popup** to show exactly after analysis resolves, highlighting Skill Gaps and Strengths visually.

## Verification Plan

### Manual Verification
1. Ensure the Node backend processes are running: `npm run dev` in `/backend`.
2. Start the React frontend on port 3000: `npm run dev` in `/frontend`.
3. Open a browser to `http://localhost:3000/dashboard`.
4. Upload a local PDF (e.g., standard resume) via the drag-and-drop input.
5. Watch the loading spinner trigger.
6. Observe the modal pop up displaying dynamic match percentage data based off of our mock dataset weighting.
7. Verify the Roadmap dynamically populates and the Progress UI updates organically.
