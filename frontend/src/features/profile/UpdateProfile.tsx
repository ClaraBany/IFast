import { zodResolver } from "@hookform/resolvers/zod";
import BackButton from "@shared/components/BackButton";
import { useForm } from "react-hook-form";
import z from "zod";
import { updateProfileSchema } from "./types";

export default function UpdateProfile() {
  const formatPhoneNumber = (value: string) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof updateProfileSchema>>({ resolver: zodResolver(updateProfileSchema), mode: "onTouched" });

  const { onChange, ...rest } = register("phoneNumber");

  return (
    <main className="flex-column flex-1 gap-7.5">
      <section className="flex-center w-full justify-between">
        <div className="flex-center gap-2.5">
          <BackButton />

          <h2>Perfil</h2>
        </div>
      </section>

      <section className="flex-column gap-7.5 rounded-[20px] bg-white p-4">
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
          <label htmlFor="name">Endereço</label>
          <input
            {...register("address")}
            aria-invalid={errors.address ? "true" : "false"}
            type="text"
            placeholder="Digite seu endereço"
            id="address"
          ></input>
          {errors.address && <span>{errors.address.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="phone-number">Telefone</label>
          <input type="tel" placeholder="Digite seu telefone" id="phone-number"></input>
          <label htmlFor="phoneNumber">Telefone</label>
          <input
            {...rest}
            aria-invalid={errors.phoneNumber ? "true" : "false"}
            type="tel"
            placeholder="Digite seu telefone"
            id="phoneNumber"
            autoComplete="tel"
            onChange={(e) => {
              e.target.value = formatPhoneNumber(e.target.value);
              onChange(e);
            }}
          ></input>
          {errors.phoneNumber && <span>{errors.phoneNumber.message}</span>}
        </div>
      </section>

      <button className="btn btn-lg mt-auto bg-primary">Salvar Mudanças</button>
    </main>
  );
}
