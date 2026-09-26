import { vehicleSchema } from "./VehicleTypes";
import { create, get, update } from "./VehicleService";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Ripples } from "react-ripples-continued";
import { useState, useEffect } from "react";
import { SuccessModal } from "@/shared/components/SucessModal";
import { ArrowLeft, LoaderCircle, Plus, Minus } from "lucide-react";
import { Link, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";

export default function VehicleForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [successOpen, setSuccessOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vehicleSchema),
    mode: "onTouched",
    defaultValues: { capacity: 4 },
  });

  const { data: vehicle, isLoading: isLoadingVehicle } = useQuery({
    queryKey: ["vehicles", id],
    queryFn: () => get(Number(id)),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (vehicle) {
      reset(vehicle);
    }
  }, [vehicle, reset]);

  const { mutate: saveVehicle, isPending: isSubmitting } = useMutation({
    mutationFn: (data: z.infer<typeof vehicleSchema>) => (isEditMode ? update(Number(id), data) : create(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      setSuccessOpen(true);
    },
  });

  const onSubmit = (data: z.infer<typeof vehicleSchema>) => saveVehicle(data);

  if (isEditMode && isLoadingVehicle) {
    return (
      <div className="flex-center flex-1">
        <LoaderCircle className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="flex-column w-full items-center justify-center gap-3">
      <title>Veículos</title>
      <div className="flex-center flex gap-2.5 self-start">
        <Link to={"/vehicles"}>
          <ArrowLeft />
        </Link>

        <h2>{isEditMode ? "Editar veículo" : "Cadastrar veículo"}</h2>
      </div>

      <form className="flex-center w-full flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid w-full grid-cols-1 gap-4 rounded-2xl bg-white px-5 py-4 md:grid-cols-2">
          <div className="field">
            <label htmlFor="model">Modelo</label>
            <input
              {...register("model")}
              aria-invalid={errors.model ? "true" : "false"}
              type="text"
              placeholder="Digite o modelo do carro"
              id="model"
            ></input>
            {errors.model && <span>{errors.model.message}</span>}
          </div>

          <div className="field">
            <label htmlFor="color">Cor</label>
            <input
              {...register("color")}
              aria-invalid={errors.color ? "true" : "false"}
              type="text"
              placeholder="Digite a cor do veículo"
              id="color"
            ></input>
            {errors.color && <span>{errors.color.message}</span>}
          </div>

          <div className="field">
            <label htmlFor="plate">
              Placa <span>(Opcional)</span>
            </label>
            <input
              {...register("plate")}
              aria-invalid={errors.plate ? "true" : "false"}
              type="text"
              placeholder="Digite a placa"
              id="plate"
              maxLength={7}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
              }}
            ></input>
            {errors.plate && <span>{errors.plate.message}</span>}
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
                    className="btn h-full text-danger"
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
                    onClick={() => field.onChange((field.value ?? 1) + 1)}
                    className="btn h-full text-primary"
                  >
                    <Plus size={18} />
                    <Ripples color="var(--ripple-dark)" />
                  </button>
                </div>
              )}
            />

            {errors.capacity && <span>{errors.capacity.message}</span>}
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-lg mt-auto bg-primary md:max-w-92.5 md:self-end"
        >
          {isSubmitting && <LoaderCircle className="animate-spin" />}
          {isEditMode ? "Salvar Veículo" : "Cadastrar Veículo"}
          <Ripples color="var(--ripple-light)" />
        </button>
      </form>
      <SuccessModal
        message={isEditMode ? "Veículo atualizado com sucesso!" : "Veículo cadastrado com sucesso!"}
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false);
          navigate("/vehicles");
        }}
      />
    </div>
  );
}
