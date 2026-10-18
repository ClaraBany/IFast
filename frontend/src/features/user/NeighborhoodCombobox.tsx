import { useState } from "react";
import { useController, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { Neighborhoods, NeighborhoodsLabels } from "@user/userTypes";

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

interface NeighborhoodComboboxProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  position?: "top" | "bottom";
  options?: readonly Neighborhoods[];
  className?: string;
  onValueChange?: (value: Neighborhoods | null) => void;
}

export default function NeighborhoodCombobox<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Selecione um bairro",
  position = "bottom",
  options = Object.values(Neighborhoods),
  className,
  onValueChange,
}: NeighborhoodComboboxProps<T>) {
  const [query, setQuery] = useState("");
  const { field, fieldState } = useController({ control, name });

  const value = (field.value ?? null) as Neighborhoods | null;

  const filteredOptions =
    query === "" ? options : options.filter((key) => normalize(NeighborhoodsLabels[key]).includes(normalize(query)));

  const handleChange = (next: Neighborhoods | null) => {
    field.onChange(next);
    onValueChange?.(next);
  };

  return (
    <div className={className ? `field ${className}` : "field"}>
      <label htmlFor={name}>{label}</label>

      <Combobox value={value} immediate onChange={handleChange} onClose={() => setQuery("")}>
        <div className="relative">
          <ComboboxInput
            id={name}
            ref={(el) => field.ref(el)}
            aria-invalid={fieldState.error ? "true" : "false"}
            autoComplete="off"
            placeholder={placeholder}
            className="pr-12!"
            displayValue={(key: Neighborhoods | null) => (key ? NeighborhoodsLabels[key] : "")}
            onChange={(event) => {
              setQuery(event.target.value);
              if (event.target.value === "") handleChange(null);
            }}
            onBlur={field.onBlur}
          />
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center px-3.5">
            <ChevronDown className="text-neutral-dark" size={20} />
          </ComboboxButton>
        </div>

        <ComboboxOptions
          anchor={position}
          transition
          className="pointer-events-auto z-30 w-(--input-width) rounded-xl border border-gray-200 bg-white p-1 shadow-lg transition duration-100 ease-in [--anchor-gap:--spacing(1)] empty:invisible data-closed:opacity-0"
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
                {NeighborhoodsLabels[key]}
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </Combobox>

      {fieldState.error && <span>{fieldState.error.message}</span>}
    </div>
  );
}
