/// <reference types="cypress" />

import "cypress-real-events/support";

describe("Testes de Disponibilidade – Perfil Associado", () => {
  beforeEach(() => {
    cy.homeBeneficiario();
    cy.loginValido();
})

it('Disponibilidade do Perfil Associado', () => {

    cy.entrarPerfilAssociado()

})

})