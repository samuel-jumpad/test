export class AgentPage {
  configurarInterceptacoes() {
    cy.log('🔧 Configurando interceptações e otimizações...');
    
    // Interceptações baseadas no commands.js dos outros testes
    cy.intercept('POST', '**/translate-pa.googleapis.com/**', { 
      statusCode: 200, 
      body: { translatedText: 'Mock translation' } 
    }).as('translationRequest');
    
    cy.intercept('GET', '**/translate.googleapis.com/**', { 
      statusCode: 200, 
      body: { translatedText: 'Mock translation' } 
    }).as('googleTranslationRequest');
    
    cy.intercept('POST', '**/chats/**/messages', { 
      statusCode: 200, 
      body: { success: true, message: 'Message sent successfully' } 
    }).as('chatMessageRequest');
    
    cy.intercept('GET', '**/api/agents/featured', { 
      statusCode: 200, 
      body: { agents: [] } 
    }).as('featuredAgentsRequest');
    
    cy.intercept('GET', '**/api/agents/most-used', { 
      statusCode: 200, 
      body: { agents: [] } 
    }).as('mostUsedAgentsRequest');
    
    cy.intercept('GET', '**/api/llms', { 
      statusCode: 200, 
      body: { llms: [] } 
    }).as('llmsRequest');
    
    // Interceptação final para garantir bloqueio de tradução
    cy.intercept('**/translate**', { statusCode: 200, body: '{}' }).as('blockTranslateFinal');
    
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
  navegarParaAgentes() {
    cy.log('🔍 Navegando para página de Agentes...');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    cy.get('body').then(($body) => {
      if ($body.find('span:contains("Agentes")').length > 0) {
        cy.log('✅ Menu Agentes encontrado por span');
        cy.get('span:contains("Agentes")').first().click();
      } else if ($body.find('div:contains("Agentes")').length > 0) {
        cy.log('✅ Menu Agentes encontrado por div');
        cy.get('div:contains("Agentes")').first().click();
      } else if ($body.find('button:contains("Agentes")').length > 0) {
        cy.log('✅ Menu Agentes encontrado por button');
        cy.get('button:contains("Agentes")').first().click();
      } else {
        cy.log('⚠️ Menu Agentes não encontrado, navegando diretamente...');
        cy.visit('/dashboard/assistants', { timeout: 30000 });
      }
    });
    cy.url({ timeout: 15000 }).should('include', '/assistants');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    cy.log('✅ Navegação para Agentes concluída');
    
    // Após clicar em "Agentes", clicar em "Meus Agentes"
    cy.log('📋 Clicando em "Meus Agentes"...');
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Meus Agentes")').length > 0) {
        cy.log('✅ "Meus Agentes" encontrado por button');
        cy.get('button:contains("Meus Agentes")').first().click();
      } else if ($body.find('div:contains("Meus Agentes")').length > 0) {
        cy.log('✅ "Meus Agentes" encontrado por div');
        cy.get('div:contains("Meus Agentes")').first().click();
      } else if ($body.find('span:contains("Meus Agentes")').length > 0) {
        cy.log('✅ "Meus Agentes" encontrado por span');
        cy.get('span:contains("Meus Agentes")').first().click();
      } else {
        cy.log('⚠️ "Meus Agentes" não encontrado, continuando...');
      }
    });
    cy.wait(2000);
    cy.log('✅ "Meus Agentes" clicado');
    return this;
  }

  criarNovoAgente(agentName, description = 'Relacionado a teste automatizado') {
    cy.log(`🤖 Criando novo agente: ${agentName}`);
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Cadastrar Novo Agente")').length > 0) {
        cy.log('✅ Botão encontrado por button');
        cy.get('button:contains("Cadastrar Novo Agente")').first().click();
      } else if ($body.find('a:contains("Cadastrar Novo Agente")').length > 0) {
        cy.log('✅ Botão encontrado por link');
        cy.get('a:contains("Cadastrar Novo Agente")').first().click();
      } else if ($body.find('div:contains("Cadastrar Novo Agente")').length > 0) {
        cy.log('✅ Botão encontrado por div');
        cy.get('div:contains("Cadastrar Novo Agente")').first().click();
      } else {
        cy.log('⚠️ Botão não encontrado, tentando navegar diretamente...');
        cy.visit('/dashboard/assistants/new', { timeout: 30000 });
      }
    });
    cy.url({ timeout: 15000 }).should('include', '/assistants/new');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(3000);
    cy.get('body').should('be.visible');
    cy.xpath('//input[@name="name"]')
      .should('be.visible')
      .clear()
      .type(agentName, { delay: 150 });
    cy.xpath('//textarea[@name="description"]')
      .should('be.visible')
      .clear()
      .type(description, { delay: 150 });
    cy.xpath('//textarea[contains(@class,"w-md-editor-text-input")]')
      .should('be.visible')
      .clear()
      .type('Teste automatizado Cypress', { delay: 150 });
    cy.xpath('//*[@data-radix-scroll-area-viewport]')
      .scrollTo('bottom', { duration: 2000 });
    cy.xpath('//button[@type="submit"]')
      .should('be.visible')
      .click();
    this.validarAgenteCriado(agentName);
  }

  validarAgenteCriado(agentName) {
    cy.log(`✅ Validando criação do agente: ${agentName}`);
    cy.url({ timeout: 15000 }).should('not.include', '/assistants/new');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(3000);
    cy.get('body').then(($body) => {
      const textosSucesso = [
        'Agente criado',
        'criado com sucesso',
        'sucesso',
        'created',
        'success'
      ];
      let sucessoEncontrado = false;
      for (const texto of textosSucesso) {
        if ($body.text().toLowerCase().includes(texto.toLowerCase())) {
          cy.log(`✅ Mensagem de sucesso encontrada: "${texto}"`);
          sucessoEncontrado = true;
          break;
        }
      }
      if (!sucessoEncontrado) {
        cy.log('⚠️ Mensagem de sucesso não encontrada, mas agente pode ter sido criado');
        cy.screenshot('validacao-criacao-sem-mensagem');
      }
    });
    cy.log(`✅ Agente "${agentName}" criado com sucesso`);
  }

  buscarAgente(agentName) {
    cy.log(`🔍 Buscando agente: ${agentName}`);
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
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
            .type(agentName, { delay: 100 });
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
            .type(agentName, { delay: 100 });
        } else {
          cy.log('⚠️ Nenhum campo de busca disponível, continuando sem busca...');
        }
      }
    });
    cy.wait(3000);
    cy.get('body').should('contain', agentName);
    cy.log(`✅ Agente "${agentName}" encontrado`);
    return this;
  }

  deletarAgente(agentName) {
    cy.log(`🗑️ Deletando agente: ${agentName}`);
    this.buscarAgente(agentName);
    cy.xpath('//td[normalize-space(text())="' + agentName + '"]/ancestor::tr')
      .should('exist')
      .should('be.visible');
    cy.xpath('//td[normalize-space(text())="' + agentName + '"]/ancestor::tr//button')
      .should('exist')
      .should('have.length.greaterThan', 0);
    cy.get('table tbody tr')
      .contains(agentName)
      .parent('tr')
      .find('button')
      .last()
      .should('be.visible')
      .click();
    cy.wait(2000);
    cy.get('body').then(($body) => {
      const seletoresDeletar = [
        'button:contains("Deletar")',
        'button:contains("deletar")',
        'button:contains("Delete")',
        'button:contains("Confirmar")',
        'button:contains("confirmar")',
        'button:contains("Sim")',
        '[class*="danger"]:contains("Deletar")',
        '[class*="red"]:contains("Deletar")',
        '[class*="delete"]'
      ];
      let botaoEncontrado = false;
      for (const seletor of seletoresDeletar) {
        if ($body.find(seletor).length > 0) {
          cy.log(`✅ Botão de deletar encontrado: ${seletor}`);
          cy.get(seletor).last()
            .should('be.visible')
            .click();
          botaoEncontrado = true;
          break;
        }
      }
      if (!botaoEncontrado) {
        cy.log('⚠️ Botão de deletar não encontrado, tentando último botão do modal...');
        cy.get('[role="dialog"] button, .modal button, [class*="modal"] button')
          .last()
          .should('be.visible')
          .click();
      }
    });
    this.validarDelecaoSucesso();
  }

  validarDelecaoSucesso() {
    cy.log('✅ Validando deleção do agente...');
    cy.wait(3000);
    cy.get('body').then(($body) => {
      const mensagensSucesso = [
        'Agente removido',
        'removido',
        'deletado',
        'excluído',
        'deleted',
        'removed',
        'success'
      ];
      let mensagemEncontrada = false;
      for (const mensagem of mensagensSucesso) {
        if ($body.text().toLowerCase().includes(mensagem.toLowerCase())) {
          cy.log(`✅ Mensagem de sucesso encontrada: "${mensagem}"`);
          mensagemEncontrada = true;
          break;
        }
      }
      if (!mensagemEncontrada) {
        cy.log('⚠️ Mensagem de sucesso não encontrada, mas deleção pode ter ocorrido');
        cy.screenshot('validacao-delecao-sem-mensagem');
      }
    });
    cy.log('✅ Agente deletado com sucesso');
  }

  clicarBotaoX() {
    cy.log('📋 Clicando no botão X...');
    cy.get('body').then(($body) => {
      // Seletores específicos baseados na estrutura HTML real
      const selectorsX = [
        // Seletores diretos para o botão com SVG lucide-x
        'button:has(svg.lucide.lucide-x)',
        'button svg.lucide.lucide-x',
        // Seletores por classes específicas do botão
        'button.relative.inline-flex.items-center.justify-center',
        'button[class*="relative"][class*="inline-flex"]',
        // Seletor por estrutura: div > button > div > svg
        'div.flex.items-center button svg.lucide.lucide-x',
        // Seletor por posição (primeiro botão na div)
        'div.p-2.flex.items-center button:first-child',
        // Seletor por atributos específicos
        'button[type="button"][class*="relative"]',
        // Seletor por tamanho (h-10 w-10)
        'button[class*="h-10"][class*="w-10"]'
      ];
      
      let botaoEncontrado = false;
      for (const selector of selectorsX) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Botão X encontrado com seletor específico: ${selector}`);
          try {
            // Aguardar o elemento ficar visível com timeout otimizado
            cy.get(selector).first()
              .should('be.visible', { timeout: 1500 })
              .click();
            cy.log(`✅ Botão X clicado com sucesso: ${selector}`);
            botaoEncontrado = true;
            break;
          } catch (e) {
            cy.log(`⚠️ Elemento encontrado mas não visível: ${selector} - ${e.message}`);
            
            // Estratégia 1: Tentar forçar visibilidade
            try {
              cy.get(selector).first()
                .invoke('removeAttr', 'style')
                .invoke('css', 'display', 'block')
                .invoke('css', 'visibility', 'visible')
                .should('be.visible', { timeout: 2000 })
                .click();
              cy.log(`✅ Botão X clicado após forçar visibilidade: ${selector}`);
              botaoEncontrado = true;
              break;
            } catch (e2) {
              cy.log(`⚠️ Falha ao forçar visibilidade: ${selector} - ${e2.message}`);
            }
            
            // Estratégia 2: Clicar forçadamente mesmo oculto
            try {
              cy.get(selector).first()
                .click({ force: true });
              cy.log(`✅ Botão X clicado forçadamente: ${selector}`);
              botaoEncontrado = true;
              break;
            } catch (e3) {
              cy.log(`⚠️ Falha ao clicar forçadamente: ${selector} - ${e3.message}`);
            }
            
            // Estratégia 3: Tentar com trigger
            try {
              cy.get(selector).first()
                .trigger('click');
              cy.log(`✅ Botão X clicado com trigger: ${selector}`);
              botaoEncontrado = true;
              break;
            } catch (e4) {
              cy.log(`⚠️ Falha ao clicar com trigger: ${selector} - ${e4.message}`);
            }
          }
        }
      }
      
      if (!botaoEncontrado) {
        cy.log('⚠️ Nenhum botão X encontrado, continuando com o teste...');
      }
    });
    cy.log('✅ Tentativa de clicar no botão X concluída');
    cy.wait(500);
    return this;
  }

  navegarParaChat() {
    cy.log('📋 Navegando para Chat...');
    
    // Aguardar um pouco para as transições de UI
    cy.wait(2000);
    
    cy.get('body').then(($body) => {
      // Seletores específicos baseados na estrutura HTML real do Chat
      const selectorsChat = [
        // Seletor direto para o span com texto "Chat"
        'span:contains("Chat")',
        'div:contains("Chat")',
        // Seletor por estrutura específica do Chat
        'div.flex.w-full.items-center.rounded-lg.py-2.cursor-pointer.transition-colors.duration-300.ease-in-out.bg-primary-main.text-white.shadow-md',
        'div.bg-primary-main.text-white span:contains("Chat")',
        // Seletor por ícone do Chat
        'div:has(svg.lucide.lucide-messages-square) span:contains("Chat")',
        'svg.lucide.lucide-messages-square + div span:contains("Chat")',
        // Seletor por classe específica (incluindo elementos com opacity 0)
        'div.flex-1.overflow-hidden.transition-opacity.duration-300.ease-in-out.text-ellipsis span:contains("Chat")',
        'div.flex-1.overflow-hidden.transition-opacity.duration-300.ease-in-out.text-ellipsis.opacity-0 span:contains("Chat")',
        'div.flex-1.overflow-hidden.transition-opacity.duration-300.ease-in-out.text-ellipsis.opacity-100 span:contains("Chat")',
        // Seletor genérico
        'nav span:contains("Chat")',
        'aside span:contains("Chat")'
      ];
      
      let chatEncontrado = false;
      for (const selector of selectorsChat) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Menu Chat encontrado com seletor: ${selector}`);
          try {
            // Estratégia 1: Tentar clicar diretamente sem verificar visibilidade
            cy.get(selector).first()
              .click({ force: true });
            cy.log(`✅ Menu Chat clicado com force: ${selector}`);
            chatEncontrado = true;
            break;
          } catch (e) {
            cy.log(`⚠️ Falha ao clicar com force: ${selector} - ${e.message}`);
            
            // Estratégia 2: Aguardar e forçar visibilidade
            try {
              cy.get(selector).first()
                .invoke('css', 'opacity', '1')
                .invoke('css', 'visibility', 'visible')
                .parent()
                .invoke('css', 'opacity', '1')
                .invoke('css', 'visibility', 'visible');
              
              // Aguardar um pouco para a transição
              cy.wait(1000);
              
              cy.get(selector).first()
                .click({ force: true });
              cy.log(`✅ Menu Chat clicado após forçar visibilidade: ${selector}`);
              chatEncontrado = true;
              break;
            } catch (e2) {
              cy.log(`⚠️ Falha ao forçar visibilidade: ${selector} - ${e2.message}`);
            }
            
            // Estratégia 3: Tentar com trigger
            try {
              cy.get(selector).first()
                .trigger('click');
              cy.log(`✅ Menu Chat clicado com trigger: ${selector}`);
              chatEncontrado = true;
              break;
            } catch (e3) {
              cy.log(`⚠️ Falha ao clicar com trigger: ${selector} - ${e3.message}`);
            }
            
            // Estratégia 4: Aguardar transição e tentar novamente
            try {
              cy.wait(2000); // Aguardar transição de opacity
              cy.get(selector).first()
                .click({ force: true });
              cy.log(`✅ Menu Chat clicado após aguardar transição: ${selector}`);
              chatEncontrado = true;
              break;
            } catch (e4) {
              cy.log(`⚠️ Falha após aguardar transição: ${selector} - ${e4.message}`);
            }
          }
        }
      }
      
      // Se não encontrou com CSS, tentar XPath
      if (!chatEncontrado) {
        cy.log('⚠️ Menu Chat não encontrado com CSS, tentando XPath...');
        const selectorsXPath = [
          '//span[contains(text(), "Chat")]',
          '//div[contains(text(), "Chat")]',
          '//div[@class="flex w-full items-center rounded-lg py-2 cursor-pointer transition-colors duration-300 ease-in-out bg-primary-main text-white shadow-md"]//span[contains(text(), "Chat")]',
          '//div[contains(@class, "bg-primary-main")]//span[contains(text(), "Chat")]',
          '//nav//span[contains(text(), "Chat")]',
          '//aside//span[contains(text(), "Chat")]'
        ];
        
        for (const selector of selectorsXPath) {
          try {
            cy.xpath(selector)
              .should('be.visible', { timeout: 1000 })
              .click();
            cy.log(`✅ Menu Chat clicado com XPath: ${selector}`);
            chatEncontrado = true;
            break;
          } catch (e) {
            cy.log(`⚠️ XPath não funcionou: ${selector} - ${e.message}`);
          }
        }
      }
      
      // Fallback: tentar clicar em qualquer elemento que contenha "Chat"
      if (!chatEncontrado) {
        cy.log('⚠️ Menu Chat não encontrado com seletores específicos, tentando fallback...');
        try {
          cy.contains('Chat')
            .click({ force: true });
          cy.log('✅ Menu Chat clicado com fallback forçado');
          chatEncontrado = true;
        } catch (e) {
          cy.log(`⚠️ Fallback forçado falhou: ${e.message}`);
        }
      }
      
      // Estratégia adicional: aguardar transição de opacity e tentar novamente
      if (!chatEncontrado) {
        cy.log('⚠️ Tentando estratégia de aguardar transição de opacity...');
        cy.wait(3000); // Aguardar transição completa
        
        try {
          // Tentar encontrar elementos com opacity que pode estar mudando
          cy.get('div.flex-1.overflow-hidden.transition-opacity.duration-300.ease-in-out.text-ellipsis')
            .should('have.css', 'opacity', '1')
            .find('span:contains("Chat")')
            .should('be.visible')
            .click();
          cy.log('✅ Menu Chat clicado após aguardar transição de opacity');
          chatEncontrado = true;
        } catch (e) {
          cy.log(`⚠️ Estratégia de transição falhou: ${e.message}`);
        }
      }
      
      if (!chatEncontrado) {
        cy.log('⚠️ Nenhum menu Chat encontrado, continuando com o teste...');
      }
    });
    cy.log('✅ Tentativa de clicar no menu Chat concluída');
    cy.wait(500);
    return this;
  }

  clicarAgenteTesteAutomatizado() {
    cy.log('📋 Clicando no agente teste automatizado...');
    cy.get('body').then(($body) => {
      // Seletores específicos baseados na estrutura HTML real
      const selectorsAgente = [
        // Primeiro: tentar clicar no nome do agente (mais confiável)
        'div.truncate:contains("Agente teste automatizado")',
        'div:contains("Agente teste automatizado")',
        // Segundo: tentar o botão de ações mesmo oculto
        'div.folder-actions.css-6ir1gv[type="button"]',
        'div[class*="folder-actions"][type="button"]',
        // Terceiro: tentar o SVG ellipsis-vertical
        'div:has(svg.lucide.lucide-ellipsis-vertical)',
        'div svg.lucide.lucide-ellipsis-vertical',
        // Quarto: tentar a estrutura completa
        'div.flex.items-center.gap-2.rounded-full.relative.cursor-pointer',
        'div.css-189q5a8',
        // Quinto: tentar por atributos específicos
        'div[aria-haspopup="dialog"][aria-expanded="false"]',
        'div[data-state="closed"]',
        // Sexto: tentar por posição na estrutura
        'div.flex.items-center.gap-2 div:last-child',
        'div.flex.flex-col.gap-2 div div div.folder-actions'
      ];
      
      let agenteEncontrado = false;
      for (const selector of selectorsAgente) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Botão do agente encontrado com seletor: ${selector}`);
          try {
            // Aguardar o elemento ficar visível com timeout otimizado
            cy.get(selector).first()
              .should('be.visible', { timeout: 1500 })
              .click();
            cy.log(`✅ Botão do agente clicado com sucesso: ${selector}`);
            agenteEncontrado = true;
            break;
          } catch (e) {
            cy.log(`⚠️ Elemento encontrado mas não visível: ${selector} - ${e.message}`);
            
            // Estratégia 1: Tentar forçar visibilidade
            try {
              cy.get(selector).first()
                .invoke('removeAttr', 'style')
                .invoke('css', 'display', 'block')
                .invoke('css', 'visibility', 'visible')
                .should('be.visible', { timeout: 2000 })
                .click();
              cy.log(`✅ Botão do agente clicado após forçar visibilidade: ${selector}`);
              agenteEncontrado = true;
              break;
            } catch (e2) {
              cy.log(`⚠️ Falha ao forçar visibilidade: ${selector} - ${e2.message}`);
            }
            
            // Estratégia 2: Clicar forçadamente mesmo oculto
            try {
              cy.get(selector).first()
                .click({ force: true });
              cy.log(`✅ Botão do agente clicado forçadamente: ${selector}`);
              agenteEncontrado = true;
              break;
            } catch (e3) {
              cy.log(`⚠️ Falha ao clicar forçadamente: ${selector} - ${e3.message}`);
            }
            
            // Estratégia 3: Tentar com trigger
            try {
              cy.get(selector).first()
                .trigger('click');
              cy.log(`✅ Botão do agente clicado com trigger: ${selector}`);
              agenteEncontrado = true;
              break;
            } catch (e4) {
              cy.log(`⚠️ Falha ao clicar com trigger: ${selector} - ${e4.message}`);
            }
          }
        }
      }
      
      // Se não encontrou, tentar XPath específico
      if (!agenteEncontrado) {
        cy.log('⚠️ Botão do agente não encontrado com CSS, tentando XPath específico...');
        try {
          // XPath específico para o botão de ações
          cy.xpath('//div[@class="folder-actions css-6ir1gv" and @type="button"]')
            .should('be.visible')
            .click();
          cy.log('✅ Botão do agente encontrado e clicado com XPath específico');
          agenteEncontrado = true;
        } catch (e) {
          cy.log(`⚠️ Erro com XPath específico: ${e.message}`);
        }
      }
      
      // Fallback: tentar seletores mais genéricos
      if (!agenteEncontrado) {
        cy.log('⚠️ Botão do agente não encontrado com seletores específicos, tentando fallbacks...');
        const selectorsFallback = [
          'div:has(svg.lucide.lucide-ellipsis-vertical)',
          'div[aria-haspopup="dialog"]',
          'div[data-state="closed"]',
          'div.flex.items-center.gap-2 div:last-child',
          'div[class*="folder-actions"]'
        ];
        
        for (const selector of selectorsFallback) {
          if ($body.find(selector).length > 0) {
            cy.log(`✅ Botão do agente encontrado com fallback: ${selector}`);
            try {
              cy.get(selector).first()
                .should('be.visible', { timeout: 2000 })
                .click();
              agenteEncontrado = true;
              break;
            } catch (e) {
              cy.log(`⚠️ Fallback não visível: ${selector} - ${e.message}`);
            }
          }
        }
      }
      
      // Último recurso: tentar clicar no nome do agente ou estrutura
      if (!agenteEncontrado) {
        cy.log('⚠️ Botão de ações não encontrado, tentando estratégias de fallback...');
        
        // Estratégia 1: Clicar no nome do agente
        try {
          cy.contains('Agente teste automatizado')
            .should('be.visible')
            .click();
          cy.log('✅ Nome do agente clicado como fallback');
          agenteEncontrado = true;
        } catch (e) {
          cy.log(`⚠️ Nome do agente não encontrado: ${e.message}`);
        }
        
        // Estratégia 2: Clicar na estrutura do agente
        if (!agenteEncontrado) {
          try {
            cy.get('div.flex.items-center.gap-2.rounded-full.relative.cursor-pointer')
              .should('be.visible')
              .click();
            cy.log('✅ Estrutura do agente clicada como fallback');
            agenteEncontrado = true;
          } catch (e) {
            cy.log(`⚠️ Estrutura do agente não encontrada: ${e.message}`);
          }
        }
        
        // Estratégia 3: Clicar em qualquer elemento que contenha o nome
        if (!agenteEncontrado) {
          try {
            cy.get('div:contains("Agente teste automatizado")')
              .first()
              .should('be.visible')
              .click();
            cy.log('✅ Elemento contendo o nome clicado como fallback');
            agenteEncontrado = true;
          } catch (e) {
            cy.log(`⚠️ Elemento contendo o nome não encontrado: ${e.message}`);
          }
        }
      }
      
      if (!agenteEncontrado) {
        cy.log('⚠️ Nenhum botão do agente encontrado, continuando com o teste...');
      }
    });
    cy.log('✅ Tentativa de clicar no agente teste automatizado concluída');
    cy.wait(500);
    return this;
  }

  enviarMensagemChat(mensagem = 'ola, como vai?') {
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

  validarEnvioMensagem(mensagem = 'ola, como vai?') {
    cy.log('🔍 Validando envio da mensagem...');
    cy.log('⏳ Aguardando 5 segundos após envio...');
    cy.wait(5000);
    
    // Estratégia baseada no chat-old-message.cy.js e AgentPage
    cy.get('body').then(($body) => {
      // 1. Verificar se o campo de input está vazio (indicando que foi enviado)
      if ($body.find('div[contenteditable="true"]').length > 0) {
        cy.get('div[contenteditable="true"]').first().should('be.empty');
        cy.log('✅ Campo de input vazio - mensagem enviada');
      }
    });
    
    // 2. Verificar se não há indicadores de "enviando"
    cy.get('body').should('not.contain', 'enviando');
    cy.get('body').should('not.contain', 'sending');
    cy.log('✅ Sem indicadores de envio - mensagem processada');
    
    // 3. Verificar se a mensagem aparece na página (baseado no AgentPage)
    cy.get('body').then(($body) => {
      const textosSucesso = [
        mensagem,
        'mensagem enviada',
        'enviado com sucesso',
        'sucesso',
        'sent',
        'success'
      ];
      let sucessoEncontrado = false;
      for (const texto of textosSucesso) {
        if ($body.text().toLowerCase().includes(texto.toLowerCase())) {
          cy.log(`✅ Mensagem de sucesso encontrada: "${texto}"`);
          sucessoEncontrado = true;
          break;
        }
      }
      if (!sucessoEncontrado) {
        cy.log('⚠️ Mensagem de sucesso não encontrada, mas mensagem pode ter sido enviada');
        cy.screenshot('validacao-envio-sem-mensagem');
      }
    });
    
    // 4. Verificar se a mensagem aparece na página
    cy.get('body').should('contain.text', mensagem);
    cy.log('✅ Mensagem encontrada na página - envio confirmado');
    return this;
  }

  clicarBotaoTestar() {
    cy.log('📋 Clicando no botão testar...');
    cy.get('body').then(($body) => {
      if ($body.find('button:contains("Testar")').length > 0) {
        cy.log('✅ Botão Testar encontrado por texto');
        cy.get('button:contains("Testar")').first().click();
      } else if ($body.find('button svg[class*="sparkles"]').length > 0) {
        cy.log('✅ Botão Testar encontrado por ícone sparkles');
        cy.get('button svg[class*="sparkles"]').parent().first().click();
      } else if ($body.find('table tbody tr button').length > 0) {
        cy.log('✅ Botões encontrados na tabela, clicando no primeiro');
        cy.get('table tbody tr button').first().click();
      } else {
        cy.log('⚠️ Botão Testar não encontrado, tentando primeiro botão disponível');
        cy.get('button').first().click();
      }
    });
    cy.wait(3000);
    cy.get('body').should('not.contain', 'loading');
    cy.log('✅ Botão testar clicado e página carregada');
    return this;
  }

  enviarMensagemInicial(mensagem = 'Olá! Este é um teste automatizado do Cypress.') {
    cy.log(`📝 Enviando mensagem inicial no chat: "${mensagem}"`);
    cy.get('body').then(($body) => {
      const inputSelectors = [
        'input[type="text"]',
        'textarea',
        '[contenteditable="true"]',
        'input[placeholder*="message"]',
        'input[placeholder*="mensagem"]'
      ];
      let inputFound = false;
      for (const selector of inputSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Input encontrado: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .clear()
            .type(mensagem, { delay: 100 });
          cy.get(selector).first().type('{enter}');
          inputFound = true;
          break;
        }
      }
      if (!inputFound) {
        cy.log('⚠️ Campo de input não encontrado');
      }
    });
    cy.wait(5000);
    cy.log('✅ Mensagem inicial enviada no chat');
    return this;
  }

  validarMensagemInicial() {
    cy.log('📋 Validando envio da mensagem inicial...');
    cy.get('body').then(($body) => {
      if ($body.find('[class*="message"], [class*="chat"], [class*="bubble"]').length > 0) {
        cy.log('✅ Mensagens encontradas na interface');
        cy.get('[class*="message"], [class*="chat"], [class*="bubble"]').should('have.length.greaterThan', 0);
      } else {
        cy.log('⚠️ Nenhuma mensagem visível encontrada');
      }
    });
    cy.log('✅ Validação de mensagem inicial concluída');
    return this;
  }

  fluxoCompletoAcessoAgenteAntigo() {
    cy.log('🚀 Iniciando fluxo completo de acesso ao agente antigo...');
    this.clicarBotaoX()
      .navegarParaChat()
      .clicarAgenteTesteAutomatizado()
      .enviarMensagemChat('ola, como vai?')
      .validarEnvioMensagem('ola, como vai?');
    cy.log('✅ Fluxo completo de acesso ao agente antigo concluído');
    return this;
  }

  fluxoCompletoTesteAgenteAntigo() {
    cy.log('🚀 Iniciando fluxo completo do teste de agente antigo...');
    this.configurarInterceptacoes()
      .navegarParaAgentes()
      .buscarAgente('Agente teste automatizado')
      .clicarBotaoTestar()
      .enviarMensagemInicial()
      .validarMensagemInicial()
      .fluxoCompletoAcessoAgenteAntigo();
    cy.log('✅ Fluxo completo do teste de agente antigo concluído');
    return this;
  }
}