/// <reference types="cypress" />

import "cypress-real-events/support";
import utilidades from "../../../../support/PAGES/utilidades";

describe("Testes de Disponibilidade – Menu Meu Plano", () => {
  beforeEach(() => {
    cy.homeBeneficiario();
    cy.loginValido();
    cy.entrarPerfilAssociado()
    utilidades.abrirMenuMeuPlano()
})

it('Validar disponibilidade do item Adesão ao Plano', () => {
    
    cy.xpath("//p[normalize-space()='Adesão ao Plano']")
        .should('contain', 'Adesão ao Plano')
        .click()

    //Validar que a página carregou corretamente
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/AdesaoDeBeneficiarios.aspx')
    cy.get('h3').should('contain', 'Adesão ao Plano')

})

it('Validar disponibilidade do item Cancelamento', () => {

    cy.xpath("//p[normalize-space()='Cancelamento']")
        .should('contain', 'Cancelamento')
        .click()

    //Validar que a página carregou corretamente
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/CancelamentoBeneficiario.aspx')
    cy.get('h3').should('contain', 'Cancelamento')
})

it('Validar disponibilidade do item Carteirinha Virtual', () => {

    cy.xpath("//p[normalize-space()='Carteirinha Virtual']")
        .should('contain', 'Carteirinha Virtual')
        .click()

    //Validar que a página carregou corretamente
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/CartaoVirtual.aspx')
    cy.get('h3').should('contain', 'Carteirinha Virtual')
})

it('Validar disponibilidade do item Comunicado de Licença', () => {

    cy.xpath("//p[normalize-space()='Comunicado de Licença']")
        .should('contain', 'Comunicado de Licença')
        .click()

    //Validar que a página carregou corretamente
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/ComunicadodeLicenca.aspx')
    cy.get('h3').should('contain', 'Comunicado de Licença')
})

it('Validar disponibilidade do item Dados do Beneficiário', () => {

    cy.xpath("//p[normalize-space()='Dados do Beneficiário']")
        .should('contain', 'Dados do Beneficiário')
        .click()

    //Validar que a página carregou corretamente
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/DadosBeneficiario.aspx')
    cy.get('h3').should('contain', 'Dados do Beneficiário')
})

it('Validar disponibilidade do item Informativos', () => {

    cy.xpath("//p[normalize-space()='Informativos']")
        .should('contain', 'Informativos')
        .click()

    //Validar que a página carregou corretamente
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/Informativos.aspx')
    cy.get('h3').should('contain', 'Informativos')
})

it('Validar disponibilidade do item Minha Utilização', () => {

    cy.xpath("//p[normalize-space()='Minha Utilização']")
        .should('contain', 'Minha Utilização')
        .click()

    //Validar que a página carregou corretamente
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/DemonstrativoPINSS.aspx')
    cy.get('h3').should('contain', 'Utilização do Beneficiário')
})

it('Validar disponibilidade do item Reajuste Anual', () => {

    cy.xpath("//p[normalize-space()='Reajuste Anual - PIN-SS']")
        .should('contain', 'Reajuste Anual')
        .click()

    //Validar que a página carregou corretamente
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/ReajusteAnual.aspx')
    cy.get('h3').should('contain', 'Reajuste Anual')
})

it('Validar disponibilidade do item Solicitar Migração de Contrato', () => {

    cy.xpath("//p[normalize-space()='Solicitar Migração de Contrato/Menor Sob Guarda']")
        .should('contain', 'Migração')
        .click()

    //Validar que a página carregou corretamente
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/SolicitarMigracaoContrato.aspx')
    cy.get('h3').should('contain', 'Migração')
})

it('Validar disponibilidade do item Sucessão de Titularidade', () => {

    cy.xpath("//p[normalize-space()='Sucessão de Titularidade']")
        .should('contain', 'Titularidade')
        .click()

    //Validar que a página carregou corretamente
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/SolicitarMigracaoSucessor.aspx')
    cy.get('h3').should('contain', 'Titularidade')

})

it('Validar disponibilidade do item Tabela de Auxílios', () => {

    cy.xpath("//p[normalize-space()='Tabela de Auxílios']")
        .should('contain', 'Auxílios')
        .click()

    //Validar que a página carregou corretamente
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/TabelaDeAuxilios.aspx')
    cy.get('h3').should('contain', 'Auxílios')

})

it('Validar disponibilidade do item Meus Dados Cadastrais', () => {

    cy.xpath("//p[normalize-space()='Meus Dados Cadastrais']")
        .should('contain', 'Dados Cadastrais')
        .click()

    //entrando no sub-item Atualização Cadastral

    cy.xpath("//p[normalize-space()='Atualização Cadastral']").click()

    //Validar que a página carregou corretamente
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/AlteracaoCadastral.aspx')
    cy.get('[class="poppinsFont mt-3"]').should('contain', 'autenticação')

})

it('Validar disponibilidade do item Dependentes', () => {

    cy.xpath("//p[normalize-space()='Dependentes']")
        .should('contain', 'Dependentes')
        .click()

    //entrando no sub-item Atualização Cadastral

    cy.xpath("//p[normalize-space()='Comprovação Matrícula Universidade']").click()

    //Validar que a página carregou corretamente
    cy.url().should('include', '/CamedSaudeServicos/Servicos/Beneficiario/ComprovaMatriculaUniversidade.aspx')
    cy.get('h3').should('contain', 'Comprovar Matrícula')

})

})