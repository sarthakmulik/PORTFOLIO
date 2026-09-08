import { projects } from '@/data/projects';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import CaseStudyLayout from '@/components/case-study/CaseStudyLayout';
import Link from 'next/link';

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: 'Not Found' };

  const title = `${project.title} — ${project.category.replace('\n', ' ')} | Sarthak Mulik`;
  const description = project.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: project.heroAsset ? [{ url: project.heroAsset }] : [],
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  const project = projects.find((p) => p.slug === slug);
  
  if (!project) {
    notFound();
  }

  if (project.status !== 'LIVE') {
    return (
      <main className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-center p-6" style={{ fontFamily: 'var(--font-manrope), system-ui, sans-serif' }}>
        <Link href="/" className="editorial-link text-meta absolute top-12 left-12" style={{ color: 'rgba(240,236,228,0.6)' }}>
          <span className="arrow rotate-180 inline-block mr-2" aria-hidden="true">←</span>
          <span>BACK TO PORTFOLIO</span>
        </Link>
        <span className="text-meta tracking-widest text-[#9b1c1c] mb-6 block">PROJECT {project.number}</span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#f0ece4] mb-8">{project.title}</h1>
        <div className="border border-[#f0ece4]/10 px-8 py-4 bg-[#0A0A0A]">
          <span className="text-xs uppercase tracking-widest text-[#f0ece4]/50 font-mono">CASE STUDY {project.status}</span>
        </div>
      </main>
    );
  }

  return <CaseStudyLayout project={project} />;
}
