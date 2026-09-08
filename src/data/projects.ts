export interface CaseStudyData {
  slug: string;
  number: string;
  title: string;
  shortTitle?: string;
  category: string;
  year: string;
  status: 'LIVE' | 'IN PROGRESS' | 'CONCEPT' | 'ARCHIVED';
  featured: boolean;
  previewAsset?: string;
  heroAsset?: string;
  description: string;
  role?: string[];
  type?: string;
  stack?: string[];
  problem?: {
    statement: string;
    description: string;
  };
  approach?: string[];
  design?: {
    images: { src?: string; caption?: string; width: '100%' | '75%' | '50%'; annotation?: { title: string; description: string } }[];
  };
  productFlow?: { step: string; title: string; src?: string }[];
  mobile?: {
    statement: string;
    description: string;
    src?: string;
  };
  system?: {
    typography: { type: string; example: string; productExampleSrc?: string }[];
    colors: { name: string; hex: string; productExampleSrc?: string }[];
    components: { name: string; src?: string }[];
  };
  engineering?: {
    statement: string;
    architecture: { layer: string; tech: string }[];
  };
  implementation?: {
    decision: string;
    rule: string;
    detail: string;
  };
  myRole?: string[];
  result?: {
    statement: string;
    description: string;
  };
  nextProject?: {
    slug: string;
    title: string;
    number: string;
    previewAsset?: string;
  };
}

export const projects: CaseStudyData[] = [
  {
    slug: 'yqr',
    number: '01',
    title: 'YQR',
    shortTitle: 'YQR',
    category: 'DIGITAL ORDERING\nECOSYSTEM',
    year: '2026',
    status: 'LIVE',
    featured: true,
    previewAsset: undefined,
    heroAsset: undefined,
    description: 'A digital ordering ecosystem built around speed and clarity.',
    role: ['PRODUCT DESIGN', 'FRONTEND ENGINEERING'],
    type: 'DIGITAL PRODUCT',
    stack: ['REACT', 'NEXT.JS', 'SUPABASE', 'TYPESCRIPT'],
    problem: {
      statement: 'ORDERING SHOULD FEEL EFFORTLESS.',
      description: 'The dining experience was burdened by slow, clunky digital menus. The problem was not the lack of digital solutions, but the lack of thoughtfully designed ones. We needed an ecosystem that prioritized speed, clarity, and the physical context of the user.'
    },
    approach: ['PROBLEM', 'RESEARCH', 'SYSTEM', 'EXECUTION'],
    design: {
      images: [
        { 
          src: undefined, 
          caption: 'YQR / 01 — DESKTOP INTERFACE', 
          width: '100%',
          annotation: { title: 'HIERARCHY', description: 'Primary actions are visually isolated so the ordering flow remains immediately legible.' }
        },
        { 
          src: undefined, 
          caption: 'YQR / 02 — MENU ARCHITECTURE', 
          width: '75%',
          annotation: { title: 'MOTION', description: 'Transitions reinforce state changes instead of decorating the interface.' }
        },
        { 
          src: undefined, 
          caption: 'YQR / 03 — DETAIL VIEW', 
          width: '50%',
          annotation: { title: 'FEEDBACK', description: 'Every important action provides a clear visual response.' }
        },
      ]
    },
    productFlow: [
      { step: '01', title: 'DISCOVER' },
      { step: '02', title: 'SELECT' },
      { step: '03', title: 'CUSTOMIZE' },
      { step: '04', title: 'ORDER' },
      { step: '05', title: 'PAY' },
      { step: '06', title: 'CONFIRM' }
    ],
    mobile: {
      statement: 'DESIGNED FOR SPEED',
      description: 'On smaller screens, the hierarchy collapses around the ordering action rather than preserving the desktop structure.'
    },
    system: {
      typography: [
        { type: 'DISPLAY', example: 'Aa' },
        { type: 'BODY', example: 'Aa' },
        { type: 'META', example: 'Aa' },
      ],
      colors: [
        { name: 'OBSIDIAN', hex: '#050505' },
        { name: 'OFF-WHITE', hex: '#F0ECE4' },
        { name: 'CRIMSON', hex: '#9B1C1C' },
      ],
      components: [
        { name: 'NAVIGATION' },
        { name: 'ORDER CARDS' },
        { name: 'BOTTOM SHEET' }
      ]
    },
    engineering: {
      statement: 'DESIGNED + ENGINEERED + DEPLOYED',
      architecture: [
        { layer: 'USER', tech: 'Client Browser' },
        { layer: 'INTERFACE', tech: 'React / Next.js' },
        { layer: 'APPLICATION', tech: 'Application logic / Server Actions' },
        { layer: 'SERVICES', tech: 'Business workflows' },
        { layer: 'DATABASE', tech: 'Supabase / PostgreSQL' },
        { layer: 'DEPLOYMENT', tech: 'Production infrastructure' }
      ]
    },
    implementation: {
      decision: 'Keep ordering actions immediately visible.',
      rule: 'Primary action remains visually dominant across breakpoints.',
      detail: 'Reusable action component + responsive layout rules.'
    },
    myRole: [
      'PRODUCT DESIGN',
      'UI SYSTEM',
      'FRONTEND ENGINEERING',
      'BACKEND INTEGRATION',
      'DEPLOYMENT'
    ],
    result: {
      statement: 'DESIGNED AS A SYSTEM.\nNOT A COLLECTION OF SCREENS.',
      description: 'BUILT FOR REAL ORDERING FLOWS. FROM INTERFACE TO DATABASE. FROM IDEA TO PRODUCTION.'
    },
    nextProject: {
      slug: 'finance-os',
      title: 'FINANCE OS',
      number: '02'
    }
  },
  {
    slug: 'finance-os',
    number: '02',
    title: 'FINANCE OS',
    shortTitle: 'FINANCE OS',
    category: 'SYSTEMS / UI',
    year: '2025',
    status: 'IN PROGRESS',
    featured: true,
    description: 'A high-density interface for complex financial operations.',
    nextProject: {
      slug: 'dhara',
      title: 'DHARA',
      number: '03'
    }
  },
  {
    slug: 'dhara',
    number: '03',
    title: 'DHARA',
    shortTitle: 'DHARA',
    category: 'E-COMMERCE',
    year: '2025',
    status: 'CONCEPT',
    featured: true,
    description: 'An immersive digital retail experience focusing on typography and flow.',
    nextProject: {
      slug: 'studio-site',
      title: 'STUDIO SITE',
      number: '04'
    }
  },
  {
    slug: 'studio-site',
    number: '04',
    title: 'STUDIO SITE',
    shortTitle: 'STUDIO SITE',
    category: 'MOTION / WEBGL',
    year: '2024',
    status: 'ARCHIVED',
    featured: true,
    description: 'An immersive digital experience for a creative agency.',
    nextProject: {
      slug: 'yqr',
      title: 'YQR',
      number: '01'
    }
  }
];
