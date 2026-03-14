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
    }> = await res.json();

    return members
      .filter((m) => m.role === 'BACKER' && m.name !== 'Guest')
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

/**
 * Map Open Collective tier name or donation amount to our tier system
 */
function mapOpenCollectiveTier(tier: string | null, amount: number): string {
  if (tier) return tier;
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
      period: '/mo',
      description: 'Custom plugin, bridge, or library created for your needs.',
      benefits: [
        'Private plugin/bridge/library',
        'Video tutorials & WIP updates',
        'All Enterprise benefits',
      ],
    },
    {
      name: 'Enterprise',
      icon: 'building-2',
      color: 'blue',
      minAmount: 50,
      price: '$50',
      period: '/mo',
      description: 'Professional support for your projects.',
      benefits: [
        'Hourly consulting rate',
        'Custom code examples',
        'Live chat support',
        'All Heroes benefits',
      ],
    },
    {
      name: 'Heroes',
      icon: 'shield',
      color: 'orange',
      minAmount: 26,
      price: '$26',
      period: '/mo',
      featured: true,
      description: 'Join us to change the world together.',
      benefits: [
        '1-on-1 meetings',
        'Exclusive content & presentations',
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
      description: 'Become a community contributor.',
      benefits: [
        'Bug prioritization',
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
      description: 'Buy us a coffee while we fix the world.',
      benefits: [
        'Sponsor badge',
        'Our eternal gratitude',
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
