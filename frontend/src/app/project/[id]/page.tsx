'use client';
import CommentSection from '@/components/comments';
import Header from '@/components/default/header';
import Logs from '@/components/logs';
import ProjectHeader from '@/components/projectHeader';
import TaskSection from '@/components/tasks';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useGet } from '@/hooks/useApi';
import { randomUserImage } from '@/lib/randomUser';
import { completeprojectType } from '@/types/project-type';
import { motion } from 'framer-motion';
import { ChevronLeft, Loader2, User } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

export default function ProjectPage() {
  const { id } = useParams();
  const { response, loading, get } = useGet({ url: `/api/projetos/${id}` });
  const [project, setProject] = useState<completeprojectType | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (response) {
      setProject(response as completeprojectType);
    }
  }, [response]);

  const groupUsersByRole = () => {
    const groups: {
      [key: string]: Array<{ id: number; papel: string; nome: string }>;
    } = {};
    project?.usuarios.forEach(usuario => {
      if (!groups[usuario.papel]) {
        groups[usuario.papel] = [];
      }
      groups[usuario.papel].push(usuario);
    });
    return groups;
  };

  const userGroups = project ? groupUsersByRole() : {};

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
        className="w-full md:w-11/12 lg:w-5/6 mt-20 min-h-screen border rounded-lg lg:p-20 p-5 flex flex-col bg-card"
      >
        {!loading && project ? (
          <>
            <Button
              variant={'secondary'}
              className="w-fit bg-white border"
              onClick={() => {
                router.back();
              }}
            >
              <ChevronLeft />
            </Button>
            <div className="w-full flex justify-between flex-col  lg:flex-row">
              <div className="lg:p-10 flex flex-col w-full lg:w-9/12  border-r">
                <ProjectHeader project={project} get={() => get({})} />
                <div className="flex flex-col gap-2 ">
                  <TaskSection projectId={project.id} />
                  <Separator className="my-8" />
                  <CommentSection id={project.id} />
                </div>
              </div>
              <div className="w-full mt-10 lg:mt-0 lg:w-3/12 lg:pl-4">
                <h2 className="text-xl font-semibold  flex items-center gap-3 mt-4 mb-6">
                  <User className="h-6 w-6 text-blue-600" />
                  Usuários:
                </h2>
                {Object.entries(userGroups).length > 0 ? (
                  Object.entries(userGroups).map(([role, usuarios]) => (
                    <div key={role} className="mt-5">
                      <h4 className="font-bold text-md">{role}s:</h4>
                      <div className="flex flex-col">
                        {usuarios.map(usuario => (
                          <div
                            key={usuario.id}
                            className="flex items-center my-2 gap-3"
                          >
                            <Avatar>
                              <AvatarImage
                                src={randomUserImage(usuario.nome)}
                              />
                            </Avatar>
                            <span>{usuario.nome}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <span>Nenhum usuário encontrado.</span>
                )}
                <Logs logs={project.Logs} />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full flex justify-center">
            <Loader2 className="animate-spin h-10 w-10 mt-46" />
          </div>
        )}
      </motion.main>
    </div>
  );
}
