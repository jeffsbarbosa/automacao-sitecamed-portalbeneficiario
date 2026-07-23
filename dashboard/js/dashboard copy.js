fetch("../historico/dashboard.json")
    .then(response => response.json())
    .then(dados => {

        console.log("Dashboard carregado:");
        console.log(dados);

        document.getElementById("cenarios").textContent =
            dados.resumo.cenarios;

        document.getElementById("aprovados").textContent =
            dados.resumo.aprovados;

        document.getElementById("falhas").textContent =
            dados.resumo.falhas;

        document.getElementById("sucesso").textContent =
            dados.resumo.sucesso;
            
        const piorData = dados.resumo.piorDia.data.split("-");

        const piorDia =
            `${piorData[2]}/${piorData[1]}/${piorData[0]}`;

       const primeiro = dados.historico[0];
const ultimoPeriodo = dados.historico[dados.historico.length - 1];

const inicio = primeiro.data.split("-");
const fim = ultimoPeriodo.data.split("-");

const dataInicial = `${inicio[2]}/${inicio[1]}/${inicio[0]}`;
const dataFinal = `${fim[2]}/${fim[1]}/${fim[0]}`;

document.getElementById("textoResumo").innerHTML = `
Os testes automatizados de disponibilidade foram realizados no período de
<b>${dataInicial}</b> a <b>${dataFinal}</b>.

<br><br>

Foram executadas
<b>${dados.resumo.cenarios} validações automatizadas</b>.

<br><br>

A disponibilidade média da plataforma foi de
<b>${dados.resumo.sucesso}%</b>.

<br><br>

Foram identificadas
<b>${dados.resumo.falhas} falhas</b>,
distribuídas em
<b>${dados.resumo.diasComFalha} dias</b>.

<br><br>

O menor índice de disponibilidade ocorreu em
<b>${piorDia}</b>,
quando a plataforma apresentou
<b>${dados.resumo.piorDia.sucesso}%</b> de disponibilidade.
`;


const ultimo = dados.historico[dados.historico.length - 1];

const partes = ultimo.data.split("-");

const dataFormatada =
    `${partes[2]}/${partes[1]}/${partes[0]}`;

const horaFormatada = ultimo.hora.substring(0,5);

document.getElementById("ultimaAtualizacao").textContent =
    `${dataFormatada} às ${horaFormatada}`;

            const labels = dados.historico.map(item => item.data);

const valores = dados.historico.map(item => item.successRate);

const ctx = document
    .getElementById("graficoSucesso")
    .getContext("2d");

new Chart(ctx, {    

    type: "line",

    data: {

        labels: labels,

        datasets: [{

            label: "Taxa de Sucesso (%)",

            data: valores,

            borderColor: "#1565c0",

            backgroundColor: "rgba(21,101,192,0.15)",

            borderWidth: 3,

            fill: true,

            tension: 0.3

        }]

    },

    

    options: {

        responsive: true,

        plugins: {

            legend: {

                display: true

            }

        },

        scales: {

            y: {

                min: 1,

                max: 100

            }

        }

    }

});

const tbody = document.querySelector("#tabelaFalhas tbody");

tbody.innerHTML = "";

if (dados.rankingFalhas.length === 0) {

    tbody.innerHTML = `
        <tr>
            <td colspan="4"
                style="padding:20px;text-align:center;color:#2e7d32;font-weight:bold;">
                🎉 Nenhuma falha recorrente encontrada nesta semana.
            </td>
        </tr>
    `;

}
else {

    dados.rankingFalhas.forEach(item => {

        tbody.innerHTML += `
            <tr>

                <td style="padding:10px;text-align:center;">
                    ${item.quantidade}
                </td>

                <td style="padding:10px;">
                    ${item.suite}
                </td>

                <td style="padding:10px;">
                    ${item.cenario}
                </td>

                <td style="padding:10px;color:#c62828;">
                    ${item.ultimoErro}
                </td>

            </tr>
        `;

    });

}

    })
    .catch(erro => {

        console.error("Erro ao carregar dashboard:", erro);

    });