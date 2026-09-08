export interface CaseStudyData {
  slug: string;
  number: string;
  title: string;
  category: string;
  year: string;
  description: string;
  role: string[];
  type: string;
  stack: string[];
  problem: {
    statement: string;
    description: string;
  };
  approach: string[];
  design: {
    images: { src: string; caption?: string; width: '100%' | '75%' | '50%' }[];
    decisions: { num: string; title: string; description: string }[];
  };
  system: {
    typography: { type: string; example: string }[];
    colors: { name: string; hex: string }[];
    components: string[];
  };
  engineering: {
    statement: string;
    architecture: string[];
  };
  result: {
    statement: string;
    description: string;
  };
  nextProject: {
    slug: string;
    title: string;
    number: string;
  };
}

export const projects: CaseStudyData[] = [
  {
    slug: 'yqr',
    number: '01',
    title: 'YQR',
    category: 'PRODUCT / ENGINEERING',
    year: '2026',
    description: 'A digital ordering ecosystem built around speed and clarity.',
    role: ['PRODUCT DESIGN', 'FRONTEND ENGINEERING'],
    type: 'DIGITAL PRODUCT',
    stack: ['REACT', 'NEXT.JS', 'SUPABASE', 'TYPESCRIPT'],
    problem: {
      statement: 'ORDERING SHOULD FEEL EFFORTLESS.',
      description: 'The dining experience was burdened by slow, clunky digital menus. The problem was not the lack of digital solutions, but the lack of thoughtfully designed ones. We needed an ecosystem that prioritized speed, clarity, and the physical context of the user.'
    },
    approach: ['PROBLEM', 'RESEARCH', 'STRUCTURE', 'INTERACTION', 'SYSTEM', 'PRODUCT'],
    design: {
      images: [
        { src: '', caption: '01 / ORDER FLOW', width: '100%' },
        { src: '', caption: '02 / MENU ARCHITECTURE', width: '75%' },
        { src: '', caption: '03 / DETAIL VIEW', width: '50%' },
      ],
      decisions: [
        { num: '01', title: 'HIERARCHY', description: 'Large typography keeps the primary action immediately visible.' },
        { num: '02', title: 'MOTION', description: 'Transitions preserve context between ordering states.' },
        { num: '03', title: 'SYSTEM', description: 'Reusable components keep the interface consistent across flows.' },
      ]
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
      components: ['NAVIGATION', 'ORDER CARDS', 'BOTTOM SHEET']
    },
    engineering: {
      statement: 'DESIGNED + ENGINEERED + DEPLOYED',
      architecture: ['CLIENT', 'APPLICATION', 'SERVICES', 'DATABASE']
    },
    result: {
      statement: 'FROM IDEA TO PRODUCTION.',
      description: 'A simplified workflow with improved clarity and a responsive, production-ready implementation that respects the user’s time and context.'
    },
    nextProject: {
      slug: 'finance-os',
      title: 'FINANCE OS',
      number: '02'
    }
  }
];
