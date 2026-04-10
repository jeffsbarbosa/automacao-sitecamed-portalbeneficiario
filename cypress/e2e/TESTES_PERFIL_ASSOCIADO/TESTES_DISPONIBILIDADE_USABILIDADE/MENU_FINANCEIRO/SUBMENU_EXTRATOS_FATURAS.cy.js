/// <reference types="cypress" />

import "cypress-real-events/support";
import utilidades from "../../../../support/PAGES/utilidades";

describe("Testes de Disponibilidade – Submenu Extratos e Faturas", () => {
  beforeEach(() => {
    cy.homeBeneficiario();
    cy.loginValido();
    cy.entrarPerfilAssociado()
    utilidades.abrirMenuFinanceiro()
    utilidades.abrirSubmenuExtratosFaturas()
})

it('Validar disponibilidade do item Declaração de Quitação Anual', () => {
    
    cy.xpath("//p[normalize-space()='Declaração de Quitação Anual']")
        .should('contain', 'Quitação')
        .click()

    //validar que a página carregou corretamente:
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/DeclaracaoQuitacaoAnual.aspx')
    cy.get('h3').should('contain', 'Quitação Anual')

  utilidades.emitirDeclaracao()

})

it('Validando disponibilidade do item Declaração por Tempo de Plano', () => {

     cy.xpath("//p[normalize-space()='Declaração por Tempo de Plano']")
        .should('contain', 'Tempo de Plano')
        .click()

    //validar que a página carregou corretamente:
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/DeclaracaoTempoDePlano.aspx')
    cy.get('h3').should('contain', 'Tempo de Plano')

   utilidades.emitirDeclaracao()

})

it('Validando disponibilidade do item Demonstrativo de Limites Contratuais', () => {

      cy.xpath("//p[normalize-space()='Demonstrativo de Limites Contratuais']")
        .should('contain', 'Limites Contratuais')
        .click()

    //validar que a página carregou corretamente:
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/DemonstrativoDeLimitesContratuais.aspx')
    cy.get('h3').should('contain', 'Limites Contratuais')

})

it('Validando disponibilidade do item Demonstrativo de Mensalidades, Taxas e Copartipação Financeira', () => {

    cy.xpath("//p[contains(text(),'Demonstrativo de Mensalidades, Taxas e Coparticipa')]")
        .should('contain', 'Coparticipação')
        .click()

    //validar que a página carregou corretamente:
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/DemonstrativoDeUtilizacao.aspx')
    cy.get('h3').should('contain', 'Coparticipação Financeira')

   utilidades.emitirDemonstrativo()

})

it('Validando disponibilidade do item Demonstrativo de Utilização por Data de Atendimento', () => {

    cy.xpath("//p[contains(text(),'Demonstrativo de Utilização por Data de Atendiment')]")
        .should('contain', 'Data de Atendimento')
        .click()

    //validar que a página carregou corretamente:
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/DemonstrativoUtilizacaoPorData.aspx')
    cy.get('h3').should('contain', 'Data de Atendimento')

    utilidades.emitirDemonstrativo()

})

})