import { Link } from "react-router";

export default function Login() {
  return (
		<div>
			<div className="bg-white rounded-2xl py-4 px-5 border flex flex-col gap-4 border-primary">
				<h1 className="text-center">Login</h1>
				
				<div className="field">
					<label htmlFor="">Email</label>
					<input id="email" type="email" placeholder="Digite seu email" />
				</div>

				<div className="field">
					<label htmlFor="senha">Senha</label>
					<input id="senha" type="password" placeholder="Digite sua senha" />
				</div>

				<button type="submit" className="btn btn-lg bg-primary mt-2.5">Entrar</button>
			</div>

			<Link to={"/register"} className="btn btn-sm text-neutral-dark mt-3">Não tem uma conta? <span className="text-tertiary">Crie agora</span></Link>
		</div>
  )
}
