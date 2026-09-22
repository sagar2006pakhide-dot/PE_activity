// Vercel Serverless Function - wraps the compiled Express app
// server/dist/server.js is compiled from server/src/server.ts
import app from '../server/dist/server.js';

export default app;
