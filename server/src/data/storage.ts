import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HistoryItem, SavedCheck, NewsArticle } from '../types/index.js';
import { sampleFactChecks } from '../nlp/sampleDatabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const HISTORY_FILE = path.join(DATA_DIR, 'history.json');
const SAVED_FILE = path.join(DATA_DIR, 'saved.json');

// Initial seed history from sample claims
const initialHistory: HistoryItem[] = sampleFactChecks.map((fc, idx) => ({
  id: `hist-${idx + 1}`,
  timestamp: new Date(Date.now() - (idx * 3600000 * 5)).toISOString(),
  claim: fc.inputClaim,
  verdict: fc.verdict,
  confidence: fc.confidence,
  sourcesCount: fc.sources.length,
  riskLevel: fc.riskLevel,
  result: fc
}));

// Initial saved checks
const initialSaved: SavedCheck[] = [
  {
    id: 'saved-1',
    historyId: 'hist-1',
    savedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    claim: sampleFactChecks[0].inputClaim,
    verdict: sampleFactChecks[0].verdict,
    notes: 'Reference case for high-risk conspiracy claims regarding geodesy and space photography.',
    result: sampleFactChecks[0]
  },
  {
    id: 'saved-2',
    historyId: 'hist-3',
    savedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    claim: sampleFactChecks[2].inputClaim,
    verdict: sampleFactChecks[2].verdict,
    notes: 'Important example of venture-capital breakthrough marketing outstripping thermodynamic physical reality.',
    result: sampleFactChecks[2]
  }
];

export const curatedNews: NewsArticle[] = [
  {
    id: 'news-1',
    headline: 'Researchers Announce Phase 3 Clinical Results for Universal Flu Vaccine Candidate',
    source: 'Nature Medicine',
    date: '2026-09-18',
    summary: 'A multivalent mRNA vaccine candidate targeting conserved stalk domains of influenza hemagglutinin enters final safety reviews.',
    category: 'Health',
    url: 'https://www.nature.com/nm',
    preliminaryRisk: 'Low'
  },
  {
    id: 'news-2',
    headline: 'Viral Post Alleges Government Geoengineering Program Triggered Unseasonal Monsoons',
    source: 'Social Trends Monitor',
    date: '2026-09-20',
    summary: 'Meteorologists refute claims of artificial cloud-seeding catastrophes, citing standard oceanic Madden-Julian Oscillation patterns.',
    category: 'World',
    url: 'https://worldweather.org',
    preliminaryRisk: 'High'
  },
  {
    id: 'news-3',
    headline: 'Commercial Fusion Reactor Project Claims Net Energy Gain in Sustained 20-Minute Pulse',
    source: 'IEEE Spectrum',
    date: '2026-09-15',
    summary: 'Independent plasma physicists review telemetry data to verify whether Q-factor exceeded scientific and commercial breakeven thresholds.',
    category: 'Technology',
    url: 'https://spectrum.ieee.org',
    preliminaryRisk: 'Medium'
  },
  {
    id: 'news-4',
    headline: 'New Dietary Guidelines Reaffirm Importance of Whole Grains and Hydration in Metabolic Longevity',
    source: 'World Health Organization (WHO)',
    date: '2026-09-12',
    summary: 'Comprehensive global review consolidates 15 years of nutritional cohort studies across 85 countries.',
    category: 'Science',
    url: 'https://www.who.int',
    preliminaryRisk: 'Low'
  },
  {
    id: 'news-5',
    headline: 'SHOCKING: Leaked Internal Memo Claims Tech Giant Secretly Listening Through Light Bulbs!',
    source: 'Viral Tech Daily',
    date: '2026-09-21',
    summary: 'Sensational social-media threads claim smart LEDs contain acoustic eavesdropping microchips, lacking electronic schematics or FCC proof.',
    category: 'Technology',
    url: 'https://cyberinsider.com',
    preliminaryRisk: 'High'
  },
  {
    id: 'news-6',
    headline: 'Astronomers Detect Unexplained Optical Fast Radio Burst from Distant Dwarf Galaxy',
    source: 'Astrophysical Journal Letters',
    date: '2026-09-19',
    summary: 'Radio telescopes triangulate repeating millisecond pulses consistent with magnetar crust fractures rather than synthetic signals.',
    category: 'Science',
    url: 'https://iopscience.iop.org',
    preliminaryRisk: 'Low'
  }
];

export class StorageService {
  private history: HistoryItem[] = [];
  private saved: SavedCheck[] = [];

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      if (fs.existsSync(HISTORY_FILE)) {
        const raw = fs.readFileSync(HISTORY_FILE, 'utf-8');
        this.history = JSON.parse(raw);
      } else {
        this.history = [...initialHistory];
        this.saveHistory();
      }
    } catch {
      this.history = [...initialHistory];
    }

    try {
      if (fs.existsSync(SAVED_FILE)) {
        const raw = fs.readFileSync(SAVED_FILE, 'utf-8');
        this.saved = JSON.parse(raw);
      } else {
        this.saved = [...initialSaved];
        this.saveSaved();
      }
    } catch {
      this.saved = [...initialSaved];
    }
  }

  private saveHistory() {
    try {
      fs.writeFileSync(HISTORY_FILE, JSON.stringify(this.history, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write history file:', err);
    }
  }

  private saveSaved() {
    try {
      fs.writeFileSync(SAVED_FILE, JSON.stringify(this.saved, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write saved file:', err);
    }
  }

  getHistory(): HistoryItem[] {
    return this.history;
  }

  addHistory(item: HistoryItem): void {
    this.history.unshift(item);
    if (this.history.length > 50) this.history.pop();
    this.saveHistory();
  }

  deleteHistory(id: string): boolean {
    const before = this.history.length;
    this.history = this.history.filter(h => h.id !== id);
    this.saveHistory();
    return this.history.length < before;
  }

  clearHistory(): void {
    this.history = [];
    this.saveHistory();
  }

  getSaved(): SavedCheck[] {
    return this.saved;
  }

  addSaved(saved: SavedCheck): void {
    // Avoid duplicate
    this.saved = this.saved.filter(s => s.result.id !== saved.result.id && s.id !== saved.id);
    this.saved.unshift(saved);
    this.saveSaved();
  }

  updateSavedNotes(id: string, notes: string): boolean {
    const item = this.saved.find(s => s.id === id);
    if (item) {
      item.notes = notes;
      this.saveSaved();
      return true;
    }
    return false;
  }

  deleteSaved(id: string): boolean {
    const before = this.saved.length;
    this.saved = this.saved.filter(s => s.id !== id);
    this.saveSaved();
    return this.saved.length < before;
  }
}

export const storage = new StorageService();
