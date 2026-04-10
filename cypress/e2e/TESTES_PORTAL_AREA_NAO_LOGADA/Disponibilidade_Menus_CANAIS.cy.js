/// <reference types="cypress" />

import "cypress-real-events/support";

describe("Testes de Disponibilidade – Menu CANAIS DE ATENDIMENTO", () => {
  beforeEach(() => {
    cy.acessarHomeCamedSaude();
    cy.contains("Canais de Atendimento").realHover();
  });

  it("Validando a disponibilidade do submenu FALE CONOSCO", () => {
    cy.contains("a", "Fale Conosco").should("be.visible").click();
    cy.validarPagina("/fale-conosco", "Fale conosco");
  });

  it("Validando a disponibilidade do link de whatsapp", () => {
    cy.contains("a", "Whatsapp")
      .should("be.visible")
      .and("have.attr", "href")
      .and("include", "api.whatsapp.com/send")
      .and("not.be.empty");
  });

  it("Validando a disponibilidade do submenu Atendimento Presencial", () => {
    cy.contains("a", "Atendimento Presencial").should("be.visible").click();
    cy.validarPagina("/atendimentos-presenciais", "Atendimentos Presenciais");
  });

  it("Validando a disponibilidade do submenu Ouvidoria", () => {
    cy.contains("a", "Ouvidoria").scrollIntoView().should("be.visible").click();
    cy.validarPagina("/ouvidoria", "Ouvidoria");
  });
});
