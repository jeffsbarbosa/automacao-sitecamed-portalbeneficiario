class utilidades {

  validarSemErroNaPagina() {
    cy.contains('Error').should('not.exist')
    cy.contains('Exception').should('not.exist')
    cy.contains('404').should('not.exist')
    cy.contains('500').should('not.exist')
  }

  abrirMenuIntercambio(){
    cy.xpath("(//a[@class='nav-link'])[18]").click()
  }

  abrirMenuFinanceiro() {
    cy.xpath("(//a[@class='nav-link'])[7]").click()
  }

  abrirMenuAtendimento() {
    cy.xpath("(//a[@class='nav-link'])[2]").click()
  }

  abrirSubmenuExtratosFaturas() {
    cy.xpath('//p[normalize-space()="Extratos e Faturas"]').click()
  }

  abrirMenuMeuPlano(){
    cy.xpath('//p[normalize-space()="Meu Plano"]').click()
  }

  abrirMenuReembolso(){
    cy.xpath('//p[normalize-space()="Reembolso"]').click()

  }

  abrirMenuTelemedicina() {
    cy.xpath("//p[normalize-space()='Telemedicina']")
        .should('contain', 'Telemedicina')
        .click()
  }

  solicitarReembolso(){
    cy.xpath("//p[normalize-space()='Solicitar Reembolso']")
        .should('contain', 'Solicitar')
        .click()
  }

  emitirDemonstrativo() {

     //clicando no botão Emitir Demonstrativo
    cy.get('[value="Emitir Demonstrativo"]').click()
    cy.wait(5000)

    //validando modal de sucesso
    cy.get('[role="dialog"]').should('be.visible')
    
  }

  emitirDeclaracao() {

    //clicando no botão Emitir Declaração

    cy.get('[value="Emitir Declaração"]').click()
    cy.wait(5000)

    //validando modal de sucesso
    cy.get('.swal2-popup').should('be.visible')
    cy.get('.swal2-confirm').click()
  }

  botaoOkModal() {
    cy.get('.swal2-confirm')
  }

  acessarGovernanca(){
    cy.contains("a", "Governança")
      .should("be.visible")
      .click();
      cy.url().should("include", "/governanca");
    cy.get(".info__title > h2").should("contain", "Governança");
  }

  abrirFaleConosco(){
    cy.contains("p", "Fale Conosco").click();
    
  }

   

}

export default new utilidades()