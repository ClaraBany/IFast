import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import type z from "zod";
import { LoaderCircle } from "lucide-react";
import { create, get, update } from "./requestService";
import { requestSchema } from "./requestTypes";
import { useAuthStore } from "@auth/authStore";
import { getCounterpart, Neighborhoods } from "@shared/types/neighborhoods";
import { getMaxDate, getMinDate } from "@shared/utils/dateLimits";
import RetryError from "@shared/components/RetryError";
import { PageHeader } from "@shared/components/navigation/PageHeader";
import NeighborhoodCombobox from "@shared/components/form/NeighborhoodCombobox";
import SubmitButton from "@shared/components/form/SubmitButton";
import { SuccessModal } from "@shared/components/modals/SucessModal";

export default function RequestForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [successOpen, setSuccessOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userAddress = useAuthStore((state) => state.user?.address);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    mode: "onTouched",
    defaultValues: {
      origin: userAddress,
      destination: Neighborhoods.IFNMG,
      date: getMinDate(),
      startTime: "",
      endTime: "",
    },
  });

  const {
    data: request,
    isLoading: isLoadingRequest,
    isError: isRequestError,
    isFetching: isFetchingRequest,
    refetch,
  } = useQuery({
    queryKey: ["ride-requests", id],
    queryFn: () => get(Number(id)),
    enabled: isEdit,
  });

  useEffect(() => {
    if (!request) return;
    const [date, startTime] = request.desiredDepartureStart.split("T");
    const [, endTime] = request.desiredDepartureEnd.split("T");
    reset({
      origin: request.origin,
      destination: request.destination,
      date,
      startTime: startTime.slice(0, 5),
      endTime: endTime.slice(0, 5),
    });
  }, [request, reset]);

  const {
    mutate: saveRequest,
    isPending,
    data: responseId,
  } = useMutation({
    mutationFn: (data: z.infer<typeof requestSchema>) => (isEdit ? update(Number(id), data) : create(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ride-requests"] });
      setSuccessOpen(true);
    },
  });

  const syncCounterpart = (other: "origin" | "destination") => (value: Neighborhoods | null) => {
    if (!value) return;
    const counterpart = getCounterpart(value, userAddress);
    if (counterpart) setValue(other, counterpart, { shouldValidate: true });
  };

  if (isEdit && isLoadingRequest) {
    return (
      <div className="flex-center flex-1">
        <LoaderCircle className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (isEdit && isRequestError) {
    return (
      <RetryError onRetry={refetch} isFetching={isFetchingRequest} message="Não foi possível carregar o pedido." />
    );
  }

  return (
    <>
      <title>{isEdit ? "Editar pedido" : "Criar pedido"}</title>
      <PageHeader title={isEdit ? "Editar Pedido" : "Criar Pedido"} />

      <form className="flex-column flex-1 gap-4" onSubmit={handleSubmit((data) => saveRequest(data))}>
        <section className="form-fields">
          <NeighborhoodCombobox
            control={control}
            name="origin"
            label="Origem"
            placeholder="Escolha a origem"
            onValueChange={syncCounterpart("destination")}
          />

          <NeighborhoodCombobox
            control={control}
            name="destination"
            label="Destino"
            placeholder="Escolha o destino"
            onValueChange={syncCounterpart("origin")}
          />

          <div className="field">
            <label htmlFor="request-date">Data</label>
            <input
              {...register("date")}
              id="request-date"
              type="date"
              min={getMinDate()}
              max={getMaxDate()}
              aria-invalid={errors.date ? "true" : "false"}
            />
            {errors.date && <span>{errors.date.message}</span>}
          </div>

          <div className="field md:col-span-2">
            <label>Horário Desejado</label>
            <div className="flex items-start gap-3">
              <div className="field w-full">
                <input
                  {...register("startTime")}
                  id="start-time"
                  type="time"
                  aria-label="Horário inicial desejado"
                  aria-invalid={errors.startTime ? "true" : "false"}
                />
                {errors.startTime && <span>{errors.startTime.message}</span>}
              </div>
              <span className="mt-3 shrink-0">Até as</span>
              <div className="field w-full">
                <input
                  {...register("endTime")}
                  id="end-time"
                  type="time"
                  aria-label="Horário final desejado"
                  aria-invalid={errors.endTime ? "true" : "false"}
                />
                {errors.endTime && <span>{errors.endTime.message}</span>}
              </div>
            </div>
          </div>
        </section>

        <SubmitButton isSubmitting={isPending} text={isEdit ? "Salvar Alterações" : "Criar Pedido"} />
      </form>

      <SuccessModal
        message={isEdit ? "Pedido atualizado com sucesso!" : "Pedido criado com sucesso!"}
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false);
          navigate(`/requests/${responseId?.id ?? id}`);
        }}
      />
    </>
  );
}
