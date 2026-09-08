import { projects } from '@/data/projects';
import { notFound } from 'next/navigation';
import CaseStudyLayout from '@/components/case-study/CaseStudyLayout';

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  const project = projects.find((p) => p.slug === slug);
  
  if (!project) {
    notFound();
  }

  return <CaseStudyLayout project={project} />;
}
