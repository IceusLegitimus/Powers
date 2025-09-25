// ======= VARIÁVEIS =======
let poderesVales = [];
let poderAtual = null;
let filtrosAtivos = {
    vale: [],
    nivel: [],
    estilo: []
};

// ======= CARREGAR PODERES =======
async function carregarPoderesVales() {
    try {
        const res = await fetch("./poderes.json");
        const dados = await res.json();
        poderesVales = dados.vales;

        if (document.getElementById("lista-poderes")) {
            // Restaurar filtros salvos
            const filtrosSalvos = JSON.parse(localStorage.getItem("filtrosAtivos"));
            if (filtrosSalvos) filtrosAtivos = filtrosSalvos;

            atualizarCheckboxes();

            renderizarPoderesVales();
            configurarBuscaVales();
            configurarTrocaMundoVales();
            configurarTituloVales();
            configurarFiltrosDinamicos();

            // Restaura a posição do scroll se existir
            const pos = localStorage.getItem("scrollPosVales");
            if (pos) {
                window.scrollTo(0, parseInt(pos));
                localStorage.removeItem("scrollPosVales");
            }
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
            case "B": classe = "tag-B"; break; 
            case "T": classe = "tag-T"; break; 
            case "C": classe = "tag-C"; break; 
            case "D": classe = "tag-D"; break; 
            default: classe = "tag-B";
        }
        return `<span class="card-tag ${classe}">${t}</span>`;
    }).join(" ");
}

// ======= FORMATA VALE =======
function formatarVale(vale) {
    if (!vale) return "";
    let cor = "bg-secondary";
    switch (vale.toLowerCase()) {
        case "arakis": cor = "bg-primary"; break; 
        case "akram": cor = "bg-danger"; break;  
    }
    return `<span class="badge ${cor} ms-2">${vale}</span>`;
}

// ======= RENDERIZAR PODERES =======
function renderizarPoderesVales(filtroTexto = "") {
    const container = document.getElementById("lista-poderes");
    if (!container) return;
    container.innerHTML = "";

    let poderesFiltrados = poderesVales.filter(p => p.nome.toLowerCase().includes(filtroTexto.toLowerCase()));

    // FILTRO DE ARTE
    if (filtrosAtivos.vale.length > 0) {
        poderesFiltrados = poderesFiltrados.filter(p => filtrosAtivos.vale.includes(p.vale));
    }

    // FILTRO DE NÍVEL (usa a primeira tag do array como referência)
    if (filtrosAtivos.nivel.length > 0) {
        poderesFiltrados = poderesFiltrados.filter(p => {
            const tagNivel = (p.tag || ["B"])[0]; // pega a primeira tag
            let nivel = "";
            switch(tagNivel) {
                case "B": nivel = "Base"; break;
                case "T": nivel = "Transmutada"; break;
                case "D": nivel = "Despertada"; break;
                default: nivel = "Base";
            }
            return filtrosAtivos.nivel.includes(nivel);
        });
    }

    // FILTRO DE ESTILO
    if (filtrosAtivos.estilo.length > 0) {
        poderesFiltrados = poderesFiltrados.filter(p => filtrosAtivos.estilo.includes(p.estilo));
    }

    // RENDERIZAÇÃO
    poderesFiltrados.forEach(p => {
        const div = document.createElement("div");
        div.className = "col-md-4 mb-3";

        div.innerHTML = `
            <div class="card p-3 h-100 d-flex flex-column justify-content-between">
                <h5>
                    ${p.nome} ${formatarTagsVales(p.tag)} ${formatarVale(p.vale)}
                </h5>
                <button class="btn btn-sm btn-outline-primary mt-2 ver-detalhes">Ver detalhes</button>
            </div>
        `;
        container.appendChild(div);

        div.querySelector(".ver-detalhes").addEventListener("click", () => {
            localStorage.setItem("scrollPosVales", window.scrollY);
            mostrarDetalhesVales(p);
        });
    });
}


// ======= MOSTRAR DETALHES =======
function mostrarDetalhesVales(poder) {
    const container = document.getElementById("lista-poderes");
    if (!container) return;

    container.innerHTML = `
        <div class="card p-4">
            <h2 class="text-center">
                ${poder.nome} ${formatarTagsVales(poder.tag)} ${formatarVale(poder.vale)}
            </h2>
            <p class="text-center fw-bold">Estilo: ${poder.estilo}</p>
            <p class="mt-3">${poder.descricao}</p>
            <h4 class="mt-4">Evoluções</h4>
            <ul>
                ${poder.evolucoes.map(e => {
                    if (typeof e === "string") return `<li>${e}</li>`;
                    return `<li>${e.nome} ${formatarTagsVales(e.tag)} ${formatarVale(e.vale || "")}</li>`;
                }).join("")}
            </ul>
            <button class="btn btn-secondary mt-3" id="voltar-lista">Voltar</button>
        </div>
    `;

    document.getElementById("voltar-lista").addEventListener("click", () => {
        renderizarPoderesVales();
        const pos = localStorage.getItem("scrollPosVales");
        if (pos) {
            window.scrollTo(0, parseInt(pos));
            localStorage.removeItem("scrollPosVales");
        }
    });
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

// ======= TÍTULO =======
function configurarTituloVales() {
    const titulo = document.getElementById("titulo-mundo");
    if (titulo) {
        titulo.style.cursor = "pointer";
        titulo.addEventListener("click", () => location.reload());
    }
}

// ======= FILTROS DINÂMICOS =======
function configurarFiltrosDinamicos() {
    const checkboxes = document.querySelectorAll('#filtroMenu input[type="checkbox"]');

    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            filtrosAtivos.vale = Array.from(document.querySelectorAll('input[name="vale"]:checked')).map(i => i.value);
            filtrosAtivos.nivel = Array.from(document.querySelectorAll('input[name="nivel"]:checked')).map(i => i.value);
            filtrosAtivos.estilo = Array.from(document.querySelectorAll('input[name="estilo"]:checked')).map(i => i.value);

            localStorage.setItem("filtrosAtivos", JSON.stringify(filtrosAtivos));
            renderizarPoderesVales(document.getElementById("busca")?.value || "");
        });
    });
}

// ======= RESTAURA CHECKBOXES COM FILTROS SALVOS =======
function atualizarCheckboxes() {
    filtrosAtivos.vale.forEach(v => {
        const el = document.querySelector(`input[name="vale"][value="${v}"]`);
        if (el) el.checked = true;
    });
    filtrosAtivos.nivel.forEach(n => {
        const el = document.querySelector(`input[name="nivel"][value="${n}"]`);
        if (el) el.checked = true;
    });
    filtrosAtivos.estilo.forEach(e => {
        const el = document.querySelector(`input[name="estilo"][value="${e}"]`);
        if (el) el.checked = true;
    });
}
