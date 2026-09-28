import { LoaderCircle, RotateCcw } from "lucide-react";
import { Ripples } from "react-ripples-continued";

interface RetryErrorProps {
  message?: string;
  onRetry: () => void;
  isFetching: boolean;
}

export default function RetryError({
  message = "Não foi possível carregar essa página.\nPor favor tente novamente",
  onRetry,
  isFetching,
}: RetryErrorProps) {
  return (
    <div className="flex-center flex-1 flex-col gap-2.5">
      <button className="icon-btn" onClick={onRetry} disabled={isFetching}>
        {isFetching ? (
          <LoaderCircle className="animate-spin text-primary" size={40} />
        ) : (
          <RotateCcw className="text-primary" size={40} />
        )}
        <Ripples color="var(--ripple-dark)" on="mouseDown" />
      </button>

      <p className="text-center text-label text-pretty whitespace-pre-line text-neutral-dark">{message}</p>
    </div>
  );
}
