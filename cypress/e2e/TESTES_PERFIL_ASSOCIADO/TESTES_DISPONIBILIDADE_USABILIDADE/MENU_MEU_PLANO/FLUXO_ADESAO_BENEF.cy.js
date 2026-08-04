/// <reference types="cypress" />

import "cypress-real-events/support";
import utilidades from "../../../../support/PAGES/utilidades";

describe("Testes de Disponibilidade – Adesão ao Plano", () => {
  beforeEach(() => {
    cy.fixture('formularioadesaobeneficiario').as('massa')
    cy.homeBeneficiario()
    cy.loginValido()
    cy.entrarPerfilAssociado()
    utilidades.abrirMenuMeuPlano()
    utilidades.abrirSubmenuAdesaoPlano()
    cy.get('#incluirDependente-tab1').should('contain', 'Próximo').click()
    cy.get('#incluirDependente-tab5').should('contain', 'Adicionar').click()
  })

  it("Testar fluxo de disponibilidade de adesão - Natural", function () {
    // Validação inicial do fluxo
    cy.get('[value="chckNatural"]').should('be.checked')
    cy.get('[value="chckFamilia"]').should('not.be.checked')

    // Preenchimento do formulário
    cy.preencherFormularioDependente(this.massa.natural, 'natural')

    // Confirmação do termo e modal
    cy.get('#checkTermoAdesaoFuturaDependente').should('exist').click()
    cy.get('[onclick="confirmDependente()"]').should('exist').click()

    cy.get('#swal2-title').should('exist').and('contain', 'sucesso')
    cy.get('.swal2-confirm').should('contain', 'OK').click()

    // Upload e seleção de 4 anexos
    cy.anexarDocumentos(4, "cypress/fixtures/CUPOMFISCALBATERIA.pdf")

    // Etapa final
    cy.finalizarSolicitacao()
  })

  it("Testar fluxo de disponibilidade de adesão - Família", function () {
    // Validação inicial do fluxo
    cy.get('[value="chckFamilia"]').click()
    cy.get('[value="chckNatural"]').should('not.be.checked')
    cy.get('[value="chckFamilia"]').should('be.checked')

    // Preenchimento do formulário
    cy.preencherFormularioDependente(this.massa.familia, 'familia')

    // Confirmação dos termos e modal
    cy.get('#checkTermoAdesaoFuturaDependente').should('exist').click()
    cy.get('#checkTermoPagamentoDebito').should('exist').click()
    cy.get('[onclick="confirmDependente()"]').should('exist').click()

    cy.get('#swal2-title').should('exist').and('contain', 'sucesso')
    cy.get('.swal2-confirm').should('contain', 'OK').click()

    // Upload e seleção de 6 anexos
    cy.anexarDocumentos(6, "cypress/fixtures/CUPOMFISCALBATERIA.pdf")

    // Etapa final
    cy.finalizarSolicitacao()
  })
})