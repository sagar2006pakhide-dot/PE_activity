import { FactCheckResult } from '../types/index.js';
import { analyzeClaimText } from '../nlp/nlpAnalyzer.js';

export async function analyzeWithAI(
  text: string, 
  inputType: 'text' | 'url' | 'document' | 'image' = 'text',
  customApiKey?: string,
  provider?: 'gemini' | 'openai'
): Promise<FactCheckResult> {
  const geminiKey = customApiKey || process.env.GEMINI_API_KEY;
  const openAiKey = customApiKey || process.env.OPENAI_API_KEY;

  // If no API key configured, use our rich smart NLP engine
  if (!geminiKey && !openAiKey) {
    return analyzeClaimText(text, inputType);
  }

  // Attempt Gemini API if key is present
  if (geminiKey && (!provider || provider === 'gemini')) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are TruthLens AI, an expert academic fact-checking system. Analyze the following news claim/text and return ONLY valid JSON matching this schema:
{
  "verdict": "Likely Reliable" | "Potentially Misleading" | "Likely False" | "Requires Verification",
  "confidence": number (0-100),
  "riskLevel": "Low" | "Moderate" | "High" | "Critical",
  "summary": string,
  "detailedExplanation": string,
  "claimsBreakdown": [
    { "id": "c1", "claim": string, "verdict": "Likely Reliable"|"Potentially Misleading"|"Likely False"|"Requires Verification", "confidence": number, "evidence": string, "counterEvidence": string }
  ],
  "clickbait": {
    "risk": "Low" | "Medium" | "High",
    "score": number (0-100),
    "signalsDetected": string[],
    "explanation": string
  },
  "sources": [
    {
      "id": "s1",
      "name": string,
      "title": string,
      "url": string,
      "date": string,
      "category": "Supports Claim" | "Contradicts Claim" | "Provides Context",
      "reliabilityScore": number (0-100),
      "publisherType": "Major News Outlet" | "Peer-Reviewed Journal" | "Government Agency" | "Academic Institution" | "Fact-Checking Organization",
      "credibilityFactors": { "transparency": boolean, "authorAttribution": boolean, "peerReviewedOrFactChecked": boolean, "primarySource": boolean },
      "snippet": string
    }
  ],
  "sourceCredibility": {
    "sourceTransparency": number,
    "authorInformation": number,
    "crossSourceAgreement": number,
    "primarySourceRatio": number,
    "citationQuality": number,
    "summary": string
  },
  "explainableAI": {
    "evidenceFound": string[],
    "contradictingEvidence": string[],
    "linguisticPatterns": string[],
    "sourceAgreement": string,
    "missingInformation": string[]
  }
}

Claim to analyze:
"${text.replace(/"/g, '\\"')}"`
                  }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2
            }
          })
        }
      );

      if (response.ok) {
        const data = (await response.json()) as any;
        const rawJsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJsonText) {
          const parsed = JSON.parse(rawJsonText);
          return {
            id: `fc-${Date.now()}`,
            inputClaim: text,
            inputType,
            timestamp: new Date().toISOString(),
            verdict: parsed.verdict || 'Requires Verification',
            confidence: parsed.confidence || 75,
            riskLevel: parsed.riskLevel || 'Moderate',
            summary: parsed.summary || 'Analysis completed.',
            detailedExplanation: parsed.detailedExplanation || '',
            claimsBreakdown: parsed.claimsBreakdown || [],
            clickbait: parsed.clickbait || { risk: 'Low', score: 10, signalsDetected: [], explanation: 'Normal wording' },
            sources: parsed.sources || [],
            sourceCredibility: parsed.sourceCredibility || { sourceTransparency: 85, authorInformation: 80, crossSourceAgreement: 85, primarySourceRatio: 80, citationQuality: 85, summary: 'Standard source verification.' },
            explainableAI: parsed.explainableAI || { evidenceFound: [], contradictingEvidence: [], linguisticPatterns: [], sourceAgreement: '', missingInformation: [] },
            isDemoMode: false,
            disclaimer: 'TruthLens AI provides automated assessments based on available information and language models. Its results should not be treated as definitive proof.'
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart NLP engine:', err);
    }
  }

  // Fallback to our rich NLP engine
  return analyzeClaimText(text, inputType);
}
