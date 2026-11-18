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

/** Terminal-style demo shown in the AI showcase (can be swapped for a HyperFrames MP4 via `video`). */
export interface ShowcaseDemo {
  prompt: string;
  lines: { text: string; tone?: 'muted' | 'ok' | 'accent' }[];
}

export interface AIProject extends Project {
  slug: string;
  tagline: string;
  install: string;
  homepage?: string;
  video?: string;
  demo: ShowcaseDemo;
}

// Project definitions without stats (will be enriched at build time)
const projectDefinitions: Record<string, Omit<Project, 'stars' | 'forks'>[]> = {
  featured: [
    {
      title: 'Temporal Workflows',
      subtitle: 'npm · NestJS backend',
      description: '@proyecto26/temporal-workflows runs Temporal workers and clients inside a NestJS app: a module that starts the worker with the app, an injectable client, connection retries while Temporal starts, and helpers to query workflow status.',
      iconColor: 'teal',
      tags: ['Temporal', 'NestJS', 'TypeScript', 'Server'],
      href: 'https://github.com/proyecto26/projectx/blob/develop/packages/workflows/README.md',
      githubUrl: 'https://github.com/proyecto26/projectx',
    },
    {
      title: 'Temporal Workflow Client',
      subtitle: 'npm · JS, React & SSR',
      description: '@proyecto26/temporal-workflow-client follows Temporal workflows from any JavaScript app, with no Temporal code in the browser: a framework-agnostic store, polling or SSE Workflow Streams, and SSR-safe React hooks like useWorkflow.',
      iconColor: 'blue',
      tags: ['Temporal', 'React', 'SSR', 'Streams'],
      href: 'https://github.com/proyecto26/projectx/tree/develop/packages/workflow-client#useworkflow',
      githubUrl: 'https://github.com/proyecto26/projectx',
    },
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

// AI agent plugins & apps (2026). Shown in the home showcase and on /projects.
const aiDefinitions: Omit<AIProject, 'stars' | 'forks'>[] = [
  {
    slug: 'system-design',
    title: 'System Design Skills',
    subtitle: 'Claude Code plugin',
    tagline: 'Reason about scalable systems. Don’t memorize architectures.',
    description: 'A divide-and-conquer wiki of system-design skills with a /design command and an orchestrator agent that scores every design against a quality bar.',
    iconColor: 'coral',
    tags: ['System Design', 'Skills', 'Evals'],
    href: 'https://proyecto26.com/system-design-skills/',
    homepage: 'https://proyecto26.com/system-design-skills/',
    githubUrl: 'https://github.com/proyecto26/system-design-skills',
    install: '/plugin install system-design-skills',
    demo: {
      prompt: '/design a URL shortener for 100M daily redirects',
      lines: [
        { text: '▸ requirements   read-heavy 100:1, p99 < 50ms', tone: 'muted' },
        { text: '▸ estimation     ~1.2k writes/s · ~115k reads/s', tone: 'muted' },
        { text: '▸ blocks         id-gen · kv-store · cache · cdn', tone: 'muted' },
        { text: '✓ design doc saved → docs/design/url-shortener.md', tone: 'ok' },
      ],
    },
  },
  {
    slug: 'notebooklm',
    title: 'NotebookLM AI Plugin',
    subtitle: 'Agent plugin',
    tagline: 'Your notebooks, turned into decks, podcasts and mind maps.',
    description: 'Drive Google NotebookLM from your agent: generate slide decks, audio overviews, videos, mind maps, flashcards, quizzes, infographics and reports.',
    iconColor: 'teal',
    tags: ['NotebookLM', 'Bun', 'CDP'],
    href: 'https://github.com/proyecto26/notebooklm-ai-plugin',
    githubUrl: 'https://github.com/proyecto26/notebooklm-ai-plugin',
    install: '/plugin install notebooklm-ai-plugin',
    demo: {
      prompt: 'make an audio overview + flashcards from my "LLM Evals" notebook',
      lines: [
        { text: '▸ notebook       LLM Evals · 12 sources', tone: 'muted' },
        { text: '▸ audio overview  generating… deep-dive, 14 min', tone: 'muted' },
        { text: '✓ flashcards.json  48 cards', tone: 'ok' },
        { text: '✓ overview.mp3     ready', tone: 'ok' },
      ],
    },
  },
  {
    slug: 'slides',
    title: 'Slides AI Plugin',
    subtitle: 'Agent plugin',
    tagline: 'One prompt in. A full presentation out.',
    description: 'Turns any idea into an animated HTML deck (GSAP) or an editable PowerPoint, with curated style presets and overlap validation.',
    iconColor: 'orange',
    tags: ['GSAP', 'PptxGenJS', 'Presentations'],
    href: 'https://proyecto26.com/slides-ai-plugin/',
    homepage: 'https://proyecto26.com/slides-ai-plugin/',
    githubUrl: 'https://github.com/proyecto26/slides-ai-plugin',
    install: '/plugin install slides-ai-plugin',
    demo: {
      prompt: '10-slide pitch deck for an open source game studio, animated',
      lines: [
        { text: '▸ outline        10 slides · story arc', tone: 'muted' },
        { text: '▸ style          cinematic-dark preset', tone: 'muted' },
        { text: '✓ deck.html      animated, single file', tone: 'ok' },
        { text: '✓ deck.pptx      editable export', tone: 'ok' },
      ],
    },
  },
  {
    slug: 'sherlock',
    title: 'Sherlock AI Plugin',
    subtitle: 'Research skills',
    tagline: 'Research and implementation, supercharged.',
    description: 'A curated set of AI skills for deep research, academic papers, data visualization and even paper-to-comic explainers.',
    iconColor: 'blue',
    tags: ['Deep Research', 'Papers', 'Dataviz'],
    href: 'https://github.com/proyecto26/sherlock-ai-plugin',
    githubUrl: 'https://github.com/proyecto26/sherlock-ai-plugin',
    install: '/plugin install sherlock-ai-plugin',
    demo: {
      prompt: 'explain the "Attention Is All You Need" paper as a comic',
      lines: [
        { text: '▸ paper          arXiv:1706.03762', tone: 'muted' },
        { text: '▸ storyboard     8 panels · style: tech', tone: 'muted' },
        { text: '✓ comic.png      rendered', tone: 'ok' },
      ],
    },
  },
  {
    slug: 'autoresearch',
    title: 'Autoresearch AI Plugin',
    subtitle: 'Experiment loop',
    tagline: 'Edit, measure, keep or revert. Repeat while you sleep.',
    description: 'An autonomous experiment loop for any measurable metric: test speed, bundle size, build time or ML training loss. Ships with a /run-autoresearch command.',
    iconColor: 'coral',
    tags: ['Agents', 'Benchmarks', 'ML'],
    href: 'https://github.com/proyecto26/autoresearch-ai-plugin',
    githubUrl: 'https://github.com/proyecto26/autoresearch-ai-plugin',
    install: '/plugin install autoresearch-ai-plugin',
    demo: {
      prompt: '/run-autoresearch make the test suite faster',
      lines: [
        { text: '▸ baseline       42.8s', tone: 'muted' },
        { text: '#07 parallel workers       31.2s  keep', tone: 'ok' },
        { text: '#08 drop jsdom for node env 24.9s  keep', tone: 'ok' },
        { text: '#09 shared fixtures        25.4s  revert', tone: 'accent' },
      ],
    },
  },
  {
    slug: 'blender',
    title: 'Blender AI Plugin',
    subtitle: 'MCP pipeline',
    tagline: 'From blockout to engine export, prompt by prompt.',
    description: 'A curated collection of Blender skills with an MCP-powered production pipeline: modeling, materials, rigging and export to game engines.',
    iconColor: 'orange',
    tags: ['Blender', 'MCP', '3D'],
    href: 'https://github.com/proyecto26/blender-ai-plugin',
    githubUrl: 'https://github.com/proyecto26/blender-ai-plugin',
    install: '/plugin install blender-ai-plugin',
    demo: {
      prompt: 'block out a low-poly ninja dojo and export it to Unity',
      lines: [
        { text: '▸ blockout       14 objects · 2.1k tris', tone: 'muted' },
        { text: '▸ materials      stylized PBR', tone: 'muted' },
        { text: '✓ dojo.fbx       exported for Unity', tone: 'ok' },
      ],
    },
  },
  {
    slug: 'seam',
    title: 'Seam',
    subtitle: 'ComfyUI app',
    tagline: 'Two shots in, one transition out.',
    description: 'Open-source AI video transitions (smoke, water bend, whip pan) from a first and last frame, rendered on your own GPU with open-weights LTX models via ComfyUI.',
    iconColor: 'teal',
    tags: ['ComfyUI', 'LTX Video', 'Three.js'],
    href: 'https://jdnichollsc.github.io/seam/',
    homepage: 'https://jdnichollsc.github.io/seam/',
    githubUrl: 'https://github.com/jdnichollsc/seam',
    install: 'claude plugin install seam',
    demo: {
      prompt: 'seam: whip-pan from shot-a.png to shot-b.png, 4s',
      lines: [
        { text: '▸ model          LTX (open weights) · local GPU', tone: 'muted' },
        { text: '▸ frames         first + last → 97 frames', tone: 'muted' },
        { text: '✓ take-03.mp4    1280×720 · 24fps', tone: 'ok' },
      ],
    },
  },
];

async function enrichAI(project: Omit<AIProject, 'stars' | 'forks'>): Promise<AIProject> {
  const stats = project.githubUrl ? await getRepoStats(project.githubUrl) : null;
  return stats ? { ...project, stars: stats.stars, forks: stats.forks } : project;
}

/** AI agent plugins & apps with live GitHub stats (build time). */
export async function getAIProjects(): Promise<AIProject[]> {
  return Promise.all(aiDefinitions.map(enrichAI));
}

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
    ...projectDefinitions.web,
  ];

  const enriched = await Promise.all(all.slice(0, limit).map(enrichProject));
  return enriched;
}
