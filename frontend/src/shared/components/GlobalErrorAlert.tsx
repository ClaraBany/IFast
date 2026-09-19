import * as Dialog from "@radix-ui/react-dialog";
import { useErrorStore } from "@shared/errorStore";
import { CircleX } from "lucide-react";

export function GlobalErrorAlert() {
  const { globalError, clearGlobalError } = useErrorStore();

  if (!globalError) return null;

  return (
    <Dialog.Root open={!!globalError} onOpenChange={(open) => !open && clearGlobalError()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-[1.5px]" />
        <Dialog.Content className="fixed inset-0 m-auto flex-center h-fit w-[calc(100%-40px)] max-w-sm flex-col gap-4 rounded-xl bg-white p-5 sm:max-w-md">
          <div className="text-danger">
            <CircleX size={45} strokeWidth={1.5} />
            <h3>Erro</h3>
          </div>

          <span className="text-center text-pretty">{globalError}</span>

          <div className="flex w-full justify-end">
            <Dialog.Close asChild>
              <button className="btn btn-sm w-fit text-primary">Entendi</button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
