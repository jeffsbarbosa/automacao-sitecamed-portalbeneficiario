Cypress.Commands.add('loginBeneficiario', (cpf, senha) => {
  cy.visit('/')
  cy.get('[name="tbxUsuario"]').type(cpf)
  cy.get('[name="tbxSenha"]').type(senha)
  cy.get('[value="ENTRAR"]').click()
}),

Cypress.Commands.add('loginValido', () => {
    cy.fixture('usuariovalido').then((user) => {
    cy.loginBeneficiario(user.beneficiario.cpf, user.beneficiario.senha)
    })

    // valida que entrou no sistema
    cy.url().should('not.include', '/login')
    cy.get('[id="perfilId-2"]').should('be.visible')
}),

Cypress.Commands.add('acessarHomeCamedSaude', () => {

    cy.visit('https://www.camed.com.br')

    // valida se a página carregou
    cy.title().should('contain', 'Camed - Página inicial - Quem tem vive melhor!')
    cy.contains('A Camed').should('be.visible') 
    
}),

Cypress.Commands.add('validarSemErroNaPagina', () => {
  cy.get('body')
    .should('not.contain', 'Error')
    .and('not.contain', 'Exception')
    .and('not.contain', '404')
}),

Cypress.Commands.add('homeBeneficiario', () => {
    cy.visit('/')

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
    cy.contains("Saúde Mental").realHover();
    cy.contains("a", "Saúde Mental")
        .should("be.visible")
        .click();

})

Cypress.Commands.add('abrirSaudePreventiva', () => {
    cy.contains("Saúde Preventiva").realHover();
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