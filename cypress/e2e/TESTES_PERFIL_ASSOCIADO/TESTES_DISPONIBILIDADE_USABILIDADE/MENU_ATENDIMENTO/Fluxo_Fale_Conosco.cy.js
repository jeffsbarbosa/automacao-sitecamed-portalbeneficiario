/// <reference types="cypress" />

import "cypress-real-events/support";
import utilidades from "../../../../support/PAGES/utilidades";

describe("Testes de Disponibilidade – Fale Conosco", () => {
  beforeEach(() => {
    cy.homeBeneficiario();
    cy.loginValido();
    cy.entrarPerfilAssociado();
    utilidades.abrirMenuAtendimento();
    utilidades.abrirFaleConosco();

     cy.url({ timeout: 20000 })
    .should('include', '/CamedSaudeServicos/Servicos/Beneficiario/FaleConosco.aspx');
  });

  it("Disponibilidade submenu Fale Conosco", () => {
    
    cy.get("h3").should("contain", "Fale Conosco");
  });

  it("Validar envio de solicitação SEM anexo", () => {
    cy.fixture("formulariofaleconosco").then((dados) => {
      cy.preencherFaleConosco(dados, false); // sem anexo

      cy.botaoProximoFaleConosco().click();
      cy.get("h3").should("contain", "Dados do Fale Conosco");
    });
  });

  it("Validar envio de solicitação COM anexo", () => {

    cy.fixture("formulariofaleconosco").then((dados) => {
      cy.preencherFaleConosco(dados, true); // com anexo
      cy.botaoProximoFaleConosco().click();

      //anexando documento
      cy.get('.qq-uploader-selector > :nth-child(1) input[type="file"]').selectFile("cypress/fixtures/CUPOMFISCALBATERIA.pdf", { force: true });
      cy.contains("Anexar").should("be.visible").click();
      cy.wait(10000);

      cy.get('[id="Resumo-tab1"]').click();
      cy.contains("Dados do Fale Conosco");
    });
  });
});
