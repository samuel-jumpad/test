import { LoginPage } from "../../support/pages/login/login.page.js";

describe("Teste Geral Específico", () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.viewport(1440, 900);
    loginPage.login();
  });

  it("deve clicar especificamente no elemento Geral", () => {
    // Navegar para Chat
    cy.log('📋 Navegando para Chat...');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    cy.contains('Chat').click({ force: true });
    cy.wait(3000);
    cy.log('✅ Navegação para Chat concluída');

    // Procurar especificamente pelo elemento Geral baseado no HTML fornecido
    cy.log('🔍 Procurando pelo elemento "Geral" específico...');
    cy.wait(2000);
    
    // Seletores baseados no HTML exato fornecido
    const selectorsGeral = [
      // Seletores mais específicos baseados no HTML
      'div.truncate:contains("Geral")',
      'div.flex.rounded-md.p-2.gap-2:contains("Geral")',
      'div[class*="cursor-pointer"]:contains("Geral")',
      'div[class*="bg-[#027fa6]"]:contains("Geral")',
      'div.ml-2.rounded-xl:contains("Geral")',
      'div:contains("Geral")',
      'span:contains("Geral")',
      '*:contains("Geral")'
    ];
    
    let geralEncontrado = false;
    for (const selector of selectorsGeral) {
      cy.log(`🔍 Tentando seletor: ${selector}`);
      cy.get('body').then(($body) => {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ "Geral" encontrado com seletor: ${selector} (${$body.find(selector).length} elementos)`);
          
          // Tentar clicar no primeiro elemento encontrado
          cy.get(selector).first()
            .should('be.visible')
            .click({ force: true });
          cy.log(`✅ "Geral" clicado com sucesso usando: ${selector}`);
          geralEncontrado = true;
        } else {
          cy.log(`⚠️ Nenhum elemento encontrado com: ${selector}`);
        }
      });
      
      if (geralEncontrado) break;
    }
    
    if (!geralEncontrado) {
      cy.log('⚠️ Nenhum seletor específico funcionou, tentando fallback...');
      cy.contains('Geral').click({ force: true });
      cy.log('✅ "Geral" clicado com fallback');
    }
    
    cy.wait(2000);
    cy.log('✅ Teste concluído');
  });
});
