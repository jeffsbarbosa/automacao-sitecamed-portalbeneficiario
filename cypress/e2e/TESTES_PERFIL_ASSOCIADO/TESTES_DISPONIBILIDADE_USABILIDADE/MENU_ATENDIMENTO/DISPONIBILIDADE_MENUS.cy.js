/// <reference types="cypress" />

import "cypress-real-events/support";
import utilidades from "../../../../support/PAGES/utilidades";

describe("Testes de Disponibilidade – Menu Atendimento", () => {
  beforeEach(() => {
    cy.homeBeneficiario();
    cy.loginValido();
    cy.entrarPerfilAssociado()
    utilidades.abrirMenuAtendimento()
})

it('Disponibilidade submenu Autorizações', () => {
     cy.contains("p", "Autorizações")
      .should('contain', 'Autorizações')
      .click()

    //validar que a página carregou corretamente:
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/ConsultaAutorizacao.aspx')
    cy.get('h3').should('contain', 'Autorização')    

})

it('Disponibilidade submenu Protocolo de Atendimento', () => {

    cy.xpath("//p[normalize-space()='Protocolo de Atendimento']")
      .should('contain', 'Protocolo de Atendimento')
      .click()

       //validar que a página carregou corretamente:
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/ConsultaProtocolosAtendimento.aspx')
    cy.get('h3').should('contain', 'Protocolos de Atendimento')

    //validar a abertura de um protocolo
    cy.contains('Selecionar')
      .first()
      .click()
    cy.get('h4').should('contain', 'Itens do Atendimento')
    

})

})