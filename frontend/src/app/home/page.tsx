'use client';
import Header from '@/components/default/header';
import ProjectCard from '@/components/project-card';
import CreateProjectForm from '@/forms/create-project-form';
import { useGet } from '@/hooks/useApi';
import { projectType } from '@/types/project-type';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const { loading, response, get } = useGet({ url: '/api/projetos' });
  const [data, setData] = useState<{
    projects: projectType[];
    total: number;
  } | null>(null);

  useEffect(() => {
    setData(response as { projects: projectType[]; total: number });
  }, [response]);

  return (
    <div
      className={`min-h-screen w-full flex flex-col  items-center bg-cover bg-no-repeat`}
      style={{ backgroundImage: `url('/background.jpg')` }}
    >
      <Header />
      <main className="mt-16 flex flex-1 flex-col gap-10 p-10 items-center relative ">
        {loading ? (
          <Loader2 className="animate-spin h-7 w-7 mt-10" />
        ) : (
          <>
            <div className="flex justify-center gap-3">
              <CreateProjectForm get={get} />
            </div>
            <div className="w-full flex flex-wrap gap-5 justify-center">
              {data?.projects &&
                data?.projects?.map((project, index) => (
                  <ProjectCard project={project} key={index} get={get} />
                ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
