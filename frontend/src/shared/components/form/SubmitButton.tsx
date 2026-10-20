import { LoaderCircle } from "lucide-react";
import { Ripples } from "react-ripples-continued";

interface SubmitButtonProps {
  text: string;
  isSubmitting: boolean;
}

export default function SubmitButton({ text, isSubmitting }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="btn btn-lg mt-auto bg-primary md:mt-4 md:max-w-92.5 md:self-end"
    >
      {isSubmitting && <LoaderCircle className="animate-spin" />}
      {text}
      <Ripples color="var(--ripple-light)" />
    </button>
  );
}
