/// <reference types="cypress" />

import "cypress-real-events/support";
import utilidades from "../../../../support/PAGES/utilidades";

describe("Testes de Disponibilidade – Menu Telemedicina", () => {
  beforeEach(() => {
    cy.homeBeneficiario();
    cy.loginValido();
    cy.entrarPerfilAssociado()
    utilidades.abrirMenuTelemedicina()
})

it('Validar disponibilidade o item Agendar Consulta Telemedicina', () => {

    cy.xpath("//p[normalize-space()='Agendar Consulta Telemedicina']")
        .should('contain', 'Agendar Consulta')
        .click()
    
    //validar que a página carregou corretamente
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/Telemedicina.aspx')
    cy.get('h3').should('contain', 'Telemedicina e Teleconsulta')

    //validando a disponibilidade da tela de nova solicitação
    cy.get('[id="ContentPlaceHolder1_btnCriarSolicitacao"]')
        .should('contain', 'Nova Solicitação')
        .click()
    cy.get('h3').should('contain', 'Nova Solicitação de Telemedicina e Teleconsulta')
    
})   


})