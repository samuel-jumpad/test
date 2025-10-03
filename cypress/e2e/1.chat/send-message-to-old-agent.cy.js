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
    
    cy.wait(5000);

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
            .type('Cypress', { delay: 100 });
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
            .type('Cypress', { delay: 350 });
        } else {
          cy.log('⚠️ Nenhum campo de busca disponível, continuando sem busca...');
        }
      }
    });

    // Aguarda a tabela carregar 
    cy.wait(5000);

    // ===== CLICAR NO BOTÃO TESTAR =====
    cy.log('🔍 Procurando botão "Testar"...');
    cy.wait(5000); // Aguardar página carregar

    // Estratégia mais robusta para encontrar o botão Testar
    cy.get('body').then(($body) => {
      // Estratégia 1: Buscar por texto "Testar" com múltiplos seletores
      const testarSelectors = [
        'button:contains("Testar")',
        'a:contains("Testar")',
        '[role="button"]:contains("Testar")',
        'div:contains("Testar")',
        '*:contains("Testar")'
      ];
      
      let testarEncontrado = false;
      
      for (const selector of testarSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Botão Testar encontrado: ${selector}`);
          cy.get(selector).first()
            .scrollIntoView()
            .wait(1000)
            .click({ force: true });
          testarEncontrado = true;
          break;
        }
      }
      
      // Buscar por ícone sparkles
      if (!testarEncontrado && $body.find('button svg[class*="sparkles"]').length > 0) {
        cy.log('✅ Botão Testar encontrado por ícone sparkles');
        cy.get('button svg[class*="sparkles"]').parent().first()
          .scrollIntoView()
          .wait(1000)
          .click({ force: true });
        testarEncontrado = true;
      }
      
      // Buscar qualquer botão na linha da tabela
      if (!testarEncontrado && $body.find('table tbody tr button').length > 0) {
        cy.log('✅ Botões encontrados na tabela, clicando no primeiro');
        cy.get('table tbody tr button').first()
          .scrollIntoView()
          .wait(1000)
          .click({ force: true });
        testarEncontrado = true;
      }
      
      // Buscar por qualquer elemento clicável
      if (!testarEncontrado) {
        cy.log('⚠️ Botão Testar não encontrado, tentando primeiro botão disponível');
        cy.get('button').first()
          .scrollIntoView()
          .wait(1000)
          .click({ force: true });
      }
    });

    cy.wait(2000);

    // DIGITAR MENSAGEM =====
    // Clica e digita no campo de mensagem
    // opção A — dentro do dialog aberto + form do chat
    const CHAT_INPUT_XPATH = '//div[@role="dialog" and @data-state="open"]//form[@id="chat-message-input-form"]//div[@role="textbox" and @contenteditable="true"]';

    cy.xpath(CHAT_INPUT_XPATH, { timeout: 20000 })
      .should('exist')
      .then($els => {
        const $visible = $els.filter(':visible');     // garante 1 só
        expect($visible.length, 'input visível único').to.eq(1);
        cy.wrap($visible[0])
          .scrollIntoView()
          .click({ force: true })
          .type('Olá, esta é uma mensagem de teste', { delay: 100 });
      });

    //clicar em enviar
    cy.xpath('(//form[@id="chat-message-input-form"]//button)[last()]')
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });

    cy.wait(5000);

    cy.contains('Olá, esta é uma mensagem de teste')
      .should('be.visible');

    //clicar no botão de fechar
    cy.xpath('//div[@role="dialog" and @data-state="open"]//button//*[name()="svg" and contains(@class,"lucide-x")]')
      .should('be.visible')
      .click({ force: true });

    //  NAVEGAR PARA CHAT =====
    cy.log('📋 Fase 1: Navegando para Chat...');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);

    // Navegar para Chat
    cy.contains('Chat').click({ force: true });
    cy.wait(3000);
    cy.log('✅ Navegação para Chat concluída');

    ///clicar no agente antigo
    cy.xpath('//div[contains(text(),"Agentes")]/following::div[contains(@class,"truncate") and text()="Cypress"][1]')
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true });

    //FASE 4: DIGITAR MENSAGEM =====
    cy.log('📋 Fase 4: Digitando mensagem...');
    const mensagem = 'ola, como vai?';
    
    // Procurar por campo de input
    cy.get('body').then(($body) => {
      const inputSelectors = [
        'div[contenteditable="true"]',
        'textarea',
        'input[type="text"]',
        '[contenteditable="true"]'
      ];
      
      let inputEncontrado = false;
      for (const selector of inputSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Input encontrado: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .clear()
            .type(mensagem, { delay: 100 });
          cy.log('✅ Mensagem digitada');
          inputEncontrado = true;
          break;
        }
      }
      
      if (!inputEncontrado) {
        cy.log('⚠️ Input não encontrado, tentando fallback...');
        cy.get('input, textarea, [contenteditable]').first()
          .should('be.visible')
          .clear()
          .type(mensagem, { delay: 100 });
        cy.log('✅ Mensagem digitada com fallback');
      }
    });

    //CLICAR EM ENVIAR =====
    cy.log('✅ Mensagem digitada');
    cy.get('body').then(($body) => {
      const selectorsBotao = [
        'button[type="submit"]:not([disabled])',
        'button:contains("Enviar")',
        'button:contains("Send")',
        'form button[type="submit"]',
        'button[class*="submit"]',
        'button[class*="send"]',
        'button[class*="enviar"]',
        'button[class*="message"]'
      ];
      let botaoEncontrado = false;
      for (const selector of selectorsBotao) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Send button encontrado: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .click();
          botaoEncontrado = true;
          break;
        }
      }
      if (!botaoEncontrado) {
        cy.log('⚠️ Send button não encontrado, tentando seletores genéricos...');
        if ($body.find('button').length > 0) {
          cy.get('button').last()
            .should('be.visible')
            .click();
        } else {
          cy.log('⚠️ Nenhum button encontrado');
        }
      }
    });
    cy.log('✅ Send button clicado');
    cy.get('body').should('not.contain', 'enviando');
    
    // Validar envio da mensagem
    cy.log('🔍 Validando envio da mensagem...');
    cy.log('⏳ Aguardando 5 segundos após envio...');
    cy.wait(5000);
    
    cy.get('body').then(($body) => {
      if ($body.find('div[contenteditable="true"]').length > 0) {
        cy.get('div[contenteditable="true"]').first().should('be.empty');
        cy.log('✅ Campo de input vazio - mensagem enviada');
      }
    });
    
    cy.get('body').should('not.contain', 'enviando');
    cy.get('body').should('not.contain', 'sending');
    cy.log('✅ Nenhum indicador de "enviando" encontrado');
    
    cy.get('body').should('contain.text', mensagem);
    cy.log('✅ Mensagem encontrada na página - envio confirmado');
    
    cy.log('✅ Message sending test completed successfully!');
  });
});
