import { useForm } from "react-hook-form";
import { Ripples } from "react-ripples-continued";
import { Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.email("Email inválido").endsWith("ifnmg.edu.br", "Email precisa ser do IFNMG"),
  password: z.string().nonempty("Digite a senha "),
});

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema), mode: "onTouched" });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    console.log("dados válidos: ", data);
  };

  return (
    <div className="w-full sm:w-100">
      <title>Login</title>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-column gap-4 rounded-2xl border border-primary bg-white px-5 py-4"
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

        <button type="submit" className="btn btn-lg mt-2.5 bg-primary">
          Entrar
          <Ripples color="var(--ripple-light)" />
        </button>
      </form>

      <Link to={"/register"} className="btn btn-sm mt-3 text-neutral-dark">
        Não tem uma conta? <span className="text-tertiary">Crie agora</span>
        <Ripples color="var(--ripple-dark)" />
      </Link>
    </div>
  );
}
