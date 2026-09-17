export default function VehicleForm() {
    return (
        <div className="flex-column w-full items-center justify-center gap-3 sm:w-100">
            <h2>Cadastrar veículo</h2>
            <form
                className="flex-column w-full gap-4 rounded-2xl bg-white px-5 py-4">
                <div className="field">
            <label htmlFor="name">Nome</label>
            <input
                type="text"
                placeholder="Digite seu nome"
                id="name"
                autoComplete="name"
            ></input>

            </div>
            </form>
        </div>
    )
}