class PrimeiraDataDisponivel {

  escolherPrimeiraDataDisponivel(tentativas = 12) {
    cy.get('#ContentPlaceHolder1_txtData')
      .should('be.visible')
      .focus()
      .click({ force: true });

    cy.get('#ui-datepicker-div')
      .should('be.visible');

    this.buscarDataDisponivel(tentativas);
  }

  buscarDataDisponivel(tentativas) {
    if (tentativas === 0) {
      throw new Error('Nenhuma data disponível encontrada.');
    }

    cy.get('#ui-datepicker-div').then(($calendar) => {
      const diasDisponiveis = $calendar.find(
        'td[data-handler="selectDay"]:not(.ui-state-disabled) a'
      );

      if (diasDisponiveis.length > 0) {
        cy.wrap(diasDisponiveis[0]).click({ force: true });
      } else {
        cy.get('#ui-datepicker-div .ui-datepicker-next')
          .should('exist')
          .click({ force: true });

        cy.wait(500);

        this.buscarDataDisponivel(tentativas - 1);
      }
    });
  }

}

export default new PrimeiraDataDisponivel();