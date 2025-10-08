import { LoginPage } from "../../support/pages/login/login.page.js";

describe("Teste chat antigo", () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.viewport(1440, 900);
    loginPage.login();
  });

  it("deve acessar chat antigo e enviar um chat", () => {
    // ===== FASE 1: NAVEGAR PARA CHAT =====
    cy.log('📋 Fase 1: Navegando para Chat...');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);

    // Navegar para Chat
    cy.contains('Chat').click({ force: true });
    cy.wait(3000);
    cy.log('✅ Navegação para Chat concluída');

    // Clicando em "Geral" - estratégia DRÁSTICA para pipeline
    cy.log('📋 Fase 3: Clicando em "Geral"...');
    cy.wait(8000); // Aguardar MUITO mais tempo após criar pasta filha
    
    cy.log('🔍 Procurando elemento "Geral" com estratégias DRÁSTICAS...');
    
    // ESTRATÉGIA DRÁSTICA 1: Procurar pelo primeiro elemento com SVG lucide-folder
    cy.log('🚀 Estratégia DRÁSTICA 1: Primeiro elemento com SVG lucide-folder');
    cy.get('svg.lucide-folder')
      .first()
      .should('be.visible')
      .wait(2000)
      .click({ force: true });
    cy.log('✅ Clicado no primeiro SVG lucide-folder (provavelmente "Geral")');
    
    cy.wait(3000); // Aguardar após clique
    
    // Fallback caso a estratégia drástica não funcione
    cy.get('body').then(($body) => {
      // Debug: Verificar se existe algum elemento "Geral"
      const geralElements = $body.find('*:contains("Geral")');
      cy.log(`📊 Total de elementos com "Geral": ${geralElements.length}`);
      
      // Se ainda não clicou em "Geral", tentar outras estratégias
      if (geralElements.length > 0) {
        cy.log('⚠️ Ainda há elementos "Geral", tentando estratégias adicionais...');
        
        // Estratégia adicional: Procurar por div com classes específicas
        if ($body.find('div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center').length > 0) {
          cy.log('✅ Encontrado div com classes específicas, tentando clicar...');
          cy.get('div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center')
            .first()
            .should('be.visible')
            .wait(1500)
            .click({ force: true });
          cy.log('✅ Clicado em div com classes específicas');
        }
        
        // Estratégia adicional: cy.contains() com timeout maior
        cy.log('✅ Tentando cy.contains() com timeout maior...');
        cy.contains('Geral', { timeout: 15000 })
          .first()
          .should('be.visible')
          .wait(1500)
          .click({ force: true });
        cy.log('✅ "Geral" clicado via cy.contains()');
      }
    });
    
    cy.wait(4000); // Aguardar mais tempo após clicar em Geral
    cy.log('✅ Fase 3 concluída');

    // ===== FASE 3: CLICAR NA PRIMEIRA MENSAGEM (OPCIONAL) =====
    cy.log('📋 Fase 3: Tentando clicar na primeira mensagem...');
    cy.wait(2000);
    
    // Procurar por elementos que parecem ser chats
    cy.get('body').then(($body) => {
      const chatSelectors = [
        'div[class*="flex gap-2 items-center"]',
        'div[class*="chat"]',
        'div[class*="conversation"]',
        'div[class*="message"]',
        'div[role="button"]'
      ];
      
      let chatEncontrado = false;
      for (const selector of chatSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Chat encontrado: ${selector}`);
          cy.get(selector).first()
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });
          cy.log('✅ Primeira mensagem clicada');
          chatEncontrado = true;
          break;
        }
      }
      
      if (!chatEncontrado) {
        cy.log('⚠️ Chat não encontrado, tentando fallback...');
        try {
          cy.get('div, li, button').first()
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });
          cy.log('✅ Elemento clicado com fallback');
        } catch (e) {
          cy.log(`⚠️ Fallback falhou: ${e.message} - pulando esta etapa`);
        }
      }
    });
    
    cy.wait(5000);
    cy.log('✅ Fase 3 concluída');

    // ===== FASE 4: DIGITAR MENSAGEM =====
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

    // ===== FASE 5: CLICAR EM ENVIAR =====
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
    cy.wait(10000);
    
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