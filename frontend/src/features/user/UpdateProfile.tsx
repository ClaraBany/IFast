import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { updateProfileSchema } from "./userTypes";
import { updateProfile } from "./userService";
import { LoaderCircle } from "lucide-react";
import { useAuthStore } from "@auth/authStore";
import { useNavigate } from "react-router";
import { PageHeader } from "@shared/components/PageHeader";

export default function UpdateProfile() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    mode: "onTouched",
    defaultValues: {
      name: user?.name,
      address: user?.address ?? "",
      phoneNumber: user?.phoneNumber ?? "",
    },
  });

  const onSubmit = async (data: z.infer<typeof updateProfileSchema>) => {
    setUser(await updateProfile(data));
    navigate(-1);
  };

  const formatPhoneNumber = (value: string) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  const { onChange, ...rest } = register("phoneNumber");

  return (
    <>
      <title>Editar Perfil</title>
      <PageHeader title="Editar Pefil" />

      <form onSubmit={handleSubmit(onSubmit)} className="flex-column flex-1 gap-7.5">
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
            <label htmlFor="address">Endereço</label>
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

        <button disabled={isSubmitting} type="submit" className="btn btn-lg mt-auto bg-primary">
          {isSubmitting && <LoaderCircle className="animate-spin" />}
          Salvar Mudanças
        </button>
      </form>
    </>
  );
}
