import { Drawer } from "vaul";
import { Neighborhoods } from "@user/userTypes";
import { filterSchema, getMaxDate, getMinDate, Period, periodLabels } from "@ride-offer/offerTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import { useSearchParams } from "react-router";
import NeighborhoodCombobox from "@user/NeighborhoodCombobox";

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
    control,
    formState: { errors },
  } = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    values: {
      period: (searchParams.get("period") as z.infer<typeof filterSchema>["period"]) || undefined,
      date: searchParams.get("date") || undefined,
      origin: searchParams.get("origin") as Neighborhoods | null,
      destination: searchParams.get("destination") as Neighborhoods | null,
    },
    mode: "onTouched",
  });

  const onSubmit = (data: z.infer<typeof filterSchema>) => {
    const newParams = new URLSearchParams();

    if (data.period) newParams.set("period", data.period);
    if (data.date) newParams.set("date", data.date);
    if (data.origin) newParams.set("origin", data.origin);
    if (data.destination) newParams.set("destination", data.destination);

    setSearchParams(newParams);
    setOpen(false);
  };

  const onClear = () => {
    reset({ period: null, date: "", origin: null, destination: null });
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
                {Object.values(Period).map((period) => (
                  <label
                    key={period}
                    className="btn btn-lg cursor-pointer bg-neutral-light transition-all has-checked:bg-primary-selected has-checked:box-shadow"
                  >
                    <input
                      type="radio"
                      value={period}
                      className="sr-only"
                      {...register("period")}
                      onClick={handleUnmarkPeriod}
                    />
                    <span className="text-slate-900">{periodLabels[period]}</span>
                  </label>
                ))}
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
                onClick={(e) => e.currentTarget.showPicker()}
              />
              {errors.date && <span>{errors.date.message}</span>}
            </div>

            <NeighborhoodCombobox
              control={control}
              name="origin"
              label="Origem"
              placeholder="Escolha a origem da carona"
              position={"top"}
            />
            <NeighborhoodCombobox
              control={control}
              name="destination"
              label="Destino"
              placeholder="Escolha o destino da carona"
              position={"top"}
            />

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
