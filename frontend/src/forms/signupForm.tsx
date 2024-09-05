'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePost } from '@/hooks/useApi';
import {
  createUserFormData,
  createUserFormSchema,
} from '@/schemas/user-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });
  const router = useRouter();

  const { error, loading, post } = usePost();

  const onSubmit = async (data: createUserFormData) => {
    post({ url: '/api/auth/register', body: data })
      .then(() => {
        router.push('/');
      })
      .catch(() => {});
  };

  return (
    <form
      className="h-full w-full flex flex-col justify-center items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-3 w-10/12 max-w-[300px]">
        <label className="text-sm">Email</label>
        <Input
          type="email"
          required
          placeholder="Email"
          id="email"
          {...register('email', { required: true })}
          error={errors.email?.message}
        />
      </div>
      <div className="flex flex-col gap-3 w-10/12 max-w-[300px]">
        <label className="text-sm">Nome</label>
        <Input
          type="text"
          required
          placeholder="nome"
          id="nome"
          {...register('nome', { required: true })}
          error={errors.nome?.message}
        />
      </div>
      <div className="flex flex-col gap-3 w-10/12 max-w-[300px]">
        <label className="text-sm">Cargo / Papel</label>
        <Input
          type="text"
          required
          placeholder="papel"
          id="papel"
          {...register('papel', { required: true })}
          error={errors.papel?.message}
        />
      </div>
      <div className="flex flex-col gap-3 w-10/12 max-w-[300px]">
        <label className="text-sm">Senha</label>
        <Input
          type="password"
          required
          placeholder="Senha"
          id="pass"
          {...register('senha', { required: true })}
          error={errors.senha?.message}
        />
      </div>
      <div className="flex flex-col gap-3 w-10/12 max-w-[300px]">
        <label className="text-sm">Confirmar senha</label>
        <Input
          type="password"
          required
          placeholder="Confirmar senha"
          id="pass"
          {...register('confirmarSenha', { required: true })}
          error={errors.confirmarSenha?.message}
        />
      </div>
      <div className="flex flex-col gap-4 justify-center items-center">
        <label className="text-destructive text-sm">{error}</label>
        <Button
          className=" z-50 text-white text-base px-8 py-6 rounded-full"
          variant={'default'}
          disabled={loading}
        >
          {loading ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            'Criar conta'
          )}
        </Button>
        <Link href={'/'}>
          <Button
            className="z-50 text-base rounded-full flex lg:hidden"
            variant={'ghost'}
          >
            ou Fazer login
          </Button>
        </Link>
      </div>
    </form>
  );
}
