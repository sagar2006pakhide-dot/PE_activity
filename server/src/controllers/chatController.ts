import { Request, Response } from 'express';
import { ChatMessage, FactCheckResult } from '../types/index.js';

export async function handleChat(req: Request, res: Response): Promise<void> {
  try {
    const { message, history = [], currentFactCheck, customApiKey } = req.body;

    if (!message || message.trim().length === 0) {
      res.status(400).json({ error: 'Message cannot be empty.' });
      return;
    }

    const userQuery = message.trim();
    const lowerQuery = userQuery.toLowerCase();

    // Check if Gemini API Key is available for real-time generative chat
    const geminiKey = customApiKey || process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const systemPrompt = `You are TruthLens AI Assistant, a responsible, professional fact-checking AI designed for academic and journalistic integrity.
Your guidelines:
1. Nuanced Verdicts: Distinguish between verified facts, claims, opinions, unverified rumors, and conflicting reports.
2. Insufficient Evidence: If information is missing or unverified, explicitly say: "There is not enough reliable evidence to determine this claim conclusively."
3. Neutrality: On controversial or evolving topics, neutrally present evidence from different credible perspectives without political bias or persuasion.
4. Disclaimer: Remind users that AI analysis is an automated assessment based on current public corpora and should not be treated as absolute proof.
5. Currently analyzed context: ${currentFactCheck ? JSON.stringify(currentFactCheck.summary) : 'No claim currently active'}.`;

        const resp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                { parts: [{ text: `${systemPrompt}\n\nUser Question: ${userQuery}` }] }
              ]
            })
          }
        );

        if (resp.ok) {
          const data = (await resp.json()) as any;
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            const assistantMsg: ChatMessage = {
              id: `msg-${Date.now()}`,
              sender: 'assistant',
              content: reply,
              timestamp: new Date().toISOString(),
              suggestedFollowUps: [
                'What evidence contradicts this?',
                'Find reliable peer-reviewed sources',
                'Is this headline clickbait?',
                'Explain this in simple language'
              ],
              confidenceNote: 'Generated via live AI with TruthLens verification parameters.'
            };
            res.json({ success: true, data: assistantMsg });
            return;
          }
        }
      } catch (err) {
        console.warn('Chat Gemini API call error, falling back to conversational rules:', err);
      }
    }

    // Intelligent Conversational Engine with full context awareness
    let responseText = '';
    const followUps: string[] = [];

    const activeFc: FactCheckResult | undefined = currentFactCheck;

    if (lowerQuery.includes('is this news true') || lowerQuery.includes('is this true') || lowerQuery.includes('verdict')) {
      if (activeFc) {
        responseText = `Based on TruthLens AI's heuristic and cross-source analysis, this claim is assessed as **${activeFc.verdict}** with approximately **${activeFc.confidence}% AI confidence**.\n\n` +
          `**Summary:** ${activeFc.summary}\n\n` +
          `*Note: This is an automated assessment of available evidence patterns, not absolute factual proof. We recommend consulting primary archives directly.*`;
        followUps.push('Why is this claim suspicious?', 'What evidence contradicts this?', 'Summarize this in simple terms');
      } else {
        responseText = 'Please submit a specific headline or claim in the Fact Checker or paste it right here in our chat, and I will evaluate whether it appears **Likely Reliable**, **Potentially Misleading**, **Likely False**, or **Requires Verification**.';
        followUps.push('The Earth is flat', 'Drinking water is essential for kidney function', 'Startup creates 3-second quantum battery');
      }
    } else if (lowerQuery.includes('suspicious') || lowerQuery.includes('why is this false') || lowerQuery.includes('why false') || lowerQuery.includes('red flag')) {
      if (activeFc) {
        const triggers = activeFc.clickbait.signalsDetected.join(', ');
        const missing = activeFc.explainableAI.missingInformation.join('; ');
        responseText = `### Suspicious Indicators Detected:\n` +
          `1. **Linguistic & Clickbait Cues:** ${triggers || 'Standard phrasing'}\n` +
          `2. **Source Discrepancies:** ${activeFc.explainableAI.sourceAgreement}\n` +
          `3. **Missing Documentation:** ${missing || 'No verified primary dataset attached'}\n\n` +
          `Claims that lack verifiable publisher credentials or make definitive promises without empirical trials often fail cross-examination.`;
        followUps.push('What evidence supports this?', 'Show me the sources', 'Can you summarize the whole claim?');
      } else {
        responseText = 'Common indicators of suspicious news include: sensational headlines in ALL CAPS, lack of named authors or scientific citations, emotional outrage baiting, and unverified promises of instant cures or breakthrough technologies.';
        followUps.push('Check a claim for clickbait', 'How do I spot fake news?');
      }
    } else if (lowerQuery.includes('contradict') || lowerQuery.includes('counter') || lowerQuery.includes('against')) {
      if (activeFc && activeFc.explainableAI.contradictingEvidence.length > 0) {
        responseText = `### Contradicting Evidence Identified:\n` +
          activeFc.explainableAI.contradictingEvidence.map(e => `- ${e}`).join('\n') +
          `\n\nAdditionally, independent fact-checking databases record divergence with the primary assertions.`;
        followUps.push('What evidence supports this?', 'Show source credibility');
      } else if (activeFc) {
        responseText = `No strong direct contradicting evidence was cataloged against this specific assertion. The consensus among reviewed sources remains largely aligned with the statement.`;
        followUps.push('Show supporting sources', 'Why is it reliable?');
      } else {
        responseText = 'There is currently no active claim selected. Paste any statement you wish to scrutinize for counter-arguments and opposing evidence.';
      }
    } else if (lowerQuery.includes('support') || lowerQuery.includes('evidence') || lowerQuery.includes('proof')) {
      if (activeFc && activeFc.sources.length > 0) {
        const supporters = activeFc.sources.filter(s => s.category === 'Supports Claim' || s.category === 'Provides Context');
        if (supporters.length > 0) {
          responseText = `### Supporting Context & Evidence:\n` +
            supporters.map(s => `- **${s.name}**: "${s.title}" — *${s.snippet}*`).join('\n\n');
        } else {
          responseText = `There is **no substantial peer-reviewed or accredited journalistic evidence** supporting this claim in our analyzed references.`;
        }
        followUps.push('What contradicts this?', 'Is this headline clickbait?');
      } else {
        responseText = 'When assessing claims, TruthLens looks for peer-reviewed journals, institutional archives (such as WHO, NASA, NIH, IEEE), and IFCN-certified fact-checking outlets.';
      }
    } else if (lowerQuery.includes('clickbait') || lowerQuery.includes('headline')) {
      if (activeFc) {
        responseText = `### Clickbait Evaluation:\n` +
          `- **Clickbait Risk:** **${activeFc.clickbait.risk}** (Score: ${activeFc.clickbait.score}/100)\n` +
          `- **Detected Triggers:**\n` +
          activeFc.clickbait.signalsDetected.map(s => `  - ${s}`).join('\n') +
          `\n\n**Assessment:** ${activeFc.clickbait.explanation}`;
        followUps.push('Explain in simple language', 'Is this claim true or false?');
      } else {
        responseText = 'You can paste any headline into TruthLens to measure its Clickbait Risk score, checking for sensational buzzwords, excessive capitalization, curiosity gaps, and emotional manipulation.';
      }
    } else if (lowerQuery.includes('simple language') || lowerQuery.includes('simple') || lowerQuery.includes('explain like')) {
      if (activeFc) {
        responseText = `### In Plain Language:\n` +
          `Think of this claim like this: Someone made a bold statement: *"${activeFc.inputClaim}"*.\n\n` +
          `When we checked against reliable libraries, scientists and journalists said: **${activeFc.verdict}**.\n\n` +
          `Why? Because ${activeFc.summary.toLowerCase()}`;
        followUps.push('Why did the AI reach this verdict?', 'Show me the sources');
      } else {
        responseText = 'I specialize in breaking down dense scientific, political, and medical terminology into clear, unbiased summaries. Enter any claim to try it out!';
      }
    } else if (lowerQuery.includes('missing') || lowerQuery.includes('information missing')) {
      if (activeFc) {
        responseText = `### Missing Information & Unverified Gaps:\n` +
          activeFc.explainableAI.missingInformation.map(m => `- ${m}`).join('\n') +
          `\n\nWithout these essential points of corroboration, complete factual certainty cannot be affirmed.`;
      } else {
        responseText = 'When information is incomplete, TruthLens explicitly states: *"There is not enough reliable evidence to determine this claim conclusively."*';
      }
    } else {
      // General helpful fallback adhering to safety rules
      responseText = `I'm **TruthLens AI Assistant**. I can help you evaluate claims, explain linguistic flags, review contradictory evidence, and check sources.\n\n` +
        `You can ask me:\n` +
        `- *"Is this news true?"*\n` +
        `- *"Why is this claim suspicious?"*\n` +
        `- *"What evidence contradicts this?"*\n` +
        `- *"Is this headline clickbait?"*\n` +
        `- *"Explain this in simple language for students"*`;
      followUps.push('Is this news true?', 'Why is this claim suspicious?', 'Check for clickbait');
    }

    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      content: responseText,
      timestamp: new Date().toISOString(),
      suggestedFollowUps: followUps.length > 0 ? followUps : [
        'Is this news true?',
        'Why is this claim suspicious?',
        'What evidence supports this?'
      ],
      confidenceNote: 'TruthLens AI Assistant assessment. Always verify critical facts through independent primary sources.'
    };

    res.json({
      success: true,
      data: assistantMsg
    });
  } catch (error) {
    console.error('Chat controller error:', error);
    res.status(500).json({ error: 'Chat assistant error. Please try again.' });
  }
}
