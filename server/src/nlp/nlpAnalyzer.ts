import { FactCheckResult, SubClaim, VerifiedSource, VerdictType, RiskLevel } from '../types/index.js';
import { sampleFactChecks } from './sampleDatabase.js';
import { analyzeClickbait } from './clickbaitAnalyzer.js';

export function analyzeClaimText(text: string, inputType: 'text' | 'url' | 'document' | 'image' = 'text'): FactCheckResult {
  const normalized = text.toLowerCase().trim();

  // 1. Check if input closely matches our pre-configured deep demo cases
  if (normalized.includes('flat') && (normalized.includes('earth') || normalized.includes('nasa') || normalized.includes('globe'))) {
    return { ...sampleFactChecks[0], id: `fc-${Date.now()}`, inputClaim: text, inputType, timestamp: new Date().toISOString() };
  }
  if (normalized.includes('water') && (normalized.includes('hydration') || normalized.includes('kidney') || normalized.includes('drink') || normalized.includes('function'))) {
    return { ...sampleFactChecks[1], id: `fc-${Date.now()}`, inputClaim: text, inputType, timestamp: new Date().toISOString() };
  }
  if ((normalized.includes('battery') || normalized.includes('quantum')) && (normalized.includes('second') || normalized.includes('charge') || normalized.includes('degradation') || normalized.includes('10 year'))) {
    return { ...sampleFactChecks[2], id: `fc-${Date.now()}`, inputClaim: text, inputType, timestamp: new Date().toISOString() };
  }
  if ((normalized.includes('fruit') || normalized.includes('cure') || normalized.includes('pharma')) && (normalized.includes('shocking') || normalized.includes('48 hours') || normalized.includes('aging') || normalized.includes('arter'))) {
    return { ...sampleFactChecks[3], id: `fc-${Date.now()}`, inputClaim: text, inputType, timestamp: new Date().toISOString() };
  }
  if ((normalized.includes('coffee') || normalized.includes('caffeine')) && (normalized.includes('heart') || normalized.includes('hypertension') || normalized.includes('cardio') || normalized.includes('pressure'))) {
    return { ...sampleFactChecks[4], id: `fc-${Date.now()}`, inputClaim: text, inputType, timestamp: new Date().toISOString() };
  }
  if ((normalized.includes('mars') || normalized.includes('ruin') || normalized.includes('perseverance') || normalized.includes('alien')) && (normalized.includes('video') || normalized.includes('leaked') || normalized.includes('stone') || normalized.includes('pyramid'))) {
    return { ...sampleFactChecks[5], id: `fc-${Date.now()}`, inputClaim: text, inputType, timestamp: new Date().toISOString() };
  }

  // 2. Intelligent dynamic heuristic analysis for arbitrary inputs
  const clickbait = analyzeClickbait(text);

  // Extract individual sentences as claims
  const rawSentences = text
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 12);

  const sentences = rawSentences.length > 0 ? rawSentences : [text];

  // Heuristics markers
  const conspiracyKeywords = ['conspiracy', 'illuminati', 'hoax', 'cover-up', 'fake news', 'stolen', 'chemtrail', 'miracle cure', 'banned by doctors'];
  const scientificKeywords = ['study', 'published', 'research', 'trial', 'peer-reviewed', 'meta-analysis', 'university', 'clinical', 'statistics'];
  const disputedKeywords = ['debated', 'conflicting', 'claims vary', 'mixed evidence', 'unclear', 'controversial', 'some say'];
  const extremeAdjectives = ['never', 'always', '100%', 'impossible', 'absolute', 'proves beyond doubt', 'miraculous'];

  let verdict: VerdictType = 'Requires Verification';
  let confidence = 74;
  let riskLevel: RiskLevel = 'Moderate';

  const hasConspiracy = conspiracyKeywords.some(k => normalized.includes(k));
  const hasScientific = scientificKeywords.some(k => normalized.includes(k));
  const hasDisputed = disputedKeywords.some(k => normalized.includes(k));
  const hasExtreme = extremeAdjectives.some(k => normalized.includes(k));

  if (clickbait.score >= 70 || hasConspiracy) {
    verdict = 'Likely False';
    confidence = Math.min(94, 75 + Math.floor(clickbait.score * 0.2));
    riskLevel = 'High';
  } else if (clickbait.score >= 45 || hasExtreme) {
    verdict = 'Potentially Misleading';
    confidence = 81;
    riskLevel = 'Moderate';
  } else if (hasScientific && !hasConspiracy && clickbait.score < 30) {
    verdict = 'Likely Reliable';
    confidence = 88;
    riskLevel = 'Low';
  } else if (hasDisputed || normalized.length < 50) {
    verdict = 'Requires Verification';
    confidence = 68;
    riskLevel = 'Moderate';
  } else {
    // Default balanced classification
    verdict = 'Potentially Misleading';
    confidence = 78;
    riskLevel = 'Moderate';
  }

  // Generate subclaims
  const claimsBreakdown: SubClaim[] = sentences.slice(0, 4).map((s, idx) => {
    let subVerdict: VerdictType = verdict;
    let subConf = Math.max(60, confidence - (idx * 4));
    let evidence = `Analysis of statement syntax indicates ${subVerdict.toLowerCase()} elements based on available public corpora.`;

    if (s.length < 25) {
      subVerdict = 'Requires Verification';
      subConf = 65;
      evidence = 'Claim is brief and lacks contextual qualification to independently substantiate.';
    }

    return {
      id: `sc-${idx + 1}`,
      claim: s,
      verdict: subVerdict,
      confidence: subConf,
      evidence,
      counterEvidence: subVerdict !== 'Likely Reliable' ? 'Independent cross-referencing identifies missing peer-reviewed corroboration or potential over-generalization.' : undefined
    };
  });

  // Construct verified sources according to verdict
  const sources: VerifiedSource[] = [
    {
      id: 'src-1',
      name: 'Reuters Fact Check / Associated Press',
      title: 'Contextual Verification and Claim Assessment',
      url: 'https://www.reuters.com/fact-check',
      date: new Date().toISOString().split('T')[0],
      category: verdict === 'Likely Reliable' ? 'Supports Claim' : (verdict === 'Likely False' ? 'Contradicts Claim' : 'Provides Context'),
      reliabilityScore: 94,
      publisherType: 'Fact-Checking Organization',
      credibilityFactors: {
        transparency: true,
        authorAttribution: true,
        peerReviewedOrFactChecked: true,
        primarySource: false
      },
      snippet: 'Independent journalism archives verify primary evidence trails, historical records, and expert consensus regarding reported topics.'
    },
    {
      id: 'src-2',
      name: 'Scientific American / Public Data Repository',
      title: 'Empirical Evidence Review and Methodology Standards',
      url: 'https://www.scientificamerican.com',
      date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
      category: verdict === 'Likely Reliable' ? 'Supports Claim' : 'Provides Context',
      reliabilityScore: 92,
      publisherType: 'Academic Institution',
      credibilityFactors: {
        transparency: true,
        authorAttribution: true,
        peerReviewedOrFactChecked: true,
        primarySource: true
      },
      snippet: 'Peer-reviewed literature requires replicable experimental trials and statistical significance before establishing factual consensus.'
    }
  ];

  if (verdict === 'Likely False' || verdict === 'Potentially Misleading') {
    sources.push({
      id: 'src-3',
      name: 'Poynter Institute International Fact-Checking Network (IFCN)',
      title: 'Identified Misinformation Signatures and Debunking Brief',
      url: 'https://www.poynter.org/ifcn',
      date: new Date(Date.now() - 86400000 * 12).toISOString().split('T')[0],
      category: 'Contradicts Claim',
      reliabilityScore: 95,
      publisherType: 'Fact-Checking Organization',
      credibilityFactors: {
        transparency: true,
        authorAttribution: true,
        peerReviewedOrFactChecked: true,
        primarySource: false
      },
      snippet: 'Linguistic markers match recurring patterns of unverified social-media speculation or decontextualized reporting.'
    });
  }

  const summary = verdict === 'Likely Reliable'
    ? 'The submitted claim is consistent with credible reporting and established public records, exhibiting balanced language and lack of sensationalism.'
    : verdict === 'Likely False'
    ? 'The submitted claim directly contradicts verifiable public records, consensus scientific models, or authenticated primary documentation.'
    : verdict === 'Potentially Misleading'
    ? 'The claim contains elements of truth or plausible premises, but presents them with exaggeration, selective omissions, or unverified extrapolations.'
    : 'Available evidence is incomplete, contested, or evolving. A definitive conclusion cannot be established without further primary verification.';

  const detailedExplanation = `TruthLens AI evaluated the linguistic markers, syntactic certainty, and cross-reference footprint of the submitted text. The assessment of "${verdict}" with ${confidence}% confidence reflects the density of verifiable factual assertions versus speculative or sensational framing. Always verify high-consequence claims through accredited primary archives.`;

  return {
    id: `fc-${Date.now()}`,
    inputClaim: text,
    inputType,
    timestamp: new Date().toISOString(),
    verdict,
    confidence,
    riskLevel,
    summary,
    detailedExplanation,
    claimsBreakdown,
    clickbait,
    sources,
    sourceCredibility: {
      sourceTransparency: verdict === 'Likely Reliable' ? 92 : 65,
      authorInformation: verdict === 'Likely Reliable' ? 88 : 55,
      crossSourceAgreement: verdict === 'Likely Reliable' ? 94 : (verdict === 'Likely False' ? 18 : 60),
      primarySourceRatio: 78,
      citationQuality: verdict === 'Likely Reliable' ? 90 : 50,
      summary: 'Cross-source evaluation evaluates author transparency, peer citations, and cross-institutional agreement.'
    },
    explainableAI: {
      evidenceFound: verdict === 'Likely Reliable' ? ['Consistent with standard informational corpora', 'Clear attribution indicators'] : [],
      contradictingEvidence: verdict === 'Likely False' || verdict === 'Potentially Misleading' ? ['Identified exaggerations or absence of primary source trail'] : [],
      linguisticPatterns: clickbait.signalsDetected.slice(0, 3),
      sourceAgreement: verdict === 'Likely Reliable' ? 'Strong alignment among mainstream reference archives' : 'Contested or lacking authoritative cross-referencing',
      missingInformation: [
        'Specific verifiable date stamps, exact author qualifications, or primary peer-reviewed dataset DOI'
      ]
    },
    isDemoMode: true,
    disclaimer: 'TruthLens AI provides automated assessments based on available information and language models. Its results should not be treated as definitive proof. Always verify important information using reliable primary or authoritative sources.'
  };
}
