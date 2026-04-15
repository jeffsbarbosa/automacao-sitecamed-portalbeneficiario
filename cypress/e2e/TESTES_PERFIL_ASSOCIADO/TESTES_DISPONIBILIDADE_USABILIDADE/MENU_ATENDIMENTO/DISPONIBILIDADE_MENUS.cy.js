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

it('Disponibilidade submenu Clinicamed', () => {

  cy.xpath("//p[normalize-space()='CliniCamed']")
      .should('contain', 'CliniCamed')
      .click()

    //validar que a página carregou corretamente:
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/CliniCamedAgendaVirtual.aspx')
    cy.get('h3').should('contain', 'CliniCamed Agenda Virtual')

    //validar redirecionamento para o healthmap

    cy.get('#idlinkCliniCamed')
      .should('contain', 'ACESSAR')
      .invoke('removeAttr', 'target')
      .click()
    
    //validando que foi aberto o healthmap

    cy.origin('https://camed.healthmap.com.br', () => {
    
    cy.get('[placeholder="Login"]')
      .should('be.visible')
    
  })   

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