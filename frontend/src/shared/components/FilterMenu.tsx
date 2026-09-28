import { Drawer } from "vaul";
import { Neighborhoods } from "@user/userTypes";

interface FilterMenuProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FilterMenu({ open, setOpen }: FilterMenuProps) {
  return (
    <Drawer.Root direction="bottom" open={open} onOpenChange={setOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-20 bg-black/40 backdrop-blur-[1.5px]" />
        <Drawer.Content className="fixed right-0 bottom-0 left-0 z-20 flex rounded-t-2xl bg-white">
          <form className="form-fields container mx-auto px-5 2xl:px-30">
            <div className="h-2 w-20 justify-self-center rounded-[20px] bg-gray-300 md:col-span-2" />

            <h2 className="md:col-span-2">Filtros</h2>

            <div className="field">
              <label>Período</label>

              <div className="flex gap-3">
                <label className="btn btn-lg bg-neutral-light transition-all has-checked:bg-primary-selected has-checked:box-shadow">
                  <input type="radio" name="period" value="morning" className="sr-only" />
                  <span className="text-slate-900">Manhã</span>
                </label>

                <label className="btn btn-lg bg-neutral-light transition-all has-checked:bg-primary-selected has-checked:box-shadow">
                  <input type="radio" name="period" value="afternoon" className="sr-only" />
                  <span className="text-slate-900">Tarde</span>
                </label>

                <label className="btn btn-lg bg-neutral-light transition-all has-checked:bg-primary-selected has-checked:box-shadow">
                  <input type="radio" name="period" value="night" className="sr-only" />
                  <span className="text-slate-900">Noite</span>
                </label>
              </div>
            </div>

            <div className="field">
              <label htmlFor="date">Data</label>
              <input
                // {...register("date")}
                // aria-invalid={errors.date ? "true" : "false"}
                type="date"
                id="date"
                onClick={(e) => e.currentTarget.showPicker()}
              ></input>
              {/* {errors.date && <span>{errors.date.message}</span>} */}
            </div>

            <div className="field">
              <label htmlFor="origin">Origem</label>
              <input
                // {...register("origin")}
                // aria-invalid={errors.origin ? "true" : "false"}
                type="text"
                list="neighborhood-list"
                autoComplete="off"
                placeholder="Selecione seu bairro"
                id="origin"
              />
              <datalist id="neighborhood-list">
                {Object.values(Neighborhoods).map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
              {/* {errors.origin && <span>{errors.origin.message}</span>} */}
            </div>

            <div className="field">
              <label htmlFor="destination">Destino</label>
              <input
                // {...register("destination")}
                // aria-invalid={errors.destination ? "true" : "false"}
                type="text"
                list="neighborhood-list"
                autoComplete="off"
                placeholder="Selecione seu bairro"
                id="destination"
              />
              <datalist id="neighborhood-list">
                {Object.values(Neighborhoods).map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
              {/* {errors.destination && <span>{errors.destination.message}</span>} */}
            </div>

            <div className="mt-5 flex-center w-full justify-between gap-4 md:col-start-2">
              <button className="btn btn-lg bg-neutral-light text-neutral-dark">Limpar</button>
              <button className="btn btn-lg bg-secondary">Aplicar</button>
            </div>
          </form>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
