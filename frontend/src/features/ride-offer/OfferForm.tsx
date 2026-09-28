import { PageHeader } from "@shared/components/PageHeader";
import SubmitButton from "@shared/components/SubmitButton";
import type { Vehicle } from "@vehicle/vehicleTypes";

export default function OfferForm() {
  const isEdit = false;
  const vehicles: Vehicle[] = [];

  return (
    <>
      <title>{isEdit ? "Editar Oferta" : "Criar Oferta"}</title>
      <PageHeader title={isEdit ? "Editar Oferta" : "Criar Oferta"} />

      <form className="flex-column flex-1">
        <section className="form-fields">
          <div className="field">
            <label htmlFor="origin">Origem</label>
            <select
              // {...register("origin")}
              // aria-invalid={errors.origin ? "true" : "false"}
              id="origin"
            >
              <option value="" selected hidden disabled>
                Escolha a origem da carona
              </option>
              <option value="bairro1">Bairro 1</option>
              <option value="bairro2">Bairro 2</option>
              <option value="bairro3">Bairro 3</option>
            </select>
            {/* {errors.origin && <span>{errors.origin.message}</span>} */}
          </div>

          <div className="field">
            <label htmlFor="destination">Destino</label>
            <select
              // {...register("destination")}
              // aria-invalid={errors.destination ? "true" : "false"}
              id="destination"
            >
              <option value="" selected hidden disabled>
                Escolha o destino da carona
              </option>
              <option value="bairro1">Bairro 1</option>
              <option value="bairro2">Bairro 2</option>
              <option value="bairro3">Bairro 3</option>
            </select>
            {/* {errors.destination && <span>{errors.destination.message}</span>} */}
          </div>

          <div className="col-span-2">
            <span>Viagem de Ida e Volta</span>
          </div>

          <div className="field">
            <label htmlFor="date">Data</label>
            <input
              // {...register("date")}
              // aria-invalid={errors.date ? "true" : "false"}
              type="date"
              id="date"
            ></input>
            {/* {errors.date && <span>{errors.date.message}</span>} */}
          </div>

          <div className="field">
            <label htmlFor="departureTime">Hora</label>
            <input
              // {...register("departureTime")}
              // aria-invalid={errors.departureTime ? "true" : "false"}
              type="time"
              id="departureTime"
            ></input>
            {/* {errors.departureTime && <span>{errors.departureTime.message}</span>} */}
          </div>

          <div className="field">
            <label htmlFor="vehicle">Veículo</label>
            <input
              // {...register("vehicle")}
              // aria-invalid={errors.vehicle ? "true" : "false"}
              type="text"
              placeholder="Escolha o destino da carona"
              id="vehicle"
            ></input>
            {/* {errors.vehicle && <span>{errors.vehicle.message}</span>} */}
          </div>

          {/* <Controller
            name="capacity"
            // control={control}
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
          /> */}

          <div className="field col-span-2">
            <label htmlFor="description">Descrição</label>
            <textarea
              // {...register("description")}
              // aria-invalid={errors.description ? "true" : "false"}
              placeholder="Descreva aqui os pontos de encontro, regras e outras informações que deseja mostrar aos passageiros"
              id="description"
            />
            {/* {errors.description && <span>{errors.description.message}</span>} */}
          </div>
        </section>

        <SubmitButton isSubmitting text={isEdit ? "Salvar Oferta" : "Criar Oferta"} />
      </form>
    </>
  );
}
