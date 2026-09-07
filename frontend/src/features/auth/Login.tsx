import { Ripples } from "react-ripples-continued";
import { Link } from "react-router";

export default function Login() {
  return (
    <div className="w-full sm:w-100">
      <title>Login</title>

      <div className="flex-column gap-4 rounded-2xl border border-primary bg-white px-5 py-4">
        <h1 className="text-center">Login</h1>

        <div className="field">
          <label htmlFor="">Email</label>
          <input id="email" type="email" placeholder="Digite seu email" />
        </div>

        <div className="field">
          <label htmlFor="password">Senha</label>
          <input id="password" type="password" placeholder="Digite sua senha" />
        </div>

        <button type="submit" className="btn btn-lg mt-2.5 bg-primary">
          Entrar
        </button>
      </div>

      <Link to={"/register"} className="btn btn-sm mt-3 text-neutral-dark">
        Não tem uma conta? <span className="text-tertiary">Crie agora</span>
        <Ripples color="var(--ripple-dark)" />
      </Link>
    </div>
  );
}
