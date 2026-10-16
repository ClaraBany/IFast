import { Drawer } from "vaul";
import { getNeighborhoodKey, getNeighborhoodLabel, Neighborhoods } from "@user/userTypes";
import { filterSchema, getMaxDate, getMinDate } from "@ride-offer/offerTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import { useSearchParams } from "react-router";

interface FilterMenuProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FilterMenu({ open, setOpen }: FilterMenuProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      period: (searchParams.get("period") as z.infer<typeof filterSchema>["period"]) || undefined,
      date: searchParams.get("date") || undefined,
      origin: getNeighborhoodLabel(searchParams.get("origin")) || undefined,
      destination: getNeighborhoodLabel(searchParams.get("destination")) || undefined,
    },
    mode: "onTouched",
  });

  const onSubmit = (data: z.infer<typeof filterSchema>) => {
    const newParams = new URLSearchParams();

    if (data.period) newParams.set("period", data.period);
    if (data.date) newParams.set("date", data.date);
    if (data.origin) newParams.set("origin", getNeighborhoodKey(data.origin)!);
    if (data.destination) newParams.set("destination", getNeighborhoodKey(data.destination)!);

    setSearchParams(newParams);
    setOpen(false);
  };

  const onClear = () => {
    reset({ period: null, date: "", origin: "", destination: "" });
    setSearchParams(new URLSearchParams());
    setOpen(false);
  };

  const handleUnmarkPeriod = (e: React.MouseEvent<HTMLInputElement>) => {
    const clickedValue = e.currentTarget.value as z.infer<typeof filterSchema>["period"];

    if (getValues("period") === clickedValue) {
      setValue("period", undefined);
    }
  };

  return (
    <Drawer.Root direction="bottom" open={open} onOpenChange={setOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-20 bg-black/40 backdrop-blur-[1.5px]" />
        <Drawer.Content className="fixed right-0 bottom-0 left-0 z-20 flex rounded-t-2xl bg-white">
          <form className="form-fields container mx-auto px-5 2xl:px-30" onSubmit={handleSubmit(onSubmit)}>
            <div className="h-2 w-20 justify-self-center rounded-[20px] bg-gray-300 md:col-span-2" />

            <h2 className="md:col-span-2">Filtros</h2>

            <div className="field">
              <label>Período</label>

              <div className="flex gap-3">
                <label className="btn btn-lg cursor-pointer bg-neutral-light transition-all has-checked:bg-primary-selected has-checked:box-shadow">
                  <input
                    type="radio"
                    value="MORNING"
                    className="sr-only"
                    {...register("period")}
                    onClick={handleUnmarkPeriod}
                  />
                  <span className="text-slate-900">Manhã</span>
                </label>

                <label className="btn btn-lg cursor-pointer bg-neutral-light transition-all has-checked:bg-primary-selected has-checked:box-shadow">
                  <input
                    type="radio"
                    value="AFTERNOON"
                    className="sr-only"
                    {...register("period")}
                    onClick={handleUnmarkPeriod}
                  />
                  <span className="text-slate-900">Tarde</span>
                </label>

                <label className="btn btn-lg cursor-pointer bg-neutral-light transition-all has-checked:bg-primary-selected has-checked:box-shadow">
                  <input
                    type="radio"
                    value="EVENING"
                    className="sr-only"
                    {...register("period")}
                    onClick={handleUnmarkPeriod}
                  />
                  <span className="text-slate-900">Noite</span>
                </label>
              </div>
              {errors.period && <span>{errors.period.message}</span>}
            </div>

            <div className="field">
              <label htmlFor="date">Data</label>
              <input
                {...register("date")}
                aria-invalid={errors.date ? "true" : "false"}
                type="date"
                id="date"
                min={getMinDate()}
                max={getMaxDate()}
              />
              {errors.date && <span>{errors.date.message}</span>}
            </div>

            <div className="field">
              <label htmlFor="origin">Origem</label>
              <input
                {...register("origin")}
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
                {...register("destination")}
                aria-invalid={errors.destination ? "true" : "false"}
                id="destination"
                type="text"
                list="neighborhood-list"
                autoComplete="off"
                placeholder="Escolha o destino da carona"
              />
              {errors.destination && <span>{errors.destination.message}</span>}
            </div>

            <div className="mt-5 flex-center w-full justify-between gap-4 md:col-start-2">
              <button className="btn btn-lg bg-neutral-light text-neutral-dark" type="button" onClick={onClear}>
                Limpar
              </button>
              <button className="btn btn-lg bg-secondary" type="submit">
                Aplicar
              </button>
            </div>
          </form>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
