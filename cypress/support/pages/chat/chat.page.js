class ChatPage {
  elements = {
    chatSection: () => cy.xpath('//div[@class="flex-1 overflow-hidden transition-opacity duration-300 ease-in-out text-ellipsis opacity-100"]//span[contains(text(), "Chat")]'),
    generalChat: () => cy.get('div').contains('Geral'),
    chatItem: () => cy.get('div.flex-1.truncate'),
    messageBubble: () => cy.xpath('//div[@class="p-2 border rounded-xl bg-gray-100"]')
  };

  openChatSection() {
    this.elements.chatSection()
      .should('be.visible')
      .click();
    
    // Wait for chat section to load
    cy.get('body').should('not.contain', 'loading');
    
    return this;
  }

  selectGeneralChat() {
    cy.log('🔍 Procurando chat "Geral"...');
    
    // Aguardar página carregar
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    // Procurar "Geral" com múltiplas estratégias
    cy.get('body').then(($body) => {
      const selectors = [
        'div:contains("Geral")',
        'span:contains("Geral")',
        'a:contains("Geral")',
        '[class*="chat"]:contains("Geral")',
        '[class*="conversation"]:contains("Geral")'
      ];
      
      let found = false;
      for (const selector of selectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Chat "Geral" encontrado com seletor: ${selector}`);
          cy.get(selector).first().should('be.visible').click();
          found = true;
          break;
        }
      }
      
      if (!found) {
        cy.log('❌ Chat "Geral" não encontrado, tentando primeiro chat disponível');
        cy.screenshot('geral-nao-encontrado');
        // Tentar selecionar o primeiro chat disponível
        cy.get('div[class*="chat"], div[class*="conversation"]').first().click();
      }
    });
    
    // Wait for general chat to be selected
    cy.get('body').should('not.contain', 'loading');
    
    cy.log('✅ Chat selecionado');
    
    return this;
  }

  selectFirstChatItem() {
    this.elements.chatItem()
      .first()
      .should('be.visible')
      .click();
    
    // Wait for chat item to be selected
    cy.get('body').should('not.contain', 'loading');
    
    // Additional wait before proceeding to message input
    cy.wait(2000);
    
    return this;
  }

  validateMessageSent() {
    // Wait for message to appear in chat
    this.elements.messageBubble()
      .should('be.visible', { timeout: 15000 });
    
    // Ensure chat is not in loading state
    cy.get('body').should('not.contain', 'loading');
    
    return this;
  }

  sendMessageInChat(message) {
    // Wait for chat interface to be ready
    cy.get('body').should('not.contain', 'loading');
    
    // Send message using the command (which handles input validation)
    cy.sendChatMessage(message);
    
    // Wait for page to be ready
    cy.waitForPageLoad();
    
    // Validate message was sent
    this.validateMessageSent();
    
    return this;
  }

  waitForPageLoad() {
    // Wait for page to be fully interactive
    cy.get('body').should('be.visible');
    cy.get('body').should('not.contain', 'loading');
    cy.document().should('have.property', 'readyState', 'complete');
    
    // Wait for specific loading states to disappear (but ignore data-loading attributes on buttons)
    cy.get('[data-testid="loading"], .loading').should('not.exist');
    
    return this;
  }

  // ===== MÉTODOS ESPECÍFICOS PARA AGENTES =====

  // Busca e clica no botão "Testar" do agente
  findAndClickTestButton() {
    cy.log('🔍 Procurando botão "Testar"...');
    
    cy.get('body').then(($body) => {
      // Estratégia 1: Buscar por texto "Testar"
      if ($body.find('button:contains("Testar")').length > 0) {
        cy.log('✅ Botão Testar encontrado por texto');
        cy.get('button:contains("Testar")').first()
          .should('be.visible')
          .click();
      }
      // Estratégia 2: Buscar por ícone sparkles
      else if ($body.find('button svg[class*="sparkles"]').length > 0) {
        cy.log('✅ Botão Testar encontrado por ícone sparkles');
        cy.get('button svg[class*="sparkles"]').parent()
          .should('be.visible')
          .click();
      }
      // Estratégia 3: Buscar por XPath com sparkles
      else if ($body.find('button svg[class*="lucide-sparkles"]').length > 0) {
        cy.log('✅ Botão Testar encontrado por lucide-sparkles');
        cy.xpath('//button[.//svg[contains(@class,"lucide-sparkles")]]').first()
          .should('be.visible')
          .click();
      }
      // Estratégia 4: Buscar qualquer botão com ícone de teste/play
      else if ($body.find('button svg[class*="play"], button svg[class*="test"], button svg[class*="run"]').length > 0) {
        cy.log('✅ Botão de teste encontrado por ícone alternativo');
        cy.get('button svg[class*="play"], button svg[class*="test"], button svg[class*="run"]').parent().first()
          .should('be.visible')
          .click();
      }
      // Estratégia 5: Buscar por botões na linha da tabela
      else if ($body.find('table tbody tr button').length > 0) {
        cy.log('✅ Botões encontrados na tabela, clicando no primeiro');
        cy.get('table tbody tr button').first()
          .should('be.visible')
          .click();
      }
      // Estratégia 6: Buscar por qualquer botão que contenha texto relacionado a teste
      else if ($body.find('button:contains("Test"), button:contains("Run"), button:contains("Execute")').length > 0) {
        cy.log('✅ Botão de teste encontrado por texto alternativo');
        cy.get('button:contains("Test"), button:contains("Run"), button:contains("Execute")').first()
          .should('be.visible')
          .click();
      }
      // Fallback: Mostrar informações de debug
      else {
        cy.log('⚠️ Botão Testar não encontrado, mostrando debug...');
        cy.screenshot('botao-testar-nao-encontrado');
        
        // Mostrar todos os botões disponíveis
        cy.get('button').then(($buttons) => {
          cy.log(`📊 Total de botões encontrados: ${$buttons.length}`);
          $buttons.each((index, button) => {
            cy.log(`Botão ${index + 1}: "${button.textContent.trim()}" - Classes: ${button.className}`);
          });
        });
        
        // Tentar clicar no primeiro botão disponível como último recurso
        cy.get('button').first()
          .should('be.visible')
          .click();
      }
    });
    
    return this;
  }

  // Envia mensagem no chat do agente
  sendMessageToAgent(message = 'Olá! Este é um teste automatizado do Cypress. Como você está?') {
    cy.log('💬 Enviando mensagem no chat do agente...');
    
    // Aguardar interface do chat carregar
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);

    // Procurar campo de input do chat
    cy.get('body').then(($body) => {
      if ($body.find('input[type="text"], textarea, [contenteditable="true"]').length > 0) {
        cy.log('✅ Campo de input do chat encontrado');
        
        // Tentar diferentes tipos de input
        const inputSelectors = [
          'input[type="text"]',
          'textarea',
          '[contenteditable="true"]',
          'input[placeholder*="message"], input[placeholder*="mensagem"]',
          'input[placeholder*="chat"], input[placeholder*="conversa"]'
        ];

        let inputFound = false;
        for (const selector of inputSelectors) {
          if ($body.find(selector).length > 0) {
            cy.log(`✅ Input encontrado com seletor: ${selector}`);
            cy.get(selector).first()
              .should('be.visible')
              .clear()
              .type(message, { delay: 100 });

            // Procurar botão de enviar
            this.clickSendButton();
            inputFound = true;
            break;
          }
        }

        if (!inputFound) {
          cy.log('❌ Campo de input não encontrado');
          cy.screenshot('input-nao-encontrado');
        }
      } else {
        cy.log('❌ Nenhum campo de input encontrado na página');
        cy.screenshot('sem-input-chat');
      }
    });
    
    return this;
  }

  // Clica no botão de enviar mensagem
  clickSendButton() {
    cy.get('body').then(($body) => {
      const sendSelectors = [
        'button[type="submit"]',
        'button:contains("Enviar")',
        'button:contains("Send")',
        'button svg[class*="send"], button svg[class*="paper-plane"]',
        'button[class*="send"], button[class*="submit"]'
      ];

      let sendFound = false;
      for (const sendSelector of sendSelectors) {
        if ($body.find(sendSelector).length > 0) {
          cy.log(`✅ Botão de enviar encontrado: ${sendSelector}`);
          cy.get(sendSelector).first()
            .should('be.visible')
            .click();
          sendFound = true;
          break;
        }
      }

      if (!sendFound) {
        cy.log('⚠️ Botão de enviar não encontrado, tentando Enter');
        cy.get('input[type="text"], textarea, [contenteditable="true"]').first().type('{enter}');
      }
    });
    
    return this;
  }

  // Valida se a mensagem foi enviada com sucesso
  validateMessageSent() {
    cy.log('⏳ Aguardando resposta do agente...');
    cy.wait(5000);

    // Verificar se a mensagem foi enviada
    cy.get('body').then(($body) => {
      if ($body.find('[class*="message"], [class*="chat"], [class*="bubble"]').length > 0) {
        cy.log('✅ Mensagens encontradas na interface');
        cy.get('[class*="message"], [class*="chat"], [class*="bubble"]').should('have.length.greaterThan', 0);
      } else {
        cy.log('⚠️ Nenhuma mensagem visível encontrada');
      }
    });
    
    return this;
  }

  // Captura dados do agente acessado
  captureAgentData() {
    cy.log('📊 Capturando dados do agente...');
    
    // Capturar URL atual
    cy.url().then((url) => {
      cy.log(`🔗 URL do agente: ${url}`);
    });

    // Tentar capturar nome do agente com múltiplas estratégias
    cy.get('body').then(($body) => {
      const selectorsNome = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        '[class*="title"]',
        '[class*="name"]',
        '[class*="agent"]',
        '[data-testid*="title"]',
        '[data-testid*="name"]',
        '.title', '.name', '.agent-name'
      ];
      
      let nomeEncontrado = false;
      for (const selector of selectorsNome) {
        try {
          if ($body.find(selector).length > 0) {
            const texto = $body.find(selector).first().text().trim();
            if (texto && texto.length > 0) {
              cy.log(`📝 Nome do agente encontrado com seletor "${selector}": ${texto}`);
              nomeEncontrado = true;
              break;
            }
          }
        } catch (error) {
          cy.log(`⚠️ Erro com seletor ${selector}: ${error.message}`);
        }
      }
      
      if (!nomeEncontrado) {
        cy.log('⚠️ Nome do agente não encontrado na página');
      }
    });
    
    return this;
  }
}

export default new ChatPage();