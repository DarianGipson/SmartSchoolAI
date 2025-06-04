import './setupEnv.js';

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dashboardAnalytics from './api/dashboard-analytics.js';
import explainConcept from './api/explain-concept.js';
import futureFeatures from './api/future-features.js';
import generateAssignment from './api/generate-assignment.js';
import gradeResponse from './api/grade-response.js';
import onboardStudent from './api/onboard-student.js';
import progress from './api/progress.js';
import tutorChat from './api/tutor-chat.js';
import updateMastery from './api/update-mastery.js';
import workflow from './api/workflow.js';
import cors from 'cors';

const app = express();
app.use(express.json());

// CORS configuration: allow Vercel frontend and (optionally) your custom domain
// If you add a custom domain, add it to allowedOrigins below.
const allowedOrigins = [
  'https://smartschoolai.vercel.app',
  // 'https://www.yourdomain.com', // Uncomment and edit if you add a custom domain
];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.all('/api/dashboard-analytics', dashboardAnalytics);
app.all('/api/explain-concept', explainConcept);
app.all('/api/future-features', futureFeatures);
app.all('/api/generate-assignment', generateAssignment);
app.all('/api/grade-response', gradeResponse);
app.all('/api/onboard-student', onboardStudent);
app.all('/api/progress', progress);
app.all('/api/tutor-chat', tutorChat);
app.all('/api/update-mastery', updateMastery);
app.all('/api/workflow', workflow);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all to serve index.html for SPA routes (except API routes)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
