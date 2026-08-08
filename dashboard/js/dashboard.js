carregarDashboard();

async function carregarDashboard() {

    try {

        const response = await fetch("../historico/dashboard.json");

        if (!response.ok) {
            throw new Error(
                `Não foi possível carregar o dashboard.json. Status: ${response.status}`
            );
        }

        const dados = await response.json();

        console.log("Dashboard carregado:", dados);

        if (!dados.resumo || !Array.isArray(dados.historico)) {
            throw new Error("Estrutura inválida no dashboard.json.");
        }

        carregarCards(dados);
        carregarInsights(dados);
        carregarResumo(dados);
        carregarUltimaAtualizacao(dados);
        carregarGrafico(dados);
        carregarHistorico(dados);
        carregarRanking(dados);

    }
    catch (erro) {

        console.error("Erro ao carregar dashboard:", erro);

        const textoResumo = document.getElementById("textoResumo");

        if (textoResumo) {
            textoResumo.textContent =
                "Não foi possível carregar os dados do relatório.";
        }

    }

}

/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

function formatarData(data) {

    if (!data || data === "-") {
        return "-";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}

function possuiTextoValido(valor) {

    return (
        valor !== null &&
        valor !== undefined &&
        String(valor).trim() !== "" &&
        String(valor).trim().toLowerCase() !== "null" &&
        String(valor).trim() !== "-"
    );

}

function obterInsights(dados) {

    const insights = dados.insights || {};

    return {

        falhaMaisRecorrente: insights.falhaMaisRecorrente || {
            suite: "-",
            cenario: "Nenhuma falha recorrente identificada",
            quantidade: 0
        },

        moduloMaisInstavel: insights.moduloMaisInstavel || {
            nome: "-",
            falhas: 0
        },

        maiorSequenciaSemFalhas:
            Number(insights.maiorSequenciaSemFalhas) || 0

    };

}

/* =========================================================
   CARDS PRINCIPAIS
========================================================= */

function carregarCards(dados) {

    animarContador(
        "cenarios",
        Number(dados.resumo.cenarios) || 0
    );

    animarContador(
        "aprovados",
        Number(dados.resumo.aprovados) || 0
    );

    animarContador(
        "falhas",
        Number(dados.resumo.falhas) || 0
    );

    animarContador(
        "sucesso",
        Number(dados.resumo.sucesso) || 0,
        "%"
    );

}

/* =========================================================
   RESUMO EXECUTIVO
========================================================= */

function carregarResumo(dados) {

    const historico = dados.historico;

    if (historico.length === 0) {

        document.getElementById("periodo").textContent = "-";

        document.getElementById("textoResumo").textContent =
            "Nenhuma execução foi localizada para o período analisado.";

        return;

    }

    const primeiro = historico[0];
    const ultimoPeriodo = historico[historico.length - 1];

    const dataInicial = formatarData(primeiro.data);
    const dataFinal = formatarData(ultimoPeriodo.data);

    document.getElementById("periodo").textContent =
        `${dataInicial} a ${dataFinal}`;

    const piorDiaDados = dados.resumo.piorDia || {
        data: "-",
        sucesso: 0
    };

    const piorDia = formatarData(piorDiaDados.data);

    const tendencia = dados.resumo.tendencia || {
        status: "ESTAVEL",
        variacao: 0
    };

    const variacao = Number(tendencia.variacao) || 0;

    let textoTendencia = "";

    if (tendencia.status === "MELHORANDO") {

        textoTendencia =
            `Observou-se uma melhora de <b>${Math.abs(variacao).toFixed(2)}%</b> ` +
            `na disponibilidade ao longo da semana.`;

    }
    else if (tendencia.status === "PIORANDO") {

        textoTendencia =
            `Foi identificada uma redução de ` +
            `<b>${Math.abs(variacao).toFixed(2)}%</b> na disponibilidade ` +
            `ao longo da semana, indicando necessidade de acompanhamento ` +
            `das ocorrências registradas.`;

    }
    else {

        textoTendencia =
            "O comportamento da aplicação permaneceu estável durante o período analisado.";

    }

    const insights = obterInsights(dados);

    const nomeModulo = possuiTextoValido(
        insights.moduloMaisInstavel.nome
    )
        ? insights.moduloMaisInstavel.nome
        : null;

    const nomeCenario = possuiTextoValido(
        insights.falhaMaisRecorrente.cenario
    )
        ? insights.falhaMaisRecorrente.cenario
        : null;

let textoInsights = "";

if (nomeModulo && nomeCenario) {

    textoInsights = `

    <br><br>

    As ocorrências concentraram-se principalmente no módulo
    <b>${nomeModulo}</b>,
    tendo como cenário de maior recorrência
    <b>${nomeCenario}</b>.

    `;

}
else if (dados.resumo.falhas > 0) {

    textoInsights = `

    <br><br>

    Foram registradas <b>${dados.resumo.falhas} falha(s)</b> durante o período analisado.
    Os detalhes das ocorrências podem ser consultados no <b>Ranking de Falhas</b> e no
    <b>Histórico das Execuções</b> apresentados abaixo.

    `;

}
else{

    textoInsights = `

    <br><br>

    Não foram identificadas falhas durante o período analisado.

    `;

}

    document.getElementById("textoResumo").innerHTML = `

        Durante o período de <b>${dataInicial}</b> a <b>${dataFinal}</b>
        foram executados
        <b>${dados.resumo.cenarios}</b>
        cenários automatizados de disponibilidade.

        <br><br>

        A plataforma apresentou disponibilidade média de
        <b>${Number(dados.resumo.sucesso).toFixed(2)}%</b>,
        com <b>${dados.resumo.falhas}</b> falha(s) distribuída(s) em
        <b>${dados.resumo.diasComFalha}</b> dia(s).

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

function carregarUltimaAtualizacao(dados) {

    if (dados.historico.length === 0) {

        document.getElementById("ultimaAtualizacao").textContent = "-";
        return;

    }

    const ultimo = dados.historico[dados.historico.length - 1];

    const dataFormatada = formatarData(ultimo.data);

    const horaFormatada = possuiTextoValido(ultimo.hora)
        ? String(ultimo.hora).substring(0, 5)
        : "--:--";

    document.getElementById("ultimaAtualizacao").textContent =
        `${dataFormatada} às ${horaFormatada}`;

}

/* =========================================================
   GRÁFICO
========================================================= */

function carregarGrafico(dados) {

    if (dados.historico.length === 0) {
        return;
    }

    const labels = dados.historico.map(item => {

        const partes = item.data.split("-");

        return `${partes[2]}/${partes[1]}`;

    });

    const valores = dados.historico.map(
        item => Number(item.successRate) || 0
    );

    const menorValor = Math.max(
        0,
        Math.floor(Math.min(...valores) - 2)
    );

    const canvas = document.getElementById("graficoSucesso");

    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext("2d");

    if (window.graficoSucesso instanceof Chart) {
        window.graficoSucesso.destroy();
    }

    window.graficoSucesso = new Chart(ctx, {

        type: "line",

        data: {

            labels,

            datasets: [{

                label: "Disponibilidade (%)",

                data: valores,

                borderColor: "#1565c0",

                backgroundColor: "rgba(21,101,192,0.08)",

                borderWidth: 4,

                pointRadius: 5,

                pointHoverRadius: 8,

                pointHoverBorderWidth: 3,

                pointHoverBackgroundColor: "#ffffff",

                pointHoverBorderColor: "#1565c0",

                pointBackgroundColor: "#1565c0",

                pointBorderColor: "#ffffff",

                pointBorderWidth: 2,

                fill: true,

                tension: 0.45

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            animation: {

                duration: 1200,
                easing: "easeOutQuart"

            },

            layout: {

                padding: {

                    top: 20,
                    right: 15,
                    bottom: 10,
                    left: 10

                }

            },

            plugins: {

                legend: {

                    display: false

                },

                tooltip: {

                    backgroundColor: "#173b73",

                    padding: 12,

                    titleFont: {

                        size: 14

                    },

                    bodyFont: {

                        size: 13

                    },

                    callbacks: {

                        title(context) {

                            return `Data: ${context[0].label}`;

                        },

                        label(context) {

                            const item =
                                dados.historico[context.dataIndex];

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

                        display: false

                    }

                },

                y: {

                    min: menorValor,

                    max: 100,

                    offset: true,

                    ticks: {

                        stepSize: 1,

                        callback: value => value + "%"

                    }

                }

            }

        }

    });

}

/* =========================================================
   RANKING DE FALHAS
========================================================= */

function carregarRanking(dados) {

    const tbody = document.querySelector("#tabelaFalhas tbody");

    if (!tbody) {
        return;
    }

    tbody.innerHTML = "";

    const rankingFalhas = Array.isArray(dados.rankingFalhas)
        ? dados.rankingFalhas.filter(item =>
            item &&
            possuiTextoValido(item.suite) &&
            possuiTextoValido(item.cenario)
        )
        : [];

    if (rankingFalhas.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="4"
                    style="
                        padding:20px;
                        text-align:center;
                        color:#2e7d32;
                        font-weight:bold;
                    "
                >
                    🎉 Nenhuma falha recorrente encontrada nesta semana.
                </td>
            </tr>
        `;

        return;

    }

    rankingFalhas.forEach(item => {

        const ultimoErro = possuiTextoValido(item.ultimoErro)
            ? item.ultimoErro
            : "Erro não informado";

        tbody.innerHTML += `
            <tr>

                <td style="padding:10px;text-align:center;">
                    ${item.quantidade || 0}
                </td>

                <td style="padding:10px;">
                    ${item.suite}
                </td>

                <td style="padding:10px;">
                    ${item.cenario}
                </td>

                <td style="padding:10px;color:#c62828;">
                    ${ultimoErro}
                </td>

            </tr>
        `;

    });

}

/* =========================================================
   HISTÓRICO
========================================================= */

function carregarHistorico(dados) {

    const tbody = document.querySelector("#tabelaHistorico tbody");

    if (!tbody) {
        return;
    }

    tbody.innerHTML = "";

    if (dados.historico.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    Nenhuma execução localizada no período.
                </td>
            <tr class="${item.failed > 0 ? 'linha-falha' : ''}">
        `;

        return;

    }

    dados.historico
        .slice()
        .reverse()
        .forEach((item,index) => {

            const dataFormatada = formatarData(item.data);

            const taxaSucesso = Number(item.successRate) || 0;

            let status = "";
            let classe = "";

            if (taxaSucesso === 100) {

                status = "SUCESSO";
                classe = "badge-sucesso";

            }
            else if (taxaSucesso >= 95) {

                status = "ATENÇÃO";
                classe = "badge-atencao";

            }
            else {

                status = "CRÍTICO";
                classe = "badge-critico";

            }

            const hora = possuiTextoValido(item.hora)
                ? String(item.hora).substring(0, 5)
                : "--:--";

            tbody.innerHTML += `
                <tr>

                    <td style="padding:10px;text-align:center;">
                        ${dataFormatada}
                        ${index === 0
                        ? '<span class="badge-recente"></span>'
                        : ''}
                    </td>

                    <td style="padding:10px;text-align:center;">
                        ${hora}
                    </td>

                    <td style="padding:10px;text-align:center;">
                        ${item.total}
                    </td>

                    <td style="padding:10px;text-align:center;">
                        ${item.failed}
                    </td>

                    <td style="padding:10px;text-align:center;">
                        ${taxaSucesso.toFixed(2)}%
                    </td>

                    <td style="padding:10px;text-align:center;">

                        <span class="badge ${classe}">
                            ${status}
                        </span>

                    </td>

                </tr>
            `;

        });

}

/* =========================================================
   ANIMAÇÃO DOS CONTADORES
========================================================= */

function animarContador(id, valorFinal, sufixo = "") {

    const elemento = document.getElementById(id);

    if (!elemento) {
        return;
    }

    valorFinal = Number(valorFinal) || 0;

    const duracao = 1200;
    const fps = 60;

    const totalFrames = duracao / (1000 / fps);

    const incremento = valorFinal / totalFrames;

    let valorAtual = 0;

    const timer = setInterval(() => {

        valorAtual += incremento;

        if (valorAtual >= valorFinal) {

            valorAtual = valorFinal;

            clearInterval(timer);

        }

        if (sufixo === "%") {

            elemento.textContent =
                valorAtual.toFixed(2) + "%";

        }
        else {

            elemento.textContent =
                Math.floor(valorAtual);

        }

    }, 1000 / fps);

}

/* =========================================================
   INSIGHTS DA SEMANA
========================================================= */

function carregarInsights(dados) {

    const insights = obterInsights(dados);

    const falhaRecorrente =
        insights.falhaMaisRecorrente;

    const moduloInstavel =
        insights.moduloMaisInstavel;

    const sequenciaSemFalhas =
        insights.maiorSequenciaSemFalhas;

    const elementoFalha =
        document.getElementById("falhaMaisRecorrente");

    const detalheFalha =
        document.getElementById("falhaMaisRecorrenteDetalhe");

    const elementoModulo =
        document.getElementById("moduloMaisInstavel");

    const detalheModulo =
        document.getElementById("moduloMaisInstavelDetalhe");

    const elementoSequencia =
        document.getElementById("maiorSequenciaSemFalhas");

    if (elementoFalha) {

        elementoFalha.textContent =
            Number(falhaRecorrente.quantidade) > 0
                ? `${falhaRecorrente.quantidade} ocorrência(s)`
                : "Nenhuma ocorrência";

    }

    if (detalheFalha) {

        detalheFalha.textContent =
            possuiTextoValido(falhaRecorrente.cenario)
                ? falhaRecorrente.cenario
                : "Nenhuma falha recorrente identificada";

    }

    if (elementoModulo) {

        elementoModulo.textContent =
            possuiTextoValido(moduloInstavel.nome)
                ? moduloInstavel.nome
                : "Nenhum módulo identificado";

    }

    if (detalheModulo) {

        detalheModulo.textContent =
            Number(moduloInstavel.falhas) > 0
                ? `${moduloInstavel.falhas} falha(s) registrada(s)`
                : "Nenhuma falha agrupada por módulo";

    }

    if (elementoSequencia) {

        elementoSequencia.textContent =
            `${sequenciaSemFalhas} dia(s)`;

    }

}