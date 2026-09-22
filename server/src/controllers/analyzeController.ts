import { Request, Response } from 'express';
import { analyzeWithAI } from '../services/aiService.js';
import { storage } from '../data/storage.js';
import { HistoryItem } from '../types/index.js';

export async function handleAnalyze(req: Request, res: Response): Promise<void> {
  try {
    const { text, url, inputType = 'text', customApiKey, provider } = req.body;

    let claimText = text ? text.trim() : '';

    if (inputType === 'url' || url) {
      const targetUrl = url || text;
      if (!targetUrl || !targetUrl.startsWith('http')) {
        res.status(400).json({ error: 'Please provide a valid URL starting with http:// or https://' });
        return;
      }
      // Extract URL domain or title simulation if body text not provided
      if (!claimText || claimText === targetUrl) {
        try {
          const parsedUrl = new URL(targetUrl);
          claimText = `News claim published on ${parsedUrl.hostname}: Investigation into public reporting and online statements.`;
        } catch {
          res.status(400).json({ error: 'Invalid URL format provided.' });
          return;
        }
      }
    }

    if (!claimText || claimText.length < 5) {
      res.status(400).json({ error: 'Please enter a substantive claim, headline, or paragraph (minimum 5 characters).' });
      return;
    }

    // Run AI / NLP Analysis
    const result = await analyzeWithAI(claimText, inputType, customApiKey, provider);

    // Save to history log
    const historyItem: HistoryItem = {
      id: `hist-${Date.now()}`,
      timestamp: result.timestamp,
      claim: result.inputClaim,
      verdict: result.verdict,
      confidence: result.confidence,
      sourcesCount: result.sources.length,
      riskLevel: result.riskLevel,
      result
    };
    storage.addHistory(historyItem);

    res.json({
      success: true,
      data: result,
      historyId: historyItem.id
    });
  } catch (error) {
    console.error('Analyze controller error:', error);
    res.status(500).json({ 
      error: 'Unable to verify this claim right now. Please try again or provide additional context.',
      details: error instanceof Error ? error.message : 'Internal error'
    });
  }
}
