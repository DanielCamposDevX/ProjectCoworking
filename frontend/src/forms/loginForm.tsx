'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePost } from '@/hooks/useApi';
import { loginUserFormData, loginUserFormSchema } from '@/schemas/user-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginUserFormData>({
    resolver: zodResolver(loginUserFormSchema),
  });
  const router = useRouter();

  const { error, loading, post } = usePost();

  const onSubmit = (data: loginUserFormData) => {
    post({ url: '/api/auth/login', body: data })
      .then(() => {
        router.push('/');
      })
      .catch(() => {});
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center items-center"
    >
      <div className="flex flex-col gap-3">
        <label className="text-sm">Email</label>
        <Input
          type="email"
          required
          placeholder="Email"
          {...register('email', { required: true })}
          error={errors.email?.message}
        />
      </div>
      <div className="flex flex-col gap-3">
        <label className="text-sm">Senha</label>
        <Input
          type="password"
          required
          placeholder="Senha"
          {...register('senha', { required: true })}
          error={errors.senha?.message}
        />
      </div>
      <label className="text-destructive text-sm">{error}</label>
      <Button
        className=" z-50 text-white text-base px-8 py-6 rounded-full mt-4"
        variant={'default'}
        disabled={loading}
      >
        {loading ? (
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          'Login'
        )}
      </Button>
    </form>
  );
}
