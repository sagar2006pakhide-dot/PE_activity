import { Request, Response } from 'express';
import { storage } from '../data/storage.js';

export function handleGetHistory(req: Request, res: Response): void {
  try {
    const { verdict, search } = req.query;
    let items = storage.getHistory();

    if (verdict && typeof verdict === 'string' && verdict !== 'All') {
      items = items.filter(h => h.verdict.toLowerCase() === verdict.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      items = items.filter(h => h.claim.toLowerCase().includes(q));
    }

    res.json({ success: true, data: items });
  } catch (error) {
    console.error('History get error:', error);
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
}

export function handleDeleteHistoryItem(req: Request, res: Response): void {
  try {
    const id = req.params.id as string;
    const deleted = storage.deleteHistory(id);
    if (deleted) {
      res.json({ success: true, message: 'Item removed from history.' });
    } else {
      res.status(404).json({ error: 'Item not found.' });
    }
  } catch (error) {
    console.error('History delete error:', error);
    res.status(500).json({ error: 'Failed to delete history item.' });
  }
}

export function handleClearHistory(_req: Request, res: Response): void {
  try {
    storage.clearHistory();
    res.json({ success: true, message: 'Fact-check history cleared.' });
  } catch (error) {
    console.error('History clear error:', error);
    res.status(500).json({ error: 'Failed to clear history.' });
  }
}
