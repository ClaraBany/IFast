import { useForm } from "react-hook-form";
import { Ripples } from "react-ripples-continued";
import { Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { loginSchema } from "./authTypes";
import { useAuthStore } from "./authStore";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { ApiError } from "@shared/api";
import { useErrorStore } from "@shared/errorStore";

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema), mode: "onTouched" });

  const login = useAuthStore((state) => state.login);
  const loginGoogle = useAuthStore((state) => state.loginGoogle);
  const setGlobalError = useErrorStore((state) => state.setGlobalError);

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      await login(data);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setError("email", { type: "manual" });
        setError("password", { message: error.message });
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setIsGoogleSubmitting(true);
    if (!credentialResponse.credential) {
      setIsGoogleSubmitting(false);
      return;
    }

    try {
      await loginGoogle(credentialResponse.credential);
    } catch (error) {
      if (error instanceof ApiError) {
        setGlobalError(error.message);
      }
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="flex-column w-full items-center gap-3 sm:w-100">
      <title>Login</title>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-column w-full gap-4 rounded-2xl border border-primary bg-white px-5 py-4"
      >
        <h1 className="text-center">Login</h1>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder="Digite seu email"
            aria-invalid={errors.email ? "true" : "false"}
            autoComplete="email"
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="password">Senha</label>
          <div className="relative">
            <input
              {...register("password")}
              id="password"
              placeholder="Digite sua senha"
              type={passwordVisible ? "text" : "password"}
              aria-invalid={errors.password ? "true" : "false"}
              className="pe-13"
            />

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

        <button type="submit" disabled={isSubmitting || isGoogleSubmitting} className="btn btn-lg mt-2.5 bg-primary">
          {(isSubmitting || isGoogleSubmitting) && <LoaderCircle className="animate-spin" />}
          Entrar
          <Ripples color="var(--ripple-light)" />
        </button>
      </form>

      <div className={isSubmitting || isGoogleSubmitting ? "pointer-events-none opacity-50" : ""}>
        <GoogleLogin
          auto_select={false}
          shape="rectangular"
          text="signin"
          onSuccess={handleGoogleSuccess}
          onError={() => setGlobalError("Não foi possível conectar com o Google. Tente novamente.")}
        />
      </div>

      <Link to={"/register"} className="btn btn-sm text-neutral-dark">
        Não tem uma conta? <span className="text-tertiary">Crie agora</span>
        <Ripples color="var(--ripple-dark)" />
      </Link>
    </div>
  );
}
