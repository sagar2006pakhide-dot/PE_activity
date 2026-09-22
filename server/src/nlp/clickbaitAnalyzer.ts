import { ClickbaitAnalysis } from '../types/index.js';

export function analyzeClickbait(text: string): ClickbaitAnalysis {
  if (!text || text.trim().length === 0) {
    return {
      risk: 'Low',
      score: 0,
      signalsDetected: ['No text provided'],
      explanation: 'No linguistic content provided for analysis.'
    };
  }

  const signals: string[] = [];
  let score = 5; // baseline

  // 1. Check capitalization ratio
  const lettersOnly = text.replace(/[^a-zA-Z]/g, '');
  if (lettersOnly.length > 8) {
    const upperCount = (text.match(/[A-Z]/g) || []).length;
    const capsRatio = upperCount / lettersOnly.length;
    if (capsRatio > 0.35) {
      signals.push(`Excessive Capitalization (${Math.round(capsRatio * 100)}% uppercase letters)`);
      score += 25;
    } else if (capsRatio > 0.2) {
      signals.push(`Elevated Capitalization emphasis (${Math.round(capsRatio * 100)}% uppercase)`);
      score += 12;
    }
  }

  // 2. Check sensational buzzwords
  const sensationalWords = [
    { pattern: /\b(shocking|unbelievable|mind[- ]?blowing|jaw[- ]?dropping|insane|crazy)\b/i, label: 'Sensational / emotional hook words' },
    { pattern: /\b(you won't believe|what happens next|will blow your mind|wait till you see)\b/i, label: 'Curiosity gap / baiting phrasing' },
    { pattern: /\b(secret|leaked|exposed|they don't want you to know|hidden truth)\b/i, label: 'Conspiracy / insider secrecy tropes' },
    { pattern: /\b(miracle|cure[s]?|magic|instant(ly)?|overnight|in \d+ (hours|minutes|days))\b/i, label: 'Miracle or hyper-accelerated claims' },
    { pattern: /\b(big pharma|deep state|cabal|illuminati|mainstream media won't tell you)\b/i, label: 'Anti-institutional conspiracy trigger' },
    { pattern: /\b(deadly|fatal|toxic|poison|catastrophe|ruin|destroy(s)?)\b/i, label: 'Fear-inducing alarmist vocabulary' },
    { pattern: /\b(simple trick|one weird trick|doctors hate this|scientists baffled)\b/i, label: 'Classic internet clickbait formula' },
    { pattern: /\b(completely cures|100% effective|zero degradation|totally free)\b/i, label: 'Absolute certainty / hyperbolic guarantees' }
  ];

  sensationalWords.forEach(({ pattern, label }) => {
    if (pattern.test(text)) {
      signals.push(label);
      score += 16;
    }
  });

  // 3. Punctuation anomalies
  if (/!{2,}/.test(text)) {
    signals.push('Multiple exclamation marks (!!!)');
    score += 10;
  }
  if (/\?{2,}/.test(text)) {
    signals.push('Multiple question marks (???)');
    score += 8;
  }
  if (/!\?|\?!/.test(text)) {
    signals.push('Interrobang / emotional punctuation combination (!?)');
    score += 12;
  }

  // 4. Vagueness / lack of specific evidence indicators
  if (/this one thing|this fruit|this trick|this simple food/i.test(text)) {
    signals.push('Withholding crucial information to force clickthrough');
    score += 15;
  }

  // Cap score at 98
  score = Math.min(98, Math.max(8, score));

  let risk: 'Low' | 'Medium' | 'High' = 'Low';
  let explanation = 'Text demonstrates standard journalistic or objective phrasing with minimal emotional framing.';

  if (score >= 65) {
    risk = 'High';
    explanation = 'High likelihood of clickbait or deceptive emotional framing designed to provoke impulsive sharing or outrage rather than convey verified facts.';
  } else if (score >= 35) {
    risk = 'Medium';
    explanation = 'Moderate sensationalism detected. Contains some heightened rhetoric, curiosity hooks, or urgency markers.';
  }

  if (signals.length === 0) {
    signals.push('Neutral, measured vocabulary observed');
    signals.push('Balanced grammatical structure');
  }

  return {
    risk,
    score,
    signalsDetected: signals,
    explanation
  };
}
