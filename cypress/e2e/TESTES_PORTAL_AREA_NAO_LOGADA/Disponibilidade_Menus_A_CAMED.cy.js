/// <reference types="cypress" />

import "cypress-real-events/support";
import utilidades from "../../support/PAGES/utilidades";

describe("Testes de Disponibilidade – Menu A CAMED", () => {
  beforeEach(() => {
    cy.acessarHomeCamedSaude();

    cy.viewport(1280, 800)

   cy.contains("A Camed", { timeout: 30000 })
  .should('be.visible')
  .realHover()
  
  });

  it("Deve validar que o menu História está disponível", () => {

    cy.contains("a", "História").should("be.visible").click();
    cy.validarPagina('/historia', 'História')
    cy.xpath("//h3[normalize-space()='Valores']").should("contain", "Valores");

  });

  it("Deve validar a disponibilidade do item Governança", () => {

    utilidades.acessarGovernanca()

  });

  it("Deve validar a disponibilidade do submenu Estatuto Social", () => {

    utilidades.acessarGovernanca()
       
    cy.url().should("include", "/governanca");
    
    cy.xpath("//p[normalize-space()='Estatuto social']")
      .should('contain', 'Estatuto')
      .click({force: true});
    
  });

  it("Deve validar a disponibilidade do submenu Organograma", () => {
    utilidades.acessarGovernanca()

    cy.contains('Organograma')
      .should("contain", "Organograma")
      .click();

    //Validando que abriu a tela do organograma.
    cy.get('[class="modal__title"]').should("contain", "Organograma");
  });
  
    it("Deve validar a disponibilidade do submenu Informes do Conselho Deliberativo", () => {

      utilidades.acessarGovernanca()

      cy.contains('Conselho Deliberativo')
        .invoke("removeAttr", "target").click()

      //validando um item da nova página aberta
      cy.contains("Conselho Deliberativo").should("be.visible");

    });

    it('Deve validar que o submenu Conselhos está disponível', () => {
      
      cy.contains("a", "Conselhos").should("be.visible").click();
      cy.validarPagina('/conselhos', 'Conselhos')

    })

    it('Deve validar que o submenu Diretoria está disponível', () => {
      
      cy.contains("a", "Diretoria").should("be.visible").click();
      cy.validarPagina('/diretoria', 'Diretoria')

    })

     it('Deve validar que o submenu Notícias está disponível', () => {
      
      cy.contains("a", "Notícias").should("be.visible").click();
      cy.validarPagina('/noticias', 'Notícias')

    })

     it('Deve validar que o submenu Identidade Corporativa está disponível', () => {
      
      cy.contains("a", "Identidade Corporativa").should("be.visible").click();
      cy.validarPagina('/identidade', 'Identidade corporativa')

    })    

    it('Deve validar que o submenu Relatório Anual está disponível', () => {
      
      cy.contains("a", "Relatório Anual").should("exist")

      .invoke('removeAttr', 'target')
      .click()
      
      cy.validarPagina('/relatorio-anual', 'Relatório Anual')
      cy.get('[class="far fa-file"]').eq(0)
      .invoke('removeAttr', 'target')
      .click({force:true})

    })

})