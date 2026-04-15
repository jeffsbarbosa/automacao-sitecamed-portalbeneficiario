# 🧪 Automação de Testes - Site Camed e Portal do Beneficiário - Área Logada

Projeto de automação de testes end-to-end (E2E) utilizando **Cypress**, com foco na validação de:

- Disponibilidade de menus
- Navegação entre páginas
- Fluxos críticos do usuário
- Funcionalidades principais do portal

---

## 🚀 Tecnologias Utilizadas

- Cypress
- JavaScript (ES6+)
- Node.js
- Cypress Real Events
- Fixtures (dados para preenchimento de formulário)
- Custom Commands

---

## 📁 Estrutura do Projeto

cypress/
├── downloads/
├── e2e/
│ ├── TESTES_HOMEPAGE/
│ │ └── Homepage_CamedSaude.cy.js
│ │
│ ├── TESTES_PERFIL_ASSOCIADO/
│ │ ├── HOMEPAGE_LOGIN/
│ │ │ ├── Disponibilidade_Perfil_Associado.cy.js
│ │ │ ├── Homepage_Portal_Beneficiario.cy.js
│ │ │ └── login.cy.js
│ │ │
│ │ └── TESTES_DISPONIBILIDADE_USABILIDADE/
│ │ ├── MENU_ATENDIMENTO/
│ │ │ ├── DISPONIBILIDADE_MENUS.cy.js
│ │ │ └── Fluxo_Fale_Conosco.cy.js
│ │ │
│ │ ├── MENU_FINANCEIRO/
│ │ │ ├── DISPONIBILIDADE_MENUS.cy.js
│ │ │ └── SUBMENU_EXTRATOS_FATURAS.cy.js
│ │ │
│ │ ├── MENU_INTERCAMBIO/
│ │ │ └── DISPONIBILIDADE_ITENS.cy.js
│ │ │
│ │ ├── MENU_MEU_PLANO/
│ │ │ └── DISPONIBILIDADE_ITENS.cy.js
│ │ │
│ │ ├── MENU_REEMBOLSO/
│ │ │ ├── ACOMPANHAR_REEMBOLSO.cy.js
│ │ │ └── SOLICITAR_REEMBOLSO.cy.js
│ │ │
│ │ └── MENU_TELEMEDICINA/
│ │ ├── AGENDAR_CONSULTA_TELEMEDICINA.cy.js
│ │ └── PRONTO_ATENDIMENTO.cy.js
│ │
│ └── TESTES_PORTAL_AREA_NAO_LOGADA/
│ ├── Disponibilidade_Menus_A_CAMED.cy.js
│ └── Disponibilidade_Menus_ANS.cy.js
│
├── fixtures/
│ └── formulariofaleconosco.json
│
├── support/
│ ├── commands.js
│ └── PAGES/
│ └── utilidades.js
│ └── e2e.js

🧪 Tipos de Testes
✅ Testes de Disponibilidade
Validação de menus e submenus
Verificação de navegação correta
Garantia de acesso às páginas

✅ Testes de Fluxo
Fale Conosco
Reembolso
Telemedicina

✅ Testes de Usuário Logado
Perfil do associado
Funcionalidades internas

✅ Testes de Usuário Não Logado
Menus públicos
Páginas institucionais