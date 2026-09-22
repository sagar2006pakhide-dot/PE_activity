import { Request, Response } from 'express';
import { storage } from '../data/storage.js';
import { SavedCheck } from '../types/index.js';

export function handleGetSaved(_req: Request, res: Response): void {
  try {
    const items = storage.getSaved();
    res.json({ success: true, data: items });
  } catch (error) {
    console.error('Saved get error:', error);
    res.status(500).json({ error: 'Failed to fetch saved checks.' });
  }
}

export function handleAddSaved(req: Request, res: Response): void {
  try {
    const { result, notes = '' } = req.body;
    if (!result || !result.id) {
      res.status(400).json({ error: 'Fact check result is required to save.' });
      return;
    }

    const savedItem: SavedCheck = {
      id: `saved-${Date.now()}`,
      historyId: result.id,
      savedAt: new Date().toISOString(),
      claim: result.inputClaim,
      verdict: result.verdict,
      notes: notes.trim(),
      result
    };

    storage.addSaved(savedItem);
    res.json({ success: true, data: savedItem });
  } catch (error) {
    console.error('Saved add error:', error);
    res.status(500).json({ error: 'Failed to save check.' });
  }
}

export function handleUpdateSavedNotes(req: Request, res: Response): void {
  try {
    const id = req.params.id as string;
    const { notes } = req.body;
    const updated = storage.updateSavedNotes(id, notes || '');
    if (updated) {
      res.json({ success: true, message: 'Notes updated.' });
    } else {
      res.status(404).json({ error: 'Saved item not found.' });
    }
  } catch (error) {
    console.error('Saved update error:', error);
    res.status(500).json({ error: 'Failed to update notes.' });
  }
}

export function handleDeleteSaved(req: Request, res: Response): void {
  try {
    const id = req.params.id as string;
    const deleted = storage.deleteSaved(id);
    if (deleted) {
      res.json({ success: true, message: 'Saved item removed.' });
    } else {
      res.status(404).json({ error: 'Saved item not found.' });
    }
  } catch (error) {
    console.error('Saved delete error:', error);
    res.status(500).json({ error: 'Failed to delete saved item.' });
  }
}
