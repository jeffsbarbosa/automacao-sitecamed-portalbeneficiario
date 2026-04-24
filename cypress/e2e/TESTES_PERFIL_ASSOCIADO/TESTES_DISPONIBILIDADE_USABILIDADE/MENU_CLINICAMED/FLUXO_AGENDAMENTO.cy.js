/// <reference types="cypress" />

import "cypress-real-events/support";
import utilidades from "../../../../support/PAGES/utilidades";
import primeiraDataDisponivel from "../../../../support/PAGES/primeiradatadisponivel";

describe("Testes de Disponibilidade – Menu Clinicamed", () => {
  beforeEach(() => {
    cy.homeBeneficiario();
    cy.loginValido();
    cy.entrarPerfilAssociado();
    utilidades.abrirMenuCliniCamed()
  });

it("Disponibilidade Para Agendar uma Consulta - Atendimento Presencial e Procura por Profissional", () => {

  cy.contains('a', 'Agenda Virtual').should('be.visible').click();

  cy.url().should("include", "/CamedSaudeServicos/Servicos/Beneficiario/CliniCamedAgendaVirtual.aspx");
  cy.get("h3").should("contain", "Minhas Consultas");

  //Início do processo de Agendamento

  cy.get('#ContentPlaceHolder1_btnNovoAgendamento')
    .should('contain', 'Novo Agendamento')
    .click();

  cy.get('h3').should('contain', 'solicitação de consulta');

  cy.get('#ContentPlaceHolder1_ddlPaciente').select(1);

  cy.get('#ContentPlaceHolder1_rbPresencial').should('be.checked');

  cy.wait(5000);

  cy.get('#ContentPlaceHolder1_ddlLocal')
    .invoke('val', '2')
    .trigger('change');

  cy.get('#ContentPlaceHolder1_ddlEspecialidade').select(1);

  cy.get('#ContentPlaceHolder1_rbMedicoEspecifico').should('be.checked');

  cy.get('#ContentPlaceHolder1_ddlMedico').select(1);

  // abrir calendário
  cy.get('#ContentPlaceHolder1_txtData')
    .should('be.visible')
    .click();

  // selecionar primeira data disponível via Page Object
  primeiraDataDisponivel.escolherPrimeiraDataDisponivel()

  // validar se preencheu
  cy.get('#ContentPlaceHolder1_txtData')
    .should(($input) => {
      expect($input.val()).to.not.equal('');
    });
 
  cy.window().then((win) => {
    win.__doPostBack('ctl00$ContentPlaceHolder1$txtData', '');
  });
//escolhendo o primeiro horário disponível
  cy.get('#ContentPlaceHolder1_ddlHorario').select(1);

  cy.get('#btnConfirmar')
    .should('not.have.class', 'disabled')
    .and('contain', 'Revisar solicitação')
    .click()

  cy.get('h3').should('contain', 'Confirmar Agendamento')
  cy.get('[id="ContentPlaceHolder1_btnEfetivarAgendamento"]').should('be.visible')

});



  it("Disponibilidade Para Agendar uma Consulta - Atendimento Online e Procura por Profissional", () => {

    cy.contains('a', 'Agenda Virtual').should('be.visible').click()

    //validar que a página carregou corretamente:
    cy.url().should("include", "/CamedSaudeServicos/Servicos/Beneficiario/CliniCamedAgendaVirtual.aspx")
    cy.get("h3").should("contain", "Minhas Consultas");

    //Início do processo de Agendamento

    cy.get('#ContentPlaceHolder1_btnNovoAgendamento')
    .should('contain', 'Novo Agendamento')
    .click();

  cy.get('h3').should('contain', 'solicitação de consulta');

  cy.get('#ContentPlaceHolder1_ddlPaciente').select(1);

//escolhendo a opção de atendimento Online
  cy.get('#ContentPlaceHolder1_rbOnline').check()

  cy.wait(5000);

  cy.get('#ContentPlaceHolder1_ddlLocal')
    .invoke('val', '2')
    .trigger('change');

  cy.get('#ContentPlaceHolder1_ddlEspecialidade').select(1);

  cy.get('#ContentPlaceHolder1_rbMedicoEspecifico').should('be.checked');

  cy.get('#ContentPlaceHolder1_ddlMedico').select(1);

  // abrir calendário
  cy.get('#ContentPlaceHolder1_txtData')
    .should('be.visible')
    .click();

  // selecionar primeira data disponível via Page Object
  primeiraDataDisponivel.escolherPrimeiraDataDisponivel()

  // validar se preencheu
  cy.get('#ContentPlaceHolder1_txtData')
    .should(($input) => {
      expect($input.val()).to.not.equal('');
    });
 
  cy.window().then((win) => {
    win.__doPostBack('ctl00$ContentPlaceHolder1$txtData', '');
  });
//escolhendo o primeiro horário disponível
  cy.get('#ContentPlaceHolder1_ddlHorario').select(1);

  cy.get('#btnConfirmar')
    .should('not.have.class', 'disabled')
    .and('contain', 'Revisar solicitação')
    .click()

  cy.get('h3').should('contain', 'Confirmar Agendamento')
  cy.get('[id="ContentPlaceHolder1_btnEfetivarAgendamento"]').should('be.visible')

    
  });




});
