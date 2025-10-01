export class ChatPage {
  configurarInterceptacoes() {
    cy.log('🔧 Configurando interceptações e otimizações para chat...');
    
    // Interceptações para bloqueio de tradução
    cy.intercept('POST', '**/translate-pa.googleapis.com/**', { 
      statusCode: 200, 
      body: { translatedText: 'Mock translation' } 
    }).as('translationRequest');
    
    cy.intercept('GET', '**/translate.googleapis.com/**', { 
      statusCode: 200, 
      body: { translatedText: 'Mock translation' } 
    }).as('googleTranslationRequest');
    
    // Configurações para acelerar o teste
    cy.window().then((win) => {
      // Desabilitar animações CSS
      win.document.documentElement.style.setProperty('animation-duration', '0s');
      win.document.documentElement.style.setProperty('transition-duration', '0s');
      
      // Desabilitar tradução automática do navegador
      win.document.documentElement.setAttribute('translate', 'no');
      win.document.documentElement.setAttribute('lang', 'en');
    });
    
    cy.log('✅ Interceptações e otimizações configuradas');
    return this;
  }

  navegarParaChat() {
    cy.log('📋 Navegando para Chat...');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    cy.get('body').then(($body) => {
      const selectorsChat = [
        'span:contains("Chat")',
        'div:contains("Chat")',
        'div.flex.w-full.items-center.rounded-lg.py-2.cursor-pointer.transition-colors.duration-300.ease-in-out.bg-primary-main.text-white.shadow-md',
        'div.bg-primary-main.text-white span:contains("Chat")',
        'div:has(svg.lucide.lucide-messages-square) span:contains("Chat")',
        'svg.lucide.lucide-messages-square + div span:contains("Chat")',
        'nav span:contains("Chat")',
        'aside span:contains("Chat")'
      ];
      
      let chatEncontrado = false;
      for (const selector of selectorsChat) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Menu Chat encontrado com seletor: ${selector}`);
          try {
            cy.get(selector).first()
              .click({ force: true });
            cy.log(`✅ Menu Chat clicado com force: ${selector}`);
            chatEncontrado = true;
            break;
          } catch (e) {
            cy.log(`⚠️ Falha ao clicar com force: ${selector} - ${e.message}`);
          }
        }
      }
      
      if (!chatEncontrado) {
        cy.log('⚠️ Menu Chat não encontrado, tentando fallback...');
        try {
          cy.contains('Chat')
            .click({ force: true });
          cy.log('✅ Menu Chat clicado com fallback forçado');
          chatEncontrado = true;
        } catch (e) {
          cy.log(`⚠️ Fallback forçado falhou: ${e.message}`);
        }
      }
    });
    
    cy.wait(2000);
    cy.log('✅ Navegação para Chat concluída');
    return this;
  }


  enviarMensagemChat(mensagem) {
    cy.log(`📝 Enviando mensagem no chat: "${mensagem}"`);
    cy.get('body').should('not.contain', 'loading');
    cy.get('body').then(($body) => {
      const selectorsInput = [
        'div[contenteditable="true"][data-placeholder*="Digite aqui"]',
        'div[contenteditable="true"]',
        'textarea',
        'input[type="text"]',
        '[contenteditable="true"]',
        'input[placeholder*="mensagem"]',
        'input[placeholder*="message"]',
        'input[placeholder*="Digite"]',
        'input[placeholder*="digite"]'
      ];
      let inputEncontrado = false;
      for (const selector of selectorsInput) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Input field encontrado: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .clear()
            .type(mensagem, { delay: 100 });
          inputEncontrado = true;
          break;
        }
      }
      if (!inputEncontrado) {
        cy.log('⚠️ Input field não encontrado, tentando seletores genéricos...');
        if ($body.find('input, textarea, [contenteditable]').length > 0) {
          cy.get('input, textarea, [contenteditable]').first()
            .should('be.visible')
            .clear()
            .type(mensagem, { delay: 100 });
        } else {
          cy.log('⚠️ Nenhum input field encontrado');
        }
      }
    });
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
    return this;
  }

  validarEnvioMensagem(mensagem) {
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
    return this;
  }

  fluxoCompletoChat(mensagem) {
    cy.log('🚀 Iniciando fluxo completo de chat...');
    this.configurarInterceptacoes()
      .navegarParaChat()
      .enviarMensagemChat(mensagem)
      .validarEnvioMensagem(mensagem);
    cy.log('✅ Fluxo completo de chat concluído');
    return this;
  }
}
