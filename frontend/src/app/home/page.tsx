'use client';
import ProjectCard from '@/components/project-card';
import CreateProjectForm from '@/forms/create-project-form';
import { useGet } from '@/hooks/useApi';
import { projectType } from '@/types/project-type';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const { loading, response } = useGet({ url: '/api/projetos' });
  const [data, setData] = useState<{
    projects: projectType[];
    total: number;
  } | null>(null);

  useEffect(() => {
    setData(response as { projects: projectType[]; total: number });
  }, [response]);

  return (
    <div
      className={`min-h-screen w-full flex flex-col  items-center bg-[#4CA2A620]`}
    >
      <main className="mt-16 flex flex-1 flex-col gap-10 p-10 items-center relative">
        {loading ? (
          <Loader2 className="animate-spin h-7 w-7 mt-10" />
        ) : (
          <>
            <div className="flex justify-center gap-3">
              <CreateProjectForm />
            </div>
            <div className="w-full flex flex-wrap gap-5 justify-center">
              {data?.projects &&
                data?.projects?.map((project, index) => (
                  <ProjectCard project={project} key={index} />
                ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
