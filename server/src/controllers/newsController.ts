import { Request, Response } from 'express';
import { curatedNews } from '../data/storage.js';

export function handleGetNews(req: Request, res: Response): void {
  try {
    const { query, category } = req.query;

    let results = [...curatedNews];

    if (category && typeof category === 'string' && category.toLowerCase() !== 'all') {
      results = results.filter(n => n.category.toLowerCase() === category.toLowerCase());
    }

    if (query && typeof query === 'string') {
      const q = query.toLowerCase().trim();
      results = results.filter(n => 
        n.headline.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        n.source.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      data: results,
      total: results.length
    });
  } catch (error) {
    console.error('News controller error:', error);
    res.status(500).json({ error: 'Failed to retrieve news stream.' });
  }
}
