'use client';
import { useHome } from '@/api/callers/home';
import Header from '@/components/default/header';
import HomeFilters from '@/components/homeFilters';
import { Pagination } from '@/components/pagination';
import ProjectCard from '@/components/project-card';
import UploadCsvButton from '@/components/upload-csv';
import CreateProjectForm from '@/forms/create-project-form';
import { paramsType } from '@/types/params-type';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import { Suspense, useState } from 'react';

export default function Home() {
  const [params, setParams] = useState<paramsType>({ limit: 10, page: 1 });

  const { index } = useHome(params);
  const data = index.data?.pages[0];

  const handlePageChange = (page: number) => {
    setParams({ ...params, page });
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center bg-cover bg-no-repeat`}
      style={{ backgroundImage: `url('/background.jpg')` }}
    >
      <Header />
      <motion.main
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: 'easeInOut', duration: 0.75 }}
        className="mt-16 flex flex-1 flex-col gap-10 p-10 items-center relative"
      >
        {index.isLoading ? (
          <Loader2 className="animate-spin h-7 w-7 mt-10" />
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-center items-center gap-3">
              <Suspense>
                <HomeFilters
                  applyFilters={filter => {
                    setParams({ ...params, ...filter });
                  }}
                />
              </Suspense>

              <CreateProjectForm get={() => index.refetch()} />
              <UploadCsvButton get={() => index.refetch()} />
            </div>
            <div className="w-full flex flex-wrap gap-5 justify-center">
              {data?.projects && data?.projects.length > 0 ? (
                data.projects.map(project => (
                  <ProjectCard
                    project={project}
                    key={project.id}
                    get={() => index.refetch()}
                  />
                ))
              ) : (
                <div>Nenhum projeto encontrado</div>
              )}
            </div>
            {data?.totalPages &&
              data?.totalPages >= 0 &&
              data?.projects.length > 0 && (
                <Pagination
                  currentPage={params.page}
                  totalPages={data.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
          </>
        )}
      </motion.main>
    </div>
  );
}
