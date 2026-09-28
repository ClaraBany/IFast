import { CircleUserRound } from "lucide-react";

interface ProfilePictureProps {
  url: string | undefined;
  size: "xl" | "lg" | "md" | "sm";
}

const sizeMap = {
  xl: "size-[120px]",
  lg: "size-[56px]",
  md: "size-[44px]",
  sm: "size-[32px]",
};

export default function ProfilePicture({ url, size }: ProfilePictureProps) {
  return url ? (
    <img src={url} className={`${sizeMap[size]} rounded-full`} alt="Imagem de Perfil" />
  ) : (
    <CircleUserRound className={sizeMap[size]} strokeWidth={1} />
  );
}
