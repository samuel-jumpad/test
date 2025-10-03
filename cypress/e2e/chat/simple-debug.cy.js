import { LoginPage } from "../../support/pages/login/login.page.js";

describe("Simple Debug", () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.viewport(1440, 900);
    loginPage.login();
  });

  it("deve navegar para chat e tirar screenshot", () => {
    // Navegar para Chat
    cy.log('📋 Navegando para Chat...');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);

    // Tentar encontrar o menu Chat
    cy.contains('Chat').click({ force: true });
    cy.wait(3000);
    
    // Tirar screenshot para ver o que está na página
    cy.screenshot('chat-page');
    cy.log('📸 Screenshot tirado: chat-page.png');
    
    // Listar todos os elementos que contêm "Geral"
    cy.get('body').then(($body) => {
      const geralElements = $body.find('*:contains("Geral")');
      cy.log(`🔍 Encontrados ${geralElements.length} elementos contendo "Geral"`);
      
      if (geralElements.length > 0) {
        cy.log('✅ Elementos "Geral" encontrados!');
        geralElements.each((index, element) => {
          const text = element.textContent?.trim();
          const tagName = element.tagName;
          const className = element.className;
          cy.log(`  ${index}: ${tagName} - "${text}" - class="${className}"`);
        });
      } else {
        cy.log('❌ Nenhum elemento "Geral" encontrado');
      }
    });
  });
});
