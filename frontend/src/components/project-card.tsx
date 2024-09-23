import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { api } from '@/config/api';
import LinkProjectUserForm from '@/forms/link-project-user';
import UpdateProjectForm from '@/forms/update-project-form';
import { useConfirmationDialog } from '@/hooks/useConfirmationDialog';
import { projectType } from '@/types/project-type';
import { Trash2 } from 'lucide-react';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

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

export default function ProjectCard({
  project,
  get,
}: {
  project: projectType;
  get: () => void;
}) {
  async function handleDelete() {
    const result = await confirm();
    if (result) {
      api
        .delete(`/api/projetos/${project.id}`)
        .then(() => {
          toast.success('Projeto removido com sucesso');
          get();
        })
        .catch(err => {
          toast.error(err.response.data);
        });
    } else {
      console.log('Ação de exclusão cancelada.');
    }
  }

  const router = useRouter();
  const { ConfirmationDialog, confirm } = useConfirmationDialog();

  return (
    <Card
      onClick={() => {
        router.push(`/project/${project.id}`);
      }}
      className="w-[300px] bg-card min-h-[200px] rounded-3xl p-2 flex flex-col gap-2 hover:cursor-pointer transition-all hover:shadow-md hover:shadow-blue-100 overflow-hidden"
    >
      <CardHeader className="flex flex-col justify-center items-center h-1/4  border-b border-primary/10 shadow-sm relative">
        <CardTitle className="text-center text-lg font-bold text-primary flex relative w-full justify-between items-center">
          {project.nome}
          <div className="flex gap-0 justify-end items-center">
            <LinkProjectUserForm project={project} get={get} />
            <UpdateProjectForm project={project} get={get} />
            <ConfirmationDialog />
            <Button
              variant={'ghost'}
              className="p-2 rounded-full"
              onClick={e => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              <Trash2 className=" text-red-400 h-5 w-5" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="overflow-hidden p-5 h-2/4">
        <h1 className="text-justify text-base">
          Início: {moment(project.data_inicio).format('DD/MM/YYYY')}
        </h1>
        <h1 className="text-justify text-base">
          Fim:{' '}
          {project.data_fim && moment(project.data_fim).format('DD/MM/YYYY')}
        </h1>
        <p className="text-justify text-sm mt-4">
          {project?._count?.usuarios} pessoas no projeto
        </p>
      </CardContent>

      <CardFooter className="flex flex-col justify-start items-start text-sm gap-2 h-1/4 ">
        <p className="text-justify">Descrição:</p>
        <p className="text-justify overflow-hidden overflow-ellipsis line-clamp-3">
          {project.descricao}
        </p>
      </CardFooter>
      <div className="w-full flex justify-center mt-4 mb-4">
        <Badge
          style={{
            backgroundColor: projectStatus[project.status].color,
            color: projectStatus[project.status].textColor,
          }}
          className="text-justify justify-self-end"
        >
          {projectStatus[project.status].text}
        </Badge>
      </div>
    </Card>
  );
}
