// ======= VARIÁVEIS =======
let poderesVales = [];
let poderAtual = null;

// ======= CARREGAR PODERES =======
async function carregarPoderesVales() {
    try {
        const res = await fetch("./poderes.json"); // Caminho relativo seguro
        const dados = await res.json();
        poderesVales = dados.vales;

        if (document.getElementById("lista-poderes")) {
            renderizarPoderesVales();
            configurarBuscaVales();
            configurarTrocaMundoVales();
            configurarTituloVales();
        }

    } catch (err) {
        console.error("Erro ao carregar poderes do Vales:", err);
    }
}
carregarPoderesVales();

// ======= FORMATA TAGS =======
function formatarTagsVales(tags) {
    if (!tags) return "";
    if (!Array.isArray(tags)) tags = [tags];

    return tags.map(t => {
        let classe = "";
        switch (t) {
            case "B": classe = "tag-B"; break; // Roxa
            case "T": classe = "tag-T"; break; // Verde
            case "C": classe = "tag-C"; break; // Marrom
            case "D": classe = "tag-D"; break; // Despertada
            default: classe = "tag-B";
        }
        return `<span class="card-tag ${classe}">${t}</span>`;
    }).join(" ");
}

// ======= RENDERIZAR PODERES =======
function renderizarPoderesVales(filtro = "") {
    const container = document.getElementById("lista-poderes");
    if (!container) return;
    container.innerHTML = "";

    poderesVales
        .filter(p => p.nome.toLowerCase().includes(filtro.toLowerCase()))
        .forEach(p => {
            const div = document.createElement("div");
            div.className = "col-md-4 mb-3"; // Grid responsivo

            div.innerHTML = `
                <div class="card p-3 h-100 d-flex flex-column justify-content-between">
                    <h5>${p.nome} ${formatarTagsVales(p.tag)}</h5>
                    <button class="btn btn-sm btn-outline-primary mt-2 ver-detalhes">Ver detalhes</button>
                </div>
            `;

            container.appendChild(div);

            // Evento do botão
            div.querySelector(".ver-detalhes").addEventListener("click", () => mostrarDetalhesVales(p));
        });
}

// ======= MOSTRAR DETALHES NO MESMO DOM =======
function mostrarDetalhesVales(poder) {
    const container = document.getElementById("lista-poderes");
    if (!container) return;

    container.innerHTML = `
        <div class="card p-4">
            <h2 class="text-center">${poder.nome} ${formatarTagsVales(poder.tag)}</h2>
            <p class="text-center fw-bold">Estilo: ${poder.estilo}</p>
            <p class="mt-3">${poder.descricao}</p>
            <h4 class="mt-4">Evoluções</h4>
            <ul>${poder.evolucoes.map(e => `<li>${e}</li>`).join("")}</ul>
            <button class="btn btn-secondary mt-3" id="voltar-lista">Voltar</button>
        </div>
    `;

    document.getElementById("voltar-lista").addEventListener("click", () => renderizarPoderesVales());
}

// ======= BUSCA =======
function configurarBuscaVales() {
    const inputBusca = document.getElementById("busca");
    if (inputBusca) inputBusca.addEventListener("input", e => renderizarPoderesVales(e.target.value));
}

// ======= TROCAR MUNDO =======
function configurarTrocaMundoVales() {
    const btnTrocar = document.getElementById("toggle-mundo");
    if (btnTrocar) btnTrocar.addEventListener("click", () => window.location.href = "arberus.html");
}

// ======= TÍTULO CLICÁVEL =======
function configurarTituloVales() {
    const titulo = document.getElementById("titulo-mundo");
    if (titulo) {
        titulo.style.cursor = "pointer";
        titulo.addEventListener("click", () => location.reload());
    }
}
