/// <reference types="cypress" />

import "cypress-real-events/support";

describe("Testes de Disponibilidade – Menu SAÚDE PREVENTIVA", () => {

  beforeEach(() => {
    cy.acessarHomeCamedSaude();
    cy.abrirSaudePreventiva();
  });

  const submenus = [
    { nome: "Campanhas de Vacinação", url: "/campanhas-de-vacinacao", titulo: "Vacinação" },
    { nome: "Programa de Prevenção Odontológica - PPO", url: "/programa-prevencao-odontologica", titulo: "Programa de Prevenção Odontológica" },
    { nome: "Promovendo Saúde", url: "/promovendo-saude", titulo: "Promovendo Saúde" },
    { nome: "Blitz Saúde", url: "/blitz-saude", titulo: "Blitz Saúde" },
    { nome: "Grupo Vitalidade", url: "/grupo-vitalidade", titulo: "Grupo Vitalidade" },
    { nome: "Vida Leve", url: "/vida-leve", titulo: "Vida leve" },
    { nome: "OrtoVida", url: "/ortovida", titulo: "OrtoVida" },
    { nome: "CardioVida", url: "/cardiovida", titulo: "CardioVida" },
    { nome: "Cuidando de Você", url: "/cuidando-de-voce", titulo: "Cuidando de Você" },
    { nome: "Check-up 60+", url: "/check-up-60", titulo: "Check-up 60+" },
    { nome: "Programa Amigo da Família", url: "/programa-amigo-da-familia", titulo: "Programa Amigo da Família" },
    { nome: "Material Informativo", url: "/material-informativo", titulo: "Material Informativo" }
  ];

  submenus.forEach(({ nome, url, titulo }) => {

    it(`Deve validar a disponibilidade do submenu ${nome}`, () => {

      cy.contains("p", nome)
        .should("be.visible")
        .click();

      cy.validarPagina(url, titulo);

    });

  });

});