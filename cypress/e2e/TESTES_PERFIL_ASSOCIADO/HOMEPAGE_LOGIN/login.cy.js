/// <reference types="cypress" />

describe('Login – Portal do Beneficiário', () => {

  it('Deve permitir login com credenciais válidas', () => {
      cy.homeBeneficiario()
      cy.loginValido()
    
  })

})
