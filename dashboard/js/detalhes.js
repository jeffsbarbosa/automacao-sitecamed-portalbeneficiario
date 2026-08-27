/* =========================================================
   CARREGAMENTO PRINCIPAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    carregarDetalhes();
});


/* =========================================================
   CONTEXTO DA PÁGINA
========================================================= */

function obterDataDaURL() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    /* =====================================================
       LINK VINDO DA TELA DE EXECUÇÕES
       detalhes.html?data=2026-08-13
    ===================================================== */

    const data =
        parametros.get("data");

    if (data) {
        return data;
    }


    /* =====================================================
       LINK VINDO DO DASHBOARD
       detalhes.html?inicio=2026-08-13&fim=2026-08-13
    ===================================================== */

    const inicio =
        parametros.get("inicio");

    const fim =
        parametros.get("fim");


    /*
     * Se início e fim forem iguais,
     * estamos analisando uma única execução.
     */

    if (
        inicio &&
        fim &&
        inicio === fim
    ) {

        return inicio;

    }


    return "";

}


/* =========================================================
   CARREGAR DETALHES
========================================================= */

async function carregarDetalhes() {

    try {

        const response =
            await fetch("../historico/dashboard.json");


        if (!response.ok) {

            throw new Error(
                "Não foi possível carregar o dashboard.json"
            );

        }


        const dados =
            await response.json();


        const dataSelecionada =
            obterDataDaURL();


        carregarPeriodo(
            dados,
            dataSelecionada
        );


        carregarIndicadores(
            dados,
            dataSelecionada
        );


        carregarDistribuicaoFalhas(
            dados,
            dataSelecionada
        );


        carregarTopFalhas(
            dados,
            dataSelecionada
        );


        carregarTimelineFalhas(
            dados,
            dataSelecionada
        );


        carregarListaErros(
            dados
        );


        configurarBusca(
            dados
        );

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

function carregarPeriodo(
    dados,
    dataSelecionada = ""
) {

    const elemento =
        document.getElementById(
            "periodoDetalhes"
        );


    if (!elemento) {
        return;
    }


    /* =====================================================
       EXECUÇÃO ESPECÍFICA
    ===================================================== */

    if (dataSelecionada) {

        elemento.textContent =
            formatarData(
                dataSelecionada
            );

        return;

    }


    /* =====================================================
       PERÍODO COMPLETO
    ===================================================== */

    const inicio =
        dados.periodo?.inicio;

    const fim =
        dados.periodo?.fim;


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

function carregarIndicadores(
    dados,
    dataSelecionada = ""
) {

    let totalFalhas = 0;
    let diasComFalha = 0;
    let errosMapeados = 0;


    /* =====================================================
       EXECUÇÃO ESPECÍFICA
    ===================================================== */

    if (dataSelecionada) {

        const historico =
            Array.isArray(dados.historico)
                ? dados.historico
                : [];


        const execucao =
            historico.find(
                item =>
                    item.data === dataSelecionada
            );


        const falhasDoDia =
            Array.isArray(dados.falhasDetalhadas)

                ? dados.falhasDetalhadas.filter(
                    item =>
                        item.data === dataSelecionada
                )

                : [];


        totalFalhas =
            Number(
                execucao?.failed || 0
            );


        diasComFalha =
            totalFalhas > 0
                ? 1
                : 0;


        errosMapeados =
            falhasDoDia.length;

    }


    /* =====================================================
       PERÍODO COMPLETO
    ===================================================== */

    else {

        totalFalhas =
            Number(
                dados.resumo?.falhas || 0
            );


        diasComFalha =
            Number(
                dados.resumo?.diasComFalha || 0
            );


        errosMapeados =
            Array.isArray(dados.falhasDetalhadas) &&
            dados.falhasDetalhadas.length > 0

                ? dados.falhasDetalhadas.length

                : (
                    Array.isArray(dados.rankingFalhas)
                        ? dados.rankingFalhas.length
                        : 0
                );

    }


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

function carregarDistribuicaoFalhas(
    dados,
    dataSelecionada = ""
) {

    const container =
        document.getElementById(
            "listaDistribuicaoFalhas"
        );

    if (!container) {
        return;
    }


    let historico =
        Array.isArray(dados.historico)
            ? [...dados.historico]
            : [];


    /* =====================================================
       EXECUÇÃO ESPECÍFICA
    ===================================================== */

    if (dataSelecionada) {

        historico =
            historico.filter(
                item =>
                    item.data === dataSelecionada
            );

    }


    if (historico.length === 0) {

        container.innerHTML = `

            <div class="detalhes-vazio">

                ${
                    dataSelecionada
                        ? "Nenhuma execução encontrada para esta data."
                        : "Nenhuma execução encontrada no período."
                }

            </div>

        `;

        return;

    }


    const maiorQuantidadeFalhas =
        Math.max(

            ...historico.map(
                item =>
                    Number(
                        item.failed || 0
                    )
            ),

            1

        );


    container.innerHTML = "";


    historico.forEach(item => {

        const falhas =
            Number(
                item.failed || 0
            );


        const percentualBarra =
            falhas === 0
                ? 0
                : (
                    falhas /
                    maiorQuantidadeFalhas
                ) * 100;


        const linha =
            document.createElement(
                "div"
            );


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


        container.appendChild(
            linha
        );

    });

}

/* =========================================================
   TOP FALHAS RECORRENTES
========================================================= */

function carregarTopFalhas(
    dados,
    dataSelecionada = ""
) {

    const container =
        document.getElementById(
            "topFalhas"
        );


    if (!container) {
        return;
    }


    let falhasDetalhadas =
        Array.isArray(dados.falhasDetalhadas)
            ? [...dados.falhasDetalhadas]
            : [];


    /* =====================================================
       EXECUÇÃO ESPECÍFICA
    ===================================================== */

    if (dataSelecionada) {

        falhasDetalhadas =
            falhasDetalhadas.filter(
                item =>
                    item.data === dataSelecionada
            );

    }


    if (falhasDetalhadas.length === 0) {

        container.innerHTML = `

            <div class="detalhes-vazio">

                ${
                    dataSelecionada
                        ? "Nenhuma falha identificada nesta execução."
                        : "Nenhuma falha identificada no período."
                }

            </div>

        `;

        return;

    }


    /* =====================================================
       AGRUPA SUITE + CENÁRIO
    ===================================================== */

    const agrupadas = {};


    falhasDetalhadas.forEach(item => {

        const suite =
            String(
                item.suite ||
                "Suite não informada"
            );


        const cenario =
            String(
                item.cenario ||
                "Cenário não informado"
            );


        const chave =
            `${suite}|||${cenario}`;


        if (!agrupadas[chave]) {

            agrupadas[chave] = {

                suite: suite,

                cenario: cenario,

                quantidade: 0

            };

        }


        agrupadas[chave].quantidade++;

    });


    /* =====================================================
       RANKING
    ===================================================== */

    const ranking =
        Object
            .values(agrupadas)

            .sort(
                (a, b) =>
                    b.quantidade -
                    a.quantidade
            )

            .slice(
                0,
                5
            );


    container.innerHTML = "";


    ranking.forEach(
        (item, indice) => {

            const linha =
                document.createElement(
                    "div"
                );


            linha.className =
                "top-falha-item";


            linha.innerHTML = `

                <div class="top-falha-posicao">
                    ${indice + 1}º
                </div>


                <div class="top-falha-conteudo">

                    <strong>
                        ${escaparHTML(
                            item.cenario
                        )}
                    </strong>

                    <span>
                        ${escaparHTML(
                            item.suite
                        )}
                    </span>

                </div>


                <div class="top-falha-quantidade">

                    <strong>
                        ${item.quantidade}
                    </strong>

                    <span>

                        ${
                            item.quantidade === 1
                                ? "ocorrência"
                                : "ocorrências"
                        }

                    </span>

                </div>

            `;


            container.appendChild(
                linha
            );

        }
    );

}


/* =========================================================
   LINHA DO TEMPO DAS FALHAS
========================================================= */

function carregarTimelineFalhas(
    dados,
    dataSelecionada = ""
) {

    const container =
        document.getElementById(
            "timelineFalhas"
        );


    if (!container) {
        return;
    }


    let falhas =
        Array.isArray(
            dados.falhasDetalhadas
        )

            ? [...dados.falhasDetalhadas]

            : [];


    /* =====================================================
       EXECUÇÃO ESPECÍFICA
    ===================================================== */

    if (dataSelecionada) {

        falhas =
            falhas.filter(
                item =>
                    item.data === dataSelecionada
            );

    }


    if (falhas.length === 0) {

        container.innerHTML = `

            <div class="detalhes-vazio">

                ${
                    dataSelecionada

                        ? "Nenhuma ocorrência detalhada disponível para esta execução."

                        : "Nenhuma ocorrência detalhada disponível para montar a linha do tempo."
                }

            </div>

        `;

        return;

    }


    /* =====================================================
       ORDENA POR DATA + HORA
    ===================================================== */

    falhas.sort(
        (a, b) => {

            const dataA =
                `${a.data || ""} ${a.hora || ""}`;

            const dataB =
                `${b.data || ""} ${b.hora || ""}`;


            return dataA.localeCompare(
                dataB
            );

        }
    );


    container.innerHTML = "";


    falhas.forEach(item => {

        const bloco =
            document.createElement(
                "div"
            );


        bloco.className =
            "timeline-item";


        bloco.innerHTML = `

            <div class="timeline-marcador"></div>


            <div class="timeline-data">

                <strong>

                    ${
                        item.data
                            ? formatarData(
                                item.data
                            )
                            : "-"
                    }

                </strong>

                <span>
                    ${escaparHTML(
                        item.hora || "-"
                    )}
                </span>

            </div>


            <div class="timeline-conteudo">

                <strong>

                    ${escaparHTML(
                        item.cenario ||
                        "Cenário não informado"
                    )}

                </strong>

                <span>

                    ${escaparHTML(
                        item.suite ||
                        "Suite não informada"
                    )}

                </span>

            </div>

        `;


        container.appendChild(
            bloco
        );

    });

}


/* =========================================================
   LISTA DE ERROS
========================================================= */

function carregarListaErros(

    dados,

    filtro = "",

    dataSelecionada = "",

    suiteSelecionada = ""

) {

    const container =
        document.getElementById(
            "listaErros"
        );


    if (!container) {
        return;
    }


    const falhasDetalhadas =
        Array.isArray(
            dados.falhasDetalhadas
        )

            ? dados.falhasDetalhadas

            : [];


    const rankingFalhas =
        Array.isArray(
            dados.rankingFalhas
        )

            ? dados.rankingFalhas

            : [];


    /* =====================================================
       FONTE PRINCIPAL + FALLBACK
    ===================================================== */

    const erros =
        falhasDetalhadas.length > 0

            ? falhasDetalhadas

            : rankingFalhas.map(
                item => ({

                    data: null,

                    hora: null,

                    suite:
                        item.suite,

                    cenario:
                        item.cenario,

                    erro:
                        item.ultimoErro,

                    quantidade:
                        item.quantidade

                })
            );


    if (erros.length === 0) {

        container.innerHTML = `

            <div class="detalhes-vazio">

                Nenhum erro detalhado foi identificado
                no período.

            </div>

        `;

        return;

    }


    const termo =
        String(
            filtro
        )
            .toLowerCase()
            .trim();


    const errosFiltrados =
        erros.filter(item => {

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
                    item.erro || ""
                ).toLowerCase();


            const data =
                String(
                    item.data || ""
                );


            const atendeBusca =

                suite.includes(termo) ||

                cenario.includes(termo) ||

                erro.includes(termo) ||

                data.includes(termo);


            const atendeData =

                !dataSelecionada ||

                item.data ===
                    dataSelecionada;


            const atendeSuite =

                !suiteSelecionada ||

                item.suite ===
                    suiteSelecionada;


            return (

                atendeBusca &&

                atendeData &&

                atendeSuite

            );

        });


    if (errosFiltrados.length === 0) {

        container.innerHTML = `

            <div class="detalhes-vazio">

                Nenhum erro encontrado para os filtros informados.

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    errosFiltrados.forEach(item => {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "erro-card";


        const dataFormatada =
            item.data

                ? formatarData(
                    item.data
                )

                : "Data não disponível";


        const horaFormatada =
            item.hora
                ? item.hora
                : "-";


        const quantidade =
            Number(
                item.quantidade || 1
            );


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


                <div class="erro-data">

                    <span>
                        Ocorrência
                    </span>

                    <strong>
                        ${dataFormatada}
                    </strong>

                    <small>
                        ${escaparHTML(
                            horaFormatada
                        )}
                    </small>

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
                    Erro identificado
                </span>

                <pre>${escaparHTML(

                    item.erro ||

                    "Erro não informado"

                )}</pre>

            </div>


            <div class="erro-card-footer">

                <span>

                    ${
                        falhasDetalhadas.length > 0

                            ? "Ocorrência registrada na execução diária"

                            : `${quantidade} ocorrência(s) registrada(s) no ranking semanal`
                    }

                </span>

            </div>

        `;


        container.appendChild(
            card
        );

    });

}


/* =========================================================
   BUSCA E FILTROS
========================================================= */

function configurarBusca(
    dados
) {

    const input =
        document.getElementById(
            "buscarErro"
        );


    const filtroData =
        document.getElementById(
            "filtroData"
        );


    const filtroSuite =
        document.getElementById(
            "filtroSuite"
        );


    const btnLimpar =
        document.getElementById(
            "btnLimparFiltros"
        );


    const falhasDetalhadas =
        Array.isArray(
            dados.falhasDetalhadas
        )

            ? dados.falhasDetalhadas

            : [];


    /* =====================================================
       PREENCHE DATAS
    ===================================================== */

    const datas = [

        ...new Set(

            falhasDetalhadas

                .map(
                    item =>
                        item.data
                )

                .filter(Boolean)

        )

    ]
    .sort();


    datas.forEach(data => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            data;


        option.textContent =
            formatarData(
                data
            );


        filtroData?.appendChild(
            option
        );

    });


    /* =====================================================
       PREENCHE SUITES
    ===================================================== */

    const suites = [

        ...new Set(

            falhasDetalhadas

                .map(
                    item =>
                        item.suite
                )

                .filter(Boolean)

        )

    ]
    .sort();


    suites.forEach(suite => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            suite;


        option.textContent =
            suite;


        filtroSuite?.appendChild(
            option
        );

    });


    /* =====================================================
       FUNÇÃO CENTRAL DOS FILTROS
    ===================================================== */

    function aplicarFiltros() {

        carregarListaErros(

            dados,

            input?.value || "",

            filtroData?.value || "",

            filtroSuite?.value || ""

        );

    }


    /* =====================================================
       DATA RECEBIDA PELA URL
    ===================================================== */

    const dataURL =
        obterDataDaURL();


    if (
        dataURL &&
        filtroData
    ) {

        const existeOpcao =
            [...filtroData.options]
                .some(
                    option =>
                        option.value ===
                        dataURL
                );


        if (existeOpcao) {

            filtroData.value =
                dataURL;

        }

    }


    /* =====================================================
       EVENTOS
    ===================================================== */

    input?.addEventListener(
        "input",
        aplicarFiltros
    );


    filtroData?.addEventListener(
        "change",
        aplicarFiltros
    );


    filtroSuite?.addEventListener(
        "change",
        aplicarFiltros
    );


    btnLimpar?.addEventListener(
        "click",
        () => {

            if (input) {

                input.value = "";

            }


            if (filtroData) {

                filtroData.value = "";

            }


            if (filtroSuite) {

                filtroSuite.value = "";

            }


            aplicarFiltros();

        }
    );


    /* =====================================================
       APLICA FILTRO INICIAL DA URL
    ===================================================== */

    if (dataURL) {

        aplicarFiltros();

    }

}


/* =========================================================
   ANIMAÇÃO DOS CONTADORES
========================================================= */

function animarContadorDetalhes(
    id,
    valorFinal
) {

    const elemento =
        document.getElementById(
            id
        );


    if (!elemento) {
        return;
    }


    const valor =
        Number(
            valorFinal || 0
        );


    const duracao =
        1000;


    const inicio =
        performance.now();


    function atualizar(
        tempoAtual
    ) {

        const progresso =
            Math.min(

                (
                    tempoAtual -
                    inicio
                ) /
                duracao,

                1

            );


        const valorAtual =
            Math.round(

                valor *
                progresso

            );


        elemento.textContent =
            valorAtual;


        if (
            progresso < 1
        ) {

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
   ATUALIZA TEXTO
========================================================= */

function atualizarTexto(
    id,
    valor
) {

    const elemento =
        document.getElementById(
            id
        );


    if (elemento) {

        elemento.textContent =
            valor;

    }

}


/* =========================================================
   FORMATA DATA COMPLETA
========================================================= */

function formatarData(
    data
) {

    if (!data) {
        return "-";
    }


    const partes =
        String(
            data
        ).split("-");


    if (
        partes.length !== 3
    ) {

        return data;

    }


    return (
        `${partes[2]}/` +
        `${partes[1]}/` +
        `${partes[0]}`
    );

}


/* =========================================================
   FORMATA DATA CURTA
========================================================= */

function formatarDataCurta(
    data
) {

    if (!data) {
        return "-";
    }


    const partes =
        String(
            data
        ).split("-");


    if (
        partes.length !== 3
    ) {

        return data;

    }


    return (
        `${partes[2]}/` +
        `${partes[1]}`
    );

}


/* =========================================================
   SEGURANÇA PARA TEXTO RECEBIDO DO JSON
========================================================= */

function escaparHTML(
    texto
) {

    return String(
        texto ?? ""
    )

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}