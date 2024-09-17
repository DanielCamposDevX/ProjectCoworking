'use client';
import Header from '@/components/default/header';
import HomeFilters from '@/components/homeFilters';
import { Pagination } from '@/components/pagination';

import ProjectCard from '@/components/project-card';
import UploadCsvButton from '@/components/upload-csv';

import CreateProjectForm from '@/forms/create-project-form';
import { useGet } from '@/hooks/useApi';
import { projectType } from '@/types/project-type';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(10);
  const { loading, response, get } = useGet({
    url: `/api/projetos?page=${currentPage}&limit=${projectsPerPage}`,
  });
  const [data, setData] = useState<{
    projects: projectType[];
    total: number;
    totalPages: number;
  } | null>(null);

  useEffect(() => {
    setData(
      response as {
        projects: projectType[];
        total: number;
        totalPages: number;
        currentPage: number;
      },
    );
    setCurrentPage((response as { currentPage: number })?.currentPage || 1);
  }, [response]);

  const handlePageChange = (page: number) => {
    get({ newUrl: `/api/projetos?page=${page}&limit=${projectsPerPage}` });
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center bg-cover bg-no-repeat`}
      style={{ backgroundImage: `url('/background.jpg')` }}
    >
      <Header />
      <main className="mt-16 flex flex-1 flex-col gap-10 p-10 items-center relative">
        {loading ? (
          <Loader2 className="animate-spin h-7 w-7 mt-10" />
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-center items-center gap-3">
              <HomeFilters
                applyFilters={filter => {
                  get({ params: filter });
                }}
              />

              <CreateProjectForm get={() => get({})} />
              <UploadCsvButton />
            </div>
            <div className="w-full flex flex-wrap gap-5 justify-center">
              {data?.projects &&
                data.projects.map(project => (
                  <ProjectCard
                    project={project}
                    key={project.id}
                    get={() => get({})}
                  />
                ))}
            </div>
            {data?.totalPages && data?.totalPages >= 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={data.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
