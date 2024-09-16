'use client';
import CommentSection from '@/components/comments';
import Header from '@/components/default/header';
import TaskSection from '@/components/tasks';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useGet } from '@/hooks/useApi';
import { randomUserImage } from '@/lib/randomUser';
import { completeprojectType } from '@/types/project-type';
import { Loader2 } from 'lucide-react';
import moment from 'moment';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const projectStatus = {
  CONCLUIDO: {
    color: 'green',
    text: 'Concluído',
    textColor: 'white',
  },
  EM_ANDAMENTO: {
    color: '#fcef62',
    text: 'Em andamento',
    textColor: 'black',
  },
  PENDENTE: {
    color: 'gray',
    text: 'Pendente',
    textColor: 'white',
  },
};

export default function ProjectPage() {
  const { id } = useParams();
  const { response, loading } = useGet({ url: `/api/projetos/${id}` });
  const [project, setProject] = useState<completeprojectType | null>(null);

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
      <main className="w-5/6 mt-20 min-h-screen border rounded-lg md:p-20 p-5 flex flex-col bg-card">
        {!loading && project ? (
          <div className="w-full flex justify-between">
            <div className="p-10 flex flex-col gap-8 w-5/6  border-r">
              <h1 className="md:text-3xl text-lh font-bold text-primary">
                {project?.nome}
              </h1>
              <h3 className="text-accent-foreground">
                <Badge
                  style={{
                    backgroundColor: projectStatus[project.status].color,
                    color: projectStatus[project.status].textColor,
                  }}
                  className="text-justify justify-self-end"
                >
                  {projectStatus[project.status].text}
                </Badge>
              </h3>
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  Data de início
                </label>
                {moment(project?.data_inicio).format('DD/MM/YYYY')}
              </div>
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  Data final
                </label>
                {moment(project?.data_fim).format('DD/MM/YYYY')}
              </div>
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <Textarea
                  placeholder={project?.descricao || 'Sem descrição'}
                  className="w-10/12"
                />
                <Separator className="my-8" />
                <TaskSection projectId={project.id} />
                <Separator className="my-8" />
                <CommentSection id={project.id} />
              </div>
            </div>
            <div className="w-1/6 pl-10">
              <h3 className="font-bold text-lg">Usuários:</h3>
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
                            <AvatarImage src={randomUserImage(usuario.nome)} />
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
            </div>
          </div>
        ) : (
          <Loader2 className="animate-spin h-10 w-10 mt-46" />
        )}
      </main>
    </div>
  );
}
