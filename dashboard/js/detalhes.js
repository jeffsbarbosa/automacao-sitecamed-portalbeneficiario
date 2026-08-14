/* =========================================================
   CARREGAMENTO PRINCIPAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    carregarDetalhes();
});


async function carregarDetalhes() {

    try {

        const response = await fetch("../historico/dashboard.json");

        if (!response.ok) {
            throw new Error("Não foi possível carregar o dashboard.json");
        }

        const dados = await response.json();

        carregarPeriodo(dados);
        carregarIndicadores(dados);
        carregarDistribuicaoFalhas(dados);
        carregarListaErros(dados);
        configurarBusca(dados);

    }
    catch (erro) {

        console.error(
            "Erro ao carregar detalhamento:",
            erro
        );

    }

}


/* =========================================================
   PERÍODO
========================================================= */

function carregarPeriodo(dados) {

    const inicio = dados.periodo?.inicio;
    const fim = dados.periodo?.fim;

    const elemento = document.getElementById(
        "periodoDetalhes"
    );

    if (!elemento) {
        return;
    }

    if (!inicio || !fim) {

        elemento.textContent = "-";
        return;

    }

    elemento.textContent =
        `${formatarData(inicio)} a ${formatarData(fim)}`;

}


/* =========================================================
   INDICADORES
========================================================= */

function carregarIndicadores(dados) {

    const totalFalhas =
        Number(dados.resumo?.falhas || 0);

    const diasComFalha =
        Number(dados.resumo?.diasComFalha || 0);

    const errosMapeados =
        Array.isArray(dados.rankingFalhas)
            ? dados.rankingFalhas.length
            : 0;


    atualizarTexto(
        "totalFalhasHeader",
        totalFalhas
    );

    animarContadorDetalhes(
        "totalFalhas",
        totalFalhas
    );

    animarContadorDetalhes(
        "diasComFalha",
        diasComFalha
    );

    animarContadorDetalhes(
        "errosMapeados",
        errosMapeados
    );

}


/* =========================================================
   DISTRIBUIÇÃO DIÁRIA DAS FALHAS
========================================================= */

function carregarDistribuicaoFalhas(dados) {

    const container =
        document.getElementById(
            "listaDistribuicaoFalhas"
        );

    if (!container) {
        return;
    }


    const historico =
        Array.isArray(dados.historico)
            ? dados.historico
            : [];


    if (historico.length === 0) {

        container.innerHTML = `
            <div class="detalhes-vazio">
                Nenhuma execução encontrada no período.
            </div>
        `;

        return;

    }


    const maiorQuantidadeFalhas =
        Math.max(
            ...historico.map(
                item => Number(item.failed || 0)
            ),
            1
        );


    container.innerHTML = "";


    historico.forEach(item => {

        const falhas =
            Number(item.failed || 0);

        const percentualBarra =
            falhas === 0
                ? 0
                : (falhas / maiorQuantidadeFalhas) * 100;


        const linha =
            document.createElement("div");

        linha.className =
            falhas > 0
                ? "linha-distribuicao linha-com-falha"
                : "linha-distribuicao";


        linha.innerHTML = `

            <div class="distribuicao-data">
                ${formatarDataCurta(item.data)}
            </div>

            <div class="distribuicao-barra-wrapper">

                <div class="distribuicao-barra">

                    <div
                        class="distribuicao-barra-preenchimento"
                        style="width: ${percentualBarra}%"
                    ></div>

                </div>

            </div>

            <div class="distribuicao-quantidade">
                ${falhas}
            </div>

        `;


        container.appendChild(linha);

    });

}


/* =========================================================
   LISTA DE ERROS
========================================================= */

function carregarListaErros(
    dados,
    filtro = ""
) {

    const container =
        document.getElementById(
            "listaErros"
        );

    if (!container) {
        return;
    }


    const rankingFalhas =
        Array.isArray(dados.rankingFalhas)
            ? dados.rankingFalhas
            : [];


    if (rankingFalhas.length === 0) {

        container.innerHTML = `
            <div class="detalhes-vazio">
                Nenhum erro detalhado foi identificado
                no período.
            </div>
        `;

        return;

    }


    const termo =
        filtro
            .toLowerCase()
            .trim();


    const errosFiltrados =
        rankingFalhas.filter(item => {

            const suite =
                String(
                    item.suite || ""
                ).toLowerCase();

            const cenario =
                String(
                    item.cenario || ""
                ).toLowerCase();

            const erro =
                String(
                    item.ultimoErro || ""
                ).toLowerCase();


            return (
                suite.includes(termo) ||
                cenario.includes(termo) ||
                erro.includes(termo)
            );

        });


    if (errosFiltrados.length === 0) {

        container.innerHTML = `
            <div class="detalhes-vazio">
                Nenhum erro encontrado para a busca informada.
            </div>
        `;

        return;

    }


    container.innerHTML = "";


    errosFiltrados.forEach(
        (item, indice) => {

            const card =
                document.createElement("article");

            card.className =
                "erro-card";


            const quantidade =
                Number(item.quantidade || 0);


            card.innerHTML = `

                <div class="erro-card-header">

                    <div class="erro-card-titulo">

                        <span class="erro-icone">
                            ×
                        </span>

                        <div>

                            <span class="erro-label">
                                CENÁRIO
                            </span>

                            <h3>
                                ${escaparHTML(
                                    item.cenario ||
                                    "Cenário não informado"
                                )}
                            </h3>

                        </div>

                    </div>


                    <div class="erro-ocorrencias">

                        <strong>
                            ${quantidade}
                        </strong>

                        <span>
                            ${
                                quantidade === 1
                                    ? "ocorrência"
                                    : "ocorrências"
                            }
                        </span>

                    </div>

                </div>


                <div class="erro-suite">

                    <span>
                        Suite
                    </span>

                    <strong>
                        ${escaparHTML(
                            item.suite ||
                            "Não informada"
                        )}
                    </strong>

                </div>


                <div class="erro-mensagem">

                    <span>
                        Último erro
                    </span>

                    <pre>${escaparHTML(
                        item.ultimoErro ||
                        "Erro não informado"
                    )}</pre>

                </div>


                <div class="erro-card-footer">

                    <span>
                        Erro mapeado no relatório semanal
                    </span>

                </div>

            `;


            container.appendChild(card);

        }
    );

}


/* =========================================================
   BUSCA
========================================================= */

function configurarBusca(dados) {

    const input =
        document.getElementById(
            "buscarErro"
        );

    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        () => {

            carregarListaErros(
                dados,
                input.value
            );

        }
    );

}


/* =========================================================
   ANIMAÇÃO DOS CONTADORES
========================================================= */

function animarContadorDetalhes(
    id,
    valorFinal
) {

    const elemento =
        document.getElementById(id);

    if (!elemento) {
        return;
    }


    const valor =
        Number(valorFinal || 0);


    const duracao = 1000;

    const inicio =
        performance.now();


    function atualizar(tempoAtual) {

        const progresso =
            Math.min(
                (tempoAtual - inicio) /
                duracao,
                1
            );


        const valorAtual =
            Math.round(
                valor * progresso
            );


        elemento.textContent =
            valorAtual;


        if (progresso < 1) {

            requestAnimationFrame(
                atualizar
            );

        }

    }


    requestAnimationFrame(
        atualizar
    );

}


/* =========================================================
   UTILITÁRIOS
========================================================= */

function atualizarTexto(
    id,
    valor
) {

    const elemento =
        document.getElementById(id);

    if (elemento) {
        elemento.textContent = valor;
    }

}


function formatarData(data) {

    if (!data) {
        return "-";
    }

    const partes =
        data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


function formatarDataCurta(data) {

    if (!data) {
        return "-";
    }

    const partes =
        data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}`;

}


/* =========================================================
   SEGURANÇA PARA TEXTO RECEBIDO DO JSON
========================================================= */

function escaparHTML(texto) {

    return String(texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}