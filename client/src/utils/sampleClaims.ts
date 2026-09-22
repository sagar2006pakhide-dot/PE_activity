export interface SampleClaim {
  id: string;
  category: string;
  badge: string;
  badgeColor: string;
  title: string;
  claim: string;
  expectedVerdict: 'Likely Reliable' | 'Potentially Misleading' | 'Likely False' | 'Requires Verification';
  description: string;
}

export const sampleClaims: SampleClaim[] = [
  {
    id: 'sample-1',
    category: 'Astronomy / Physics',
    badge: 'Conspiracy',
    badgeColor: 'bg-red-500/10 text-red-500 border-red-500/20',
    title: 'Earth Shape & Satellite Fabrication',
    claim: 'The Earth is flat and NASA uses CGI to fabricate satellite imagery of a spherical globe.',
    expectedVerdict: 'Likely False',
    description: 'Classic physical science contradiction refuting global geodesy and observational satellite physics.'
  },
  {
    id: 'sample-2',
    category: 'Human Biology / Health',
    badge: 'Scientific Fact',
    badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    title: 'Water Hydration & Cellular Function',
    claim: 'Drinking adequate water daily is essential for human cellular function, kidney filtration, and thermoregulation.',
    expectedVerdict: 'Likely Reliable',
    description: 'Well-established biomedical consensus supported by WHO and gold-standard physiology guidelines.'
  },
  {
    id: 'sample-3',
    category: 'Emerging Tech',
    badge: 'Marketing Hype',
    badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    title: 'Instant Quantum Battery Breakthrough',
    claim: 'Startup introduces QuantumBattery 5000 that charges smartphones in 3 seconds and lasts 10 years with 0% degradation.',
    expectedVerdict: 'Potentially Misleading',
    description: 'Theoretical laboratory concepts conflated with commercially ready hardware, ignoring thermal constraints.'
  },
  {
    id: 'sample-4',
    category: 'Health Scams',
    badge: 'High Clickbait',
    badgeColor: 'bg-red-500/10 text-red-500 border-red-500/20',
    title: 'Miracle Cure & Big Pharma Ban',
    claim: 'SHOCKING: Secret fruit that Big Pharma wants BANNED cures aging and cleans arteries in 48 hours!',
    expectedVerdict: 'Likely False',
    description: 'Extreme clickbait markers: all-caps urgency, conspiracy scapegoating, and biological impossibility.'
  },
  {
    id: 'sample-5',
    category: 'Nutritional Science',
    badge: 'Conflicting Data',
    badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    title: 'Coffee Cardiovascular Dilemma',
    claim: 'Regular coffee consumption drastically decreases risk of cardiovascular death, but other studies claim it induces dangerous chronic hypertension.',
    expectedVerdict: 'Requires Verification',
    description: 'Nuanced epidemiology: protective long-term antioxidants vs acute vascular caffeine responsiveness.'
  },
  {
    id: 'sample-6',
    category: 'Space & Viral Media',
    badge: 'Synthetic Media',
    badgeColor: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    title: 'Martian Megaliths on Rover Feed',
    claim: 'Leaked NASA video from Perseverance rover exposes ancient megalithic ruins and stone structures on Mars.',
    expectedVerdict: 'Likely False',
    description: 'Digital video manipulation and pareidolia applied to open NASA raw planetary geology files.'
  }
];
