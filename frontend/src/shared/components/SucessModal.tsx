import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle } from "lucide-react";

type SuccessModalProps = {
  message: string;
  open: boolean;
  onClose: () => void;
};

export function SuccessModal({ message, open, onClose }: SuccessModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content className="modal-content">
          <div className="flex flex-col items-center gap-2 text-primary">
            <CheckCircle size={45} strokeWidth={1.5} />
            <h3>Sucesso</h3>
          </div>
          <span className="text-center text-pretty">{message}</span>
          <div className="flex w-full justify-end">
            <Dialog.Close asChild>
              <button className="btn w-fit text-primary">Voltar</button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
