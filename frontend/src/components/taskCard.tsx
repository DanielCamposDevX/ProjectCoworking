import { api } from '@/app/config/api';
import { taskType } from '@/types/task-type';
import { Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';

const projectStatus = {
  CONCLUIDO: {
    color: 'green',
    text: 'Concluído',
    textColor: 'white',
  },
  PENDENTE: {
    color: '#da7b00',
    text: 'Pendente',
    textColor: 'white',
  },
};

export default function TaskCard({
  task,
  userId,
  get,
}: {
  task: taskType;
  userId: number | null;
  get: ({
    newUrl,
    params,
  }: {
    newUrl?: string;
    params?: unknown;
  }) => Promise<unknown>;
}) {
  const handleDelete = (taskId: number) => {
    api.delete(`/api/projetos/tarefas/${taskId}`).then(() => {
      get({});
    });
  };

  return (
    <div key={task.id} className="p-3 border rounded-md bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 justify-center items-center">
          <Checkbox
            className="rounded-full w-6 h-6"
            style={
              task.status === 'CONCLUIDO'
                ? {
                    borderColor: projectStatus.CONCLUIDO.color,
                    backgroundColor: projectStatus.CONCLUIDO.color,
                  }
                : { borderColor: projectStatus.PENDENTE.color }
            }
          />
          <span className="font-semibold">{task.nome}</span>
        </div>
        <span className="text-gray-500 text-sm flex justify-center items-center">
          {userId === task.usuario.id && (
            <Button
              variant={'ghost'}
              className="p-2 rounded-full"
              onClick={e => {
                e.stopPropagation();
                handleDelete(task.id);
              }}
            >
              <Trash2 className="text-red-400 h-5 w-5" />
            </Button>
          )}
        </span>
      </div>
      <div className="flex justify-between items-center pl-8">
        <>{task.descricao}</>
      </div>
    </div>
  );
}
