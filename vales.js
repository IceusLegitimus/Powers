// ---------------------- Variáveis globais ----------------------
let poderes = {};
let mundoAtual = null;
let poderAtual = null;

// ---------------------- Carrega JSON assíncrono (GitHub raw) ----------------------
async function carregarPoderes() {
    try {
        const res = await fetch("https://raw.githubusercontent.com/IceusLegitimus/Powers/main/poderes.json");
        poderes = await res.json();
        inicializarPagina();
    } catch (err) {
        console.error("Erro ao carregar poderes:", err);
    }
}
carregarPoderes();

// ---------------------- Inicializa a página ----------------------
function inicializarPagina() {
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

    // PÁGINA PRINCIPAL DO MUNDO (Arberus ou Vales)
    if (document.getElementById("titulo-mundo") && document.getElementById("lista-poderes")) {
        mundoAtual = document.getElementById("titulo-mundo").innerText.toLowerCase().includes("arberus") ? "arberus" : "vales";

        document.getElementById("toggle-mundo").addEventListener("click", alternarMundo);
        document.getElementById("busca").addEventListener("input", e => renderizarPoderes(e.target.value));

        const tituloMundo = document.getElementById("titulo-mundo");
        tituloMundo.style.cursor = "pointer";
        tituloMundo.addEventListener("click", () => location.reload());

        renderizarPoderes();
        return;
    }

    // DETALHES DO PODER (Vales)
    if (document.getElementById("lista-poderes")) {
        const voltar = document.getElementById("voltar-lista");
        if (voltar) {
            voltar.addEventListener("click", () => renderizarPoderes());
        }
    }
}

// ---------------------- Alterna entre Arberus e Vales ----------------------
function alternarMundo() {
    if (!mundoAtual) return;
    window.location.href = mundoAtual === "arberus" ? "vales.html" : "arberus.html";
}

// ---------------------- Renderiza poderes do mundo atual ----------------------
function renderizarPoderes(filtro = "") {
    if (!poderes[mundoAtual]) return;

    const container = document.getElementById("lista-poderes");
    container.innerHTML = "";

    poderes[mundoAtual]
        .filter(p => p.nome.toLowerCase().includes(filtro.toLowerCase()))
        .forEach(p => {
            const card = document.createElement("div");
            card.className = "poder-card";
            card.innerHTML = `
                <div class="card p-3 h-100 d-flex flex-column justify-content-between">
                    <h5 id="${p.id}">${p.nome} ${formatarTags(p.tag)}</h5>
                    <button class="btn btn-sm btn-outline-primary mt-2">Ver detalhes</button>
                </div>
            `;
            container.appendChild(card);

            const btn = card.querySelector("button");
            if (mundoAtual === "vales") {
                btn.addEventListener("click", () => abrirDetalhesVales(p.id));
            } else {
                // Para Arberus, redireciona para detalhes.html
                btn.addEventListener("click", () => {
                    localStorage.setItem("poderSelecionado", JSON.stringify(p));
                    window.location.href = "detalhes.html";
                });
            }
        });
}

// ---------------------- Formata tags múltiplas ----------------------
function formatarTags(tags) {
    if (!tags) return "";
    if (!Array.isArray(tags)) tags = [tags];

    return tags.map(t => {
        let classe = "";
        switch (t) {
            case "B": classe = "tag-B"; break;      // Roxa
            case "T": classe = "tag-T"; break;      // Verde
            case "C": classe = "tag-C"; break;      // Marrom
            case "D": classe = "tag-D"; break;      // Despertada
            case "Arakis": classe = "tag-Arakis"; break;
            case "Akram": classe = "tag-Akram"; break;
            default: classe = "tag-B";
        }
        return `<span class="card-tag ${classe}">${t}</span>`;
    }).join(" ");
}

// ---------------------- Abre detalhes de um poder (Vales) ----------------------
function abrirDetalhesVales(id) {
    const poder = poderes[mundoAtual].find(p => p.id === id);
    if (!poder) return;

    const container = document.getElementById("lista-poderes");
    container.innerHTML = `
        <h2 class="text-center">${poder.nome} ${formatarTags(poder.tag)}</h2>
        <p class="text-center fw-bold">Estilo: ${poder.estilo}</p>
        <p class="mt-3">${poder.descricao}</p>
        <h3 class="mt-4">Evoluções</h3>
        <ul>${poder.evolucoes.map(e => `<li>${e}</li>`).join("")}</ul>
        <button class="btn btn-secondary mt-3" id="voltar-lista">Voltar</button>
    `;

    document.getElementById("voltar-lista").addEventListener("click", () => renderizarPoderes());
}
