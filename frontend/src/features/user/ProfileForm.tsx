import { useForm } from "react-hook-form";
import { updateProfileSchema } from "./userTypes";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@auth/authStore";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@shared/components/PageHeader";
import SubmitButton from "@shared/components/SubmitButton";
import { SuccessModal } from "@shared/components/SucessModal";
import { updateProfile } from "./userService";
import type z from "zod";
import NeighborhoodCombobox from "@shared/components/NeighborhoodCombobox";

const addressOptions = [...updateProfileSchema.shape.address.unwrap().options];

export default function ProfileForm() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [successOpen, setSuccessOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    mode: "onTouched",
    defaultValues: {
      name: user?.name,
      address: (user?.address ?? null) as z.infer<typeof updateProfileSchema>["address"],
      phoneNumber: user?.phoneNumber ?? "",
    },
  });

  const onSubmit = async (data: z.infer<typeof updateProfileSchema>) => {
    setUser(await updateProfile(data));
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    setSuccessOpen(true);
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
      <PageHeader title="Editar Perfil" />

      <form onSubmit={handleSubmit(onSubmit)} className="flex-column flex-1 gap-4">
        <section className="form-fields">
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

          <NeighborhoodCombobox
            control={control}
            name="address"
            label="Bairro"
            placeholder="Selecione seu bairro"
            options={addressOptions}
          />

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

        <SubmitButton isSubmitting={isSubmitting} text="Salvar Mudanças" />
      </form>
      <SuccessModal
        message="Perfil atualizado com sucesso!"
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false);
          navigate(-1);
        }}
      />
    </>
  );
}
