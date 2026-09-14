import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { Ripples } from "react-ripples-continued";
import { registerSchema } from "./authTypes";
import { useAuthStore } from "./authStore";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

export default function Register() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof registerSchema>>({ resolver: zodResolver(registerSchema), mode: "onTouched" });

  const handleRegister = useAuthStore((state) => state.register);
  const loginGoogle = useAuthStore((state) => state.loginGoogle);

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      await handleRegister(data);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Erro inesperado");
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setIsGoogleSubmitting(true);
    if (!credentialResponse.credential) {
      setIsGoogleSubmitting(false);
      return
    }

    try {
      await loginGoogle(credentialResponse.credential);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="w-full sm:w-100 flex-column items-center gap-3">
      <title>Cadastro</title>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-column w-full gap-4 rounded-2xl border border-primary bg-white px-5 py-4"
      >
        <h1 className="text-center">Cadastro</h1>

        <div className="field">
          <label htmlFor="name">Nome</label>
          <input
            {...register("name")}
            aria-invalid={errors.name ? "true" : "false"}
            type="text"
            placeholder="Digite seu nome"
            id="name"
            autoComplete="name"
          ></input>
          {errors.name && <span>{errors.name.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            {...register("email")}
            aria-invalid={errors.email ? "true" : "false"}
            type="email"
            placeholder="Digite seu email"
            id="email"
            autoComplete="email"
          ></input>
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="password">Senha</label>
          <div className="relative">
            <input
              {...register("password")}
              aria-invalid={errors.password ? "true" : "false"}
              type={passwordVisible ? "text" : "password"}
              placeholder="Digite sua senha"
              id="password"
              className="pe-13"
              autoComplete="new-password"
            ></input>

            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="input-icon cursor-pointer transition-colors hover:bg-black/10"
            >
              {passwordVisible ? <Eye className="text-primary" /> : <EyeOff className="text-neutral-dark" />}
              <Ripples color="var(--ripple-dark)" />
            </button>
          </div>
          {errors.password && <span>{errors.password.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="confirm-password">Confirmar Senha</label>
          <div className="relative">
            <input
              {...register("confirm_password")}
              aria-invalid={errors.confirm_password ? "true" : "false"}
              type={passwordVisible ? "text" : "password"}
              placeholder="Confirme sua senha"
              id="confirm-password"
              className="pe-13"
              autoComplete="new-password"
            ></input>

            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="input-icon cursor-pointer transition-colors hover:bg-black/10"
            >
              {passwordVisible ? <Eye className="text-primary" /> : <EyeOff className="text-neutral-dark" />}
              <Ripples color="var(--ripple-dark)" />
            </button>
          </div>
          {errors.confirm_password && <span>{errors.confirm_password.message}</span>}
        </div>

        <button type="submit" disabled={isSubmitting || isGoogleSubmitting} className="btn btn-lg mt-2.5 bg-primary">
          {(isSubmitting || isGoogleSubmitting) && <LoaderCircle className="animate-spin" />}
          Criar Conta
          <Ripples color="var(--ripple-light)" />
        </button>
      </form>

      <div className={isSubmitting || isGoogleSubmitting ? "pointer-events-none opacity-50" : ""}>
        <GoogleLogin type="icon" auto_select={false} shape="circle" onSuccess={handleGoogleSuccess}
          onError={() => {alert('Login Failed');}}
        />
      </div>

      <Link to={"/login"} className="btn btn-sm text-neutral-dark">
        Já tem uma conta? <span className="text-tertiary">Faça login</span>
        <Ripples color="var(--ripple-dark)" />
      </Link>
    </div>
  );
}
