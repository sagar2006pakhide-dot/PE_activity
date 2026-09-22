import { FactCheckResult, ChatMessage, NewsArticle, HistoryItem, SavedCheck } from '../types';

const API_BASE = '/api';

export const apiService = {
  // Fact check analysis
  async analyzeClaim(params: {
    text: string;
    url?: string;
    inputType?: 'text' | 'url' | 'document' | 'image';
    customApiKey?: string;
    provider?: 'gemini' | 'openai';
  }): Promise<{ success: boolean; data: FactCheckResult; historyId: string }> {
    const response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to analyze claim.');
    }
    return response.json();
  },

  // Conversational Chatbot
  async sendChatMessage(params: {
    message: string;
    history?: ChatMessage[];
    currentFactCheck?: FactCheckResult | null;
    customApiKey?: string;
  }): Promise<{ success: boolean; data: ChatMessage }> {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Chat assistant temporarily unavailable.');
    }
    return response.json();
  },

  // News search
  async getNews(query?: string, category?: string): Promise<{ success: boolean; data: NewsArticle[] }> {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category) params.append('category', category);

    const response = await fetch(`${API_BASE}/search-news?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to retrieve news stream.');
    return response.json();
  },

  // Document & Screenshot upload
  async uploadFile(file: File): Promise<{
    success: boolean;
    type: 'document' | 'image';
    text: string;
    confidence?: number;
    filename: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to process uploaded file.');
    }
    return response.json();
  },

  // History
  async getHistory(verdict?: string, search?: string): Promise<{ success: boolean; data: HistoryItem[] }> {
    const params = new URLSearchParams();
    if (verdict && verdict !== 'All') params.append('verdict', verdict);
    if (search) params.append('search', search);

    const response = await fetch(`${API_BASE}/history?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch history.');
    return response.json();
  },

  async deleteHistoryItem(id: string): Promise<void> {
    await fetch(`${API_BASE}/history/${id}`, { method: 'DELETE' });
  },

  async clearHistory(): Promise<void> {
    await fetch(`${API_BASE}/history`, { method: 'DELETE' });
  },

  // Saved Checks
  async getSaved(): Promise<{ success: boolean; data: SavedCheck[] }> {
    const response = await fetch(`${API_BASE}/saved`);
    if (!response.ok) throw new Error('Failed to fetch saved checks.');
    return response.json();
  },

  async addSaved(result: FactCheckResult, notes: string = ''): Promise<{ success: boolean; data: SavedCheck }> {
    const response = await fetch(`${API_BASE}/saved`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result, notes }),
    });
    if (!response.ok) throw new Error('Failed to bookmark check.');
    return response.json();
  },

  async updateSavedNotes(id: string, notes: string): Promise<void> {
    await fetch(`${API_BASE}/saved/${id}/notes`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
  },

  async deleteSaved(id: string): Promise<void> {
    await fetch(`${API_BASE}/saved/${id}`, { method: 'DELETE' });
  },

  // Analytics Stats
  async getStats(): Promise<{ success: boolean; data: any }> {
    const response = await fetch(`${API_BASE}/stats`);
    if (!response.ok) throw new Error('Failed to fetch statistics.');
    return response.json();
  },
};
