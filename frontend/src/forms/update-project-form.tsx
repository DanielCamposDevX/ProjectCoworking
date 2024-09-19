'use client';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/config/api';
import {
  updateProjectFormData,
  updateProjectFormSchema,
} from '@/schemas/project-schema';
import { projectType } from '@/types/project-type';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertDialogCancel,
  AlertDialogTrigger,
} from '@radix-ui/react-alert-dialog';
import { LoaderCircle, Pencil } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function UpdateProjectForm({
  project,
  get,
}: {
  project: projectType;
  get: () => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm<updateProjectFormData>({
    resolver: zodResolver(updateProjectFormSchema),
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      const formattedProject = {
        ...project,
        data_inicio: moment(project.data_inicio).format('YYYY-MM-DD'),
        data_fim: moment(project.data_fim).format('YYYY-MM-DD'),
      };
      reset(formattedProject as unknown as updateProjectFormData);
    }
  }, [project]);

  const onSubmit = (data: updateProjectFormData) => {
    setLoading(true);
    data.data_inicio = moment(data.data_inicio).add(1, 'day').toDate();
    const dataFim = data.data_fim ? new Date(data.data_fim) : undefined;
    if (dataFim instanceof Date && isNaN(dataFim.getTime())) {
      delete data.data_fim;
    }
    api
      .put(`/api/projetos/${project.id}`, data)
      .then(() => {
        toast.success('Projeto atualizado com sucesso');
        get();
        setLoading(false);
      })
      .catch(err => {
        toast.error(err.response.data);
        setLoading(false);
      });
  };

  const status = useWatch({ name: 'status', control });

  return (
    <AlertDialog>
      <AlertDialogTrigger onClick={e => e.stopPropagation()}>
        <Button variant={'ghost'} className="p-2 rounded-full">
          <Pencil className="h-5 w-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        className="sm:max-w-[425px] bg-white p-10"
        onClick={e => e.stopPropagation()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Editar Projeto</AlertDialogTitle>
          <AlertDialogDescription>
            Preencha os detalhes do projeto abaixo.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <label className="block text-sm font-medium text-gray-700">
              Data de Início
            </label>
            <Input
              type="date"
              {...register('data_inicio')}
              error={errors?.data_inicio?.message}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data de Fim
            </label>
            <Input
              type="date"
              {...register('data_fim')}
              error={errors?.data_fim?.message}
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
              value={status}
              aria-invalid={errors.status ? 'true' : 'false'}
              required
              onValueChange={value => setValue('status', value)}
            >
              <SelectTrigger className="w-full border rounded-full py-7 px-3">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="w-full bg-white">
                <SelectItem value="PENDENTE">Pendente</SelectItem>
                <SelectItem value="EM_ANDAMENTO">Em andamento</SelectItem>
                <SelectItem value="CONCLUIDO">Concluído</SelectItem>
              </SelectContent>
            </Select>
            {errors?.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>

          <AlertDialogFooter className="flex justify-center items-center gap-2 w-full">
            <AlertDialogCancel
              onClick={e => e.stopPropagation()}
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
              onClick={e => e.stopPropagation()}
              className=" z-50 text-white text-base px-8 py-6 rounded-full mt-4"
              variant={'default'}
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Editar projeto'
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
