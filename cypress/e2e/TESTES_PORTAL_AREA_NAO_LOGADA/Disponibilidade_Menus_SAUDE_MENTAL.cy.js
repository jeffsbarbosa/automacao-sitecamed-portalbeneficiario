/// <reference types="cypress" />

import "cypress-real-events/support";

describe("Testes de Disponibilidade – Menu SAÚDE MENTAL", () => {
  beforeEach(() => {
    cy.acessarHomeCamedSaude();
    cy.abrirSaudeMental()
  });

  it("Deve validar a disponibilidade do item Saúde Mental", () => {
    
    cy.validarPagina('/saude-mental', 'Saúde Mental')
    cy.get('[class="saude__mental__title"]').should("be.visible");  

  });

  it("Deve validar a disponibilidade do item Blitz do Cuidado", () => {
   
    cy.get(".card-planos.blitz")
      .should("be.visible")
      .invoke("removeAttr", "target")
      .click();

    //Validando que a página da blitz do cuidado está sendo exibida após o clique

    cy.contains("Blitz do Cuidado").should("exist");
    
  });

  it("Deve validar disponibilidade do item Jornada do Cuidado", () => {
   
    cy.get(".card-planos.jornada")
      .should("be.visible")
      .invoke("removeAttr", "target")
      .click();

    //Validando que a página da jornada do cuidado está sendo exibida após o clique

    cy.contains("Jornada do Cuidado").should("exist");
    
  });

  it("Deve validar disponibilidade do item Cuidado Integrado", () => {
    
    cy.get(".card-planos.integrado")
      .should("be.visible")
      .invoke("removeAttr", "target")
      .click();

    //Validando que a página do Cuidado Integrado está sendo exibida após o clique

    cy.contains("Integrado").should("exist");
    
  });
});
