/**
 * GitHub API utilities for fetching repository data at build time
 */

interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  description: string;
}

interface RepoStats {
  stars: number;
  forks: number;
}

/**
 * Extract owner and repo name from a GitHub URL
 */
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

/**
 * Fetch repository stats from GitHub API
 * Note: Unauthenticated requests are limited to 60/hour
 * For higher limits, set GITHUB_TOKEN environment variable
 */
export async function getRepoStats(githubUrl: string): Promise<RepoStats | null> {
  const parsed = parseGitHubUrl(githubUrl);
  if (!parsed) return null;

  const { owner, repo } = parsed;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Proyecto26-Website',
    };

    // Use token if available for higher rate limits
    const token = import.meta.env.GITHUB_TOKEN;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(apiUrl, { headers });

    if (!response.ok) {
      console.warn(`GitHub API error for ${owner}/${repo}: ${response.status}`);
      return null;
    }

    const data: GitHubRepo = await response.json();
    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
    };
  } catch (error) {
    console.warn(`Failed to fetch stats for ${owner}/${repo}:`, error);
    return null;
  }
}

/**
 * Fetch stats for multiple repositories
 * Returns a map of GitHub URL -> stats
 */
export async function getMultipleRepoStats(
  githubUrls: string[]
): Promise<Map<string, RepoStats>> {
  const results = new Map<string, RepoStats>();

  // Fetch in parallel but handle failures gracefully
  const promises = githubUrls.map(async (url) => {
    const stats = await getRepoStats(url);
    if (stats) {
      results.set(url, stats);
    }
  });

  await Promise.all(promises);
  return results;
}

/**
 * Fetch total stars for a GitHub organization
 */
export async function getOrgTotalStars(org: string): Promise<number> {
  let totalStars = 0;
  let page = 1;
  const perPage = 100;

  try {
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Proyecto26-Website',
    };

    const token = import.meta.env.GITHUB_TOKEN;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Fetch all repos (paginated)
    while (true) {
      const response = await fetch(
        `https://api.github.com/orgs/${org}/repos?per_page=${perPage}&page=${page}`,
        { headers }
      );

      if (!response.ok) {
        console.warn(`GitHub API error for org ${org}: ${response.status}`);
        break;
      }

      const repos: GitHubRepo[] = await response.json();
      if (repos.length === 0) break;

      totalStars += repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

      if (repos.length < perPage) break;
      page++;
    }
  } catch (error) {
    console.warn(`Failed to fetch org stats for ${org}:`, error);
  }

  return totalStars;
}

/**
 * Format number with K suffix for thousands
 */
export function formatStars(count: number): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return count.toString();
}
