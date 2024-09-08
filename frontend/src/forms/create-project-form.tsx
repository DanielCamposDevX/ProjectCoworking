'use client';
import {
  AlertDialog,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePost } from '@/hooks/useApi';
import {
  createProjectFormData,
  createProjectFormSchema,
} from '@/schemas/project-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import { LoaderCircle, PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function CreateProjectForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<createProjectFormData>({
    resolver: zodResolver(createProjectFormSchema),
  });

  const { loading, post } = usePost();

  const onSubmit = (data: createProjectFormData) => {
    post({ url: '/api/projetos', body: data }).then(() => {
      toast.success('Projeto criado com sucesso');
      window.location.reload();
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="gap-2">
          Criar novo projeto <PlusCircle className="h-5 w-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px] bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Criar Novo Projeto</AlertDialogTitle>
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
            <label
              htmlFor="dataInicio"
              className="block text-sm font-medium text-gray-700"
            >
              Data de Início
            </label>
            <Input
              id="dataInicio"
              type="date"
              {...register('data_inicio')}
              error={errors?.data_inicio?.message}
              required
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
              onValueChange={value => setValue('status', value)} // Atualiza o valor no React Hook Form
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
  );
}
