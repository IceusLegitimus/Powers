// // ---------------------- Variáveis globais ----------------------
// let poderes = {};
// let mundoAtual = null;
// let poderAtual = null;

// // ---------------------- Carrega JSON assíncrono ----------------------
// async function carregarPoderes() {
//     try {
//         const res = await fetch("poderes.json");
//         poderes = await res.json();
//         inicializarPagina();
//     } catch (err) {
//         console.error("Erro ao carregar poderes:", err);
//     }
// }
// carregarPoderes();

// // ---------------------- Inicializa a página ----------------------
// function inicializarPagina() {
//     // INDEX.HTML
//     if (document.getElementById("btn-arberus") && document.getElementById("btn-vales")) {
//         document.getElementById("btn-arberus").addEventListener("click", () => {
//             window.location.href = "arberus.html";
//         });
//         document.getElementById("btn-vales").addEventListener("click", () => {
//             window.location.href = "vales.html";
//         });
//         return;
//     }

//     // PÁGINA PRINCIPAL DO MUNDO
//     if (document.getElementById("titulo-mundo") && document.getElementById("lista-poderes")) {
//         mundoAtual = document.getElementById("titulo-mundo").innerText.toLowerCase().includes("arberus") ? "arberus" : "vales";

//         document.getElementById("toggle-mundo").addEventListener("click", alternarMundo);
//         document.getElementById("busca").addEventListener("input", e => renderizarPoderes(e.target.value));

//         const tituloMundo = document.getElementById("titulo-mundo");
//         tituloMundo.style.cursor = "pointer";
//         tituloMundo.addEventListener("click", () => location.reload());

//         renderizarPoderes();
//         return;
//     }

//     // DETALHES.HTML (Arberus)
//     if (document.getElementById("nome-poder") && document.getElementById("lista-anomalias")) {
//         poderAtual = pegarPoderDaURL();
//         if (!poderAtual) return;

//         document.getElementById("toggle-mundo").addEventListener("click", alternarMundo);

//         // Título clicável leva direto para arberus.html
//         const tituloMundo = document.getElementById("titulo-mundo");
//         tituloMundo.style.cursor = "pointer";
//         tituloMundo.addEventListener("click", () => window.location.href = "arberus.html");

//         // Limpa URL para esconder parâmetros
//         window.history.replaceState({}, document.title, "detalhes.html");

//         mostrarPoderDetalhes();
//     }
// }

// // ---------------------- Alterna entre Arberus e Vales ----------------------
// function alternarMundo() {
//     if (!mundoAtual) return;
//     window.location.href = mundoAtual === "arberus" ? "vales.html" : "arberus.html";
// }

// // ---------------------- Renderiza poderes do mundo atual ----------------------
// function renderizarPoderes(filtro = "") {
//     if (!poderes[mundoAtual]) return;

//     const container = document.getElementById("lista-poderes");
//     container.innerHTML = "";

//     poderes[mundoAtual]
//         .filter(p => p.nome.toLowerCase().includes(filtro.toLowerCase()))
//         .forEach(p => {
//             const card = document.createElement("div");
//             card.className = "col-md-4 mb-3";
//             card.innerHTML = `
//                 <div class="card p-3 h-100 d-flex flex-column justify-content-between">
//                     <h5 id="${p.id}">${p.nome} ${formatarTags(p.tag)}</h5>
//                     <button class="btn btn-sm btn-outline-primary mt-2">Ver detalhes</button>
//                 </div>
//             `;
//             container.appendChild(card);

//             const btn = card.querySelector("button");
//             btn.addEventListener("click", () => abrirDetalhes(p.id));
//         });
// }

// // ---------------------- Formata tags múltiplas ----------------------
// function formatarTags(tags) {
//     if (!tags) return "";
//     if (!Array.isArray(tags)) tags = [tags];

//     return tags.map(t => {
//         let classe = "";
//         switch (t) {
//             case "T": classe = "tag-T"; break;
//             case "M": classe = "tag-M"; break;
//             case "C": classe = "tag-C"; break;
//             case "B": classe = "tag-B"; break;
//             case "T2": classe = "tag-T2"; break;
//             case "D": classe = "tag-D"; break;
//             case "Arakis": classe = "tag-Arakis"; break;
//             case "Akram": classe = "tag-Akram"; break;
//             default: classe = "tag-T";
//         }
//         return `<span class="card-tag ${classe}">${t}</span>`;
//     }).join(" ");
// }

// // ---------------------- Abre detalhes de um poder ----------------------
// function abrirDetalhes(id) {
//     const poder = poderes[mundoAtual].find(p => p.id === id);
//     if (!poder) return;

//     if (mundoAtual === "arberus") {
//         // Renderiza detalhes diretamente no detalhes.html
//         poderAtual = poder;
//         mostrarPoderDetalhes();
//         window.history.replaceState({}, document.title, "detalhes.html"); // limpa URL
//     } else if (mundoAtual === "vales") {
//         const container = document.getElementById("lista-poderes");
//         container.innerHTML = `
//             <h2 class="text-center">${poder.nome} ${formatarTags(poder.tag)}</h2>
//             <p class="text-center fw-bold">${poder.destaque}</p>
//             <p class="mt-3">${poder.descricao}</p>
//             <h3 class="mt-4">Evoluções</h3>
//             <ul>${poder.evolucoes.map(e => `<li>${e}</li>`).join("")}</ul>
//         `;
//     }
// }

// // ---------------------- Página de detalhes do Arberus ----------------------
// function pegarPoderDaURL() {
//     const params = new URLSearchParams(window.location.search);
//     const poderStr = params.get("poder");
//     if (!poderStr) return null;
//     return JSON.parse(decodeURIComponent(poderStr));
// }

// // ---------------------- Renderiza detalhes e anomalias ----------------------
// function mostrarPoderDetalhes() {
//     if (!poderAtual) return;

//     document.getElementById("nome-poder").innerHTML = `${poderAtual.nome} ${formatarTags(poderAtual.tag)}`;
//     document.getElementById("descricao-poder").innerText = poderAtual.descricao;

//     const container = document.getElementById("lista-anomalias");
//     container.innerHTML = "";

//     if (poderAtual.anomalias && poderAtual.anomalias.length > 0) {
//         poderAtual.anomalias.forEach(a => {
//             const div = document.createElement("div");
//             div.className = "col-md-4 mb-2";
//             div.innerHTML = `<div class="card p-2 clickable-anomalia">${a.nome}</div>`;
//             container.appendChild(div);

//             // Clique abre card dentro da mesma página
//             div.addEventListener("click", () => abrirCardAnomalia(a));
//         });
//     }
// }

// // ---------------------- Card detalhado da anomalia ----------------------
// function abrirCardAnomalia(anomalia) {
//     const container = document.getElementById("lista-anomalias");
//     container.innerHTML = `
//         <div class="card p-4">
//             <h4>${anomalia.nome}</h4>
//             <p>${anomalia.descricao}</p>
//             <button class="btn btn-secondary mt-2" onclick="mostrarPoderDetalhes()">Voltar</button>
//         </div>
//     `;
// }
