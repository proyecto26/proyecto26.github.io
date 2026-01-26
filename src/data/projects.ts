import { getRepoStats } from '../utils/github';

export type IconColor = 'coral' | 'teal' | 'orange' | 'blue';

export interface Project {
  title: string;
  subtitle: string;
  description: string;
  iconColor: IconColor;
  tags: string[];
  stars?: number;
  forks?: number;
  href: string;
  githubUrl?: string;
}

// Project definitions without stats (will be enriched at build time)
const projectDefinitions: Record<string, Omit<Project, 'stars' | 'forks'>[]> = {
  featured: [
    {
      title: 'react-native-inappbrowser',
      subtitle: 'React Native',
      description: 'InAppBrowser for React Native with support for Chrome Custom Tabs, Safari Services, and SafariViewController. Provides authentication flow, deep linking, and web browser capabilities.',
      iconColor: 'coral',
      tags: ['React Native', 'iOS', 'Android', 'Authentication'],
      href: 'https://github.com/proyecto26/react-native-inappbrowser',
      githubUrl: 'https://github.com/proyecto26/react-native-inappbrowser',
    },
    {
      title: 'RestClient',
      subtitle: 'Unity',
      description: 'Promise-based REST and HTTP client for Unity game development. Makes API calls simple and clean with async/await support and JSON serialization.',
      iconColor: 'teal',
      tags: ['Unity', 'C#', 'REST API', 'Promises'],
      href: 'https://github.com/proyecto26/RestClient',
      githubUrl: 'https://github.com/proyecto26/RestClient',
    },
  ],
  web: [
    {
      title: 'Animatable Component',
      subtitle: 'Web Component',
      description: 'Web component for creating reusable animations using the Web Animations API. Framework agnostic and easy to integrate.',
      iconColor: 'orange',
      tags: ['Stencil', 'Web Components', 'WAAPI'],
      href: 'https://proyecto26.github.io/animatable-component',
      githubUrl: 'https://github.com/proyecto26/animatable-component',
    },
    {
      title: 'IonPhaser',
      subtitle: 'Phaser + Ionic',
      description: 'Web component to integrate Phaser game framework with Ionic, Angular, React, Vue, and other frameworks.',
      iconColor: 'blue',
      tags: ['Phaser', 'Ionic', 'Stencil'],
      href: 'https://github.com/proyecto26/ion-phaser',
      githubUrl: 'https://github.com/proyecto26/ion-phaser',
    },
    {
      title: 'ProjectX',
      subtitle: 'Full-Stack Template',
      description: 'A real-world event-driven Full-Stack TypeScript template designed for production-ready distributed applications.',
      iconColor: 'coral',
      tags: ['React', 'NestJS', 'Temporal'],
      href: 'https://github.com/proyecto26/projectx',
      githubUrl: 'https://github.com/proyecto26/projectx',
    },
  ],
  mobile: [
    {
      title: 'nativescript-inappbrowser',
      subtitle: 'NativeScript',
      description: 'InAppBrowser plugin for NativeScript with Chrome Custom Tabs and Safari Services support.',
      iconColor: 'teal',
      tags: ['NativeScript', 'iOS', 'Android'],
      href: 'https://github.com/proyecto26/nativescript-inappbrowser',
      githubUrl: 'https://github.com/proyecto26/nativescript-inappbrowser',
    },
    {
      title: 'PokeDex GO',
      subtitle: 'NativeScript',
      description: 'Pokemon collection app built with NativeScript showcasing mobile development best practices.',
      iconColor: 'orange',
      tags: ['NativeScript', 'Mobile', 'Game'],
      href: 'https://github.com/proyecto26/PokeDex-GO',
      githubUrl: 'https://github.com/proyecto26/PokeDex-GO',
    },
  ],
  curated: [
    {
      title: 'Awesome Unity',
      subtitle: 'Curated List',
      description: 'A curated list of awesome Unity games, resources, tutorials, and open source projects for game developers.',
      iconColor: 'coral',
      tags: ['Unity', 'Resources', 'Curated'],
      href: 'https://github.com/proyecto26/awesome-unity',
      githubUrl: 'https://github.com/proyecto26/awesome-unity',
    },
    {
      title: 'Awesome JSGames',
      subtitle: 'Curated List',
      description: 'A curated list of awesome JavaScript games built with HTML5, Canvas, WebGL, and game engines.',
      iconColor: 'teal',
      tags: ['JavaScript', 'HTML5', 'Games'],
      href: 'https://github.com/proyecto26/awesome-jsgames',
      githubUrl: 'https://github.com/proyecto26/awesome-jsgames',
    },
  ],
};

/**
 * Enrich project with GitHub stats
 */
async function enrichProject(project: Omit<Project, 'stars' | 'forks'>): Promise<Project> {
  const githubUrl = project.githubUrl || project.href;

  if (githubUrl?.includes('github.com')) {
    const stats = await getRepoStats(githubUrl);
    if (stats) {
      return { ...project, stars: stats.stars, forks: stats.forks };
    }
  }

  return project;
}

/**
 * Get all projects with GitHub stats (fetched at build time)
 */
export async function getProjects(): Promise<{
  featured: Project[];
  web: Project[];
  mobile: Project[];
  curated: Project[];
}> {
  const [featured, web, mobile, curated] = await Promise.all([
    Promise.all(projectDefinitions.featured.map(enrichProject)),
    Promise.all(projectDefinitions.web.map(enrichProject)),
    Promise.all(projectDefinitions.mobile.map(enrichProject)),
    Promise.all(projectDefinitions.curated.map(enrichProject)),
  ]);

  return { featured, web, mobile, curated };
}

/**
 * Get a subset of featured projects for the home page
 */
export async function getFeaturedProjects(limit = 6): Promise<Project[]> {
  const all = [
    ...projectDefinitions.featured,
    ...projectDefinitions.curated,
    ...projectDefinitions.web.slice(0, 2),
  ];

  const enriched = await Promise.all(all.slice(0, limit).map(enrichProject));
  return enriched;
}
