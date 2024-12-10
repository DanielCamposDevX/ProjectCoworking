"use client";
import { TemplateButton } from "@/components/templates/Button";
import { TFormInputs } from "@/components/templates/Form";
import { useAuth } from "@/context/AuthContext";
import { usePost } from "@/hooks/useApi";
import { loginUserFormData, loginUserFormSchema } from "@/schemas/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

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

  const { setToken, token } = useAuth();

  useEffect(() => {
    const storedToken = localStorage.getItem("PM-token");
    if (storedToken) {
      setToken(storedToken);
      router.push("/dash");
    }
  }, [token]);

  const onSubmit = (data: loginUserFormData) => {
    post({ url: "/api/auth/login", body: data })
      .then((res) => {
        setToken(res);
        router.push("/dash");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center items-center"
    >
      <TFormInputs.TextInput
        type="email"
        required
        placeholder="Email"
        register={register("email", { required: true })}
        error={errors.email?.message}
        label="Email"
      />
      <TFormInputs.TextInput
        type="password"
        required
        placeholder="Senha"
        label="Senha"
        register={register("senha", { required: true })}
        error={errors.senha?.message}
      />
      <label className="text-destructive text-sm">{error}</label>
      <div className="flex flex-col gap-2">
        <TemplateButton.Primary
          loading={loading}
          text="Login"
          className="w-[120px]"
        />
        <Link href={"/signup"}>
          <TemplateButton.Secondary
            loading={false}
            text="Criar conta"
            className="w-[120px]"
          />
        </Link>
      </div>
    </form>
  );
}
