/// <reference types="cypress" />

import "cypress-real-events/support";

describe("Testes de Disponibilidade – Menu CLINICAMED", () => {

  beforeEach(() => {
    cy.acessarHomeCamedSaude();
    
    cy.viewport(1280, 800)

   cy.contains("a", "Clinicamed", { timeout: 30000 })
      .should('be.visible')
      .realHover()

  })

it('Deve validar que a tela da Clinicamed está disponível', () => {
     cy.contains("Clinicamed")
      .should("be.visible")
      .click();

    cy.url().should("include", "/clinicamed");
    cy.contains('Agendar consulta').should('exist')
   

})

})