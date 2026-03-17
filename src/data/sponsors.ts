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
 * Manually curated sponsors from platforms without public APIs (Patreon, Ko-fi, etc.)
 * Add sponsors here as they come in.
 */
const manualSponsors: Sponsor[] = [
  // { name: 'Company X', image: '/img/sponsors/company-x.png', url: 'https://companyx.com', tier: 'Heroes', platform: 'other' },
];

/**
 * GitHub Sponsors GraphQL API accounts to fetch from.
 * Supports both org and personal sponsorship accounts.
 */
const GITHUB_SPONSORS_ACCOUNTS = ['proyecto26', 'jdnichollsc'];

/**
 * Fetch sponsors from GitHub Sponsors GraphQL API.
 * Requires a PAT with `read:org` and `read:user` scopes,
 * stored as GH_SPONSORS_TOKEN in repo secrets.
 */
async function fetchGitHubSponsors(): Promise<Sponsor[]> {
  const token = import.meta.env.GH_SPONSORS_TOKEN;
  if (!token) return [];

  const allSponsors: Sponsor[] = [];

  for (const account of GITHUB_SPONSORS_ACCOUNTS) {
    try {
      const query = `
        query($login: String!) {
          repositoryOwner(login: $login) {
            ... on Organization {
              sponsorshipsAsMaintainer(first: 100, activeOnly: false) {
                nodes {
                  isActive
                  sponsorEntity {
                    ... on User {
                      login
                      name
                      avatarUrl
                      url
                    }
                    ... on Organization {
                      login
                      name
                      avatarUrl
                      url
                    }
                  }
                  tier {
                    monthlyPriceInDollars
                    name
                    isOneTime
                  }
                }
              }
            }
            ... on User {
              sponsorshipsAsMaintainer(first: 100, activeOnly: false) {
                nodes {
                  isActive
                  sponsorEntity {
                    ... on User {
                      login
                      name
                      avatarUrl
                      url
                    }
                    ... on Organization {
                      login
                      name
                      avatarUrl
                      url
                    }
                  }
                  tier {
                    monthlyPriceInDollars
                    name
                    isOneTime
                  }
                }
              }
            }
          }
        }
      `;

      const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Proyecto26-Website',
        },
        body: JSON.stringify({ query, variables: { login: account } }),
      });

      if (!res.ok) {
        console.warn(`GitHub Sponsors API error for ${account}: ${res.status}`);
        continue;
      }

      const json = await res.json();
      const owner = json.data?.repositoryOwner;
      if (!owner) continue;

      const nodes = owner.sponsorshipsAsMaintainer?.nodes || [];

      for (const node of nodes) {
        const entity = node.sponsorEntity;
        if (!entity) continue;

        const name = entity.name || entity.login;
        // Skip if already added from another account
        if (allSponsors.some((s) => s.name === name && s.platform === 'github')) continue;

        allSponsors.push({
          name,
          image: entity.avatarUrl || undefined,
          url: entity.url,
          tier: mapGitHubSponsorTier(node.tier?.monthlyPriceInDollars || 0),
          platform: 'github',
        });
      }
    } catch (error) {
      console.warn(`Failed to fetch GitHub Sponsors for ${account}:`, error);
    }
  }

  return allSponsors;
}

/**
 * Map GitHub Sponsors monthly price to our tier system
 */
function mapGitHubSponsorTier(monthlyPrice: number): string {
  if (monthlyPrice >= 1500) return 'Platinum Partner';
  if (monthlyPrice >= 500) return 'Gold Sponsor';
  if (monthlyPrice >= 150) return 'Silver Sponsor';
  if (monthlyPrice >= 50) return 'Bronze Sponsor';
  if (monthlyPrice >= 14) return 'Supporter';
  return 'Backer';
}

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
  if (amount >= 1500) return 'Platinum Partner';
  if (amount >= 500) return 'Gold Sponsor';
  if (amount >= 150) return 'Silver Sponsor';
  if (amount >= 50) return 'Bronze Sponsor';
  if (amount >= 14) return 'Supporter';
  return 'Backer';
}

/**
 * Define all sponsor tiers with their benefits
 */
export function getTierDefinitions(): Omit<SponsorTier, 'sponsors'>[] {
  return [
    {
      name: 'Platinum Partner',
      icon: 'gem',
      color: 'coral',
      minAmount: 1500,
      price: '$1,500',
      period: '/mo',
      description: 'Reach 6.6M+ developers/year with your logo on every README, homepage hero, and npm package. Unlock custom integrations and quarterly roadmap influence.',
      audience: 'For organizations that depend on our ecosystem',
      benefits: [
        'Logo on all project READMEs (6.6M+ npm impressions/year)',
        'Logo in homepage hero section',
        'Custom integrations & priority development',
        '2h/mo consulting + same-day chat support',
        'Quarterly roadmap input & co-marketing',
        'Video tutorials & work-in-progress updates',
        'All Gold benefits',
      ],
    },
    {
      name: 'Gold Sponsor',
      icon: 'trophy',
      color: 'orange',
      minAmount: 500,
      price: '$500',
      period: '/mo',
      description: 'Get homepage logo placement and 2h/mo consulting with J.D. Nicholls. $500/mo reaches more developers than most ad campaigns.',
      audience: 'For teams that rely on our tools in production',
      benefits: [
        'Large logo on proyecto26.com homepage',
        'Logo on key project READMEs',
        '2h/mo consulting with J.D. Nicholls',
        'Same-day chat support',
        'Custom code examples & integration help',
        'Exclusive content & early previews',
        'All Silver benefits',
      ],
    },
    {
      name: 'Silver Sponsor',
      icon: 'shield',
      color: 'blue',
      minAmount: 150,
      price: '$150',
      period: '/mo',
      featured: true,
      description: 'Get your logo in front of 6.6M+ npm users/year. Unlock monthly strategy calls and priority bug fixes for your team.',
      audience: 'For companies using our libraries',
      benefits: [
        'Logo on key project READMEs (~6.6M npm impressions/year)',
        'Monthly 30-min strategy call with J.D. Nicholls',
        'Priority bug fixes & feature requests',
        'Request any example, presentation, or code repository',
        'All Bronze benefits',
      ],
    },
    {
      name: 'Bronze Sponsor',
      icon: 'award',
      color: 'teal',
      minAmount: 50,
      price: '$50',
      period: '/mo',
      description: 'Fund 1 hour of dedicated development for $50/mo. Get your company logo on proyecto26.com and priority issue triage.',
      audience: 'For teams that want to give back',
      benefits: [
        'Small logo on proyecto26.com sponsors page',
        'Priority issue triage',
        'Name credited in projects',
        'Choose Open Source projects & features to invest time',
        'All Supporter benefits',
      ],
    },
    {
      name: 'Supporter',
      icon: 'sparkles',
      color: 'teal',
      minAmount: 14,
      price: '$14',
      period: '/mo',
      description: 'Get your name in project READMEs seen by millions. $14/mo funds 15 minutes of focused development on the tools you use.',
      audience: 'For individual developers who use our tools',
      benefits: [
        'Name listed in project READMEs',
        'Priority bug reports',
        'Sponsor badge on GitHub',
        'Monthly development update',
      ],
    },
    {
      name: 'Backer',
      icon: 'coffee',
      color: 'coral',
      minAmount: 0,
      price: '$5',
      period: '/mo',
      description: 'Keep the open source tools you rely on alive. $5/mo buys real development time — every dollar counts.',
      audience: 'For anyone who wants to support open source',
      benefits: [
        'Access to enterprise projects (MercadoPago RN, Record Audio Button)',
        'Sponsor badge on GitHub',
        'Name on our sponsors wall',
        'Monthly development update',
      ],
    },
  ];
}

/**
 * Get all sponsors grouped by tier (fetched at build time)
 */
export async function getSponsorsGrouped(): Promise<SponsorTier[]> {
  const [ghSponsors, ocSponsors] = await Promise.all([
    fetchGitHubSponsors(),
    fetchOpenCollectiveSponsors(),
  ]);

  // Deduplicate: if a sponsor appears on both platforms, keep the one with higher tier
  const sponsorMap = new Map<string, Sponsor>();
  const tierRank: Record<string, number> = {
    'Platinum Partner': 6, 'Gold Sponsor': 5, 'Silver Sponsor': 4, 'Bronze Sponsor': 3, 'Supporter': 2, 'Backer': 1,
  };

  for (const s of [...manualSponsors, ...ghSponsors, ...ocSponsors]) {
    const key = s.name.toLowerCase();
    const existing = sponsorMap.get(key);
    if (!existing || (tierRank[s.tier] || 0) > (tierRank[existing.tier] || 0)) {
      sponsorMap.set(key, s);
    }
  }

  const allSponsors = Array.from(sponsorMap.values());
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
