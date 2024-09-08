import { api } from '@/app/config/api';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import UpdateProjectForm from '@/forms/update-project-form';
import { projectType } from '@/types/project-type';
import { Trash2 } from 'lucide-react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export default function ProjectCard({ project }: { project: projectType }) {
  function handleDelete() {
    api
      .delete(`/api/projetos/${project.id}`)
      .then(() => {
        toast.success('Projeto removido com sucesso');
        window.location.reload();
      })
      .catch(err => {
        toast.error(err);
      });
  }

  return (
    <Card className="w-[300px] bg-card min-h-[200px] flex flex-col gap-2 hover:cursor-pointer transition-all hover:shadow-md hover:shadow-blue-100">
      <CardHeader className="flex flex-col justify-center items-center h-1/4  border-b border-primary/10 shadow-sm relative">
        <CardTitle className="text-center text-lg font-bold text-primary flex relative w-full justify-start items-center">
          {project.nome}
          <Button
            variant={'ghost'}
            className="absolute right-0"
            onClick={() => {
              handleDelete();
            }}
          >
            <Trash2 className=" text-red-400" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-hidden p-5 h-2/4">
        <Badge
          style={{
            backgroundColor:
              project.status === 'CONCLUIDO'
                ? 'green'
                : project.status === 'EM ANDAMENTO'
                ? 'yellow'
                : 'gray',
          }}
          className="text-justify"
        >
          {project.status === 'CONCLUIDO'
            ? 'Concluído'
            : project.status === 'EM ANDAMENTO'
            ? 'Em andamento'
            : 'Pendente'}
        </Badge>
        <h1 className="text-justify">
          {moment(project.data_inicio).format('DD-MM-YYYY')}
        </h1>
        <h1 className="text-justify">
          {project.data_fim ? (
            moment(project.data_fim).format('DD-MM-YYYY')
          ) : (
            <></>
          )}
        </h1>
      </CardContent>
      <CardFooter className="flex items-center justify-between text-sm gap-2 h-1/4">
        <p className="text-justify">{project.descricao}</p>
        <UpdateProjectForm project={project} />
      </CardFooter>
    </Card>
  );
}
