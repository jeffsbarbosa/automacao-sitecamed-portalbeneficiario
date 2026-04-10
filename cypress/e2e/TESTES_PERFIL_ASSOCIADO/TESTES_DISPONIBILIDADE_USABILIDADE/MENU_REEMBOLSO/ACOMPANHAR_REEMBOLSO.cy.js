/// <reference types="cypress" />

import "cypress-real-events/support";
import utilidades from "../../../../support/PAGES/utilidades";

describe("Testes de Disponibilidade – Menu Reembolso", () => {
  beforeEach(() => {
    cy.homeBeneficiario();
    cy.loginValido();
    cy.entrarPerfilAssociado()
    utilidades.abrirMenuReembolso()
})

it('Validando a disponibilidade do item Acompanhar Reembolso', () => {

    cy.xpath("//p[normalize-space()='Acompanhar Reembolso']")
        .should('contain', 'Acompanhar')
        .click()

    //Validar que a página carregou corretamente
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/ListarReembolso.aspx')
    cy.get('h3').should('contain', 'Acompanhar')

})

})