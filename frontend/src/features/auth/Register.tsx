import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(10, "Nome precisa conter pelo menos 10 caracteres"),
    phone_number: z.string().min(15, "Número incompleto"),
    neighborhood: z.string().nonempty("Bairro é obrigatório"),
    email: z.email("Email inválido").endsWith("ifnmg.edu.br", "Email precisa ser do IFNMG"),
    password: z.string().min(6, "Senha precisa conter pelo menos 6 caracteres"),
    confirm_password: z.string().nonempty("Digite uma senha"),
  })
  .refine((data) => data.password === data.confirm_password, {
    error: "As senhas precisam ser iguais",
    path: ["confirm_password"],
  });

export default function Register() {
  const [isFirstStep, setIsFirstStep] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({ resolver: zodResolver(registerSchema), mode: "onTouched" });

  const handleNext = async () => {
    const isValid = await trigger(["name", "phone_number", "neighborhood"]);
    if (isValid) setIsFirstStep(false);
  };

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    console.log("dados válidos: ", data);
  };

  const formatPhoneNumber = (value: string) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  const { onChange, ...rest } = register("phone_number");

  return (
    <div className="w-full sm:w-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-column rounded-2xl border border-primary bg-white px-5 py-4"
      >
        <h1 className="text-center">Cadastro</h1>
        {isFirstStep ? (
          <div key="step-1" className="flex-column gap-4">
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
              <label htmlFor="phone_number">Telefone</label>
              <input
                {...rest}
                aria-invalid={errors.phone_number ? "true" : "false"}
                type="tel"
                placeholder="Digite seu telefone"
                id="phone_number"
                autoComplete="tel"
                onChange={(e) => {
                  e.target.value = formatPhoneNumber(e.target.value);
                  onChange(e);
                }}
              ></input>
              {errors.phone_number && <span>{errors.phone_number.message}</span>}
            </div>
            <div className="field">
              <label htmlFor="neighborhood">Bairro</label>
              <select
                {...register("neighborhood")}
                aria-invalid={errors.neighborhood ? "true" : "false"}
                id="neighborhood"
              >
                <option value="" disabled selected hidden>
                  Escolha seu bairro
                </option>
                <option value="Bairro 1">Bairro 1</option>
                <option value="Bairro 2">Bairro 2</option>
                <option value="Bairro 3">Bairro 3</option>
                <option value="Bairro 4">Bairro 4</option>
                <option value="Bairro 5">Bairro 5</option>
                <option value="Bairro 6">Bairro 6</option>
              </select>
              {errors.neighborhood && <span>{errors.neighborhood.message}</span>}
            </div>

            <button type="button" className="btn btn-lg mt-2.5 bg-primary" onClick={handleNext}>
              Avançar
            </button>
          </div>
        ) : (
          <div key="step-2" className="flex-column gap-4">
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
                  className="input-icon cursor-pointer"
                >
                  {passwordVisible ? <Eye className="text-primary" /> : <EyeOff className="text-neutral-dark" />}
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
                  className="input-icon cursor-pointer"
                >
                  {passwordVisible ? <Eye className="text-primary" /> : <EyeOff className="text-neutral-dark" />}
                </button>
              </div>
              {errors.confirm_password && <span>{errors.confirm_password.message}</span>}
            </div>

            <div className="mt-2.5 flex gap-3">
              <button
                type="button"
                onClick={() => setIsFirstStep(true)}
                className="btn btn-lg w-1/3 bg-neutral-light text-neutral-dark"
              >
                Voltar
              </button>
              <button type="submit" className="btn btn-lg w-2/3 bg-primary">
                Criar Conta
              </button>
            </div>
          </div>
        )}
      </form>

      <Link to={"/login"} className="btn btn-sm mt-3 text-neutral-dark">
        Já tem uma conta? <span className="text-tertiary">Faça login</span>
      </Link>
    </div>
  );
}
