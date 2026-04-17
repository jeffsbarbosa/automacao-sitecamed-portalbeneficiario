/// <reference types="cypress" />

import "cypress-real-events/support";

describe("Testes de Disponibilidade – Menu PLANOS", () => {
  beforeEach(() => {
    cy.acessarHomeCamedSaude();
    
    cy.viewport(1280, 800)

    cy.contains("span", "Planos", { timeout: 30000 })
      .should('be.visible')
      .realHover()
  })

it('Deve validar a disponibilidade do Submenu Nossos Planos', () => {

     cy.contains("Nossos Planos")
      .should("be.visible")
      .click();

    cy.validarPagina("/planos", "Nossos planos");    
    
})

it('Deve validar a disponibilidade PLANO NATURAL EMPRESA', () => {

    cy.contains("a", "Nossos Planos")
      .should("be.visible")
      .click();

    //saiba mais PLANO NATURAL EMPRESA
    cy.get('.info__content')
      .eq(0)
      .contains('Saiba mais')
      .click()

    //validando que a página abriu

    cy.validarPagina('/plano-natural-emp', 'Plano Natural Emp')
   
    //validando disponibilidade de adesão ao plano - titular

    cy.xpath("//a[normalize-space()='Adesão ao Plano - Titular']")
        .should('be.visible')
        .click()  

    //validando disponibilidade de adesão ao plano - dependente

    cy.xpath("//a[normalize-space()='Adesão ao Plano - Dependente']")
        .should('be.visible')        
        .click()
      
}),

it('Deve validar disponibilidade PLANO FAMÍLIA EMPRESA', () => {

    cy.contains("a", "Nossos Planos")
      .should("be.visible")
      .click();

    //saiba mais PLANO NATURAL EMPRESA

    cy.get('.info__content')
      .eq(1)
      .contains('Saiba mais')
      .click()
   
    cy.validarPagina('/plano-familia-emp', 'Plano Família Emp')

    //validando disponibilidade de adesão ao plano - titular

    cy.xpath("//a[normalize-space()='Adesão ao Plano - Titular']")
        .should('be.visible')
        .click()              

    //validando disponibilidade de adesão ao plano - dependente

    cy.xpath("//a[normalize-space()='Adesão ao Plano - Dependente']")
        .should('be.visible')        
        .click()

})

})