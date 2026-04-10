/// <reference types="cypress" />

import "cypress-real-events/support";
import utilidades from "../../support/PAGES/utilidades";

describe("Testes de Disponibilidade – Menu ANS", () => {
  beforeEach(() => {
    cy.acessarHomeCamedSaude();
    cy.contains('ANS').realHover();
  });

  it('Deve validar a disponibilidade do submenu Resultado do IDSS',() => {

    cy.contains('a', 'Resultado do IDSS')
        .should('exist')
        .click({force:true})
    //validando texto da tela

    cy.get('[class="MsoNormal"]').eq(0).should('contain.text', 'Índice de Desempenho da Saúde Suplementar (IDSS).')

  })

  it('Deve validar a disponibilidade do submenu Pesquisa de Satisfação do Beneficiário - ANS', () => {
    cy.contains('a', 'Pesquisa de Satisfação do Beneficiário ANS')
        .should('exist')
        .click({force:true})

    cy.validarPagina('/pesquisa-de-satisfacao-do-beneficiario-ans', 'Pesquisa de Satisfação do Beneficiário - ANS')
  })
})