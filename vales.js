// ---------------------- Variáveis globais ----------------------
let poderesVales = [];
let poderAtual = null;
let mundoAtual = "vales";

// ---------------------- Carrega JSON assíncrono (GitHub raw) ----------------------
async function carregarPoderesVales() {
    try {
        const res = await fetch("https://raw.githubusercontent.com/IceusLegitimus/Powers/main/poderes.json");
        const dados = await res.json();
        poderesVales = dados.vales || [];

        inicializarPaginaVales();
    } catch (err) {
        console.error("Erro ao carregar poderes do Vales:", err);
    }
}
carregarPoderesVales();

// ---------------------- Inicializa página ----------------------
function inicializarPaginaVales() {
    // INDEX.HTML
    if (document.getElementById("btn-arberus") && document.getElementById("btn-vales")) {
        document.getElementById("btn-arberus").addEventListener("click", () => {
            window.location.href = "arberus.html";
        });
        document.getElementById("btn-vales").addEventListener("click", () => {
            window.location.href = "vales.html";
        });
        return;
    }

    // PÁGINA PRINCIPAL DO VALES
    if (document.getElementById("titulo-mundo") && document.getElementById("lista-poderes")) {
        renderizarPoderesVales();
        const inputBusca = document.getElementById("busca");
        if (inputBusca) inputBusca.addEventListener("input", (e) => renderizarPoderesVales(e.target.value));

        const tituloMundo = document.getElementById("titulo-mundo");
        if (tituloMundo) {
            tituloMundo.style.cursor = "pointer";
            tituloMundo.addEventListener("click", () => location.reload());
        }
    }
}

// ---------------------- Formata tags ----------------------
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

// ---------------------- Renderiza poderes ----------------------
function renderizarPoderesVales(filtro = "") {
    const container = document.getElementById("lista-poderes");
    if (!container) return;
    container.innerHTML = "";

    poderesVales
        .filter(p => p.nome.toLowerCase().includes(filtro.toLowerCase()))
        .forEach(p => {
            const div = document.createElement("div");
            div.className = "poder-card";
            div.innerHTML = `
                <div class="card p-3 h-100 d-flex flex-column justify-content-between">
                    <h5>${p.nome} ${formatarTagsVales(p.tag)}</h5>
                    <p>${p.descricao}</p>
                    <button class="btn btn-sm btn-outline-primary mt-2 ver-detalhes">Ver detalhes</button>
                </div>
            `;
            container.appendChild(div);

            div.querySelector(".ver-detalhes").addEventListener("click", () => mostrarDetalhesVales(p));
        });
}

// ---------------------- Mostra detalhes do poder ----------------------
function mostrarDetalhesVales(poder) {
    const container = document.getElementById("lista-poderes");
    if (!container) return;

    container.innerHTML = `
        <h2 class="text-center">${poder.nome} ${formatarTagsVales(poder.tag)}</h2>
        <p class="text-center fw-bold">Estilo: ${poder.estilo}</p>
        <p class="mt-3">${poder.descricao}</p>
        <h3 class="mt-4">Evoluções</h3>
        <ul>${poder.evolucoes.map(e => `<li>${e}</li>`).join("")}</ul>
    `;
}
