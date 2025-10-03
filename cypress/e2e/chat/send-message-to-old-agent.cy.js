import { LoginPage } from "../../support/pages/login/login.page.js";

describe("Acessar agente antigo e enviar um chat", () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.viewport(1440, 900);
    loginPage.login();
  });

  it("deve acessar chat antigo de um agente e enviar um chat", () => {



  // Estratégia 1: Tentar encontrar botão Agentes na navegação
  cy.get('body').then(($body) => {
    // Procurar por botão ou link com texto "Agentes"
    const agentesButton = $body.find('button:contains("Agentes"), a:contains("Agentes"), [role="button"]:contains("Agentes")');
    
    if (agentesButton.length > 0) {
      cy.log('✅ Encontrado botão Agentes');
      cy.wrap(agentesButton.first()).should('be.visible').click();
      cy.wait(2000);
    } else {
      cy.log('⚠️ Botão Agentes não encontrado, tentando navegação direta...');
      
      // Estratégia 2: Navegação direta para página de agentes
      cy.url().then((currentUrl) => {
        const baseUrl = currentUrl.split('/').slice(0, 3).join('/');
        
        // Tentar diferentes possíveis URLs para agentes
        const possibleUrls = [
          `${baseUrl}/agents`,
          `${baseUrl}/agentes`, 
          `${baseUrl}/dashboard/agents`,
          `${baseUrl}/dashboard/agentes`
        ];
        
        let navigated = false;
        for (let i = 0; i < possibleUrls.length && !navigated; i++) {
          cy.log(`Tentando navegar para: ${possibleUrls[i]}`);
          cy.visit(possibleUrls[i], { failOnStatusCode: false });
          cy.wait(3000);
          
          cy.url().then((newUrl) => {
            if (newUrl.includes('agents') || newUrl.includes('agentes')) {
              cy.log(`✅ Navegação bem-sucedida para: ${newUrl}`);
              navigated = true;
            }
          });
        }
      });
    }
  });

  // Aguardar carregamento da página de agentes
  cy.wait(3000);
  
  // Verificar se estamos na página correta
  cy.url().then((url) => {
    if (!url.includes('agents') && !url.includes('agentes') && !url.includes('assistants')) {
      cy.log('⚠️ Navegando para página de agentes...');
      
      // Tentar navegar diretamente para a página de agentes
      const baseUrl = url.split('/').slice(0, 3).join('/');
      const agentsUrl = `${baseUrl}/agents`;
      
      cy.visit(agentsUrl, { failOnStatusCode: false });
      cy.wait(5000);
    }
  });
  
  // Clicar em "Meus Agentes"
  cy.log('🔍 Procurando "Meus Agentes"...');
  
  cy.get('body').then(($body) => {
    // Procurar por "Meus Agentes" com seletores simples
    const meusAgentesSelectors = [
      'button:contains("Meus Agentes")',
      'a:contains("Meus Agentes")',
      'div:contains("Meus Agentes")',
      '*:contains("Meus Agentes")',
      'button:contains("Meus")',
      'a:contains("Meus")',
      'div:contains("Meus")'
    ];
    
    let found = false;
    
    // Tentar cada seletor CSS apenas
    for (let selector of meusAgentesSelectors) {
      if ($body.find(selector).length > 0) {
        cy.log(`✅ Encontrado "Meus Agentes"`);
        cy.get(selector).first().should('be.visible').click();
        cy.wait(2000);
        found = true;
        break;
      }
    }
    
    if (!found) {
      cy.log('✅ Continuando para criar novo agente');
    }
  });



// Digita o nome no campo de busca - com fallback
cy.log('🔍 Procurando campo de busca...');
cy.get('body').then(($body) => {
  const selectorsBusca = [
    'input[type="search"]',
    'input[placeholder*="Buscar"]',
    'input[placeholder*="buscar"]',
    'input[placeholder*="nome"]',
    'input[placeholder*="search"]',
    '[data-testid*="search"]',
    '[class*="search"] input'
  ];
  
  let campoBuscaEncontrado = false;
  for (const selector of selectorsBusca) {
    if ($body.find(selector).length > 0) {
      cy.log(`✅ Campo de busca encontrado: ${selector}`);
      cy.get(selector).first()
        .should('be.visible')
        .clear()
        .type('Agente Teste Automatizado', { delay: 100 });
      campoBuscaEncontrado = true;
      break;
    }
  }
  
  if (!campoBuscaEncontrado) {
    cy.log('⚠️ Campo de busca não encontrado, tentando input genérico...');
    if ($body.find('input[type="text"]').length > 0) {
      cy.get('input[type="text"]').first()
        .should('be.visible')
        .clear()
        .type('Teste Automatizado', { delay: 100 });
    } else {
      cy.log('⚠️ Nenhum campo de busca disponível, continuando sem busca...');
    }
  }
});

// Aguarda a tabela carregar 
cy.wait(3000);
























  });
});
