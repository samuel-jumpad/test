import { LoginPage } from "../../support/pages/login/login.page.js";

describe("Debug - Teste Geral", () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.viewport(1440, 900);
    loginPage.login();
  });

  it("deve encontrar e clicar em Geral", () => {
    // Navegar para Chat primeiro
    cy.log('📋 Navegando para Chat...');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);

    // Tentar encontrar o menu Chat
    cy.get('body').then(($body) => {
      const selectorsChat = [
        'span:contains("Chat")',
        'div:contains("Chat")',
        'a:contains("Chat")',
        'button:contains("Chat")'
      ];
      
      let chatEncontrado = false;
      for (const selector of selectorsChat) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Menu Chat encontrado: ${selector}`);
          cy.get(selector).first().click({ force: true });
          chatEncontrado = true;
          break;
        }
      }
      
      if (!chatEncontrado) {
        cy.log('⚠️ Menu Chat não encontrado, tentando fallback...');
        cy.contains('Chat').click({ force: true });
      }
    });
    
    cy.wait(3000);
    cy.log('✅ Navegação para Chat concluída');

    // Agora focar em encontrar "Geral"
    cy.log('🔍 Procurando por "Geral"...');
    cy.wait(2000);
    
    // Listar todos os elementos que contêm "Geral"
    cy.get('body').then(($body) => {
      const geralElements = $body.find('*:contains("Geral")');
      cy.log(`🔍 Encontrados ${geralElements.length} elementos contendo "Geral"`);
      
      if (geralElements.length > 0) {
        geralElements.each((index, element) => {
          const text = element.textContent?.trim();
          const tagName = element.tagName;
          const className = element.className;
          const id = element.id;
          cy.log(`  Elemento ${index}: tag="${tagName}" class="${className}" id="${id}" text="${text}"`);
        });
        
        // Tentar clicar no primeiro elemento "Geral" encontrado
        cy.log('🎯 Tentando clicar no primeiro elemento "Geral"...');
        cy.get('*:contains("Geral")').first()
          .should('be.visible')
          .click({ force: true });
        cy.log('✅ Clicou no primeiro elemento "Geral"');
      } else {
        cy.log('❌ Nenhum elemento "Geral" encontrado na página');
        
        // Listar todos os elementos visíveis para debug
        cy.log('🔍 Listando todos os elementos visíveis...');
        cy.get('body').then(($body) => {
          const allElements = $body.find('*').filter(':visible');
          cy.log(`Total de elementos visíveis: ${allElements.length}`);
          
          // Listar os primeiros 20 elementos
          allElements.slice(0, 20).each((index, element) => {
            const text = element.textContent?.trim();
            const tagName = element.tagName;
            const className = element.className;
            if (text && text.length > 0 && text.length < 50) {
              cy.log(`  Elemento ${index}: tag="${tagName}" class="${className}" text="${text}"`);
            }
          });
        });
      }
    });
    
    cy.wait(2000);
    cy.log('✅ Teste de debug concluído');
  });
});
