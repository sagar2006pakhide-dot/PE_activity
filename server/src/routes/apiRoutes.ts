import { Router } from 'express';
import multer from 'multer';
import { handleAnalyze } from '../controllers/analyzeController.js';
import { handleChat } from '../controllers/chatController.js';
import { handleGetNews } from '../controllers/newsController.js';
import { handleGetHistory, handleDeleteHistoryItem, handleClearHistory } from '../controllers/historyController.js';
import { handleGetSaved, handleAddSaved, handleUpdateSavedNotes, handleDeleteSaved } from '../controllers/savedController.js';
import { handleUpload } from '../controllers/uploadController.js';
import { handleGetStats } from '../controllers/statsController.js';

const router = Router();

// Configure Multer for in-memory file uploads (max 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Fact-checking endpoints
router.post('/analyze', handleAnalyze);

// Conversational Chatbot
router.post('/chat', handleChat);

// News search feed
router.get('/search-news', handleGetNews);

// Document & Screenshot OCR Upload
router.post('/upload', upload.single('file'), handleUpload);

// History management
router.get('/history', handleGetHistory);
router.delete('/history/:id', handleDeleteHistoryItem);
router.delete('/history', handleClearHistory);

// Saved Checks (Bookmarks with Notes)
router.get('/saved', handleGetSaved);
router.post('/saved', handleAddSaved);
router.patch('/saved/:id/notes', handleUpdateSavedNotes);
router.delete('/saved/:id', handleDeleteSaved);

// Dashboard Analytics
router.get('/stats', handleGetStats);

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'TruthLens AI Backend', timestamp: new Date().toISOString() });
});

export default router;
