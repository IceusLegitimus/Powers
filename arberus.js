// ======= VARIÁVEIS =======
let poderesArberus = [];
let poderAtual = null;

// ======= CARREGAR PODERES =======
async function carregarPoderesArberus() {
    try {
        const res = await fetch("https://raw.githubusercontent.com/IceusLegitimus/Powers/main/poderes.json");
        const dados = await res.json();
        poderesArberus = dados.arberus;

        // Detecta se estamos em arberus.html ou detalhes.html
        if (document.getElementById("lista-poderes")) {
            renderizarPoderesArberus();
            configurarBuscaArberus();
            configurarTrocaMundoArberus();
            configurarTituloArberus();
        }

        if (document.getElementById("nome-poder")) {
            poderAtual = JSON.parse(localStorage.getItem("poderSelecionado"));
            if (!poderAtual) return;

            mostrarDetalhesArberus(poderAtual);
            configurarTituloDetalhesArberus();
            configurarTrocaMundoArberus();
        }

    } catch (err) {
        console.error("Erro ao carregar poderes do Arberus:", err);
    }
}
carregarPoderesArberus();

// ======= FORMATA TAGS =======
function formatarTagsArberus(tags) {
    if (!tags) return "";
    if (!Array.isArray(tags)) tags = [tags];

    return tags.map(t => {
        let classe = "";
        switch (t) {
            case "T": classe = "tag-T"; break;     // Verde
            case "M": classe = "tag-M"; break;     // Azul
            case "C": classe = "tag-C"; break;     // Marrom
            default: classe = "tag-T";
        }
        return `<span class="card-tag ${classe}">${t}</span>`;
    }).join(" ");
}

// ======= RENDERIZAR PODERES =======
function renderizarPoderesArberus(filtro = "") {
    const container = document.getElementById("lista-poderes");
    container.innerHTML = "";

    poderesArberus
        .filter(p => p.nome.toLowerCase().includes(filtro.toLowerCase()))
        .forEach(p => {
            const div = document.createElement("div");
            div.className = "col-md-4 mb-3";

            div.innerHTML = `
                <div class="card p-3 h-100 d-flex flex-column justify-content-between">
                    <h5>${p.nome} ${formatarTagsArberus(p.tag)}</h5>
                    <p>${p.descricao}</p>
                    <button class="btn btn-sm btn-outline-primary mt-2 ver-detalhes">Ver detalhes</button>
                </div>
            `;
            container.appendChild(div);

            div.querySelector(".ver-detalhes").addEventListener("click", () => {
                localStorage.setItem("poderSelecionado", JSON.stringify(p));
                window.location.href = "detalhes.html";
            });
        });
}

// ======= BUSCA =======
function configurarBuscaArberus() {
    const inputBusca = document.getElementById("busca");
    inputBusca.addEventListener("input", (e) => renderizarPoderesArberus(e.target.value));
}

// ======= TROCAR MUNDO =======
function configurarTrocaMundoArberus() {
    const btnTrocar = document.getElementById("toggle-mundo");
    btnTrocar.addEventListener("click", () => {
        window.location.href = "vales.html";
    });
}

// ======= TÍTULO CLICÁVEL =======
function configurarTituloArberus() {
    const titulo = document.getElementById("titulo-mundo");
    titulo.style.cursor = "pointer";
    titulo.addEventListener("click", () => location.reload());
}

// ======= DETALHES DO PODER (detalhes.html) =======
function mostrarDetalhesArberus(poder) {
    document.getElementById("nome-poder").innerHTML = `${poder.nome} ${formatarTagsArberus(poder.tag)}`;
    document.getElementById("descricao-poder").innerText = poder.descricao;

    const container = document.getElementById("lista-anomalias");
    container.innerHTML = "";

    poder.anomalias.forEach(a => {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline-secondary m-1";
        btn.innerText = a.nome;
        container.appendChild(btn);

        btn.addEventListener("click", () => {
            container.innerHTML = `
                <div class="card p-3">
                    <h4>${a.nome}</h4>
                    <p>${a.descricao}</p>
                    <button class="btn btn-secondary mt-2" id="voltar-anomalias">Voltar</button>
                </div>
            `;
            document.getElementById("voltar-anomalias").addEventListener("click", () => mostrarDetalhesArberus(poder));
        });
    });
}

// ======= TÍTULO CLICÁVEL DETALHES =======
function configurarTituloDetalhesArberus() {
    const titulo = document.getElementById("titulo-mundo");
    titulo.style.cursor = "pointer";
    titulo.addEventListener("click", () => window.location.href = "arberus.html");
}
