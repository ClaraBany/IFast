import { PageHeader } from "@shared/components/PageHeader";
import SubmitButton from "@shared/components/SubmitButton";
import { CirclePlus, LoaderCircle, Minus, Plus } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import * as Switch from "@radix-ui/react-switch";
import { Controller, useForm, useWatch } from "react-hook-form";
import { getCounterpart, Neighborhoods } from "@user/userTypes";
import { SuccessModal } from "@shared/components/SucessModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getMaxDate, getMinDate, offerSchema } from "./offerTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { create, get, update } from "./offerService";
import type z from "zod";
import { Ripples } from "react-ripples-continued";
import { getAll as getVehicles } from "@vehicle/vehicleService";
import { useAuthStore } from "@auth/authStore";

export default function OfferForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [successOpen, setSuccessOpen] = useState(false);
  const hasAutoSelectedVehicle = useRef(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userAddress = useAuthStore((s) => s.user?.address);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(offerSchema),
    mode: "onTouched",
    shouldUnregister: true,
    defaultValues: {
      origin: userAddress ?? "",
      destination: Neighborhoods.IFNMG,
      isRoundTrip: false,
      date: getMinDate(),
      capacity: 1,
    },
  });

  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });

  const vehicleId = useWatch({ control, name: "vehicleId" });
  const selectedVehicle = vehicles.find((v) => String(v.id) === String(vehicleId));

  useEffect(() => {
    if (!isEdit && vehicles.length === 1 && !vehicleId && !hasAutoSelectedVehicle.current) {
      setValue("vehicleId", String(vehicles[0].id));
      hasAutoSelectedVehicle.current = true;
    }
  }, [isEdit, setValue, vehicleId, vehicles]);

  useEffect(() => {
    if (selectedVehicle) {
      setValue("model", selectedVehicle.model, { shouldValidate: true });
      setValue("color", selectedVehicle.color, { shouldValidate: true });
      setValue("capacity", selectedVehicle.capacity, { shouldValidate: true });
    }
  }, [selectedVehicle, setValue]);

  const isRoundTrip = useWatch({
    control,
    name: "isRoundTrip",
    defaultValue: false,
  });

  const { data: offer, isLoading: isLoadingOffer } = useQuery({
    queryKey: ["offers", id],
    queryFn: () => get(Number(id)),
    enabled: isEdit,
  });

  useEffect(() => {
    if (offer) {
      reset(offer);
    }
  }, [offer, reset]);

  const { mutate: saveOffer, isPending: isSubmitting } = useMutation({
    mutationFn: (data: z.infer<typeof offerSchema>) => (isEdit ? update(Number(id), data) : create(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      setSuccessOpen(true);
    },
  });

  const onSubmit = (data: z.infer<typeof offerSchema>) => saveOffer(data);

  const syncCounterpart = (other: "origin" | "destination") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const counterpart = getCounterpart(e.target.value, userAddress);
    if (counterpart === null) return;

    setValue(other, counterpart, { shouldValidate: !!errors[other] });
  };

  if ((isEdit && isLoadingOffer) || isLoadingVehicles) {
    return (
      <div className="flex-center flex-1">
        <LoaderCircle className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <>
      <title>{isEdit ? "Editar Oferta" : "Criar Oferta"}</title>
      <PageHeader title={isEdit ? "Editar Oferta" : "Criar Oferta"} />

      <form className="flex-column flex-1 gap-4" onSubmit={handleSubmit(onSubmit)}>
        <section className="form-fields">
          <div className="field">
            <label htmlFor="origin">Origem</label>
            <input
              {...register("origin", { onChange: syncCounterpart("destination") })}
              aria-invalid={errors.origin ? "true" : "false"}
              id="origin"
              type="text"
              list="neighborhood-list"
              autoComplete="off"
              placeholder="Escolha a origem da carona"
            />
            <datalist id="neighborhood-list">
              {Object.values(Neighborhoods).map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
            {errors.origin && <span>{errors.origin.message}</span>}
          </div>

          <div className="field">
            <label htmlFor="destination">Destino</label>
            <input
              {...register("destination", { onChange: syncCounterpart("origin") })}
              aria-invalid={errors.destination ? "true" : "false"}
              id="destination"
              type="text"
              list="neighborhood-list"
              autoComplete="off"
              placeholder="Escolha o destino da carona"
            />
            {errors.destination && <span>{errors.destination.message}</span>}
          </div>

          {!isEdit && (
            <Controller
              name="isRoundTrip"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2.5 md:col-span-2">
                  <Switch.Root
                    id="roundTrip"
                    className="switch-root"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  >
                    <Switch.Thumb className="switch-thumb" />
                  </Switch.Root>
                  <label htmlFor="roundTrip">Viagem de Ida e Volta</label>
                </div>
              )}
            />
          )}

          <div className="field">
            <label htmlFor="date">Data</label>
            <input
              {...register("date")}
              aria-invalid={errors.date ? "true" : "false"}
              type="date"
              id="date"
              min={getMinDate()}
              max={getMaxDate()}
            ></input>
            {errors.date && <span>{errors.date.message}</span>}
          </div>

          <div className="flex gap-4">
            <div className="field w-full">
              <label htmlFor="departureTime">Horário de Ida</label>
              <input
                {...register("departureTime")}
                aria-invalid={errors.departureTime ? "true" : "false"}
                type="time"
                id="departureTime"
              ></input>
              {errors.departureTime && <span>{errors.departureTime.message}</span>}
            </div>
            {isRoundTrip && (
              <div className="field w-full">
                <label htmlFor="returnTime">Horário de Volta</label>
                <input
                  {...register("returnTime")}
                  aria-invalid={errors.returnTime ? "true" : "false"}
                  type="time"
                  id="returnTime"
                ></input>
                {errors.returnTime && <span>{errors.returnTime.message}</span>}
              </div>
            )}
          </div>

          <div className="flex-column gap-2.5 md:col-span-2">
            <div className="field">
              <label htmlFor="vehicleId">Veículo</label>
              {vehicles.length === 0 ? (
                <Link to={"/vehicles/create"} className="btn btn-lg bg-neutral-light text-slate-900">
                  <CirclePlus />
                  Cadastrar Veículo
                </Link>
              ) : (
                <>
                  <select {...register("vehicleId")} aria-invalid={errors.vehicleId ? "true" : "false"} id="vehicleId">
                    <option value="">Escolha um veículo</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.model}, {v.color}
                      </option>
                    ))}
                  </select>
                  {errors.vehicleId && <span>{errors.vehicleId.message}</span>}
                </>
              )}
            </div>

            <div className="flex-center gap-2.5">
              <div className="h-px w-full bg-neutral-dark" />
              <p className="text-neutral-dark">ou</p>
              <div className="h-px w-full bg-neutral-dark" />
            </div>

            <div className="flex gap-4">
              <div className="field w-2/3 md:w-full">
                <label htmlFor="model">Modelo</label>
                <input
                  {...register("model")}
                  readOnly={!!selectedVehicle}
                  className="read-only:cursor-not-allowed read-only:opacity-60"
                  aria-invalid={errors.model ? "true" : "false"}
                  type="text"
                  placeholder="Digite o modelo do veículo"
                  id="model"
                ></input>
                {errors.model && <span>{errors.model.message}</span>}
              </div>

              <div className="field w-1/3 md:w-full">
                <label htmlFor="color">Cor</label>
                <input
                  {...register("color")}
                  readOnly={!!selectedVehicle}
                  className="read-only:cursor-not-allowed read-only:opacity-60"
                  aria-invalid={errors.color ? "true" : "false"}
                  type="text"
                  placeholder="Digite a cor do veículo"
                  id="color"
                ></input>
                {errors.color && <span>{errors.color.message}</span>}
              </div>
            </div>
          </div>

          <div className="field">
            <label htmlFor="capacity">Capacidade</label>

            <Controller
              name="capacity"
              control={control}
              render={({ field }) => (
                <div className="flex-center min-h-12.5 w-full rounded-[10px] bg-neutral-light">
                  <button
                    type="button"
                    onClick={() => field.onChange(Math.max((field.value ?? 1) - 1, 1))}
                    aria-label="Diminuir capacidade"
                    className="btn h-full rounded-e-none text-danger"
                  >
                    <Minus size={18} />
                    <Ripples color="var(--ripple-dark)" />
                  </button>

                  <div className="flex w-full justify-between">
                    <div className="h-5 w-px bg-danger" />
                    <p>{field.value}</p>
                    <div className="h-5 w-px bg-primary" />
                  </div>

                  <button
                    type="button"
                    onClick={() => field.onChange(Math.min((field.value ?? 1) + 1, 4))}
                    aria-label="Aumentar capacidade"
                    className="btn h-full rounded-s-none text-primary"
                  >
                    <Plus size={18} />
                    <Ripples color="var(--ripple-dark)" />
                  </button>
                </div>
              )}
            />
            {errors.capacity && <span>{errors.capacity.message}</span>}
          </div>

          <div className="field md:col-span-2">
            <label htmlFor="description">
              Descrição <span className="text-neutral-dark">(Opcional)</span>
            </label>
            <textarea
              {...register("description")}
              aria-invalid={errors.description ? "true" : "false"}
              placeholder="Descreva aqui os pontos de encontro, regras e outras informações que deseja mostrar aos passageiros"
              id="description"
            />
            {errors.description && <span>{errors.description.message}</span>}
          </div>
        </section>

        <SubmitButton isSubmitting={isSubmitting} text={isEdit ? "Salvar Oferta" : "Criar Oferta"} />
      </form>
      <SuccessModal
        message={isEdit ? "Oferta atualizada com sucesso!" : "Oferta criada com sucesso!"}
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false);
          navigate("/offers");
        }}
      />
    </>
  );
}
