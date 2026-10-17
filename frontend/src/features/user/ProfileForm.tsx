import { Controller, useForm } from "react-hook-form";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { NeighborhoodsTest, neighborhoodsTestLabels, updateProfileSchema } from "./userTypes";
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

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const addressOptions = [...updateProfileSchema.shape.address.unwrap().options].sort((a, b) =>
  neighborhoodsTestLabels[a].localeCompare(neighborhoodsTestLabels[b], "pt-BR"),
);

export default function ProfileForm() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [successOpen, setSuccessOpen] = useState(false);
  const [query, setQuery] = useState("");

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

  const filteredOptions =
    query === ""
      ? addressOptions
      : addressOptions.filter((key) => normalize(neighborhoodsTestLabels[key]).includes(normalize(query)));

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

          <div className="field">
            <label htmlFor="address">Bairro</label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <Combobox
                  value={field.value}
                  immediate
                  onChange={(value) => field.onChange(value)}
                  onClose={() => setQuery("")}
                >
                  <div className="relative">
                    <ComboboxInput
                      id="address"
                      ref={field.ref}
                      aria-invalid={errors.address ? "true" : "false"}
                      autoComplete="off"
                      placeholder="Selecione seu bairro"
                      className="pr-12!"
                      displayValue={(key: NeighborhoodsTest | null) => (key ? neighborhoodsTestLabels[key] : "")}
                      onChange={(event) => {
                        setQuery(event.target.value);
                        if (event.target.value === "") field.onChange(null);
                      }}
                      onBlur={field.onBlur}
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-3.5">
                      <ChevronDown className="text-neutral-dark" size={20} />
                    </ComboboxButton>
                  </div>

                  <ComboboxOptions
                    anchor="bottom"
                    transition
                    className="w-(--input-width) rounded-xl border border-gray-200 bg-white p-1 shadow-lg transition duration-100 ease-in [--anchor-gap:--spacing(1)] empty:invisible data-leave:data-closed:opacity-0"
                  >
                    {filteredOptions.length === 0 ? (
                      <div className="px-3 py-1.5 text-neutral-dark select-none">Nenhum bairro encontrado</div>
                    ) : (
                      filteredOptions.map((key) => (
                        <ComboboxOption
                          key={key}
                          value={key}
                          className="group flex items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-primary-selected/25"
                        >
                          <Check className="invisible size-4 text-primary group-data-selected:visible" />
                          {neighborhoodsTestLabels[key]}
                        </ComboboxOption>
                      ))
                    )}
                  </ComboboxOptions>
                </Combobox>
              )}
            />
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
