import * as Dialog from "@radix-ui/react-dialog";
import { OctagonAlert, LoaderCircle } from "lucide-react";

type ConfirmModalProps = {
  title: string;
  message: string;
  open: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({ title, message, open, isLoading = false, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(open) => !open && !isLoading && onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content className="modal-content">
          <div className="flex flex-col items-center gap-2 text-danger">
            <OctagonAlert size={45} strokeWidth={1.5} />
            <h3>{title}</h3>
          </div>
          <span className="text-center text-pretty">{message}</span>
          <div className="flex-center w-full gap-3">
            <Dialog.Close asChild>
              <button
                className="btn btn-sm w-full bg-neutral-light text-neutral-dark"
                disabled={isLoading}
                onClick={onCancel}
              >
                Cancelar
              </button>
            </Dialog.Close>
            <button className="btn btn-sm w-full bg-danger" onClick={onConfirm} disabled={isLoading}>
              {isLoading ? <LoaderCircle className="animate-spin" /> : "Excluir"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
