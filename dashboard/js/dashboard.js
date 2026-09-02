/* =========================================================
   VARIÁVEIS GLOBAIS
========================================================= */

let dashboardSemanal = null;
let historicoCompleto = [];


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

carregarDashboard();


async function carregarDashboard() {

    try {

        const responseDashboard =
            await fetch("../historico/dashboard.json");

        if (!responseDashboard.ok) {

            throw new Error(
                `Não foi possível carregar o dashboard.json. Status: ${responseDashboard.status}`
            );

        }

        dashboardSemanal =
            await responseDashboard.json();


        const responseHistorico =
            await fetch("../historico/historico-completo.json");

        if (!responseHistorico.ok) {

            throw new Error(
                `Não foi possível carregar o historico-completo.json. Status: ${responseHistorico.status}`
            );

        }

        historicoCompleto =
            await responseHistorico.json();


        if (!Array.isArray(historicoCompleto)) {

            throw new Error(
                "Estrutura inválida no historico-completo.json."
            );

        }


        console.log(
            "Dashboard semanal:",
            dashboardSemanal
        );

        console.log(
            "Histórico completo:",
            historicoCompleto
        );


        renderizarDashboard(
            dashboardSemanal
        );


        configurarFiltroPeriodo();

    }
    catch (erro) {

        console.error(
            "Erro ao carregar dashboard:",
            erro
        );

        const textoResumo =
            document.getElementById("textoResumo");

        if (textoResumo) {

            textoResumo.textContent =
                "Não foi possível carregar os dados do relatório.";

        }

    }

}


/* =========================================================
   RENDERIZA TODAS AS ÁREAS
========================================================= */

function renderizarDashboard(dados) {

    carregarCards(dados);

    carregarInsights(dados);

    carregarResumo(dados);

    carregarUltimaAtualizacao(dados);

    carregarGrafico(dados);

    carregarHistorico(dados);

    carregarRanking(dados);

    carregarSaudeModulos(dados);

}

function carregarSaudeModulos(dados) {

    const container = document.getElementById("listaSaudeModulos");

    if (!container) {
        console.error("Elemento listaSaudeModulos não encontrado.");
        return;
    }

    const modulos = dados.saudeModulos;

    if (!modulos || !Array.isArray(modulos) || modulos.length === 0) {

        container.innerHTML = `
            <div class="modulo-saude carregando">
                Nenhuma informação de módulo disponível.
            </div>
        `;

        return;
    }

    container.innerHTML = "";

    modulos.forEach(modulo => {

        const disponibilidade = Number(modulo.disponibilidade || 0);

        let classeStatus = "";
        let textoStatus = "";
        let iconeStatus = "";

        if (modulo.status === "ESTAVEL") {

            classeStatus = "modulo-estavel";
            textoStatus = "ESTÁVEL";
            iconeStatus = "●";

        }
        else if (modulo.status === "ATENCAO") {

            classeStatus = "modulo-atencao";
            textoStatus = "ATENÇÃO";
            iconeStatus = "●";

        }
        else {

            classeStatus = "modulo-critico";
            textoStatus = "CRÍTICO";
            iconeStatus = "●";

        }

        container.innerHTML += `

            <div class="modulo-saude">

                <div class="modulo-info">

                    <strong>
                        ${modulo.nome}
                    </strong>

                    <span class="modulo-status ${classeStatus}">
                        ${iconeStatus} ${textoStatus}
                    </span>

                </div>

                <div class="modulo-disponibilidade">

                    <strong>
                        ${disponibilidade.toFixed(2)}%
                    </strong>

                    <span>
                        disponibilidade média
                    </span>

                </div>

                <div class="barra-saude">

                    <div
                        class="barra-saude-progresso ${classeStatus}"
                        style="width: ${Math.min(disponibilidade, 100)}%"
                    ></div>

                </div>

            </div>
        `;
    });
}


/* =========================================================
   CONFIGURAÇÃO DO FILTRO
========================================================= */

function configurarFiltroPeriodo() {

    const dataInicial =
        document.getElementById(
            "dataInicialFiltro"
        );

    const dataFinal =
        document.getElementById(
            "dataFinalFiltro"
        );

    const btnAplicar =
        document.getElementById(
            "btnAplicarPeriodo"
        );

    const btnRestaurar =
        document.getElementById(
            "btnPeriodoSemanal"
        );


    if (
        !dataInicial ||
        !dataFinal ||
        !btnAplicar ||
        !btnRestaurar
    ) {

        console.warn(
            "Elementos do filtro de período não encontrados."
        );

        return;

    }


    /* =====================================================
       PERÍODO PADRÃO DA SEMANA
    ===================================================== */

    if (
        dashboardSemanal?.periodo
    ) {

        dataInicial.value =
            dashboardSemanal.periodo.inicio;

        dataFinal.value =
            dashboardSemanal.periodo.fim;

    }
    else if (
        dashboardSemanal?.historico?.length
    ) {

        dataInicial.value =
            dashboardSemanal.historico[0].data;

        dataFinal.value =
            dashboardSemanal.historico[
                dashboardSemanal.historico.length - 1
            ].data;

    }


    /* =====================================================
       LIMITES DISPONÍVEIS NO HISTÓRICO
    ===================================================== */

    if (
        historicoCompleto.length > 0
    ) {

        const primeiraData =
            historicoCompleto[0].data;

        const ultimaData =
            historicoCompleto[
                historicoCompleto.length - 1
            ].data;


        dataInicial.min =
            primeiraData;

        dataInicial.max =
            ultimaData;


        dataFinal.min =
            primeiraData;

        dataFinal.max =
            ultimaData;

    }


    /* =====================================================
       PERÍODO RECEBIDO PELA URL
    ===================================================== */

    const parametrosURL =
        new URLSearchParams(
            window.location.search
        );


    const periodoInicioURL =
        parametrosURL.get(
            "inicio"
        );


    const periodoFimURL =
        parametrosURL.get(
            "fim"
        );


    /* =====================================================
       PERÍODO SALVO NA SESSÃO
    ===================================================== */

    const periodoInicioSalvo =
        sessionStorage.getItem(
            "dashboardPeriodoInicio"
        );


    const periodoFimSalvo =
        sessionStorage.getItem(
            "dashboardPeriodoFim"
        );


    /* =====================================================
       DEFINE QUAL PERÍODO SERÁ RESTAURADO

       PRIORIDADE:
       1 - URL
       2 - SESSION STORAGE
       3 - SEMANA PADRÃO
    ===================================================== */

    let periodoInicio =
        "";

    let periodoFim =
        "";

    let origemPeriodo =
        "";


    if (
        periodoInicioURL &&
        periodoFimURL
    ) {

        periodoInicio =
            periodoInicioURL;

        periodoFim =
            periodoFimURL;

        origemPeriodo =
            "url";

    }
    else if (
        periodoInicioSalvo &&
        periodoFimSalvo
    ) {

        periodoInicio =
            periodoInicioSalvo;

        periodoFim =
            periodoFimSalvo;

        origemPeriodo =
            "sessao";

    }


    /* =====================================================
       RESTAURA O PERÍODO
    ===================================================== */

    if (
        periodoInicio &&
        periodoFim
    ) {

        const periodoValido =
            periodoInicio <=
            periodoFim;


        if (periodoValido) {

            const execucoesFiltradas =
                historicoCompleto.filter(
                    item =>
                        item.data >=
                            periodoInicio &&
                        item.data <=
                            periodoFim
                );


            if (
                execucoesFiltradas.length > 0
            ) {

                dataInicial.value =
                    periodoInicio;

                dataFinal.value =
                    periodoFim;


                const dadosPeriodo =
                    montarDashboardPorPeriodo(
                        execucoesFiltradas,
                        periodoInicio,
                        periodoFim
                    );


                renderizarDashboard(
                    dadosPeriodo
                );


                /*
                    Mantém também na sessão.

                    Assim, depois que a URL definir
                    o período, a navegação continua
                    preservando o filtro.
                */

                sessionStorage.setItem(
                    "dashboardPeriodoInicio",
                    periodoInicio
                );


                sessionStorage.setItem(
                    "dashboardPeriodoFim",
                    periodoFim
                );


                if (
                    origemPeriodo ===
                    "url"
                ) {

                    mostrarMensagemFiltro(
                        `Período carregado: ${formatarData(periodoInicio)} a ${formatarData(periodoFim)}.`,
                        "sucesso"
                    );

                }
                else {

                    mostrarMensagemFiltro(
                        `Período restaurado: ${formatarData(periodoInicio)} a ${formatarData(periodoFim)}.`,
                        "sucesso"
                    );

                }

            }
            else {

                /*
                    Caso o período salvo não exista
                    mais no histórico.
                */

                if (
                    origemPeriodo ===
                    "sessao"
                ) {

                    sessionStorage.removeItem(
                        "dashboardPeriodoInicio"
                    );

                    sessionStorage.removeItem(
                        "dashboardPeriodoFim"
                    );

                }

            }

        }

    }


    /* =====================================================
       EVENTOS
    ===================================================== */

    btnAplicar.addEventListener(
        "click",
        aplicarFiltroPeriodo
    );


    btnRestaurar.addEventListener(
        "click",
        restaurarPeriodoSemanal
    );

}


/* =========================================================
   APLICA FILTRO PERSONALIZADO
========================================================= */

function aplicarFiltroPeriodo() {

    const inicio =
        document.getElementById(
            "dataInicialFiltro"
        ).value;

    const fim =
        document.getElementById(
            "dataFinalFiltro"
        ).value;


    if (!inicio || !fim) {

        mostrarMensagemFiltro(
            "Selecione a data inicial e a data final.",
            "erro"
        );

        return;

    }


    if (inicio > fim) {

        mostrarMensagemFiltro(
            "A data inicial não pode ser maior que a data final.",
            "erro"
        );

        return;

    }

    /* =========================================================
   SALVA PERÍODO SELECIONADO NA SESSÃO
========================================================= */

sessionStorage.setItem(
    "dashboardPeriodoInicio",
    inicio
);

sessionStorage.setItem(
    "dashboardPeriodoFim",
    fim
);


    const execucoesFiltradas =
        historicoCompleto.filter(
            item =>
                item.data >= inicio &&
                item.data <= fim
        );


    if (execucoesFiltradas.length === 0) {

        mostrarMensagemFiltro(
            "Nenhuma execução encontrada no período selecionado.",
            "erro"
        );

        return;

    }


    const dadosPeriodo =
        montarDashboardPorPeriodo(
            execucoesFiltradas,
            inicio,
            fim
        );


    renderizarDashboard(
        dadosPeriodo
    );


    mostrarMensagemFiltro(
        `Período aplicado: ${formatarData(inicio)} a ${formatarData(fim)}.`,
        "sucesso"
    );

}


/* =========================================================
   RESTAURA A SEMANA PADRÃO
========================================================= */

function restaurarPeriodoSemanal() {

    if (!dashboardSemanal) {
        return;
    }

    /* =========================================================
   REMOVE PERÍODO SALVO
========================================================= */

sessionStorage.removeItem(
    "dashboardPeriodoInicio"
);

sessionStorage.removeItem(
    "dashboardPeriodoFim"
);


    const dataInicial =
        document.getElementById(
            "dataInicialFiltro"
        );

    const dataFinal =
        document.getElementById(
            "dataFinalFiltro"
        );


    if (dashboardSemanal.periodo) {

        dataInicial.value =
            dashboardSemanal.periodo.inicio;

        dataFinal.value =
            dashboardSemanal.periodo.fim;

    }


    renderizarDashboard(
        dashboardSemanal
    );


    mostrarMensagemFiltro(
        "Período semanal restaurado.",
        "sucesso"
    );

}


/* =========================================================
   MENSAGEM DO FILTRO
========================================================= */

function mostrarMensagemFiltro(
    texto,
    tipo = ""
) {

    const elemento =
        document.getElementById(
            "mensagemFiltro"
        );

    if (!elemento) {
        return;
    }


    elemento.textContent =
        texto;


    elemento.classList.remove(
        "mensagem-sucesso",
        "mensagem-erro"
    );


    if (tipo === "sucesso") {

        elemento.classList.add(
            "mensagem-sucesso"
        );

    }


    if (tipo === "erro") {

        elemento.classList.add(
            "mensagem-erro"
        );

    }

}


/* =========================================================
   MONTA DASHBOARD PARA O PERÍODO ESCOLHIDO
========================================================= */

function montarDashboardPorPeriodo(
    execucoes,
    inicio,
    fim
) {

    const historico =
        execucoes
            .slice()
            .sort(
                (a, b) =>
                    a.data.localeCompare(
                        b.data
                    )
            );


    const dias =
        historico.length;


    const cenarios =
        historico.reduce(
            (total, item) =>
                total +
                Number(item.total || 0),
            0
        );


    const aprovados =
        historico.reduce(
            (total, item) =>
                total +
                Number(item.passed || 0),
            0
        );


    const falhas =
        historico.reduce(
            (total, item) =>
                total +
                Number(item.failed || 0),
            0
        );


    const diasComFalha =
        historico.filter(
            item =>
                Number(item.failed) > 0
        ).length;


    const somaSucesso =
        historico.reduce(
            (total, item) =>
                total +
                Number(
                    item.successRate || 0
                ),
            0
        );


    const sucesso =
        dias > 0
            ? Number(
                (
                    somaSucesso / dias
                ).toFixed(2)
            )
            : 0;


    const piorExecucao =
        historico.reduce(
            (pior, item) => {

                if (!pior) {
                    return item;
                }

                return (
                    Number(item.successRate) <
                    Number(pior.successRate)
                )
                    ? item
                    : pior;

            },
            null
        );


    let variacao = 0;

    let statusTendencia =
        "ESTAVEL";


    if (historico.length > 1) {

        variacao =
            Number(
                (
                    Number(
                        historico[
                            historico.length - 1
                        ].successRate
                    )
                    -
                    Number(
                        historico[0].successRate
                    )
                ).toFixed(2)
            );


        if (variacao > 0) {

            statusTendencia =
                "MELHORANDO";

        }
        else if (variacao < 0) {

            statusTendencia =
                "PIORANDO";

        }

    }


    const todasFalhas = [];
    const falhasDetalhadas = [];


    historico.forEach(
    execucao => {

        const falhasDia =
            normalizarTopFalhas(
                execucao.topFalhas
            );


        falhasDia.forEach(
            falha => {

                if (
                    falha &&
                    possuiTextoValido(
                        falha.suite
                    ) &&
                    possuiTextoValido(
                        falha.cenario
                    )
                ) {

                    const erro =
                        falha.erro ||
                        "Erro não informado";


                    todasFalhas.push(
                        {
                            suite:
                                falha.suite,

                            cenario:
                                falha.cenario,

                            erro
                        }
                    );


                    falhasDetalhadas.push(
                        {
                            data:
                                execucao.data,

                            hora:
                                execucao.hora || "-",

                            suite:
                                falha.suite,

                            cenario:
                                falha.cenario,

                            erro
                        }
                    );

                }

            }
        );

    }
);


    const mapaRanking =
        new Map();


    todasFalhas.forEach(
        falha => {

            const chave =
                `${falha.suite}|||${falha.cenario}`;


            if (
                !mapaRanking.has(
                    chave
                )
            ) {

                mapaRanking.set(
                    chave,
                    {
                        suite:
                            falha.suite,

                        cenario:
                            falha.cenario,

                        quantidade:
                            0,

                        ultimoErro:
                            falha.erro
                    }
                );

            }


            const registro =
                mapaRanking.get(
                    chave
                );


            registro.quantidade++;

            registro.ultimoErro =
                falha.erro;

        }
    );


    const rankingFalhas =
        Array.from(
            mapaRanking.values()
        )
        .sort(
            (a, b) =>
                b.quantidade -
                a.quantidade
        );


    const falhaMaisRecorrente =
        rankingFalhas.length > 0
            ? {
                suite:
                    rankingFalhas[0].suite,

                cenario:
                    rankingFalhas[0].cenario,

                quantidade:
                    rankingFalhas[0].quantidade
            }
            : {
                suite: "-",

                cenario:
                    "Nenhuma falha registrada",

                quantidade: 0
            };


    const mapaModulos =
        new Map();


    todasFalhas.forEach(
        falha => {

            const atual =
                mapaModulos.get(
                    falha.suite
                ) || 0;


            mapaModulos.set(
                falha.suite,
                atual + 1
            );

        }
    );


    let moduloMaisInstavel = {
        nome: "-",
        falhas: 0
    };


    mapaModulos.forEach(
        (quantidade, nome) => {

            if (
                quantidade >
                moduloMaisInstavel.falhas
            ) {

                moduloMaisInstavel = {
                    nome,
                    falhas:
                        quantidade
                };

            }

        }
    );


    let sequenciaAtual = 0;

    let maiorSequencia = 0;


    historico.forEach(
        item => {

            if (
                Number(item.failed) === 0
            ) {

                sequenciaAtual++;


                if (
                    sequenciaAtual >
                    maiorSequencia
                ) {

                    maiorSequencia =
                        sequenciaAtual;

                }

            }
            else {

                sequenciaAtual = 0;

            }

        }
    );

    /* =========================================================
   SAÚDE DOS MÓDULOS NO PERÍODO FILTRADO
========================================================= */

function calcularMediaModulo(campo) {

    const valores =
        historico
            .map(
                item =>
                    Number(item[campo])
            )
            .filter(
                valor =>
                    Number.isFinite(valor)
            );


    if (valores.length === 0) {
        return 0;
    }


    const soma =
        valores.reduce(
            (total, valor) =>
                total + valor,
            0
        );


    return Number(
        (
            soma /
            valores.length
        ).toFixed(2)
    );

}


function montarSaudeModulo(
    nome,
    disponibilidade
) {

    let status = "CRITICO";


    if (disponibilidade === 100) {

        status =
            "ESTAVEL";

    }
    else if (
        disponibilidade >= 95
    ) {

        status =
            "ATENCAO";

    }


    return {

        nome,

        disponibilidade,

        status

    };

}


const saudeModulos = [

    montarSaudeModulo(
        "HomePage",
        calcularMediaModulo(
            "homepage"
        )
    ),

    montarSaudeModulo(
        "Portal Camed",
        calcularMediaModulo(
            "portal"
        )
    ),

    montarSaudeModulo(
        "Perfil Associado",
        calcularMediaModulo(
            "perfil"
        )
    )

];


    return {

        periodo: {

            inicio,

            fim

        },

        resumo: {

            dias,

            cenarios,

            aprovados,

            falhas,

            diasComFalha,

            sucesso,

            piorDia: {

                data:
                    piorExecucao
                        ? piorExecucao.data
                        : "-",

                sucesso:
                    piorExecucao
                        ? Number(
                            piorExecucao.successRate
                        )
                        : 0

            },

            tendencia: {

                status:
                    statusTendencia,

                variacao

            }

        },

        historico,

        rankingFalhas,

        falhasDetalhadas,

        saudeModulos,
        
        
        insights: {

            falhaMaisRecorrente,

            moduloMaisInstavel,

            maiorSequenciaSemFalhas:
                maiorSequencia,

            execucaoPerfeita:
                historico.some(
                    item =>
                        Number(item.failed) === 0
                )

        }

    };

}


/* =========================================================
   NORMALIZA TOP FALHAS
========================================================= */

function normalizarTopFalhas(
    topFalhas
) {

    if (!topFalhas) {
        return [];
    }


    if (
        Array.isArray(
            topFalhas
        )
    ) {

        return topFalhas.filter(
            item =>
                item !== null &&
                item !== undefined
        );

    }


    if (
        Array.isArray(
            topFalhas.value
        )
    ) {

        return topFalhas.value.filter(
            item =>
                item !== null &&
                item !== undefined
        );

    }


    if (
        topFalhas.suite ||
        topFalhas.cenario
    ) {

        return [
            topFalhas
        ];

    }


    return [];

}


/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

function formatarData(data) {

    if (
        !data ||
        data === "-"
    ) {

        return "-";

    }


    const partes =
        data.split("-");


    if (
        partes.length !== 3
    ) {

        return data;

    }


    return (
        `${partes[2]}/${partes[1]}/${partes[0]}`
    );

}


function possuiTextoValido(
    valor
) {

    return (

        valor !== null &&

        valor !== undefined &&

        String(valor).trim() !== "" &&

        String(valor)
            .trim()
            .toLowerCase() !==
            "null" &&

        String(valor).trim() !== "-"

    );

}


function obterInsights(
    dados
) {

    const insights =
        dados.insights || {};


    return {

        falhaMaisRecorrente:

            insights
                .falhaMaisRecorrente ||

            {
                suite: "-",

                cenario:
                    "Nenhuma falha recorrente identificada",

                quantidade: 0
            },


        moduloMaisInstavel:

            insights
                .moduloMaisInstavel ||

            {
                nome: "-",

                falhas: 0
            },


        maiorSequenciaSemFalhas:

            Number(
                insights
                    .maiorSequenciaSemFalhas
            ) || 0

    };

}


/* =========================================================
   CARDS
========================================================= */

function carregarCards(
    dados
) {

    animarContador(
        "cenarios",
        Number(
            dados.resumo.cenarios
        ) || 0
    );


    animarContador(
        "aprovados",
        Number(
            dados.resumo.aprovados
        ) || 0
    );


    animarContador(
        "falhas",
        Number(
            dados.resumo.falhas
        ) || 0
    );


    animarContador(
        "sucesso",
        Number(
            dados.resumo.sucesso
        ) || 0,
        "%"
    );

    animarContador(
        "execucoes",
        dados.resumo.dias
    );


}


/* =========================================================
   RESUMO EXECUTIVO
========================================================= */

function carregarResumo(
    dados
) {

    const historico =
        dados.historico;


    if (
        historico.length === 0
    ) {

        document.getElementById(
            "periodo"
        ).textContent = "-";


        document.getElementById(
            "textoResumo"
        ).textContent =
            "Nenhuma execução foi localizada para o período analisado.";


        return;

    }


    const dataInicial =
        dados.periodo?.inicio
            ? formatarData(
                dados.periodo.inicio
            )
            : formatarData(
                historico[0].data
            );


    const dataFinal =
        dados.periodo?.fim
            ? formatarData(
                dados.periodo.fim
            )
            : formatarData(
                historico[
                    historico.length - 1
                ].data
            );


    document.getElementById(
        "periodo"
    ).textContent =
        `${dataInicial} a ${dataFinal}`;


    const piorDiaDados =
        dados.resumo.piorDia || {
            data: "-",
            sucesso: 0
        };


    const piorDia =
        formatarData(
            piorDiaDados.data
        );


    const tendencia =
        dados.resumo.tendencia || {
            status:
                "ESTAVEL",

            variacao: 0
        };


    const variacao =
        Number(
            tendencia.variacao
        ) || 0;


    let textoTendencia = "";


    if (
        tendencia.status ===
        "MELHORANDO"
    ) {

        textoTendencia =
            `Observou-se uma melhora de <b>${Math.abs(variacao).toFixed(2)}%</b> ` +
            `na disponibilidade ao longo do período analisado.`;

    }
    else if (
        tendencia.status ===
        "PIORANDO"
    ) {

        textoTendencia =
            `Foi identificada uma redução de ` +
            `<b>${Math.abs(variacao).toFixed(2)}%</b> na disponibilidade ` +
            `ao longo do período analisado.`;

    }
    else {

        textoTendencia =
            "O comportamento da aplicação permaneceu estável durante o período analisado.";

    }


    const insights =
        obterInsights(
            dados
        );


    const nomeModulo =
        possuiTextoValido(
            insights
                .moduloMaisInstavel
                .nome
        )
            ? insights
                .moduloMaisInstavel
                .nome
            : null;


    const nomeCenario =
        possuiTextoValido(
            insights
                .falhaMaisRecorrente
                .cenario
        )
            ? insights
                .falhaMaisRecorrente
                .cenario
            : null;


    let textoInsights = "";


    if (
        nomeModulo &&
        nomeCenario
    ) {

        textoInsights = `

            <br><br>

            As ocorrências concentraram-se principalmente no módulo
            <b>${nomeModulo}</b>,
            tendo como cenário de maior recorrência
            <b>${nomeCenario}</b>.

        `;

    }
    else if (
        Number(
            dados.resumo.falhas
        ) > 0
    ) {

        textoInsights = `

            <br><br>

            Foram registradas
            <b>${dados.resumo.falhas} falha(s)</b>
            durante o período analisado.

        `;

    }
    else {

        textoInsights = `

            <br><br>

            Não foram identificadas falhas durante o período analisado.

        `;

    }


    document.getElementById(
        "textoResumo"
    ).innerHTML = `

        Durante o período de
        <b>${dataInicial}</b> a
        <b>${dataFinal}</b>
        foram executados
        <b>${dados.resumo.cenarios}</b>
        cenários automatizados de disponibilidade.

        <br><br>

        A plataforma apresentou disponibilidade média de
        <b>${Number(dados.resumo.sucesso).toFixed(2)}%</b>,
        com
        <b>${dados.resumo.falhas}</b>
        falha(s) distribuída(s) em
        <b>${dados.resumo.diasComFalha}</b>
        dia(s).

        <br><br>

        O menor índice de disponibilidade foi registrado em
        <b>${piorDia}</b>,
        com
        <b>${Number(piorDiaDados.sucesso).toFixed(2)}%</b>.

        <br><br>

        ${textoTendencia}

        ${textoInsights}

    `;

}


/* =========================================================
   ÚLTIMA ATUALIZAÇÃO
========================================================= */

function carregarUltimaAtualizacao(
    dados
) {

    if (
        dados.historico.length === 0
    ) {

        document.getElementById(
            "ultimaAtualizacao"
        ).textContent = "-";

        return;

    }


    const ultimo =
        dados.historico[
            dados.historico.length - 1
        ];


    const dataFormatada =
        formatarData(
            ultimo.data
        );


    const horaFormatada =
        possuiTextoValido(
            ultimo.hora
        )
            ? String(
                ultimo.hora
            ).substring(
                0,
                5
            )
            : "--:--";


    document.getElementById(
        "ultimaAtualizacao"
    ).textContent =
        `${dataFormatada} às ${horaFormatada}`;

}


/* =========================================================
   GRÁFICO
========================================================= */

function carregarGrafico(
    dados
) {

    const canvas =
        document.getElementById(
            "graficoSucesso"
        );


    if (!canvas) {
        return;
    }


    if (
        window.graficoSucesso
        instanceof Chart
    ) {

        window.graficoSucesso
            .destroy();

    }


    if (
        dados.historico.length === 0
    ) {

        return;

    }


    const labels =
        dados.historico.map(
            item => {

                const partes =
                    item.data.split(
                        "-"
                    );


                return (
                    `${partes[2]}/${partes[1]}`
                );

            }
        );


    const valores =
        dados.historico.map(
            item =>
                Number(
                    item.successRate
                ) || 0
        );


    const menorValor =
        Math.max(

            0,

            Math.floor(
                Math.min(
                    ...valores
                ) - 2
            )

        );


    const ctx =
        canvas.getContext(
            "2d"
        );


    /* =====================================================
       PLUGIN DE RÓTULOS DOS PONTOS
    ====================================================== */

    const pluginRotulos = {

        id:
            "rotulosDisponibilidade",

        afterDatasetsDraw(chart) {

            const {
                ctx,
                data
            } = chart;


            ctx.save();


            ctx.font =
                "bold 12px Segoe UI";


            ctx.fillStyle =
                "#173b73";


            ctx.textAlign =
                "center";


            ctx.textBaseline =
                "bottom";


            data.datasets.forEach(
                (
                    dataset,
                    datasetIndex
                ) => {

                    const meta =
                        chart.getDatasetMeta(
                            datasetIndex
                        );


                    meta.data.forEach(
                        (
                            ponto,
                            index
                        ) => {

                            const valor =
                                Number(
                                    dataset
                                        .data[index]
                                );


                            if (
                                Number.isNaN(
                                    valor
                                )
                            ) {

                                return;

                            }


                            const texto =
                                valor.toFixed(2) +
                                "%";


                            ctx.fillText(
                                texto,
                                ponto.x,
                                ponto.y - 12
                            );

                        }
                    );

                }
            );


            ctx.restore();

        }

    };


    window.graficoSucesso =
        new Chart(
            ctx,
            {

                type: "line",

                data: {

                    labels,

                    datasets: [{

                        label:
                            "Disponibilidade (%)",

                        data:
                            valores,

                        borderColor:
                            "#1565c0",

                        backgroundColor:
                            "rgba(21,101,192,0.08)",

                        borderWidth:
                            4,

                        pointRadius:
                            5,

                        pointHoverRadius:
                            8,

                        pointHoverBorderWidth:
                            3,

                        pointHoverBackgroundColor:
                            "#ffffff",

                        pointHoverBorderColor:
                            "#1565c0",

                        pointBackgroundColor:
                            "#1565c0",

                        pointBorderColor:
                            "#ffffff",

                        pointBorderWidth:
                            2,

                        fill:
                            true,

                        tension:
                            0.45

                    }]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    animation: {

                        duration:
                            1200,

                        easing:
                            "easeOutQuart"

                    },

                    layout: {

                        padding: {

                            top:
                                38,

                            right:
                                20,

                            bottom:
                                10,

                            left:
                                10

                        }

                    },

                    plugins: {

                        legend: {

                            display:
                                false

                        },

                        tooltip: {

                            backgroundColor:
                                "#173b73",

                            padding:
                                12,

                            titleFont: {

                                size:
                                    14

                            },

                            bodyFont: {

                                size:
                                    13

                            },

                            callbacks: {

                                title(
                                    context
                                ) {

                                    return (
                                        `Data: ${context[0].label}`
                                    );

                                },

                                label(
                                    context
                                ) {

                                    const item =
                                        dados.historico[
                                            context.dataIndex
                                        ];


                                    return [

                                        `Disponibilidade: ${Number(item.successRate).toFixed(2)}%`,

                                        `Falhas: ${item.failed}`,

                                        `Cenários: ${item.total}`

                                    ];

                                }

                            }

                        }

                    },

                    scales: {

                        x: {

                            grid: {

                                display:
                                    false

                            }

                        },

                        y: {

                            min:
                                menorValor,

                            max:
                                100,

                            offset:
                                true,

                            ticks: {

                                stepSize:
                                    1,

                                callback:
                                    value =>
                                        value +
                                        "%"

                            }

                        }

                    }

                },

                plugins: [

                    pluginRotulos

                ]

            }
        );

}


/* =========================================================
   RANKING
========================================================= */

function carregarRanking(
    dados
) {

    const tbody =
        document.querySelector(
            "#tabelaFalhas tbody"
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    const rankingFalhas =
        Array.isArray(
            dados.rankingFalhas
        )
            ? dados
                .rankingFalhas
                .filter(
                    item =>
                        item &&

                        possuiTextoValido(
                            item.suite
                        ) &&

                        possuiTextoValido(
                            item.cenario
                        )
                )
            : [];


    if (
        rankingFalhas.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="3"
                    style="
                        padding:20px;
                        text-align:center;
                        color:#2e7d32;
                        font-weight:bold;
                    "
                >

                    Nenhuma falha recorrente encontrada no período.

                </td>

            </tr>

        `;


        return;

    }


rankingFalhas.forEach(
    item => {

        const ultimoErro =
            possuiTextoValido(
                item.ultimoErro
            )
                ? item.ultimoErro
                : "Erro não informado";


        const parametros =
            new URLSearchParams();

        parametros.set(
            "cenario",
            item.cenario
        );

        parametros.set(
            "suite",
            item.suite
        );

        if (
    dados.periodo?.inicio &&
    dados.periodo?.fim
) {

    parametros.set(
        "inicio",
        dados.periodo.inicio
    );

    parametros.set(
        "fim",
        dados.periodo.fim
    );

}

        if (
    dados.periodo?.inicio &&
    dados.periodo?.fim
) {

    parametros.set(
        "inicio",
        dados.periodo.inicio
    );

    parametros.set(
        "fim",
        dados.periodo.fim
    );

}


        tbody.innerHTML += `

            <tr
                class="ranking-clicavel"
                data-url="detalhes.html?${parametros.toString()}"
                tabindex="0"
                role="button"
            >

                <td>
                    ${item.quantidade || 0}
                </td>

                <td class="ranking-suite-cenario">

                    <strong>
                        ${item.suite}
                    </strong>

                    <span>
                        ${item.cenario}
                    </span>

                    <small class="ranking-ver-detalhes">
                        Ver ocorrências →
                    </small>

                </td>

                <td class="ranking-erro">

                    ${ultimoErro}

                </td>

            </tr>

        `;

    }
);

/* =========================================================
   CLIQUE NO RANKING
========================================================= */

const linhasRanking =
    tbody.querySelectorAll(
        ".ranking-clicavel"
    );


linhasRanking.forEach(
    linha => {

        const abrirDetalhes = () => {

            const url =
                linha.dataset.url;


            if (url) {

                window.location.href =
                    url;

            }

        };


        linha.addEventListener(
            "click",
            abrirDetalhes
        );


        linha.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    abrirDetalhes();

                }

            }
        );

    }
);

}


/* =========================================================
   HISTÓRICO
========================================================= */

function carregarHistorico(
    dados
) {

    const tbody =
        document.querySelector(
            "#tabelaHistorico tbody"
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    if (
        dados.historico.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td colspan="6">

                    Nenhuma execução localizada no período.

                </td>

            </tr>

        `;


        return;

    }


    dados.historico
        .slice()
        .reverse()
        .forEach(
            item => {

                const dataFormatada =
                    formatarData(
                        item.data
                    );


                const taxaSucesso =
                    Number(
                        item.successRate
                    ) || 0;


                let status = "";

                let classe = "";


                if (
                    taxaSucesso === 100
                ) {

                    status =
                        "SUCESSO";

                    classe =
                        "badge-sucesso";

                }
                else if (
                    taxaSucesso >= 95
                ) {

                    status =
                        "ATENÇÃO";

                    classe =
                        "badge-atencao";

                }
                else {

                    status =
                        "CRÍTICO";

                    classe =
                        "badge-critico";

                }


                const hora =
                    possuiTextoValido(
                        item.hora
                    )
                        ? String(
                            item.hora
                        ).substring(
                            0,
                            5
                        )
                        : "--:--";


                const classeLinha =
                    Number(
                        item.failed
                    ) > 0
                        ? "linha-falha"
                        : "";


                tbody.innerHTML += `

                    <tr class="${classeLinha}">

                        <td
                            style="
                                padding:10px;
                                text-align:center;
                            "
                        >

                            ${dataFormatada}

                        </td>

                        <td
                            style="
                                padding:10px;
                                text-align:center;
                            "
                        >
                            ${hora}
                        </td>

                        <td
                            style="
                                padding:10px;
                                text-align:center;
                            "
                        >
                            ${item.total}
                        </td>

                        <td
                            style="
                                padding:10px;
                                text-align:center;
                            "
                        >
                            ${item.failed}
                        </td>

                        <td
                            style="
                                padding:10px;
                                text-align:center;
                            "
                        >
                            ${taxaSucesso.toFixed(2)}%
                        </td>

                        <td
                            style="
                                padding:10px;
                                text-align:center;
                            "
                        >

                            <span
                                class="
                                    badge
                                    ${classe}
                                "
                            >

                                ${status}

                            </span>

                        </td>

                    </tr>

                `;

            }
        );

}


/* =========================================================
   CONTADORES
========================================================= */

function animarContador(
    id,
    valorFinal,
    sufixo = ""
) {

    const elemento =
        document.getElementById(
            id
        );


    if (!elemento) {
        return;
    }


    valorFinal =
        Number(
            valorFinal
        ) || 0;


    const duracao =
        1200;


    const fps =
        60;


    const totalFrames =
        duracao /
        (
            1000 /
            fps
        );


    const incremento =
        valorFinal /
        totalFrames;


    let valorAtual =
        0;


    const timer =
        setInterval(
            () => {

                valorAtual +=
                    incremento;


                if (
                    valorAtual >=
                    valorFinal
                ) {

                    valorAtual =
                        valorFinal;

                    clearInterval(
                        timer
                    );

                }


                if (
                    sufixo === "%"
                ) {

                    elemento.textContent =
                        valorAtual
                            .toFixed(2)
                        +
                        "%";

                }
                else {

                    elemento.textContent =
                        Math.floor(
                            valorAtual
                        );

                }

            },

            1000 / fps
        );

}


/* =========================================================
   INSIGHTS
========================================================= */

function carregarInsights(
    dados
) {

    const insights =
        obterInsights(
            dados
        );


    const falhaRecorrente =
        insights
            .falhaMaisRecorrente;


    const moduloInstavel =
        insights
            .moduloMaisInstavel;


    const sequenciaSemFalhas =
        insights
            .maiorSequenciaSemFalhas;


    const elementoFalha =
        document.getElementById(
            "falhaMaisRecorrente"
        );


    const detalheFalha =
        document.getElementById(
            "falhaMaisRecorrenteDetalhe"
        );


    const elementoModulo =
        document.getElementById(
            "moduloMaisInstavel"
        );


    const detalheModulo =
        document.getElementById(
            "moduloMaisInstavelDetalhe"
        );


    const elementoSequencia =
        document.getElementById(
            "maiorSequenciaSemFalhas"
        );


    if (elementoFalha) {

        elementoFalha.textContent =
            Number(
                falhaRecorrente
                    .quantidade
            ) > 0

                ? `${falhaRecorrente.quantidade} ocorrência(s)`

                : "Nenhuma ocorrência";

    }


    if (detalheFalha) {

        detalheFalha.textContent =
            possuiTextoValido(
                falhaRecorrente
                    .cenario
            )

                ? falhaRecorrente
                    .cenario

                : "Nenhuma falha recorrente identificada";

    }


    if (elementoModulo) {

        elementoModulo.textContent =
            possuiTextoValido(
                moduloInstavel.nome
            )

                ? moduloInstavel.nome

                : "Nenhum módulo identificado";

    }


    if (detalheModulo) {

        detalheModulo.textContent =
            Number(
                moduloInstavel.falhas
            ) > 0

                ? `${moduloInstavel.falhas} falha(s) registrada(s)`

                : "Nenhuma falha agrupada por módulo";

    }


    if (elementoSequencia) {

        elementoSequencia.textContent =
            `${sequenciaSemFalhas} dia(s)`;

    }

}

/* =========================================================
   NAVEGAÇÃO - DETALHAMENTO DE FALHAS
========================================================= */

const cardFalhas =
    document.getElementById("cardFalhas");

if (cardFalhas) {

    const abrirDetalhesFalhas = () => {

        const dataInicial =
            document.getElementById(
                "dataInicialFiltro"
            );

        const dataFinal =
            document.getElementById(
                "dataFinalFiltro"
            );


        let inicio =
            dataInicial?.value || "";

        let fim =
            dataFinal?.value || "";


        /*
         * Caso os campos do filtro não estejam disponíveis,
         * utiliza o período atualmente carregado no dashboard.
         */

        if (!inicio || !fim) {

            inicio =
                dashboardSemanal?.periodo?.inicio || "";

            fim =
                dashboardSemanal?.periodo?.fim || "";

        }


        const parametros =
            new URLSearchParams();

        parametros.set(
            "tipo",
            "falhas"
        );


        if (inicio) {

            parametros.set(
                "inicio",
                inicio
            );

        }


        if (fim) {

            parametros.set(
                "fim",
                fim
            );

        }


        window.location.href =
            `detalhes.html?${parametros.toString()}`;

    };


    cardFalhas.addEventListener(
        "click",
        abrirDetalhesFalhas
    );


    cardFalhas.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                abrirDetalhesFalhas();

            }

        }
    );

}

/* =========================================================
   NAVEGAÇÃO - DETALHAMENTO DAS EXECUÇÕES
========================================================= */

const cardExecucoes =
    document.getElementById("cardExecucoes");

if (cardExecucoes) {

    const abrirDetalhesExecucoes = () => {

        window.location.href =
            "execucoes.html";

    };


    cardExecucoes.addEventListener(
        "click",
        abrirDetalhesExecucoes
    );


    cardExecucoes.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                abrirDetalhesExecucoes();

            }

        }
    );

}