/* =========================================================
   CARREGAMENTO PRINCIPAL
========================================================= */

async function carregarExecucoes() {

    try {

        const resposta =
            await fetch("../historico/dashboard.json");

        if (!resposta.ok) {
            throw new Error(
                `Erro ao carregar dashboard.json: ${resposta.status}`
            );
        }

        const dados =
            await resposta.json();


        carregarPeriodoExecucoes(dados);

        carregarIndicadoresExecucoes(dados);

        carregarTabelaExecucoes(dados);

        configurarFiltrosExecucoes(dados);


    } catch (erro) {

        console.error(
            "Erro ao carregar detalhamento das execuções:",
            erro
        );

    }

}


/* =========================================================
   PERÍODO / HEADER
========================================================= */

function carregarPeriodoExecucoes(dados) {

    const periodo =
        document.getElementById("periodoExecucoes");

    const totalHeader =
        document.getElementById("totalExecucoesHeader");


    const historico =
        Array.isArray(dados.historico)
            ? dados.historico
            : [];


    if (historico.length === 0) {

        if (periodo) {
            periodo.textContent = "-";
        }

        if (totalHeader) {
            totalHeader.textContent = "0";
        }

        return;
    }


    const primeiraExecucao =
        historico[0];

    const ultimaExecucao =
        historico[historico.length - 1];


    if (periodo) {

        periodo.textContent =
            `${formatarData(primeiraExecucao.data)} a ` +
            `${formatarData(ultimaExecucao.data)}`;

    }


    if (totalHeader) {

        totalHeader.textContent =
            historico.length;

    }

}


/* =========================================================
   INDICADORES
========================================================= */

function carregarIndicadoresExecucoes(dados) {

    const resumo =
        dados.resumo || {};

    const historico =
        Array.isArray(dados.historico)
            ? dados.historico
            : [];


    animarContador(
        "execucoesCenarios",
        Number(resumo.cenarios || 0)
    );


    animarContador(
        "execucoesAprovados",
        Number(resumo.aprovados || 0)
    );


    animarContador(
        "execucoesFalhas",
        Number(resumo.falhas || 0)
    );


    animarContador(
        "execucoesTotal",
        historico.length
    );

}


/* =========================================================
   TABELA
========================================================= */

function carregarTabelaExecucoes(
    dados,
    dataSelecionada = "",
    statusSelecionado = ""
) {

    const tbody =
        document.querySelector(
            "#tabelaExecucoes tbody"
        );

    if (!tbody) {
        return;
    }


    const historico =
        Array.isArray(dados.historico)
            ? [...dados.historico]
            : [];


    const execucoesFiltradas =
        historico.filter(item => {

            const status =
                obterStatusExecucao(
                    Number(item.successRate || 0)
                );


            const atendeData =
                !dataSelecionada ||
                item.data === dataSelecionada;


            const atendeStatus =
                !statusSelecionado ||
                status === statusSelecionado;


            return (
                atendeData &&
                atendeStatus
            );

        });


    tbody.innerHTML = "";


    if (execucoesFiltradas.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td colspan="8">

                    <div class="execucoes-vazio">
                        Nenhuma execução encontrada
                        para os filtros selecionados.
                    </div>

                </td>

            </tr>

        `;

        return;

    }


    execucoesFiltradas
        .sort(
            (a, b) =>
                String(b.data)
                    .localeCompare(String(a.data))
        )
        .forEach(item => {

            const disponibilidade =
                Number(item.successRate || 0);


            const status =
                obterStatusExecucao(
                    disponibilidade
                );


            const statusTexto =
                obterTextoStatus(status);


            const classeStatus =
                obterClasseStatus(status);


            const falhas =
                Number(item.failed || 0);


            const linha =
                document.createElement("tr");


            let acaoFalhas;


            if (falhas > 0) {

                acaoFalhas = `

                    <a
                        href="detalhes.html?data=${encodeURIComponent(item.data)}"
                        class="btn-ver-falhas"
                    >
                        Ver falhas
                    </a>

                `;

            } else {

                acaoFalhas = `

                    <span
                        class="btn-ver-falhas desabilitado"
                    >
                        Sem falhas
                    </span>

                `;

            }


            linha.innerHTML = `

                <td>
                    ${formatarData(item.data)}
                </td>

                <td>
                    ${escaparHTML(item.hora || "-")}
                </td>

                <td>
                    ${Number(item.total || 0)}
                </td>

                <td>
                    ${Number(item.passed || 0)}
                </td>

                <td>
                    ${falhas}
                </td>

                <td>
                    ${disponibilidade.toFixed(2)}%
                </td>

                <td>

                    <span
                        class="execucao-status ${classeStatus}"
                    >
                        ${statusTexto}
                    </span>

                </td>

                <td>
                    ${acaoFalhas}
                </td>

            `;


            tbody.appendChild(linha);

        });

}


/* =========================================================
   FILTROS
========================================================= */

function configurarFiltrosExecucoes(dados) {

    const filtroData =
        document.getElementById(
            "filtroDataExecucao"
        );

    const filtroStatus =
        document.getElementById(
            "filtroStatusExecucao"
        );

    const btnLimpar =
        document.getElementById(
            "btnLimparFiltrosExecucao"
        );


    const historico =
        Array.isArray(dados.historico)
            ? dados.historico
            : [];


    /* =====================================================
       DATAS
    ===================================================== */

    const datas =
        [
            ...new Set(
                historico
                    .map(item => item.data)
                    .filter(Boolean)
            )
        ]
        .sort()
        .reverse();


    datas.forEach(data => {

        const option =
            document.createElement("option");

        option.value = data;

        option.textContent =
            formatarData(data);

        filtroData?.appendChild(option);

    });


    /* =====================================================
       APLICAR FILTROS
    ===================================================== */

    function aplicarFiltros() {

        carregarTabelaExecucoes(
            dados,
            filtroData?.value || "",
            filtroStatus?.value || ""
        );

    }


    filtroData?.addEventListener(
        "change",
        aplicarFiltros
    );


    filtroStatus?.addEventListener(
        "change",
        aplicarFiltros
    );


    btnLimpar?.addEventListener(
        "click",
        () => {

            if (filtroData) {
                filtroData.value = "";
            }

            if (filtroStatus) {
                filtroStatus.value = "";
            }

            aplicarFiltros();

        }
    );

}


/* =========================================================
   STATUS
========================================================= */

function obterStatusExecucao(disponibilidade) {

    if (disponibilidade === 100) {
        return "SUCESSO";
    }

    if (disponibilidade >= 95) {
        return "ATENCAO";
    }

    return "CRITICO";

}


function obterTextoStatus(status) {

    if (status === "SUCESSO") {
        return "SUCESSO";
    }

    if (status === "ATENCAO") {
        return "ATENÇÃO";
    }

    return "CRÍTICO";

}


function obterClasseStatus(status) {

    if (status === "SUCESSO") {
        return "execucao-sucesso";
    }

    if (status === "ATENCAO") {
        return "execucao-atencao";
    }

    return "execucao-critico";

}


/* =========================================================
   FORMATAÇÃO DE DATA
========================================================= */

function formatarData(data) {

    if (!data) {
        return "-";
    }

    const partes =
        String(data).split("-");

    if (partes.length !== 3) {
        return data;
    }

    return (
        `${partes[2]}/` +
        `${partes[1]}/` +
        `${partes[0]}`
    );

}


/* =========================================================
   CONTADOR ANIMADO
========================================================= */

function animarContador(
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


    const duracao =
        900;


    const inicio =
        performance.now();


    function atualizar(tempoAtual) {

        const progresso =
            Math.min(
                (tempoAtual - inicio) /
                duracao,
                1
            );


        const atual =
            Math.floor(
                valor * progresso
            );


        elemento.textContent =
            atual.toLocaleString(
                "pt-BR"
            );


        if (progresso < 1) {

            requestAnimationFrame(
                atualizar
            );

        } else {

            elemento.textContent =
                valor.toLocaleString(
                    "pt-BR"
                );

        }

    }


    requestAnimationFrame(
        atualizar
    );

}


/* =========================================================
   SEGURANÇA HTML
========================================================= */

function escaparHTML(valor) {

    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    carregarExecucoes
);