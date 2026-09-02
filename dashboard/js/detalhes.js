/* =========================================================
   CARREGAMENTO PRINCIPAL
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        carregarDetalhes();
    }
);


/* =========================================================
   CONTEXTO DA PÁGINA
========================================================= */

function obterPeriodoDaURL() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const data =
        parametros.get(
            "data"
        );

    const inicio =
        parametros.get(
            "inicio"
        );

    const fim =
        parametros.get(
            "fim"
        );


    /*
        Link vindo da tela de execuções:

        detalhes.html?data=2026-08-13
    */

    if (data) {

        return {
            inicio: data,
            fim: data
        };

    }


    /*
        Link vindo do Dashboard:

        detalhes.html?inicio=2026-08-10&fim=2026-08-16
    */

    if (
        inicio &&
        fim
    ) {

        return {
            inicio,
            fim
        };

    }


    return {
        inicio: "",
        fim: ""
    };

}


/* =========================================================
   VERIFICA SE DATA ESTÁ DENTRO DO PERÍODO
========================================================= */

function dataDentroDoPeriodo(
    data,
    inicio,
    fim
) {

    if (!data) {
        return false;
    }


    if (
        !inicio &&
        !fim
    ) {

        return true;

    }


    if (
        inicio &&
        data < inicio
    ) {

        return false;

    }


    if (
        fim &&
        data > fim
    ) {

        return false;

    }


    return true;

}


/* =========================================================
   FILTRA LISTA PELO PERÍODO
========================================================= */

function filtrarPorPeriodo(
    lista,
    inicio,
    fim
) {

    if (!Array.isArray(lista)) {
        return [];
    }


    if (
        !inicio &&
        !fim
    ) {

        return [...lista];

    }


    return lista.filter(
        item =>
            dataDentroDoPeriodo(
                item.data,
                inicio,
                fim
            )
    );

}


/* =========================================================
   CARREGAR DETALHES
========================================================= */

async function carregarDetalhes() {

    try {

        const response =
            await fetch(
                "../historico/dashboard.json"
            );


        if (!response.ok) {

            throw new Error(
                "Não foi possível carregar o dashboard.json"
            );

        }


        const dados =
            await response.json();


        const periodoSelecionado =
            obterPeriodoDaURL();

        configurarVoltarDashboard(
            periodoSelecionado
);


        carregarPeriodo(
            dados,
            periodoSelecionado
        );


        carregarIndicadores(
            dados,
            periodoSelecionado
        );


        carregarDistribuicaoFalhas(
            dados,
            periodoSelecionado
        );

        carregarDistribuicaoSucessos(
            dados,
            periodoSelecionado
);


        carregarTopFalhas(
            dados,
            periodoSelecionado
        );


        carregarTimelineFalhas(
            dados,
            periodoSelecionado
        );


        carregarListaErros(
            dados,
            "",
            "",
            "",
            periodoSelecionado
        );


        configurarBusca(
            dados,
            periodoSelecionado
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
   VOLTAR AO DASHBOARD PRESERVANDO O PERÍODO
========================================================= */

function configurarVoltarDashboard(
    periodoSelecionado = {}
) {

    const botaoVoltar =
        document.querySelector(
            'a[href="index.html"]'
        );


    if (!botaoVoltar) {
        return;
    }


    const inicio =
        periodoSelecionado.inicio || "";

    const fim =
        periodoSelecionado.fim || "";


    if (
        !inicio ||
        !fim
    ) {

        botaoVoltar.href =
            "index.html";

        return;

    }


    const parametros =
        new URLSearchParams();


    parametros.set(
        "inicio",
        inicio
    );


    parametros.set(
        "fim",
        fim
    );


    botaoVoltar.href =
        `index.html?${parametros.toString()}`;

}


/* =========================================================
   PERÍODO
========================================================= */

function carregarPeriodo(
    dados,
    periodoSelecionado = {}
) {

    const elemento =
        document.getElementById(
            "periodoDetalhes"
        );


    if (!elemento) {
        return;
    }


    const inicioSelecionado =
        periodoSelecionado.inicio || "";

    const fimSelecionado =
        periodoSelecionado.fim || "";


    /*
        Período recebido pela URL
    */

    if (
        inicioSelecionado &&
        fimSelecionado
    ) {

        if (
            inicioSelecionado ===
            fimSelecionado
        ) {

            elemento.textContent =
                formatarData(
                    inicioSelecionado
                );

        }
        else {

            elemento.textContent =
                `${formatarData(inicioSelecionado)} a ${formatarData(fimSelecionado)}`;

        }


        return;

    }


    /*
        Período padrão do dashboard.json
    */

    const inicio =
        dados.periodo?.inicio;

    const fim =
        dados.periodo?.fim;


    if (
        !inicio ||
        !fim
    ) {

        elemento.textContent =
            "-";

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
    periodoSelecionado = {}
) {

    const inicio =
        periodoSelecionado.inicio || "";

    const fim =
        periodoSelecionado.fim || "";


    const historicoCompleto =
        Array.isArray(
            dados.historico
        )
            ? dados.historico
            : [];


    const falhasCompletas =
        Array.isArray(
            dados.falhasDetalhadas
        )
            ? dados.falhasDetalhadas
            : [];


    const possuiPeriodo =
        Boolean(
            inicio &&
            fim
        );


    let totalFalhas = 0;

    let diasComFalha = 0;

    let errosMapeados = 0;


    /*
        Período recebido pela URL
    */

    if (possuiPeriodo) {

        const historico =
            filtrarPorPeriodo(
                historicoCompleto,
                inicio,
                fim
            );


        const falhasDetalhadas =
            filtrarPorPeriodo(
                falhasCompletas,
                inicio,
                fim
            );


        totalFalhas =
            historico.reduce(
                (
                    total,
                    item
                ) =>
                    total +
                    Number(
                        item.failed || 0
                    ),
                0
            );


        diasComFalha =
            historico.filter(
                item =>
                    Number(
                        item.failed || 0
                    ) > 0
            ).length;


        errosMapeados =
            falhasDetalhadas.length;

    }

    /*
        Período completo do dashboard
    */

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

            falhasCompletas.length > 0

                ? falhasCompletas.length

                : (
                    Array.isArray(
                        dados.rankingFalhas
                    )
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
    periodoSelecionado = {}
) {

    const container =
        document.getElementById(
            "listaDistribuicaoFalhas"
        );


    if (!container) {
        return;
    }


    const inicio =
        periodoSelecionado.inicio || "";

    const fim =
        periodoSelecionado.fim || "";


    let historico =
        Array.isArray(
            dados.historico
        )
            ? [...dados.historico]
            : [];


    historico =
        filtrarPorPeriodo(
            historico,
            inicio,
            fim
        );


    if (
        historico.length === 0
    ) {

        container.innerHTML = `

            <div class="detalhes-vazio">

                Nenhuma execução encontrada
                no período selecionado.

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


    container.innerHTML =
        "";


    historico.forEach(
        item => {

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

                    ? "linha-distribuicao linha-com-falha distribuicao-clicavel"

                    : "linha-distribuicao";


            linha.innerHTML = `

                <div class="distribuicao-data">

                    ${formatarDataCurta(
                        item.data
                    )}

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


            /* =================================================
               CLIQUE SOMENTE EM DIAS COM FALHA
            ================================================= */

            if (
                falhas > 0
            ) {

                linha.dataset.data =
                    item.data;


                linha.tabIndex =
                    0;


                linha.setAttribute(
                    "role",
                    "button"
                );


                linha.setAttribute(
                    "title",
                    "Clique para visualizar as falhas desta execução"
                );


                linha.addEventListener(
                    "click",
                    () => {

                        const filtroData =
                            document.getElementById(
                                "filtroData"
                            );


                        const secaoErros =
                            document.getElementById(
                                "listaErros"
                            );


                        if (
                            filtroData
                        ) {

                            filtroData.value =
                                item.data;


                            filtroData.dispatchEvent(
                                new Event(
                                    "change",
                                    {
                                        bubbles:
                                            true
                                    }
                                )
                            );

                        }


                        setTimeout(
                            () => {

                                secaoErros?.scrollIntoView(
                                    {
                                        behavior:
                                            "smooth",

                                        block:
                                            "start"
                                    }
                                );

                            },
                            100
                        );

                    }
                );


                /* =============================================
                   ACESSIBILIDADE PELO TECLADO
                ============================================= */

                linha.addEventListener(
                    "keydown",
                    event => {

                        if (
                            event.key ===
                                "Enter" ||
                            event.key ===
                                " "
                        ) {

                            event.preventDefault();

                            linha.click();

                        }

                    }
                );

            }


            container.appendChild(
                linha
            );

        }
    );

}

/* =========================================================
   DISTRIBUIÇÃO DIÁRIA DOS SUCESSOS
========================================================= */

function carregarDistribuicaoSucessos(
    dados,
    periodoSelecionado = {}
) {

    const container =
        document.getElementById(
            "listaDistribuicaoSucessos"
        );


    if (!container) {
        return;
    }


    const inicio =
        periodoSelecionado.inicio || "";

    const fim =
        periodoSelecionado.fim || "";


    let historico =
        Array.isArray(
            dados.historico
        )
            ? [...dados.historico]
            : [];


    historico =
        filtrarPorPeriodo(
            historico,
            inicio,
            fim
        );


    if (
        historico.length === 0
    ) {

        container.innerHTML = `

            <div class="detalhes-vazio">

                Nenhuma execução encontrada
                no período selecionado.

            </div>

        `;

        return;

    }


    container.innerHTML =
        "";


    historico.forEach(
        item => {

            const aprovados =
                Number(
                    item.passed || 0
                );


            const total =
                Number(
                    item.total || 0
                );


            const taxaSucesso =
                Number(
                    item.successRate || 0
                );


            const percentualBarra =
                Math.min(
                    Math.max(
                        taxaSucesso,
                        0
                    ),
                    100
                );


            const linha =
                document.createElement(
                    "div"
                );


            linha.className =
                "linha-distribuicao-sucesso";


            linha.innerHTML = `

                <div class="sucesso-data">

                    ${formatarDataCurta(
                        item.data
                    )}

                </div>


                <div class="sucesso-barra-wrapper">

                    <div class="sucesso-barra">

                        <div
                            class="sucesso-barra-preenchimento"
                            style="width: ${percentualBarra}%"
                        ></div>

                    </div>

                </div>


                <div class="sucesso-aprovados">

                    <strong>
                        ${aprovados}
                    </strong>

                    <span>
                        / ${total}
                    </span>

                </div>


                <div class="sucesso-percentual">

                    ${taxaSucesso.toLocaleString(
                        "pt-BR",
                        {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2
                        }
                    )}%

                </div>

            `;


            container.appendChild(
                linha
            );

        }
    );

}


/* =========================================================
   TOP FALHAS RECORRENTES
========================================================= */

function carregarTopFalhas(
    dados,
    periodoSelecionado = {}
) {

    const container =
        document.getElementById(
            "topFalhas"
        );


    if (!container) {
        return;
    }


    const inicio =
        periodoSelecionado.inicio || "";

    const fim =
        periodoSelecionado.fim || "";


    let falhasDetalhadas =
        Array.isArray(
            dados.falhasDetalhadas
        )
            ? [...dados.falhasDetalhadas]
            : [];


    falhasDetalhadas =
        filtrarPorPeriodo(
            falhasDetalhadas,
            inicio,
            fim
        );


    if (
        falhasDetalhadas.length === 0
    ) {

        container.innerHTML = `

            <div class="detalhes-vazio">

                Nenhuma falha identificada
                no período.

            </div>

        `;

        return;

    }


    /* =====================================================
       AGRUPA SUITE + CENÁRIO
    ===================================================== */

    const agrupadas =
        {};


    falhasDetalhadas.forEach(
        item => {

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


            if (
                !agrupadas[chave]
            ) {

                agrupadas[chave] = {

                    suite,

                    cenario,

                    quantidade: 0

                };

            }


            agrupadas[chave]
                .quantidade++;

        }
    );


    /* =====================================================
       RANKING
    ===================================================== */

    const ranking =
        Object
            .values(
                agrupadas
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    b.quantidade -
                    a.quantidade
            )
            .slice(
                0,
                5
            );


    container.innerHTML =
        "";


    ranking.forEach(
        (
            item,
            indice
        ) => {

            const linha =
                document.createElement(
                    "div"
                );


            linha.className =
    "top-falha-item top-falha-clicavel";


linha.dataset.cenario =
    item.cenario;


linha.dataset.suite =
    item.suite;


linha.tabIndex =
    0;


linha.setAttribute(
    "role",
    "button"
);


linha.setAttribute(
    "title",
    "Clique para visualizar as ocorrências desta falha"
);


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

            linha.addEventListener(
    "click",
    () => {

        const input =
            document.getElementById(
                "buscarErro"
            );

        const filtroSuite =
            document.getElementById(
                "filtroSuite"
            );

        const secaoErros =
            document.getElementById(
                "listaErros"
            );


        if (input) {

            input.value =
                item.cenario;

        }


        if (filtroSuite) {

            filtroSuite.value =
                item.suite;

        }


        input?.dispatchEvent(
            new Event(
                "input",
                {
                    bubbles: true
                }
            )
        );


        setTimeout(
    () => {

        secaoErros?.scrollIntoView(
            {
                behavior:
                    "smooth",

                block:
                    "start"
            }
        );


        const cardsErros =
            document.querySelectorAll(
                ".erro-card"
            );


        cardsErros.forEach(
            card => {

                card.classList.remove(
                    "erro-destaque"
                );

                void card.offsetWidth;

                card.classList.add(
                    "erro-destaque"
                );


                setTimeout(
                    () => {

                        card.classList.remove(
                            "erro-destaque"
                        );

                    },
                    2500
                );

            }
        );

    },
    100
);

    }
);

linha.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            linha.click();

        }

    }
);

        }
    );

}


/* =========================================================
   LINHA DO TEMPO DAS FALHAS
========================================================= */

function carregarTimelineFalhas(
    dados,
    periodoSelecionado = {}
) {

    const container =
        document.getElementById(
            "timelineFalhas"
        );


    if (!container) {
        return;
    }


    const inicio =
        periodoSelecionado.inicio || "";

    const fim =
        periodoSelecionado.fim || "";


    let falhas =
        Array.isArray(
            dados.falhasDetalhadas
        )

            ? [...dados.falhasDetalhadas]

            : [];


    falhas =
        filtrarPorPeriodo(
            falhas,
            inicio,
            fim
        );


    if (
        falhas.length === 0
    ) {

        container.innerHTML = `

            <div class="detalhes-vazio">

                Nenhuma ocorrência detalhada
                disponível no período.

            </div>

        `;

        return;

    }


    /* =====================================================
       ORDENA POR DATA + HORA
    ===================================================== */

    falhas.sort(
        (
            a,
            b
        ) => {

            const dataA =
                `${a.data || ""} ${a.hora || ""}`;

            const dataB =
                `${b.data || ""} ${b.hora || ""}`;


            return dataA.localeCompare(
                dataB
            );

        }
    );


    container.innerHTML =
        "";


    falhas.forEach(
        item => {

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

        }
    );

}


/* =========================================================
   LISTA DE ERROS
========================================================= */

function carregarListaErros(

    dados,

    filtro = "",

    dataSelecionada = "",

    suiteSelecionada = "",

    periodoSelecionado = {}

) {

    const container =
        document.getElementById(
            "listaErros"
        );


    if (!container) {
        return;
    }


    const inicio =
        periodoSelecionado.inicio || "";

    const fim =
        periodoSelecionado.fim || "";


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

    let erros =
        falhasDetalhadas.length > 0

            ? [...falhasDetalhadas]

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


    /*
        Filtra o período recebido pela URL.

        Só aplicamos quando os itens possuem data.
    */

    if (
        falhasDetalhadas.length > 0
    ) {

        erros =
            filtrarPorPeriodo(
                erros,
                inicio,
                fim
            );

    }


    if (
        erros.length === 0
    ) {

        container.innerHTML = `

            <div class="detalhes-vazio">

                Nenhum erro detalhado foi
                identificado no período.

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
        erros.filter(
            item => {

                const suite =
                    String(
                        item.suite || ""
                    )
                        .toLowerCase();


                const cenario =
                    String(
                        item.cenario || ""
                    )
                        .toLowerCase();


                const erro =
                    String(
                        item.erro || ""
                    )
                        .toLowerCase();


                const data =
                    String(
                        item.data || ""
                    );


                const atendeBusca =

                    !termo ||

                    suite.includes(
                        termo
                    ) ||

                    cenario.includes(
                        termo
                    ) ||

                    erro.includes(
                        termo
                    ) ||

                    data.includes(
                        termo
                    );


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

            }
        );


    if (
        errosFiltrados.length === 0
    ) {

        container.innerHTML = `

            <div class="detalhes-vazio">

                Nenhum erro encontrado
                para os filtros informados.

            </div>

        `;

        return;

    }


    container.innerHTML =
        "";


    errosFiltrados.forEach(
        item => {

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

        }
    );

}


/* =========================================================
   BUSCA E FILTROS
========================================================= */

function configurarBusca(
    dados,
    periodoSelecionado = {}
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


    const inicioPeriodo =
        periodoSelecionado.inicio || "";

    const fimPeriodo =
        periodoSelecionado.fim || "";


    /*
        Trabalhamos somente com falhas
        pertencentes ao período atual.
    */

    const falhasDoPeriodo =
        filtrarPorPeriodo(
            falhasDetalhadas,
            inicioPeriodo,
            fimPeriodo
        );


    /* =====================================================
       PREENCHE DATAS
    ===================================================== */

    const datas = [

        ...new Set(

            falhasDoPeriodo
                .map(
                    item =>
                        item.data
                )
                .filter(
                    Boolean
                )

        )

    ]
        .sort();


    datas.forEach(
        data => {

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

        }
    );


    /* =====================================================
       PREENCHE SUITES
    ===================================================== */

    const suites = [

        ...new Set(

            falhasDoPeriodo
                .map(
                    item =>
                        item.suite
                )
                .filter(
                    Boolean
                )

        )

    ]
        .sort();


    suites.forEach(
        suite => {

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

        }
    );


    /* =====================================================
       PARÂMETROS RECEBIDOS PELA URL
    ===================================================== */

    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const dataURL =
        parametros.get(
            "data"
        );


    const cenarioURL =
        parametros.get(
            "cenario"
        );


    const suiteURL =
        parametros.get(
            "suite"
        );


    /* =====================================================
       SUITE RECEBIDA PELO RANKING
    ===================================================== */

    if (
        suiteURL &&
        filtroSuite
    ) {

        const existeSuite =
            [...filtroSuite.options]
                .some(
                    option =>
                        option.value ===
                        suiteURL
                );


        if (existeSuite) {

            filtroSuite.value =
                suiteURL;

        }

    }


    /* =====================================================
       CENÁRIO RECEBIDO PELO RANKING
    ===================================================== */

    if (
        cenarioURL &&
        input
    ) {

        input.value =
            cenarioURL;

    }


    /* =====================================================
       DATA RECEBIDA DA TELA DE EXECUÇÕES
    ===================================================== */

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
       FUNÇÃO CENTRAL DOS FILTROS
    ===================================================== */

    function aplicarFiltros() {

        carregarListaErros(

            dados,

            input?.value || "",

            filtroData?.value || "",

            filtroSuite?.value || "",

            periodoSelecionado

        );

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

                input.value =
                    "";

            }


            if (filtroData) {

                filtroData.value =
                    "";

            }


            if (filtroSuite) {

                filtroSuite.value =
                    "";

            }


            aplicarFiltros();

        }
    );


    /* =====================================================
       APLICA FILTRO INICIAL DA URL
    ===================================================== */

    if (
        dataURL ||
        cenarioURL ||
        suiteURL
    ) {

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
        )
            .split("-");


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
        )
            .split("-");


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