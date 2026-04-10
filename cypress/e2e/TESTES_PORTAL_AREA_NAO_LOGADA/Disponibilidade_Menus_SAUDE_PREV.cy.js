/// <reference types="cypress" />

import "cypress-real-events/support";

describe("Testes de Disponibilidade – Menu SAÚDE PREVENTIVA", () => {
  beforeEach(() => {
    cy.acessarHomeCamedSaude();
    cy.abrirSaudePreventiva();
  });

  it("Deve validar a disponibilidade do item Saúde Preventiva", () => {
    cy.validarPagina("/saude-preventiva", "Saúde Preventiva");
  });

  it("Deve validar a disponibilidade do submenu Campanhas de Vacinação", () => {
    cy.contains("p", "Campanhas de Vacinação").should("be.visible").click();

    cy.validarPagina("/campanhas-de-vacinacao", "Vacinação");
  });

  it("Deve validar a disponibilidade do submenu Programa de Prevenção Odontológica - PPO", () => {
    cy.contains("p", "Programa de Prevenção Odontológica - PPO")
      .should("be.visible")
      .click();

    cy.validarPagina("/programa-prevencao-odontologica","Programa de Prevenção Odontológica",);
  });

  it("Deve validar a disponibilidade do submenu Promovendo Saúde", () => {
    cy.contains("p", "Promovendo Saúde").should("be.visible").click();

    cy.validarPagina("/promovendo-saude", "Promovendo Saúde");
  });

  it("Deve validar a disponibilidade do submenu Blitz Saúde", () => {
    cy.contains("p", "Blitz Saúde").should("be.visible").click();

    cy.validarPagina("/blitz-saude", "Blitz Saúde");
  });

  it("Deve validar a disponibilidade do submenu Grupo Vitalidade", () => {
    cy.contains("p", "Grupo Vitalidade").should("be.visible").click();

    cy.validarPagina("/grupo-vitalidade", "Grupo Vitalidade");
  });

  it("Deve validar a disponibilidade do submenu Vida Leve", () => {
    cy.contains("p", "Vida Leve").should("be.visible").click();

    cy.validarPagina("/vida-leve", "Vida leve");
  });

  it("Deve validar a disponibilidade do submenu OrtoVida", () => {
    cy.contains("p", "OrtoVida").should("be.visible").click();

    cy.validarPagina("/ortovida", "OrtoVida");
  });

  it("Deve validar a disponibilidade do submenu CardioVida", () => {
    cy.contains("p", "CardioVida").should("be.visible").click();

    cy.validarPagina("/cardiovida", "CardioVida");
  });

  it("Deve validar a disponibilidade do submenu Cuidando de Você", () => {
    cy.contains("p", "Cuidando de Você").should("be.visible").click();

    cy.validarPagina("/cuidando-de-voce", "Cuidando de Você");
  });

  it("Deve validar a disponibilidade do submenu Check-up 60+", () => {
    cy.contains("p", "Check-up 60+").should("be.visible").click();

    cy.validarPagina("/check-up-60", "Check-up 60+");
  });

  it("Deve validar a disponibilidade do submenu Programa Amigo da Família", () => {
    cy.contains("p", "Programa Amigo da Família").should("be.visible").click();

    cy.validarPagina("/programa-amigo-da-familia", "Programa Amigo da Família");
  });

  it("Deve validar disponibilidade do submenu Material Informativo", () => {
    cy.contains("p", "Material Informativo").should("be.visible").click();

    cy.validarPagina("/material-informativo", "Material Informativo");
  });
});
