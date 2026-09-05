import { useState } from "react";
import { Link } from "react-router";

export default function Register() {
  const [isFirstStep, setIsFirstStep] = useState(true);

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-2xl border border-primary bg-white px-5 py-4">
        <h1 className="text-center">Cadastro</h1>
        {isFirstStep ? (
          <>
            <div className="field">
              <label htmlFor="name">Nome</label>
              <input type="text" placeholder="Digite seu nome" id="name"></input>
            </div>
            <div className="field">
              <label htmlFor="phone-number">Telefone</label>
              <input type="tel" placeholder="Digite seu telefone" id="phone-number"></input>
            </div>
            <div className="field">
              <label htmlFor="neighborhood">Bairro</label>
              <input type="text" placeholder="Digite seu bairro" id="neighborhood"></input>
            </div>
            <button className="btn btn-lg bg-primary" onClick={() => setIsFirstStep(false)}>
              Avançar
            </button>
          </>
        ) : (
          <>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input type="email" placeholder="Digite seu email" id="email"></input>
            </div>
            <div className="field">
              <label htmlFor="password">Senha</label>
              <input type="password" placeholder="Digite seu senha" id="password"></input>
            </div>
            <div className="field">
              <label htmlFor="confirm-password">Confirmar Senha</label>
              <input type="password" placeholder="Confirme sua senha" id="confirm-password"></input>
            </div>
            <button className="btn btn-lg bg-primary">Criar Conta</button>
          </>
        )}
      </div>

      <Link to={"/login"} className="btn btn-sm mt-3 text-neutral-dark">
        Já tem uma conta? <span className="text-tertiary">Faça login</span>
      </Link>
    </div>
  );
}
