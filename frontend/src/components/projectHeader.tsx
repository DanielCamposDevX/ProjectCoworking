import { api } from '@/app/config/api';
import LinkProjectUserForm from '@/forms/link-project-user';
import UpdateProjectForm from '@/forms/update-project-form';
import { useConfirmationDialog } from '@/hooks/useConfirmationDialog';
import { completeprojectType } from '@/types/project-type';
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

export default function ProjectHeader({
  project,
  get,
}: {
  project: completeprojectType;
  get: () => void;
}) {
  const router = useRouter();

  async function handleDelete() {
    const result = await confirm();
    if (result) {
      api
        .delete(`/api/projetos/${project.id}`)
        .then(() => {
          toast.success('Projeto removido com sucesso');
          router.push('/home');
        })
        .catch(err => {
          toast.error(err.response.data);
        });
    } else {
      console.log('Ação de exclusão cancelada.');
    }
  }

  const { ConfirmationDialog, confirm } = useConfirmationDialog();

  return (
    <header className="shadow-lg rounded-lg border">
      <section className="flex  justify-between items-start  py-10 px-6">
        <div className="flex flex-col gap-6">
          <h1 className="md:text-3xl text-lg font-bold text-primary">
            {project?.nome}
          </h1>
          <label className="block text-md font-medium text-gray-700">
            {project?.descricao}
          </label>
        </div>
        <div className="flex gap-0 justify-end items-center">
          <LinkProjectUserForm project={project} />
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
      </section>

      <section className="flex justify-around py-4 border-t">
        <h3 className="text-accent-foreground">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
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

        <div className="w-[1px] bg-border" />

        <div className="flex flex-col gap-2">
          <label className="block text-sm font-medium text-gray-700">
            Data de início
          </label>
          {moment(project?.data_inicio).format('DD/MM/YYYY')}
        </div>
        {project.data_fim && (
          <>
            <div className="w-[1px] bg-border" />

            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-700">
                Data final
              </label>
              {moment(project?.data_fim).format('DD/MM/YYYY')}
            </div>
          </>
        )}
      </section>
    </header>
  );
}
