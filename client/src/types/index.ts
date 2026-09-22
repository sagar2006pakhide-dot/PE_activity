export type VerdictType = 
  | 'Likely Reliable' 
  | 'Potentially Misleading' 
  | 'Likely False' 
  | 'Requires Verification';

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export type SourceCategory = 'Supports Claim' | 'Contradicts Claim' | 'Provides Context';

export interface VerifiedSource {
  id: string;
  name: string;
  title: string;
  url: string;
  date?: string;
  category: SourceCategory;
  reliabilityScore: number;
  publisherType: string;
  credibilityFactors: {
    transparency: boolean;
    authorAttribution: boolean;
    peerReviewedOrFactChecked: boolean;
    primarySource: boolean;
  };
  snippet: string;
}

export interface SubClaim {
  id: string;
  claim: string;
  verdict: VerdictType;
  confidence: number;
  evidence: string;
  counterEvidence?: string;
}

export interface ClickbaitAnalysis {
  risk: 'Low' | 'Medium' | 'High';
  score: number;
  signalsDetected: string[];
  explanation: string;
}

export interface SourceCredibilityOverview {
  sourceTransparency: number;
  authorInformation: number;
  crossSourceAgreement: number;
  primarySourceRatio: number;
  citationQuality: number;
  summary: string;
}

export interface ExplainableFactors {
  evidenceFound: string[];
  contradictingEvidence: string[];
  linguisticPatterns: string[];
  sourceAgreement: string;
  missingInformation: string[];
  contextMismatch?: string;
}

export interface FactCheckResult {
  id: string;
  inputClaim: string;
  inputType: 'text' | 'url' | 'document' | 'image';
  timestamp: string;
  verdict: VerdictType;
  confidence: number;
  riskLevel: RiskLevel;
  summary: string;
  detailedExplanation: string;
  claimsBreakdown: SubClaim[];
  clickbait: ClickbaitAnalysis;
  sources: VerifiedSource[];
  sourceCredibility: SourceCredibilityOverview;
  explainableAI: ExplainableFactors;
  isDemoMode: boolean;
  disclaimer: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  relatedClaimId?: string;
  suggestedFollowUps?: string[];
  confidenceNote?: string;
}

export interface NewsArticle {
  id: string;
  headline: string;
  source: string;
  date: string;
  summary: string;
  category: string;
  url: string;
  preliminaryRisk?: 'Low' | 'Medium' | 'High';
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  claim: string;
  verdict: VerdictType;
  confidence: number;
  sourcesCount: number;
  riskLevel: RiskLevel;
  result: FactCheckResult;
}

export interface SavedCheck {
  id: string;
  historyId: string;
  savedAt: string;
  claim: string;
  verdict: VerdictType;
  notes: string;
  result: FactCheckResult;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isGuest: boolean;
  avatarUrl?: string;
}
