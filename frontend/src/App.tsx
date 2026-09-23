import { Check, CirclePlus } from "lucide-react";
import { Ripples } from "react-ripples-continued";
import { Link } from "react-router";

export default function App() {
  return (
    <>
      <div className="mx-auto flex min-h-screen flex-col gap-8">
        {/* Seção de Tipografia e Cabeçalhos */}
        <header className="space-y-3">
          <h1>Título H1 (Poppins 32px / 600)</h1>
          <h2>Título H2 (Poppins 26px / 600)</h2>
          <h3>Título H3 (Poppins 24px / 600)</h3>
          <p>
            Este é um parágrafo padrão utilizando a fonte Inter (16px / 400). Ele valida se o corpo do texto e a família
            global estão configurados corretamente.
          </p>
        </header>

        <hr className="border-neutral-dark opacity-30" />

        {/* Seção de Cores do Tema */}
        <section className="space-y-4">
          <h2>Teste de Cores do Tema</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="rounded-xl bg-primary p-4 text-center font-bold text-white">Primary (#17842A)</div>
            <div className="rounded-xl bg-primary-selected p-4 text-center font-bold text-slate-900">
              Primary Selected (#9ED5A8)
            </div>
            <div className="rounded-xl bg-secondary p-4 text-center font-bold text-white">Secondary (#008C89)</div>
            <div className="rounded-xl bg-tertiary p-4 text-center font-bold text-white">Tertiary (#6581FF)</div>
            <div className="rounded-xl bg-neutral-dark p-4 text-center font-bold text-white">
              Neutral Dark (#808080)
            </div>
            <div className="rounded-xl border border-neutral-dark/30 bg-neutral-light p-4 text-center font-bold text-slate-900">
              Neutral Light (#F3F3F3)
            </div>
            <div className="col-span-full rounded-xl bg-danger p-4 text-center font-bold text-white sm:col-span-1">
              Danger (#E11248)
            </div>
          </div>
        </section>

        <hr className="border-neutral-dark opacity-30" />

        {/* Seção de Elementos de Formulário e Base */}
        <section className="space-y-4">
          <h2>Teste de Formulários e Estados (Focus)</h2>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-4 rounded-2xl border border-neutral-light bg-white p-6 shadow-sm"
          >
            <div className="field">
              <label htmlFor="nome">Campo de Texto (Input)</label>
              <input id="nome" type="text" placeholder="Clique aqui para testar o foco..." />
            </div>

            <div className="field">
              <label htmlFor="opcao">Seleção (Select)</label>
              <select id="opcao">
                <option value="">Selecione uma opção...</option>
                <option value="1">Teste 1</option>
                <option value="2">Teste 2</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="mensagem">Área de Texto (Textarea com field-sizing)</label>
              <textarea
                id="mensagem"
                placeholder="Digite uma mensagem longa para testar o redimensionamento automático..."
              ></textarea>
            </div>

            <button type="submit" className="btn btn-sm bg-primary">
              <Check />
              Botão de Envio (Primary)
              <Ripples color="var(--ripple-light)" />
            </button>

            <button type="submit" className="btn btn-sm bg-neutral-light text-neutral-dark">
              <Check />
              Botão de Envio (Primary)
              <Ripples color="var(--ripple-dark)" />
            </button>

            <button type="submit" className="btn btn-lg mt-4 bg-neutral-light text-slate-900">
              <CirclePlus color="#0f172b" />
              Cadastrar Veículo
              <Ripples color="var(--ripple-dark)" />
            </button>

            <Link to={"/register"} className="btn btn-lg mt-4 bg-neutral-light text-slate-900">
              Ir para register
              <Ripples color="var(--ripple-dark)" />
            </Link>
          </form>
        </section>
      </div>
    </>
  );
}
