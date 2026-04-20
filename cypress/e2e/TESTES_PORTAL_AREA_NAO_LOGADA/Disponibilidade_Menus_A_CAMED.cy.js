/// <reference types="cypress" />

import "cypress-real-events/support";
import utilidades from "../../support/PAGES/utilidades";

describe("Testes de Disponibilidade – Menu A CAMED", () => {
 beforeEach(() => {
  cy.viewport(1280, 800)
  //cy.acessarHomeCamedSaude()
 cy.visit('https://www.camed.com.br')

cy.contains('a', 'A Camed', { timeout: 30000 }).realHover()
})

  it("Deve validar que o menu História está disponível", () => {

    cy.contains("a", "História")
      .should("exist")
      .click({ force: true });

    cy.validarPagina('/historia', 'História')

    cy.xpath("//h3[normalize-space()='Valores']")
      .should("contain", "Valores");

  });

  it("Deve validar a disponibilidade do item Governança", () => {

    utilidades.acessarGovernanca()

  });

  it("Deve validar a disponibilidade do submenu Estatuto Social", () => {

    utilidades.acessarGovernanca()
       
    cy.url().should("include", "/governanca");
    
    cy.xpath("//p[normalize-space()='Estatuto social']")
      .should('exist')
      .click({ force: true });
    
  });

  it("Deve validar a disponibilidade do submenu Organograma", () => {

    utilidades.acessarGovernanca()

    cy.contains('Organograma')
      .should("exist")
      .click({ force: true });

    cy.get('[class="modal__title"]')
      .should("contain", "Organograma");
  });
  
  it("Deve validar a disponibilidade do submenu Informes do Conselho Deliberativo", () => {

    utilidades.acessarGovernanca()

    cy.contains('Conselho Deliberativo')
      .invoke("removeAttr", "target")
      .click({ force: true });

    cy.contains("Conselho Deliberativo")
      .should("be.visible");

  });

  it('Deve validar que o submenu Conselhos está disponível', () => {
      
    cy.contains("a", "Conselhos")
      .should("exist")
      .click({ force: true });

    cy.validarPagina('/conselhos', 'Conselhos')

  });

  it('Deve validar que o submenu Diretoria está disponível', () => {
      
    cy.contains("a", "Diretoria")
      .should("exist")
      .click({ force: true });

    cy.validarPagina('/diretoria', 'Diretoria')

  });

  it('Deve validar que o submenu Notícias está disponível', () => {
      
    cy.contains("a", "Notícias")
      .should("exist")
      .click({ force: true });

    cy.validarPagina('/noticias', 'Notícias')

  });

  it('Deve validar que o submenu Identidade Corporativa está disponível', () => {
      
    cy.contains("a", "Identidade Corporativa")
      .should("exist")
      .click({ force: true });

    cy.validarPagina('/identidade', 'Identidade corporativa')

  });    

  it('Deve validar que o submenu Relatório Anual está disponível', () => {
      
    cy.contains("a", "Relatório Anual")
      .should("exist")
      .invoke('removeAttr', 'target')
      .click({ force: true });
      
    cy.validarPagina('/relatorio-anual', 'Relatório Anual')

    cy.get('[class="far fa-file"]').eq(0)
      .invoke('removeAttr', 'target')
      .click({ force:true })

  });

})