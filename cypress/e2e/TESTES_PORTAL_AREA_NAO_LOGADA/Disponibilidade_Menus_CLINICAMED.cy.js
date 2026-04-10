/// <reference types="cypress" />

import "cypress-real-events/support";

describe("Testes de Disponibilidade – Menu CLINICAMED", () => {

  beforeEach(() => {
    cy.acessarHomeCamedSaude();
    cy.contains("Clinicamed").realHover();
  })

it('Validando que a tela da Clinicamed está disponível', () => {
     cy.contains("a", "Clinicamed")
      .should("be.visible")
      .click();

    cy.url().should("include", "/clinicamed");
    cy.contains('Agendar consulta')


})

})