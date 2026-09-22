import React, { useState } from 'react';
import { 
  GraduationCap, ChevronDown, ChevronUp, Code2, Cpu, Globe2, 
  Shield, Sparkles, ArrowRight, BookOpen, CheckCircle2 
} from 'lucide-react';

const Section: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-900/80 transition-colors"
      >
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
        {open ? <ChevronUp size={18} className="text-brand-500" /> : <ChevronDown size={18} className="text-slate-400" />}
      </button>
      {open && <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">{children}</div>}
    </div>
  );
};

export const PresentationPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-start gap-4 relative">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <GraduationCap size={28} />
          </div>
          <div>
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">BTech CSE — 7th Semester Project</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold">TruthLens AI — Project Viva & Demo Module</h1>
            <p className="text-white/80 text-sm mt-1">Fake News Detection & Fact-Checking Assistant Using NLP and Multi-Source Verification</p>
          </div>
        </div>
      </div>

      {/* Problem Statement */}
      <Section title="📌 Problem Statement" defaultOpen>
        <p>
          The proliferation of digital misinformation represents one of the most critical threats to democratic institutions, public health systems, and social cohesion in the modern era. 
          False narratives, deepfakes, emotionally manipulative clickbait, and selectively framed headlines are engineered to circulate virally on social media platforms, outpacing the corrective capacity of traditional journalistic oversight.
        </p>
        <p>
          Existing automated fact-checking tools frequently produce simplistic binary outputs ("Fake" / "Real") that fail to capture the nuanced epistemic reality of journalistic sources—where claims may be <em>partially correct</em>, <em>misleading by omission</em>, <em>out of temporal context</em>, or <em>supported by conflicting peer-reviewed evidence</em>.
        </p>
        <p className="font-semibold text-slate-800 dark:text-slate-100">
          TruthLens AI addresses this gap through a nuanced, explainable, multi-source AI-powered verification pipeline designed for digital literacy education and academic research.
        </p>
      </Section>

      {/* Objectives */}
      <Section title="🎯 Project Objectives" defaultOpen>
        <ul className="space-y-2">
          {[
            'Design and implement a nuanced 4-tier verification system (Likely Reliable / Potentially Misleading / Likely False / Requires Verification) rather than a binary true/false classifier.',
            'Deploy multi-layer NLP heuristics for clickbait detection, linguistic bias scoring, and atomic claim decomposition.',
            'Provide transparent Explainable AI (XAI) reasoning that reveals what factors drove each assessment.',
            'Support multi-modal input: plain text, article URLs, uploaded documents (TXT/PDF/DOCX), and screenshot OCR.',
            'Integrate a conversational AI assistant maintaining claim context across multi-turn investigative dialogues.',
            'Demonstrate responsible AI principles through mandatory disclaimers, balanced source presentation, and honest uncertainty signalling.',
          ].map((obj, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Methodology */}
      <Section title="🔬 Methodology & NLP Pipeline">
        <div className="space-y-4">
          <p>TruthLens AI employs a sequential 6-stage verification pipeline:</p>
          <div className="space-y-2">
            {[
              { step: '1', title: 'Preprocessing & Normalization', desc: 'Remove HTML artifacts, normalize whitespace, detect language, segment sentences.' },
              { step: '2', title: 'Claim Extraction', desc: 'Apply rule-based syntactic parsing to identify atomic factual assertions from compound propositions.' },
              { step: '3', title: 'Clickbait & Sentiment Scoring', desc: 'Analyze capitalization ratio, sensational lexicons, emotional trigger words, and curiosity gap patterns.' },
              { step: '4', title: 'Evidence Retrieval', desc: 'Cross-reference claims against a curated knowledge base of peer-reviewed papers, government agency documents, and IFCN fact-check databases.' },
              { step: '5', title: 'Source Credibility Assessment', desc: 'Score publishers on transparency, author attribution, citation quality, and cross-institutional consensus.' },
              { step: '6', title: 'Verdict Synthesis & XAI', desc: 'Generate a nuanced verdict with confidence percentage, risk level, and human-readable explanation of reasoning factors.' },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50">
                <span className="w-6 h-6 rounded-lg bg-brand-500 text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">{s.step}</span>
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{s.title}: </span>
                  <span>{s.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* System Architecture Diagram */}
      <Section title="🏗️ System Architecture">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
          <pre>{`
User Input (Text / URL / Document / Screenshot OCR)
                    │
                    ▼
      ┌─────────────────────────────┐
      │    React Frontend (Vite)    │
      │   TypeScript + Tailwind CSS │
      └─────────────┬───────────────┘
                    │  HTTP REST API
                    ▼
      ┌─────────────────────────────┐
      │   Node.js + Express Backend │
      │   Multer Upload Middleware  │
      └──────┬────────────┬─────────┘
             │            │
    ┌────────▼───┐  ┌─────▼──────────┐
    │ OCR Engine │  │  NLP Analyzer  │
    │ Tesseract  │  │ Clickbait Heur │
    │   .js      │  │ Claim Extractor│
    └────────────┘  └─────┬──────────┘
                          │
               ┌──────────▼──────────┐
               │  Credibility Engine  │
               │  Source Validator    │
               │  Evidence Scorer     │
               └──────────┬──────────┘
                          │
               ┌──────────▼──────────┐
               │   AI API Gateway     │
               │ Gemini / OpenAI (opt)│
               │ Smart NLP Fallback   │
               └──────────┬──────────┘
                          │
               ┌──────────▼──────────┐
               │  Verdict Generator   │
               │  XAI Explanation     │
               │  JSON Storage Layer  │
               └─────────────────────┘
                          │
                          ▼
               Result + Chatbot Interface
`}</pre>
        </div>
      </Section>

      {/* Technologies */}
      <Section title="💻 Technologies Used">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { cat: 'Frontend', items: ['React 18 + TypeScript', 'Vite 6 Build Tool', 'Tailwind CSS v3', 'Recharts v2 (Analytics)', 'Lucide React (Icons)', 'jsPDF (Report Export)'] },
            { cat: 'Backend', items: ['Node.js v24 + Express 4', 'TypeScript + TSX Dev', 'Multer (File Uploads)', 'pdf-parse (PDF Parsing)', 'mammoth (DOCX Parsing)', 'Tesseract.js v5 (OCR)'] },
            { cat: 'AI / NLP', items: ['Custom NLP Heuristic Engine', 'Google Gemini Flash API (optional)', 'Claim Decomposition Algorithm', 'Clickbait Linguistic Classifier', 'Multi-tier Verdict Synthesizer', 'Context-Aware Chat Engine'] },
            { cat: 'Storage & DevOps', items: ['JSON File-Based Storage', 'LocalStorage (Client State)', 'REST API Architecture', 'CORS + Express Middleware', '.env Configuration System', 'Modular Component Design'] },
          ].map(c => (
            <div key={c.cat} className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50">
              <h4 className="font-bold text-brand-600 dark:text-brand-400 mb-2 text-xs uppercase tracking-wider">{c.cat}</h4>
              <ul className="space-y-1">
                {c.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-brand-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Future Scope */}
      <Section title="🚀 Future Scope & Research Directions">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            'Multilingual fact-checking supporting Indic languages (Hindi, Tamil, Telugu)',
            'Voice-based claim verification via speech-to-text pipeline',
            'Deepfake video and manipulated image forensic analysis module',
            'Browser extension for real-time inline news verification',
            'WhatsApp and Telegram chatbot integration for rural media literacy',
            'Transformer-based fine-tuned BERT/RoBERTa classification models',
            'Advanced knowledge graph cross-referencing with Wikidata / DBpedia',
            'Real-time misinformation monitoring and alert dashboards',
            'Federated learning for privacy-preserving model improvement',
          ].map((scope, i) => (
            <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-brand-500/5 border border-brand-500/20">
              <ArrowRight size={13} className="text-brand-500 mt-0.5 shrink-0" />
              <span>{scope}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Novel Contributions */}
      <Section title="⭐ Project Novelty & Contributions">
        <ul className="space-y-2">
          {[
            'Pioneered 4-tier nuanced verdict system instead of binary classification.',
            'Integrated Explainable AI (XAI) transparency layer for academic accountability.',
            'Combined multimodal input processing: text, URL, documents, and OCR screenshots.',
            'Designed ethical AI principles with mandatory disclaimers and uncertainty reporting.',
            'Built a zero-configuration demo mode with 6 rich pre-analyzed academic case studies.',
            'Included a dedicated BTech viva/presentation module for evaluator demonstrations.',
          ].map((c, i) => (
            <li key={i} className="flex items-start gap-2">
              <Sparkles size={13} className="text-brand-500 mt-0.5 shrink-0" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
};
