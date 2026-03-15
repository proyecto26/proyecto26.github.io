export interface Sponsor {
  name: string;
  image?: string;
  url?: string;
  tier: string;
  totalDonated?: number;
  platform: 'github' | 'opencollective' | 'patreon' | 'kofi' | 'other';
}

export interface SponsorTier {
  name: string;
  icon: string;
  color: string;
  minAmount: number;
  description: string;
  benefits: string[];
  price: string;
  period: string;
  featured?: boolean;
  audience?: string;
  sponsors: Sponsor[];
}

/**
 * Manually curated sponsors from platforms that don't have public APIs
 * Add sponsors here as they come in from GitHub Sponsors, Patreon, etc.
 */
const manualSponsors: Sponsor[] = [
  // Add sponsors manually here as needed, e.g.:
  // { name: 'Company X', image: '/img/sponsors/company-x.png', url: 'https://companyx.com', tier: 'Heroes', platform: 'github' },
];

/**
 * Fetch backers from Open Collective public API
 */
async function fetchOpenCollectiveSponsors(): Promise<Sponsor[]> {
  try {
    const res = await fetch('https://opencollective.com/proyecto26/members/all.json');
    if (!res.ok) return [];

    const members: Array<{
      role: string;
      tier: string | null;
      name: string;
      image: string | null;
      profile: string;
      totalAmountDonated: number;
      isActive: boolean;
    }> | unknown = await res.json();

    if (!Array.isArray(members)) return [];

    return members
      .filter((m) => m.role === 'BACKER' && m.isActive && m.name !== 'Guest')
      .map((m) => ({
        name: m.name,
        image: m.image || undefined,
        url: m.profile,
        tier: mapOpenCollectiveTier(m.tier, m.totalAmountDonated),
        totalDonated: m.totalAmountDonated,
        platform: 'opencollective' as const,
      }));
  } catch {
    return [];
  }
}

const supportedTierNames = new Set(['Enterprise Pro', 'Enterprise', 'Heroes', 'Unicorns', 'Backers']);

const tierAliases: Record<string, string> = {
  'enterprise pro': 'Enterprise Pro',
  enterprise: 'Enterprise',
  heroes: 'Heroes',
  unicorns: 'Unicorns',
  backers: 'Backers',
  backer: 'Backers',
};

function normalizeOpenCollectiveTier(tier: string | null): string | undefined {
  if (!tier) return undefined;

  const directMatch = tierAliases[tier.trim().toLowerCase()];
  if (directMatch) return directMatch;

  if (supportedTierNames.has(tier)) return tier;
  return undefined;
}

/**
 * Map Open Collective tier name or donation amount to our tier system
 */
function mapOpenCollectiveTier(tier: string | null, amount: number): string {
  const normalizedTier = normalizeOpenCollectiveTier(tier);
  if (normalizedTier) return normalizedTier;
  if (amount >= 260) return 'Enterprise Pro';
  if (amount >= 50) return 'Enterprise';
  if (amount >= 26) return 'Heroes';
  if (amount >= 10) return 'Unicorns';
  return 'Backers';
}

/**
 * Define all sponsor tiers with their benefits
 */
export function getTierDefinitions(): Omit<SponsorTier, 'sponsors'>[] {
  return [
    {
      name: 'Enterprise Pro',
      icon: 'rocket',
      color: 'coral',
      minAmount: 260,
      price: '$260+',
      period: '/mo (custom dev quoted separately)',
      description: 'Custom plugins, bridges, or libraries built for your needs. Dedicated support channel.',
      audience: 'For companies needing custom solutions',
      benefits: [
        'Custom plugin/bridge/library development',
        'Video tutorials & work-in-progress updates',
        'Priority issue fast-tracking',
        'All Enterprise benefits',
      ],
    },
    {
      name: 'Enterprise',
      icon: 'building-2',
      color: 'blue',
      minAmount: 50,
      price: '$50',
      period: '/mo or $500/year (save 17%)',
      description: 'Production support, custom examples, and consulting for teams that depend on our tools.',
      audience: 'For teams using our tools in production',
      benefits: [
        '2h/mo consulting at sponsor rates',
        'Direct chat access with same-day responses',
        'Custom code examples & integration help',
        'All Heroes benefits',
      ],
    },
    {
      name: 'Heroes',
      icon: 'shield',
      color: 'orange',
      minAmount: 26,
      price: '$26',
      period: '/mo or $260/year (save 17%)',
      featured: true,
      description: 'Get direct access to J.D. Nicholls with monthly calls and exclusive dev content.',
      audience: 'For developers who want to shape our roadmap',
      benefits: [
        'Monthly 30-min strategy call',
        'Access to private dev streams & early previews',
        'Priority support',
        'All Unicorns benefits',
      ],
    },
    {
      name: 'Unicorns',
      icon: 'sparkles',
      color: 'teal',
      minAmount: 10,
      price: '$10',
      period: '/mo',
      description: 'Get recognized in our projects and help decide which bugs we fix first.',
      audience: 'For individual developers who use our tools',
      benefits: [
        'Your bugs get fixed first',
        'Name credited in projects',
        'Sponsor badge',
      ],
    },
    {
      name: 'Backers',
      icon: 'coffee',
      color: 'coral',
      minAmount: 0,
      price: '$2',
      period: '/mo',
      description: 'Support open source you use every day. Every contribution counts.',
      audience: 'For anyone who wants to support open source',
      benefits: [
        'Sponsor badge',
        'Your name on our sponsors wall',
        'Monthly development update',
      ],
    },
  ];
}

/**
 * Get all sponsors grouped by tier (fetched at build time)
 */
export async function getSponsorsGrouped(): Promise<SponsorTier[]> {
  const ocSponsors = await fetchOpenCollectiveSponsors();
  const allSponsors = [...manualSponsors, ...ocSponsors];
  const tiers = getTierDefinitions();

  return tiers.map((tier) => ({
    ...tier,
    sponsors: allSponsors.filter((s) => s.tier === tier.name),
  }));
}

/**
 * Platforms where people can sponsor
 */
export const sponsorPlatforms = [
  { name: 'GitHub Sponsors', icon: 'github', href: 'https://github.com/sponsors/proyecto26', primary: true },
  { name: 'Open Collective', icon: 'users', color: '#7FADF2', href: 'https://opencollective.com/proyecto26' },
  { name: 'Patreon', icon: 'heart', color: '#FF424D', href: 'https://patreon.com/proyecto26' },
  { name: 'Ko-fi', icon: 'coffee', color: '#f2385a', href: 'https://ko-fi.com/proyecto26' },
  { name: 'Liberapay', icon: 'dollar-sign', color: '#f6c915', href: 'https://liberapay.com/proyecto26' },
  { name: 'Buy Me a Coffee', icon: 'coffee', color: '#FFDD00', href: 'https://buymeacoffee.com/jdnichollsc' },
  { name: 'PayPal', icon: 'credit-card', color: '#003087', href: 'https://paypal.me/jdnichollsc' },
];
