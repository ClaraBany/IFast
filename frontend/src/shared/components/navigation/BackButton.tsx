import { ArrowLeft } from "lucide-react";
import { Ripples } from "react-ripples-continued";
import { useNavigate } from "react-router";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button className="icon-btn" onClick={() => navigate(-1)}>
      <ArrowLeft className="text-neutral-dark" size={29} />
      <Ripples color="var(--ripple-dark)" on="mouseDown" />
    </button>
  );
}
