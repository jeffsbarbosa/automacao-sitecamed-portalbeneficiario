/// <reference types="cypress" />

import "cypress-real-events/support";
import utilidades from "../../../../support/PAGES/utilidades";

describe("Testes de Disponibilidade – Menu Financeiro", () => {
  beforeEach(() => {
    cy.homeBeneficiario();
    cy.loginValido();
    cy.entrarPerfilAssociado()
    utilidades.abrirMenuFinanceiro()
})

it('Validar disponibilidade do submenu 2ª via de Boleto', () => {

     cy.xpath("//p[normalize-space()='2ª via de Boleto']")
      .should('contain', 'Boleto')
      .click()

    //validar que a página carregou corretamente:
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/SegundaViaBoleto.aspx')
    cy.get('h3').should('contain', 'Boleto')
})

it('Validar disponibilidade do submenu Alteração de Dados Bancários', () => {

     cy.xpath("//p[normalize-space()='Dados Bancários']")
      .should('contain', 'Dados Bancários')
      .click()

    //validar que a página carregou corretamente:
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/AlteracaoDadosBancario.aspx')
    cy.get('h3').should('contain', 'Dados Bancários')

})

it('Validar disponibilidade do submenu Imposto de Renda', () => {

     cy.xpath("//p[normalize-space()='Imposto de Renda']")
      .should('contain', 'Renda')
      .click()

      //abrir o submenu 2ª via de demonstrativo imposto de renda
    cy.xpath('//p[normalize-space()="2ª via de Demonstrativo de Imposto de Renda"]').click()

    //validar que a página carregou corretamente:
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/DemonstrativoImpostoRenda.aspx')
    cy.get('h3').should('contain', 'Imposto de Renda')

    //clicando no botão Emitir Demonstrativo

   utilidades.emitirDemonstrativo()

})

})