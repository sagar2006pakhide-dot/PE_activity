import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for client development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Router
app.use('/api', apiRoutes);

// Root informational endpoint
app.get('/', (_req, res) => {
  res.json({
    app: 'TruthLens AI - Fake News Detector & Fact-Checking Assistant API',
    status: 'Running',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// Export app for Vercel serverless usage
export default app;

// Start server only when running directly (not imported by Vercel)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 TruthLens AI Backend Server running on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  });
}
