import { vehicleSchema } from "./VehicleTypes";
import { create, get, update } from "./VehicleService";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { Ripples } from "react-ripples-continued";
import { ApiError } from "@/shared/api";
import { useState, useEffect } from "react";
import { SuccessModal } from "@/shared/components/SucessModal";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export default function VehicleForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [successOpen, setSuccessOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(vehicleSchema), mode: "onTouched" });

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
    mutationFn: (data: z.infer<typeof vehicleSchema>) =>
      isEditMode ? update(Number(id), data) : create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      setSuccessOpen(true);
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        // tratar erro (toast, etc)
      }
    },
  });

  const onSubmit = (data: z.infer<typeof vehicleSchema>) => saveVehicle(data);

  if (isEditMode && isLoadingVehicle) {
    return (
      <div className="flex-center min-h-dvh">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-column w-full items-center justify-center gap-3 sm:w-100">
      <div className="flex-center flex gap-2.5 self-start">
        <Link to={"/vehicles"}>
          <ArrowLeft />
        </Link>

        <h2>{isEditMode ? "Editar veículo" : "Cadastrar veículo"}</h2>
      </div>

      <form className="flex-column w-full gap-4 rounded-2xl bg-white px-5 py-4" onSubmit={handleSubmit(onSubmit)}>
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
          <label htmlFor="plate">Placa</label>
          <input
            {...register("plate")}
            aria-invalid={errors.plate ? "true" : "false"}
            type="text"
            placeholder="Digite a placa (opcional)"
            id="plate"
          ></input>
          {errors.plate && <span>{errors.plate.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="capacity">Capacidade</label>
          <input
            {...register("capacity")}
            aria-invalid={errors.capacity ? "true" : "false"}
            type="number"
            placeholder="Digite a capacidade (opcional)"
            id="capacity"
          ></input>
          {errors.capacity && <span>{errors.capacity.message}</span>}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn btn-lg mt-2.5 bg-primary">
          {isSubmitting && <LoaderCircle className="animate-spin" />}
          {isEditMode ? "Salvar" : "Cadastrar"}
          <Ripples color="var(--ripple-light)" />
        </button>
      </form>
      <SuccessModal
       message={isEditMode ? "Veículo atualizado com sucesso!" : "Veículo cadastrado com sucesso!"}
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
      />
    </div>
  );
}
