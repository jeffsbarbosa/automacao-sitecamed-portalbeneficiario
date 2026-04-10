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

it('Validando disponibilidade do item Pronto Atendimento', () => {
    cy.xpath("//p[normalize-space()='Pronto Atendimento']")
        .should('contain', 'Pronto Atendimento')
        .click()
    
    //validar que a página carregou corretamente
    
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/TelemedicinaProntoAtendimento.aspx')
    cy.get('h3').should('contain', 'Pronto Atendimento')

})

})