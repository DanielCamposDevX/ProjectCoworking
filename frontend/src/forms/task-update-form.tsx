import { api } from '@/app/config/api';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  createTaskFormData,
  createTaskFormSchema,
} from '@/schemas/task-schema';
import { taskType } from '@/types/task-type';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle, Pencil } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function TaskUpdateForm({
  task,
  get,
}: {
  task: taskType;
  get: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<createTaskFormData>({
    resolver: zodResolver(createTaskFormSchema),
  });

  useEffect(() => {
    if (task) {
      reset(task as createTaskFormData);
      setValue('status', task.status);
      setValue('term', moment(task.term).format('YYYY-MM-DD'));
    }
  }, [task]);

  const handleUpdateTask = async (data: createTaskFormData) => {
    setLoading(true);
    try {
      await api.put(`/api/projetos/tarefas/${task.id}`, data);
      setOpen(false);
      get();
    } catch (error) {
      console.error('Erro ao atualizar tarefa', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex justify-end">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant={'ghost'}
            className="p-2 rounded-full"
            onClick={e => {
              e.stopPropagation();
            }}
          >
            <Pencil className="text-black h-5 w-5" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="sm:max-w-[425px] bg-white p-10">
          <AlertDialogHeader>
            <AlertDialogTitle>Atualizar Tarefa</AlertDialogTitle>
            <AlertDialogDescription>
              Atualize os detalhes da tarefa abaixo.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={handleSubmit(handleUpdateTask)} className="space-y-4">
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-gray-700"
              >
                Nome
              </label>
              <Input
                id="nome"
                placeholder="Digite o nome da tarefa"
                {...register('nome')}
                error={errors?.nome?.message}
              />
            </div>
            <div>
              <label
                htmlFor="descricao"
                className="block text-sm font-medium text-gray-700"
              >
                Descrição
              </label>
              <Input
                id="descricao"
                placeholder="Digite uma descrição (opcional)"
                {...register('descricao')}
                error={errors?.descricao?.message}
              />
            </div>

            <div>
              <label
                htmlFor="term"
                className="block text-sm font-medium text-gray-700 mt-4"
              >
                Prazo
              </label>
              <Input
                type="date"
                {...register('term')}
                error={errors?.term?.message}
              />
            </div>

            <AlertDialogFooter className="flex justify-center items-center gap-2 w-full">
              <AlertDialogCancel
                className="z-50 border text-base px-8 py-3 rounded-full mt-4"
                disabled={loading}
              >
                {loading ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  'Cancelar'
                )}
              </AlertDialogCancel>
              <Button
                className="z-50 text-white text-base px-8 py-6 rounded-full mt-4"
                variant={'default'}
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  'Atualizar tarefa'
                )}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
