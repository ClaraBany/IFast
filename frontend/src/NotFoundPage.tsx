import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="flex-center min-h-screen flex-col gap-4 bg-neutral-light text-center">
      <h1 className="text-6xl text-primary">404</h1>
      <p className="text-label font-semibold">Página não encontrada</p>
      <p className="max-w-xs text-neutral-dark">A página que você procura não existe ou foi movida.</p>
      <Link to="/offers" className="btn btn-lg mt-2 w-fit bg-primary px-5">
        Ver caronas disponíveis
      </Link>
    </div>
  );
}
