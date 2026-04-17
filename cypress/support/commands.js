Cypress.Commands.add('loginBeneficiario', (cpf, senha) => {

  cy.visit('/Acesso/Login.aspx', { failOnStatusCode: false })

  cy.get('[name="tbxUsuario"]', { timeout: 30000 })
    .should('be.visible')
    .type(cpf)

  cy.get('[name="tbxSenha"]', { timeout: 30000 })
    .should('be.visible')
    .type(senha, { log: false })

  cy.get('[value="ENTRAR"]')
    .should('be.visible')
    .and('not.be.disabled')
    .click()

  // 🔥 garante que saiu do login
  cy.url({ timeout: 30000 }).should('not.include', 'Login')

})

Cypress.Commands.add('loginValido', () => {
 
    cy.fixture('usuariovalido').then((user) => {
      cy.loginBeneficiario(
        user.beneficiario.cpf,
        user.beneficiario.senha)
   

    cy.url().should('not.include', '/login')
  })
})

Cypress.Commands.add('acessarHomeCamedSaude', () => {

  // 🚀 VISIT robusto
 cy.visit('https://www.camed.com.br', {
  failOnStatusCode: false,
  timeout: 120000,
  onBeforeLoad(win) {
    // opcional: evitar libs pesadas
    delete win.fetch
  }
})

  // valida carregamento REAL (não depende de load completo)
  cy.get('body', { timeout: 30000 }).should('be.visible')

  // valida elemento chave
  cy.contains('A Camed', { timeout: 30000 }).should('be.visible')
})

Cypress.Commands.add('validarSemErroNaPagina', () => {
  cy.get('body')
    .should('not.contain', 'Error')
    .and('not.contain', 'Exception')
    .and('not.contain', '404')
}),

Cypress.Commands.add('homeBeneficiario', () => {
    cy.visit('/Acesso/Login.aspx', { failOnStatusCode: false })

    // valida se a página carregou
    cy.get('[id="Label1"]').should('be.visible').should('contain', 'CPF')

    
}),

Cypress.Commands.add('entrarPerfilAssociado', () => {

    cy.get('#perfilId-2 > .items')
        .should('contain', 'ASSOCIADO')
        .click()
    //validar que estou na tela de associado
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/Default.aspx')
})

Cypress.Commands.add('validarPagina', (url, titulo) => {
  cy.url().should('include', url)
  cy.get('h2').should('contain', titulo)
})

Cypress.Commands.add('abrirSaudeMental', () => {

  cy.viewport(1280, 800)
  cy.contains("a", "Saúde Mental", { timeout: 30000 })
  .should('be.visible')
  .realHover()
    
  cy.contains("a", "Saúde Mental")
   .should("be.visible")
   .click();

})

Cypress.Commands.add('abrirSaudePreventiva', () => {
  cy.viewport(1280, 800)

    cy.contains("a", "Saúde Preventiva", { timeout: 30000 })
    .should('be.visible')
    .realHover()

    cy.contains("a", "Saúde Preventiva")
        .should("be.visible")
        .click();

})

Cypress.Commands.add('preencherFaleConosco', (dados, comAnexo = false) => {
  cy.get('#idNome').type('teste nome automatizado');
  cy.get('#idEmail').type('teste@teste.com');
  cy.get('#idTelefone').type('85912345678');
  cy.get('#idSelectServico').select(2);
  cy.get('#idSelectAssunto').select(2);

  if (comAnexo) {
    cy.get('[name="tipoCheckAnexo"]').check();
  }

  cy.get('#idComentario').type('teste automatizado');
  
});

Cypress.Commands.add('botaoProximoFaleConosco', () => {
    cy.get('[name="NextTela1"]')
        .should('contain', 'Próximo')
    

})