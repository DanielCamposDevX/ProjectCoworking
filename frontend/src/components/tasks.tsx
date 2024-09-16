import { api } from '@/app/config/api';
import { useAuth } from '@/app/context/AuthContext';
import { useGet } from '@/hooks/useApi';
import { taskType } from '@/types/task-type';

import {
  createTaskFormData,
  createTaskFormSchema,
} from '@/schemas/task-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClipboardList, LoaderCircle, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pagination } from './pagination';
import TaskCard from './taskCard';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type responseType = {
  tasks: taskType[];
  total: number;
};

export default function TaskSection({ projectId }: { projectId: number }) {
  const [tasks, setTasks] = useState<Array<taskType>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const tasksPerPage = 5;
  const { userId } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<createTaskFormData>({
    resolver: zodResolver(createTaskFormSchema),
  });

  const { response, get } = useGet({
    url: `/api/projetos/${projectId}/tarefas?page=${currentPage}&limit=${tasksPerPage}`,
  });

  useEffect(() => {
    if (response) {
      const { tasks, total } = response as responseType;
      setTasks(tasks);
      setTotalTasks(total);
    }
  }, [response]);

  const totalPages = Math.ceil(totalTasks / tasksPerPage);

  const handleAddTask = (taskData: createTaskFormData) => {
    setLoading(true);
    api.post(`/api/projetos/${projectId}/tarefas`, taskData).then(() => {
      setLoading(false);
      setOpen(false);
      reset();
      setCurrentPage(1);
      get({});
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-3 flex items-center gap-3 mt-10">
        <ClipboardList className="h-6 w-6 text-blue-600" />
        Tarefas
      </h2>

      <div className="border shadow-lg rounded-lg py-10 px-10 mt-2">
        <div className="space-y-4 ">
          {tasks?.map(task => (
            <TaskCard key={task.id} task={task} userId={userId} get={get} />
          ))}
        </div>
        <div className="flex justify-center items-center py-4">
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
        <div className="mb-5 flex justify-end">
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button className="gap-2 text-base px-4 py-6 rounded-full w-fit bg-white">
                Nova tarefa <PlusCircle className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[425px] bg-white p-10">
              <AlertDialogHeader>
                <AlertDialogTitle>Criar Novo Projeto</AlertDialogTitle>
                <AlertDialogDescription>
                  Preencha os detalhes do projeto abaixo.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <form
                onSubmit={handleSubmit(handleAddTask)}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="nome"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nome
                  </label>
                  <Input
                    id="nome"
                    placeholder="Digite o nome do projeto"
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
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <Select
                    defaultValue=""
                    aria-invalid={errors.status ? 'true' : 'false'}
                    required
                    onValueChange={value => setValue('status', value)}
                  >
                    <SelectTrigger className="w-full border rounded-full py-7 px-3">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent className="w-full bg-white">
                      <SelectItem value="PENDENTE">Pendente</SelectItem>
                      <SelectItem value="CONCLUIDO">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors?.status && (
                    <p className="text-red-500 text-sm">
                      {errors.status.message}
                    </p>
                  )}
                </div>

                <AlertDialogFooter className="flex justify-center items-center gap-2 w-full">
                  <AlertDialogCancel
                    className=" z-50 border text-base px-8 py-3 rounded-full mt-4 "
                    disabled={loading}
                  >
                    {loading ? (
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Cancelar'
                    )}
                  </AlertDialogCancel>
                  <Button
                    className=" z-50 text-white text-base px-8 py-6 rounded-full mt-4"
                    variant={'default'}
                    disabled={loading}
                    type="submit"
                  >
                    {loading ? (
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Criar projeto'
                    )}
                  </Button>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
}
