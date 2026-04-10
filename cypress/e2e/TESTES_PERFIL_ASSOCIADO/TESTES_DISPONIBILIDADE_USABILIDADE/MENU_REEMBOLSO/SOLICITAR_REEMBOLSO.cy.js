/// <reference types="cypress" />

import "cypress-real-events/support";
import utilidades from "../../../../support/PAGES/utilidades";

describe("Testes de Disponibilidade – Menu Reembolso", () => {
  beforeEach(() => {
    cy.homeBeneficiario();
    cy.loginValido();
    cy.entrarPerfilAssociado()
    utilidades.abrirMenuReembolso()
    utilidades.solicitarReembolso()    
})

it("Validando a disponibilidade do item Solicitar Reembolso", () => {
    
    //Validar que a página carregou corretamente
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/SolicitacaoDeReembolso.aspx')
    cy.get('h3').should('contain', 'Solicitação')

})

it.only('Fluxo de Solicitação de Reembolso com atendimento realizado', () => {

    //PASSO 1 - DADOS DO ATENDIMENTO
        
    cy.get('#idSelectAtendimentoRealizado').select(1)
    cy.get('#idDataAtendimento').type('2026-01-01')
    cy.get('#idSelectEstado').select(6)
    cy.get('#idSelectMunicipio').select(1)
    cy.get('#idSelectBeneficiario').select(1)
    cy.get('#idSelectMotivoSolicitacaoReembolso').select(1)
    cy.get('#idJustificativa').type('Teste automatizado fluxo de reembolso')
    //clique no botão Salvar
    cy.get('#submitButton1')
        .should('be.visible')
        .click()
    //marcar a opção de solicitante não identificado    
    cy.get('#idCheckSolicitanteIdentificado').check()
    cy.get('#idNomeSolicitante').type('TESTE AUTOMATIZADO')
    cy.get('#idSelectCBOSSolicitante').select(2)
    //clique no botão salvar
    cy.get('#submitButton2')
        .should('be.visible')
        .click()

    //Dados do executante    
    cy.get('#idCpfCnpjExecutante').type('11794674000121')
    cy.get('#btnBuscaExecutante').click()
        .should('be.visible')
        .click()
    cy.get('#btnBuscaExecutante')
        .should('not.be.empty')
    cy.get('#firstNextStep')
        .should('contain', 'Próximo')
        .and('be.visible')
        .click()

    //PASSO 2 - DADOS DOS PROCEDIMENTOS - TIPO CONSULTAS

    cy.get('#idSelectTipoAtendimento').select('CONSULTAS')
    cy.get('#idQtdSolicitada').type('1')
    cy.get('#idValorSolicitado').type('100')
    cy.get('#idSelectCondicaoAtendimento').select('Eletivo')
    cy.get('#idSelectCBOS').select(2)
    cy.get('#BotaoSalvarDadosReembolso')
        .should('be.visible')
        .click()
    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-confirm').click()
    //VALIDANDO DADOS DO RESUMO: 
    cy.get('#dadosPagamento-tab1').click()    

    //PASSO 3 - DADOS DO PAGAMENTO
    cy.get('#identificacaoAnexoProximo-tab1')
        .should('contain', 'Próximo')
        .click()

    //PASSO 4 - ANEXOS
    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-confirm').click()
    cy.get('#anexoN0').selectFile('cypress/fixtures/CUPOMFISCALBATERIA.pdf', {force: true})
    cy.get('.swal2-confirm').click()
    cy.get('#verificaTermo-tab1')
        .should('contain', 'Próximo')
        .click()
    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-confirm').click()

    //VALIDANDO QUE ESTÁ SENDO MOSTRADA A TELA DE RESUMO

    cy.get('.form-group > span').should('be.visible')



    




    


})



})