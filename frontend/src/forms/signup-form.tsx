"use client";
import { FormBase } from "@/components/base/Form";
import { TemplateButton } from "@/components/templates/Button";
import { TFormInputs } from "@/components/templates/Form";

import { Button } from "@/components/ui/button";
import { usePost } from "@/hooks/useApi";
import {
  createUserFormData,
  createUserFormSchema,
} from "@/schemas/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

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
    post({ url: "/api/auth/register", body: data })
      .then(() => {
        router.push("/");
      })
      .catch(() => {});
  };

  return (
    <form
      className="lg:h-full w-full flex flex-col gap-2 justify-start items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TFormInputs.TextInput
        label="Email"
        type="email"
        required
        placeholder="Email"
        id="email"
        register={register("email", { required: true })}
        error={errors.email?.message}
      />
      <TFormInputs.TextInput
        label="Nome"
        type="text"
        required
        placeholder="nome"
        id="nome"
        register={register("nome", { required: true })}
        error={errors.nome?.message}
      />
      <TFormInputs.TextInput
        label="Cargo / Papel"
        type="text"
        required
        placeholder="papel"
        id="papel"
        register={register("papel", { required: true })}
        error={errors.papel?.message}
      />

      <TFormInputs.TextInput
        label="Senha"
        type="password"
        required
        placeholder="Senha"
        id="pass"
        register={register("senha", { required: true })}
        error={errors.senha?.message}
      />
      <TFormInputs.TextInput
        label="Confirmar senha"
        type="password"
        required
        placeholder="Confirmar senha"
        id="confirmpass"
        register={register("confirmarSenha", { required: true })}
        error={errors.confirmarSenha?.message}
      />
      <div className="flex flex-col gap-4 justify-center items-center">
        <FormBase.Error>{error}</FormBase.Error>
        <TemplateButton.Primary loading={loading} text={"Criar conta"} />

        <Link href={"/"}>
          <Button
            className="z-50 text-base rounded-full flex lg:hidden"
            variant={"ghost"}
          >
            ou Fazer login
          </Button>
        </Link>
      </div>
    </form>
  );
}
