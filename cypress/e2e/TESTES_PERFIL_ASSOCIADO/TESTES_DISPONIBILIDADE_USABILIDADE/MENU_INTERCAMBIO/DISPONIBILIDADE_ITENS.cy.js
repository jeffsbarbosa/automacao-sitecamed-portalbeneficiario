/// <reference types="cypress" />

import "cypress-real-events/support";
import utilidades from "../../../../support/PAGES/utilidades";

describe("Testes de Disponibilidade – Menu Intercambio", () => {
  beforeEach(() => {
    cy.homeBeneficiario();
    cy.loginValido();
    cy.entrarPerfilAssociado()
    utilidades.abrirMenuIntercambio()
})

it('Validar disponibilidade do Menu Intercâmbio', () => { 

     cy.contains('Solicitação De Intercâmbio', { timeout: 20000 })
        .should('be.visible')
        .click()
    //Validar que a página carregou corretamente
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/SolicitacaoDeIntercambio.aspx')
    cy.get('h3').should('contain', 'Solicitação de Intercâmbio')

})

})
