export class ChatPage {
  // Navegar para o chat
  navegarParaChat() {
    cy.log('📋 Navegando para o chat...');
    
    // Aguarda dashboard carregar (sem wait fixo)
    cy.get('body').should('not.contain', 'loading');
    
    // Tenta encontrar o menu Chat com múltiplos seletores
    cy.get('body').then(($body) => {
      const selectorsChat = [
        'span:contains("Chat")',
        'div:contains("Chat")',
        'button:contains("Chat")',
        'a:contains("Chat")',
        '[class*="menu"]:contains("Chat")',
        '[class*="nav"]:contains("Chat")'
      ];

      let chatEncontrado = false;
      for (const selector of selectorsChat) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Menu Chat encontrado: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .scrollIntoView()
            .click({ force: true });
          chatEncontrado = true;
          break;
        }
      }

      if (!chatEncontrado) {
        cy.log('⚠️ Menu Chat não encontrado, tentando XPath...');
        cy.xpath('//div[@class="flex-1 overflow-hidden transition-opacity duration-300 ease-in-out text-ellipsis opacity-100"]//span[contains(text(), "Chat")]')
          .should('be.visible')
          .scrollIntoView()
          .click({ force: true });
      }
    });

    // Aguarda navegação para chat (aguarda URL mudar)
    cy.url({ timeout: 15000 }).should('include', '/chat');
    cy.get('body').should('not.contain', 'loading');
    cy.log('✅ Navegação para chat concluída');
    return this;
  }

  // Selecionar conversa "Geral"
  selecionarConversaGeral() {
    cy.log('📋 Selecionando conversa "Geral"...');
    
    // Aguarda a página de chat carregar (sem wait fixo)
    cy.get('body').should('not.contain', 'loading');
    
    // Usa o XPath que você confirmou que funciona
    cy.log('🎯 Clicando em "Geral" com XPath...');
    cy.xpath('//div[@class="truncate" and normalize-space(text())="Geral"]')
      .should('be.visible')
      .click();
    cy.log('✅ Conversa "Geral" selecionada');
    
    // Aguarda a conversa carregar (sem wait fixo)
    cy.get('body').should('not.contain', 'loading');
    return this;
  }

  // Clicar na primeira mensagem (abrir a última mensagem)
  clicarPrimeiraMensagem() {
    cy.log('📋 Abrindo a última mensagem do chat...');
    
    // Aguarda a conversa carregar (sem wait fixo)
    cy.get('body').should('not.contain', 'loading');
    
    // Tenta encontrar mensagens com múltiplos seletores
    cy.get('body').then(($body) => {
      const selectorsMensagem = [
        '[class*="flex gap-2 items-center truncate rounded-xl"]',
        '[class*="message"]',
        '[class*="chat-item"]',
        '[class*="conversation"]',
        'div[class*="flex"][class*="gap"]',
        'div[class*="rounded-xl"]'
      ];

      let mensagemEncontrada = false;
      for (const selector of selectorsMensagem) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Mensagem encontrada: ${selector}`);
          cy.get(selector)
            .first()
            .scrollIntoView()
            .click({ force: true });
          mensagemEncontrada = true;
          break;
        }
      }

      if (!mensagemEncontrada) {
        cy.log('⚠️ Nenhuma mensagem encontrada, tentando primeiro elemento clicável...');
        if ($body.find('div[class*="flex"]').length > 0) {
          cy.get('div[class*="flex"]').first()
            .scrollIntoView()
            .click({ force: true });
        } else {
          cy.log('⚠️ Nenhum elemento de mensagem encontrado, continuando...');
        }
      }
    });

    cy.log('✅ Mensagem aberta');
    return this;
  }

  // Enviar mensagem no chat
  enviarMensagem(mensagem = 'ola, como vai?') {
    cy.log(`📝 Enviando mensagem: "${mensagem}"`);
    
    // Digitar mensagem (sem wait fixo)
    cy.get('body').then(($body) => {
      const selectorsInput = [
        'div[contenteditable="true"][data-placeholder*="Digite aqui"]',
        'div[contenteditable="true"]',
        'textarea',
        'input[type="text"]',
        '[contenteditable="true"]',
        'input[placeholder*="mensagem"]',
        'input[placeholder*="message"]'
      ];

      let inputEncontrado = false;
      for (const selector of selectorsInput) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Campo de input encontrado: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .clear()
            .type(mensagem, { delay: 100 });
          inputEncontrado = true;
          break;
        }
      }

      if (!inputEncontrado) {
        cy.log('⚠️ Campo de input não encontrado, tentando XPath...');
        cy.xpath('//div[@contenteditable="true" and @data-placeholder="Digite aqui sua mensagem..."]')
          .should('be.visible')
          .clear()
          .type(mensagem, { delay: 100 });
      }
    });

    cy.log('✅ Mensagem digitada');

    // Clicar no botão de enviar
    cy.get('body').then(($body) => {
      const selectorsBotao = [
        'button[type="submit"]:not([disabled])',
        'button:contains("Enviar")',
        'button:contains("Send")',
        'form button[type="submit"]',
        'button[class*="submit"]',
        'button[class*="send"]'
      ];

      let botaoEncontrado = false;
      for (const selector of selectorsBotao) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Botão de enviar encontrado: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .scrollIntoView()
            .click();
          botaoEncontrado = true;
          break;
        }
      }

      if (!botaoEncontrado) {
        cy.log('⚠️ Botão de enviar não encontrado, tentando XPath...');
        cy.xpath('//form[.//div[@contenteditable="true" and @data-placeholder="Digite aqui sua mensagem..."]]//button[@type="submit" and not(@disabled)]', { timeout: 15000 })
          .should('be.visible')
          .scrollIntoView()
          .click();
      }
    });

    cy.log('✅ Botão de enviar clicado');
    // Aguarda envio (sem wait fixo - aguarda elemento desaparecer ou mudar)
    cy.get('body').should('not.contain', 'enviando');
    return this;
  }

  // Validar envio da mensagem
  validarEnvioMensagem(mensagem = 'ola, como vai?') {
    cy.log('🔍 Validando envio da mensagem...');
    
    // Verificar se o campo foi limpo (confirmação de envio)
    cy.get('body').then(($body) => {
      if ($body.find('div[contenteditable="true"]').length > 0) {
        cy.get('div[contenteditable="true"]').first().should('be.empty');
      }
    });

    // Verificar se não há indicadores de loading
    cy.get('body').should('not.contain', 'enviando');
    cy.get('body').should('not.contain', 'sending');

    // Verificar se a mensagem aparece na interface
    cy.get('body').should('contain.text', mensagem);
    
    cy.log('✅ Mensagem enviada e validada com sucesso');
    return this;
  }

  // Fluxo completo de chat
  fluxoCompletoChat(mensagem = 'ola, como vai?') {
    cy.log('🚀 Iniciando fluxo completo de chat...');
    
    this.navegarParaChat()
      .selecionarConversaGeral()
      .clicarPrimeiraMensagem()
      .enviarMensagem(mensagem)
      .validarEnvioMensagem(mensagem);
    
    cy.log('✅ Fluxo completo de chat concluído');
    return this;
  }
}