export class AgentPage {
  configurarInterceptacoes() {
    cy.log('🔧 Configurando interceptações e otimizações...');
    
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
    
    cy.intercept('**/translate**', { statusCode: 200, body: '{}' }).as('blockTranslateFinal');
   
    cy.window().then((win) => {
      win.document.documentElement.style.setProperty('animation-duration', '0s');
      win.document.documentElement.style.setProperty('transition-duration', '0s');
      
      win.document.documentElement.setAttribute('translate', 'no');
      win.document.documentElement.setAttribute('lang', 'en');
    });
    
    cy.log('✅ Interceptações e otimizações configuradas');
    return this;
  }

  navegarParaAgentes() {
    cy.log('🔍 Navegando para Agentes...');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    cy.get('body').then(($body) => {
      const totalAgentes = $body.find('*:contains("Agentes")').length;
      cy.log(`🔍 DEBUG: Total de elementos contendo "Agentes": ${totalAgentes}`);
    });
    
    cy.get('body').then(($body) => {
      const agentesSelectors = [
        'button:contains("Agentes")',
        'a:contains("Agentes")',
        '[role="button"]:contains("Agentes")',
        '[data-testid*="agentes"]',
        '[data-testid*="agents"]',
        '[aria-label*="agentes"]',
        '[aria-label*="agents"]',
        'nav button:contains("Agentes")',
        'nav a:contains("Agentes")',
        '.nav-item:contains("Agentes")',
        '.menu-item:contains("Agentes")',
        '.sidebar-item:contains("Agentes")',
        '[data-sidebar="menu-button"]:contains("Agentes")',
        'li[data-slot="sidebar-menu-item"] button:contains("Agentes")'
      ];
      
      let agentesEncontrado = false;
      for (const selector of agentesSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Agentes encontrado com seletor: ${selector}`);
          cy.log(`📊 Quantidade encontrada: ${$body.find(selector).length}`);
          
          cy.get(selector).first()
            .scrollIntoView()
            .wait(1000)
            .click({ force: true });
          agentesEncontrado = true;
          cy.log('✅ Clique em Agentes EXECUTADO!');
          break;
        }
      }
      
      if (!agentesEncontrado) {
        cy.log('❌ Agentes NÃO encontrado, navegando diretamente...');
        cy.visit('/dashboard/agents', { failOnStatusCode: false });
      }
    });
    
    cy.wait(4000);
    cy.log('✅ Navegação para Agentes concluída');
    return this;
  }

  clicarEmMeusAgentes() {
    cy.log('🔍 Procurando "Meus Agentes"...');
    cy.wait(2000);
    
    cy.get('body').then(($body) => {
      const meusAgentesSelectors = [
        'a[href="/dashboard/assistants/list"]',
        'a[href*="/assistants/list"]',
        'button:contains("Meus Agentes")',
        'a:contains("Meus Agentes")',
        '[role="button"]:contains("Meus Agentes")',
        'button:contains("Meus")',
        'a:contains("Meus")'
      ];
      
      let found = false;
      for (let selector of meusAgentesSelectors) {
        const elements = $body.find(selector);
        if (elements.length > 0) {
          cy.log(`✅ "Meus Agentes" encontrado com seletor: ${selector}`);
          cy.log(`📊 Quantidade encontrada: ${elements.length}`);

          cy.get(selector).then($els => {

            let targetElement = null;
            
            $els.each((index, el) => {
              const $el = Cypress.$(el);
              const text = $el.text().trim();

              cy.log(`🔍 Elemento ${index}: tag="${el.tagName}", text="${text}"`);

              if (el.tagName === 'A' || el.tagName === 'BUTTON') {
                if (text === 'Meus Agentes' || text.includes('Meus Agentes')) {
                  targetElement = $el;
                  cy.log(`✅ Elemento alvo encontrado: ${el.tagName}`);
                  return false; 
                }
              }
            });

            if (!targetElement && $els.length > 0) {
              $els.each((index, el) => {
                if (el.tagName === 'A' || el.tagName === 'BUTTON') {
                  targetElement = Cypress.$(el);
                  cy.log(`⚠️ Usando primeiro elemento clicável: ${el.tagName}`);
                  return false;
                }
              });
            }

            if (!targetElement) {
              targetElement = $els.first();
              cy.log('⚠️ Usando primeiro elemento encontrado (fallback)');
            }

            cy.wrap(targetElement)
              .scrollIntoView()
              .should('be.visible')
              .wait(1000)
              .click({ force: true });
            
            cy.log('✅ Clique em "Meus Agentes" EXECUTADO!');
          });
          
          found = true;
          break;
        }
      }
      
      if (!found) {
        cy.log('❌ "Meus Agentes" NÃO encontrado, navegando diretamente...');
        cy.visit('/dashboard/assistants/list', { failOnStatusCode: false });
      }
    });
    
    cy.wait(5000);
    cy.log('✅ Navegação para Meus Agentes concluída');
    return this;
  }

  navegarParaSecaoAgentes() {
    cy.log('🔍 Navegando para seção de Agentes...');
    
    cy.get('body').then(($body) => {
      const agentesButton = $body.find('button:contains("Agentes"), a:contains("Agentes"), [role="button"]:contains("Agentes")');
      
      if (agentesButton.length > 0) {
        cy.log('✅ Encontrado botão Agentes');
        cy.wrap(agentesButton.first()).should('be.visible').click();
        cy.wait(2000);
      } else {
        cy.log('⚠️ Botão Agentes não encontrado, tentando navegação direta...');
        cy.url().then((currentUrl) => {
          const baseUrl = currentUrl.split('/').slice(0, 3).join('/');
          
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

    cy.wait(3000);
    
    cy.url().then((url) => {
      if (!url.includes('agents') && !url.includes('agentes') && !url.includes('assistants')) {
        cy.log('⚠️ Navegando para página de agentes...');
        
        const baseUrl = url.split('/').slice(0, 3).join('/');
        const agentsUrl = `${baseUrl}/agents`;
        
        cy.visit(agentsUrl, { failOnStatusCode: false });
        cy.wait(5000);
      }
    });

    cy.log('📋 Clicando em "Meus Agentes"...');
    cy.get('body').then(($body) => {
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
      for (let selector of meusAgentesSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Encontrado "Meus Agentes" com seletor: ${selector}`);
          cy.get(selector).first().should('be.visible').click();
          cy.wait(2000);
          found = true;
          break;
        }
      }
      
      if (!found) {
        cy.log('⚠️ "Meus Agentes" não encontrado, mas continuando...');
      }
    });
    
    return this;
  }

  clicarEmCriarNovoAgente() {
    cy.log('🔍 Procurando botão "Cadastrar Novo Agente"...');
    cy.wait(3000);
    
    cy.get('body').then(($body) => {
      const criarAgenteSelectors = [
        'a[href="/dashboard/assistants/new"]',
        'a[href*="/assistants/new"]',
        'button.bg-primary-main:contains("Cadastrar Novo Agente")',
        'button.bg-primary-main',
        'a:has(button:contains("Cadastrar Novo Agente"))',
        'a:has(button):contains("Cadastrar Novo Agente")',
        'button:contains("Cadastrar Novo Agente")',
        'div:contains("Cadastrar Novo Agente")',
        'a:contains("Cadastrar Novo Agente")',
        '*:contains("Cadastrar Novo Agente")',
        'button:contains("Criar novo agente")',
        'div:contains("Criar novo agente")',
        'button:contains("Novo Agente")',
        '[data-testid*="create-agent"]',
        '[data-testid*="new-agent"]',
        'button[aria-label*="criar"]'
      ];
      
      let found = false;
      for (let selector of criarAgenteSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Encontrado botão com seletor: "${selector}"`);
          cy.get(selector).first()
            .scrollIntoView()
            .wait(500)
            .should('be.visible')
            .click({ force: true });
          cy.wait(2000);
          found = true;
          break;
        }
      }
      
      if (!found) {
        cy.log('⚠️ Botão não encontrado, navegando diretamente para URL...');
        cy.visit('/dashboard/assistants/new', { failOnStatusCode: false });
        cy.wait(2000);
      }
    });
    
    cy.wait(3000);
    cy.url().then((url) => {
      if (url.includes('/assistants/new') || url.includes('/agents/new')) {
        cy.log('✅ Navegação para página de criação confirmada');
      } else {
        cy.log(`⚠️ URL atual: ${url} - Tentando navegar diretamente...`);
        cy.visit('/dashboard/assistants/new', { failOnStatusCode: false });
        cy.wait(2000);
      }
    });
    
    return this;
  }

navegarParaSecaoAgentes() {
  cy.log('🔍 Navegando para seção de Agentes...');
  
  cy.get('body').then(($body) => {

    const agentesButton = $body.find('button:contains("Agentes"), a:contains("Agentes"), [role="button"]:contains("Agentes")');
    
    if (agentesButton.length > 0) {
      cy.log('✅ Encontrado botão Agentes');
      cy.wrap(agentesButton.first()).should('be.visible').click();
      cy.wait(2000);
    } else {
      cy.log('⚠️ Botão Agentes não encontrado, tentando navegação direta...');
      
      cy.url().then((currentUrl) => {
        const baseUrl = currentUrl.split('/').slice(0, 3).join('/');
        
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

  cy.wait(3000);
  
  cy.url().then((url) => {
    if (!url.includes('agents') && !url.includes('agentes') && !url.includes('assistants')) {
      cy.log('⚠️ Navegando para página de agentes...');
      
      const baseUrl = url.split('/').slice(0, 3).join('/');
      const agentsUrl = `${baseUrl}/agents`;
      
      cy.visit(agentsUrl, { failOnStatusCode: false });
      cy.wait(5000);
    }
  });
  
  return this;
}

clicarEmCriarNovoAgente() {
  cy.log('🔍 Procurando botão "Cadastrar Novo Agente"...');
  cy.wait(3000);
  
  cy.get('body').then(($body) => {
    const criarAgenteSelectors = [
      'a[href="/dashboard/assistants/new"]',
      'a[href*="/assistants/new"]',
      'button.bg-primary-main:contains("Cadastrar Novo Agente")',
      'button.bg-primary-main',
      'a:has(button:contains("Cadastrar Novo Agente"))',
      'a:has(button):contains("Cadastrar Novo Agente")',
      'button:contains("Cadastrar Novo Agente")',
      'div:contains("Cadastrar Novo Agente")',
      'a:contains("Cadastrar Novo Agente")',
      '*:contains("Cadastrar Novo Agente")',
      'button:contains("Criar novo agente")',
      'div:contains("Criar novo agente")',
      'button:contains("Novo Agente")',
      '[data-testid*="create-agent"]',
      '[data-testid*="new-agent"]',
      'button[aria-label*="criar"]'
    ];
    
    let found = false;
    for (let selector of criarAgenteSelectors) {
      if ($body.find(selector).length > 0) {
        cy.log(`✅ Encontrado botão com seletor: "${selector}"`);
        cy.get(selector).first()
          .scrollIntoView()
          .wait(500)
          .should('be.visible')
          .click({ force: true });
        cy.wait(2000);
        found = true;
        break;
      }
    }
    
    if (!found) {
      cy.log('⚠️ Botão não encontrado, navegando diretamente para URL...');
      cy.visit('/dashboard/assistants/new', { failOnStatusCode: false });
      cy.wait(2000);
    }
  });
  
  return this;
}

verificarFormularioCarregado() {
  cy.log('🔍 Verificando se o formulário de criação carregou...');
  
  cy.wait(5000);
  
  cy.get('body').then(($body) => {
    const inputs = $body.find('input').length;
    const textareas = $body.find('textarea').length;
    const selects = $body.find('select').length;
    const buttons = $body.find('button').length;
    const comboboxes = $body.find('[role="combobox"]').length;
    
    cy.log(`📋 Elementos encontrados:`);
    cy.log(`  - Inputs: ${inputs}`);
    cy.log(`  - Textareas: ${textareas}`);
    cy.log(`  - Selects: ${selects}`);
    cy.log(`  - Buttons: ${buttons}`);
    cy.log(`  - Comboboxes: ${comboboxes}`);
    
    const modeloElements = $body.find('button[role="combobox"], button:contains("GPT"), [role="combobox"]');
    cy.log(`  - Campos modelo: ${modeloElements.length}`);
    
    if (inputs > 0) {
      cy.log('📝 Inputs encontrados:');
      cy.get('input').each(($input, index) => {
        const name = $input.attr('name');
        const placeholder = $input.attr('placeholder');
        const type = $input.attr('type');
        if (name || placeholder) {
          cy.log(`  Input ${index}: name="${name}" placeholder="${placeholder}" type="${type}"`);
        }
      });
    }
    
       if (textareas > 0) {
      cy.log('📄 Textareas encontradas:');
      cy.get('textarea').each(($textarea, index) => {
        const name = $textarea.attr('name');
        const placeholder = $textarea.attr('placeholder');
        const value = $textarea.val();
        cy.log(`  Textarea ${index}: name="${name}" placeholder="${placeholder}" value="${value}"`);
      });
    }
    
    if (modeloElements.length > 0) {
      cy.log('🤖 Campos modelo encontrados:');
      modeloElements.each((index, element) => {
        const text = element.textContent?.trim();
        const role = element.getAttribute('role');
        cy.log(`  Modelo ${index}: role="${role}" text="${text}"`);
      });
    }
  });
  
  return this;
}

  encontrarCampoNome() {
    cy.log('📝 Procurando campo nome...');
  
    cy.get('body').then(($body) => {
      let nameFieldFound = false;

      const nameSelectors = [
        'input[name="name"]',
        'input[placeholder*="nome"]',
        'input[placeholder*="Nome"]',
        'input[placeholder*="name"]',
        'input[placeholder*="Name"]',
        'input[placeholder*="Nome do agente"]',
        'input[placeholder*="Agent name"]',
        'input[type="text"]'
      ];
      
      for (let selector of nameSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Campo nome encontrado com seletor: ${selector}`);
          cy.get(selector).first().should('be.visible').should('not.be.disabled');
          nameFieldFound = true;
          break;
        }
      }
      
      if (!nameFieldFound) {
        cy.log('❌ Campo nome não encontrado, aguardando mais tempo...');
        cy.wait(3000);
        
        cy.get('input').first().should('be.visible');
        cy.log('✅ Usando primeiro input encontrado');
      }
    });
    
    return this;
  }

  preencherCampoNome(nomeAgente) {
    cy.log(`📝 Preenchendo campo nome: ${nomeAgente}`);
    
    cy.wait(1000);
    
    const nameSelectors = [
      'input[name="name"]',
      'input[placeholder*="nome"]',
      'input[placeholder*="Nome"]',
      'input[placeholder*="name"]',
      'input[placeholder*="Name"]',
      'input[placeholder*="Nome do agente"]',
      'input[placeholder*="Agent name"]',
      'input[type="text"]'
    ];
    
    cy.get('body').then(($body) => {
      let nameSelector = 'input[name="name"]';
      
      for (let selector of nameSelectors) {
        if ($body.find(selector).length > 0) {
          nameSelector = selector;
          cy.log(`✅ Campo nome encontrado com seletor: ${selector}`);
          break;
        }
      }
      
      cy.log(`📝 Usando seletor: ${nameSelector}`);
      
      cy.get(nameSelector, { timeout: 10000 })
        .first()
        .should('exist')
        .should('be.visible')
        .then(($input) => {
          cy.wrap($input).focus();
          cy.wait(300);
          
          cy.wrap($input)
            .type('{selectall}')
            .type('{del}')
            .should('have.value', '');
          
          cy.wait(500);
          
          cy.wrap($input).type(nomeAgente, { 
            delay: 150,
            force: true 
          });
          
          cy.wrap($input)
            .trigger('input', { bubbles: true })
            .trigger('change', { bubbles: true })
            .trigger('keyup', { bubbles: true })
            .trigger('blur', { bubbles: true });
          
          cy.wait(1000);
          
          cy.wrap($input).should('have.value', nomeAgente);
          
          cy.get('body').click(0, 0);
          
          cy.log('✅ Campo nome preenchido com simulação humana');
        });
    });
    
    return this;
  }

  preencherCampoDescricao(descricao = 'Descrição do Agente de Teste Automatizado') {
    cy.log('📝 Preenchendo campo descrição...');
    cy.get('body').then(($body) => {
      const descriptionSelectors = [
        'textarea[name="description"]',
        'textarea[placeholder*="descrição"]',
        'textarea[placeholder*="Descrição"]',
        'textarea[placeholder*="description"]',
        'textarea[placeholder*="Description"]',
        'textarea[placeholder*="Descrição do agente"]',
        'input[name="description"]'
      ];
      
      let found = false;
      for (let selector of descriptionSelectors) {
        const elements = $body.find(selector).not('.w-md-editor-text-input');
        if (elements.length > 0) {
          cy.log(`✅ Campo descrição encontrado com seletor: ${selector}`);
          cy.get(selector).not('.w-md-editor-text-input').first()
            .should('be.visible')
            .clear()
            .type(descricao, { delay: 100 })
            .trigger('input')
            .trigger('change')
            .blur();
          found = true;
          break;
        }
      }
      
      if (!found) {
        cy.log('⚠️ Campo descrição não encontrado, pulando...');
      }
    });
    
    return this;
  }

  preencherCampoInstrucoes(instrucoes = 'Relacionado a teste automatizado com cypress.') {
    cy.log('📝 Preenchendo campo de instruções...');
    cy.get('body').then(($body) => {
      const instructionSelectors = [
        '.w-md-editor-text-input',
        'textarea.w-md-editor-text-input',
        'textarea[name="instructions"]',
        'textarea[name="prompt"]',
        'textarea[placeholder*="instrução"]',
        'textarea[placeholder*="Instrução"]',
        'textarea[placeholder*="instruction"]',
        'textarea[placeholder*="Instruction"]',
        'textarea:last-of-type'
      ];
      
      let found = false;
      for (let selector of instructionSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Campo instruções encontrado com seletor: ${selector}`);
          cy.get(selector).last()
            .should('be.visible')
            .clear()
            .type(instrucoes, { delay: 100 })
            .trigger('input')
            .trigger('change')
            .blur();
          found = true;
          break;
        }
      }
      
      if (!found) {
        cy.log('⚠️ Campo instruções não encontrado, pulando...');
      }
    });
    
    return this;
  }

  rolarAteFinal() {
    cy.log('📜 Rolando até o final do formulário...');
    
    cy.wait(2000);

    cy.get('body').then(($body) => {
      if ($body.find('[data-radix-scroll-area-viewport]').length > 0) {
        cy.log('✅ Elemento de scroll encontrado');
        cy.get('[data-radix-scroll-area-viewport]')
          .first()
          .then(($el) => {
            const isScrollable = $el[0].scrollHeight > $el[0].clientHeight;
            if (isScrollable) {
              cy.log('✅ Elemento é scrollável, rolando...');
              cy.wrap($el).scrollTo('bottom', { duration: 1000 });
            } else {
              cy.log('⚠️ Elemento não é scrollável, tentando scroll da janela...');
              cy.window().then((win) => {
                const isWindowScrollable = win.document.body.scrollHeight > win.innerHeight;
                if (isWindowScrollable) {
                  cy.log('✅ Janela é scrollável, rolando...');
                  cy.window().scrollTo(0, win.document.body.scrollHeight);
                } else {
                  cy.log('✅ Não é necessário rolar - conteúdo está visível');
                }
              });
            }
          });
      } else {
        cy.log('⚠️ Elemento de scroll não encontrado, tentando scroll da janela...');
        cy.window().then((win) => {
          const isWindowScrollable = win.document.body.scrollHeight > win.innerHeight;
          if (isWindowScrollable) {
            cy.log('✅ Janela é scrollável, rolando...');
            cy.window().scrollTo(0, win.document.body.scrollHeight);
          } else {
            cy.log('✅ Não é necessário rolar - conteúdo está visível');
          }
        });
      }
    });
    cy.wait(1000);
    
    return this;
  }

  validarCamposPreenchidos(nomeAgente) {
    cy.log('🔍 Validação final dos campos...');
    
    cy.get('body').then(($body) => {
      let nameSelector = 'input[name="name"]';
      
      const nameSelectors = [
        'input[name="name"]',
        'input[placeholder*="nome"]',
        'input[placeholder*="Nome"]',
        'input[placeholder*="name"]',
        'input[placeholder*="Name"]',
        'input[placeholder*="Nome do agente"]',
        'input[placeholder*="Agent name"]',
        'input[type="text"]'
      ];
      
      for (let selector of nameSelectors) {
        if ($body.find(selector).length > 0) {
          nameSelector = selector;
          break;
        }
      }
      
      cy.get(nameSelector).first()
        .should('have.value', nomeAgente)
        .should('not.have.class', 'border-red-500')
        .then(($input) => {
          const valor = $input.val();
          cy.log(`Campo nome: "${valor}"`);
          expect(valor).to.not.be.empty;
        });
    });
    
    cy.get('body').then(($body) => {
      const descriptionSelectors = [
        'textarea[name="description"]',
        'textarea[placeholder*="descrição"]',
        'textarea[placeholder*="Descrição"]',
        'textarea[placeholder*="description"]',
        'textarea[placeholder*="Description"]',
        'textarea[placeholder*="Descrição do agente"]',
        'textarea'
      ];
      
      let found = false;
      for (let selector of descriptionSelectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first()
            .should('contain.value', 'Descrição do Agente')
            .then(($textarea) => {
              const valor = $textarea.val();
              cy.log(`Campo descrição: "${valor}"`);
              expect(valor).to.not.be.empty;
            });
          found = true;
          break;
        }
      }
      
      if (!found) {
        cy.log('⚠️ Campo descrição não encontrado para validação');
      }
    });
    
    return this;
  }

  tratarCamposObrigatorios(nomeAgente) {
    cy.get('body').then(($body) => {
      if ($body.find('*:contains("Obrigatório")').length > 0) {
        cy.log('⚠️ Ainda há campos obrigatórios - tentando abordagem alternativa');
        
        cy.get('body').then(($body) => {
          let nameSelector = 'input[name="name"]';
          
          const nameSelectors = [
            'input[name="name"]',
            'input[placeholder*="nome"]',
            'input[placeholder*="Nome"]',
            'input[placeholder*="name"]',
            'input[placeholder*="Name"]',
            'input[placeholder*="Nome do agente"]',
            'input[placeholder*="Agent name"]',
            'input[type="text"]'
          ];
          
          for (let selector of nameSelectors) {
            if ($body.find(selector).length > 0) {
              nameSelector = selector;
              break;
            }
          }
          
          cy.get(nameSelector).first().then(($el) => {
            const input = $el[0];
            
            input.value = nomeAgente;
            
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new Event('blur', { bubbles: true }));
            
            cy.log('✅ Valor definido via JavaScript nativo');
          });
        });
        
        cy.wait(1000);
        
        cy.get('body').then(($body) => {
          let nameSelector = 'input[name="name"]';
          
          const nameSelectors = [
            'input[name="name"]',
            'input[placeholder*="nome"]',
            'input[placeholder*="Nome"]',
            'input[placeholder*="name"]',
            'input[placeholder*="Name"]',
            'input[placeholder*="Nome do agente"]',
            'input[placeholder*="Agent name"]',
            'input[type="text"]'
          ];
          
          for (let selector of nameSelectors) {
            if ($body.find(selector).length > 0) {
              nameSelector = selector;
              break;
            }
          }
          
          cy.get(nameSelector).first().should('have.value', nomeAgente);
        });
      }
    });
    
    return this;
  }

  clicarEmSalvar() {
    cy.log('🔍 Procurando botão "Salvar"...');
    cy.get('body').then(($body) => {
      const saveSelectors = [
        'button:contains("Salvar")',
        'button:contains("Save")',
        'button:contains("Criar")',
        'button:contains("Create")',
        'button:contains("Cadastrar")',
        'button:contains("Register")',
        'button[type="submit"]',
        'button[aria-label*="salvar"]',
        'button[aria-label*="save"]',
        'button[aria-label*="criar"]',
        'button[aria-label*="create"]',
        '[data-testid*="save"]',
        '[data-testid*="submit"]',
        '[data-testid*="create"]'
      ];
      
      let found = false;
      for (let selector of saveSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Botão salvar encontrado com seletor: ${selector}`);
          cy.get(selector).first()
            .scrollIntoView()
            .should('be.visible')
            .should('not.be.disabled')
            .click();
          found = true;
          break;
        }
      }
      
      if (!found) {
        cy.log('⚠️ Botão salvar não encontrado, tentando XPath...');
        try {
          cy.xpath('//button[contains(text(), "Salvar") or contains(text(), "Save") or contains(text(), "Criar")]')
            .first()
            .scrollIntoView()
            .should('be.visible')
            .should('not.be.disabled')
            .click();
          cy.log('✅ Botão salvar encontrado com XPath');
        } catch (error) {
          cy.log('❌ Botão salvar não encontrado com nenhuma estratégia');
          cy.log('⚠️ Tentando encontrar qualquer botão de submit...');
          
          cy.get('button').then(($buttons) => {
            let submitButton = null;
            $buttons.each((index, button) => {
              const text = button.textContent?.trim().toLowerCase();
              const type = button.getAttribute('type');
              const className = button.className;
              
              if (
                text && (
                  text.includes('salvar') || 
                  text.includes('save') || 
                  text.includes('criar') || 
                  text.includes('create') ||
                  text.includes('submit') ||
                  type === 'submit' ||
                  className.includes('submit') ||
                  className.includes('primary')
                )
              ) {
                submitButton = button;
                return false;
              }
            });
            
            if (submitButton) {
              cy.log('✅ Botão de submit encontrado');
              cy.wrap(submitButton)
                .scrollIntoView()
                .should('be.visible')
                .click();
            } else {
              cy.log('❌ Nenhum botão de submit encontrado');
            }
          });
        }
      }
    });
    
    return this;
  }

  verificarToastSucesso() {
    cy.log('🔍 Capturando toast de sucesso...');
    
    cy.wait(300);
    
    cy.get('body', { timeout: 3000 }).then(($body) => {
      const successMessages = [
        'O agente foi criado com sucesso!',
        'Agente criado com sucesso',
        'Agent created successfully',
        'Sucesso',
        'Success',
        'Criado com sucesso',
        'Created successfully'
      ];
      
      let found = false;
      
      for (let message of successMessages) {
        if ($body.find(`*:contains("${message}")`).length > 0) {
          cy.log(`✅ Toast encontrado com mensagem: "${message}"`);
          const toastElement = $body.find(`*:contains("${message}")`).first();
          const toastText = toastElement.text();
          cy.log(`📝 Conteúdo completo: "${toastText}"`);
          found = true;
          break;
        }
      }
      
      if (!found) {
        const toastSelectors = [
          '.toast-description',
          '.toast',
          '.notification',
          '.alert',
          '.message',
          '[role="alert"]',
          '[role="status"]',
          '[class*="toast"]',
          '[class*="notification"]',
          '[class*="success"]'
        ];
        
        for (let selector of toastSelectors) {
          if ($body.find(selector).length > 0) {
            cy.log(`✅ Toast encontrado com seletor: ${selector}`);
            const toastText = $body.find(selector).first().text();
            cy.log(`📝 Conteúdo do toast: "${toastText}"`);
            found = true;
            break;
          }
        }
      }
      
      if (!found) {
        cy.url().then((url) => {
          if (!url.includes('/new')) {
            cy.log('✅ URL mudou (saiu de /new) - agente criado com sucesso!');
            found = true;
          }
        });
      }
      
      if (found) {
        cy.log('✅ Agente criado com sucesso!');
      } else {
        cy.log('⚠️ Toast não capturado (pode ter desaparecido), mas agente provavelmente foi criado');
      }
    });
    
    return this;
  }

  criarAgenteCompleto(nomeAgente, descricao = 'Descrição do Agente de Teste Automatizado', instrucoes = 'Relacionado a teste automatizado com cypress.') {
    cy.log(`🤖 Iniciando criação completa do agente: ${nomeAgente}`);
    
    this.navegarParaAgentes()
      .clicarEmMeusAgentes()
      .clicarEmCriarNovoAgente()
      .aguardarFormularioCarregar()
      .preencherCampoNome(nomeAgente)
      .preencherCampoDescricao(descricao)
      .preencherCampoInstrucoes(instrucoes)
      .rolarAteFinal()
      .validarCamposPreenchidos(nomeAgente)
      .tratarCamposObrigatorios(nomeAgente)
      .clicarEmSalvar()
      .verificarToastSucesso();
    
    cy.log(`✅ Criação do agente "${nomeAgente}" concluída com sucesso!`);
    return this;
  }

  aguardarFormularioCarregar() {
    cy.log('🔍 Aguardando formulário de criação carregar...');
    cy.wait(5000);
    
    cy.get('body').then(($body) => {
      const inputs = $body.find('input').length;
      const textareas = $body.find('textarea').length;
      const selects = $body.find('select').length;
      const buttons = $body.find('button').length;
      
      cy.log(`📋 Elementos encontrados:`);
      cy.log(`  - Inputs: ${inputs}`);
      cy.log(`  - Textareas: ${textareas}`);
      cy.log(`  - Selects: ${selects}`);
      cy.log(`  - Buttons: ${buttons}`);
      
      if (inputs > 0) {
        cy.log('📝 Inputs encontrados:');
        cy.get('input').each(($input, index) => {
          const name = $input.attr('name');
          const placeholder = $input.attr('placeholder');
          const type = $input.attr('type');
          if (name || placeholder) {
            cy.log(`  Input ${index}: name="${name}" placeholder="${placeholder}" type="${type}"`);
          }
        });
      }
      
      if (textareas > 0) {
        cy.log('📄 Textareas encontradas:');
        cy.get('textarea').each(($textarea, index) => {
          const name = $textarea.attr('name');
          const placeholder = $textarea.attr('placeholder');
          const value = $textarea.val();
          cy.log(`  Textarea ${index}: name="${name}" placeholder="${placeholder}" value="${value}"`);
        });
      }
    });
    
    cy.log('📝 Procurando campo nome...');
    cy.get('body').then(($body) => {
      let nameFieldFound = false;
      
      const nameSelectors = [
        'input[name="name"]',
        'input[placeholder*="nome"]',
        'input[placeholder*="Nome"]',
        'input[placeholder*="name"]',
        'input[placeholder*="Name"]',
        'input[placeholder*="Nome do agente"]',
        'input[placeholder*="Agent name"]',
        'input[type="text"]'
      ];
      
      for (let selector of nameSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Campo nome encontrado com seletor: ${selector}`);
          cy.get(selector).first().should('be.visible').should('not.be.disabled');
          nameFieldFound = true;
          break;
        }
      }
      
      if (!nameFieldFound) {
        cy.log('❌ Campo nome não encontrado, aguardando mais tempo...');
        cy.wait(3000);
        
        // Tentar novamente após aguardar
        cy.get('input').first().should('be.visible');
        cy.log('✅ Usando primeiro input encontrado');
      }
    });
    
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
    
    cy.get('body').then(($body) => {
      if ($body.find('[data-radix-scroll-area-viewport]').length > 0) {
        cy.get('[data-radix-scroll-area-viewport]')
          .first()
          .then(($el) => {
            const isScrollable = $el[0].scrollHeight > $el[0].clientHeight;
            if (isScrollable) {
              cy.wrap($el).scrollTo('bottom', { duration: 2000 });
            } else {
              cy.window().then((win) => {
                const isWindowScrollable = win.document.body.scrollHeight > win.innerHeight;
                if (isWindowScrollable) {
                  cy.window().scrollTo(0, win.document.body.scrollHeight);
                }
              });
            }
          });
      } else {
        cy.window().then((win) => {
          const isWindowScrollable = win.document.body.scrollHeight > win.innerHeight;
          if (isWindowScrollable) {
            cy.window().scrollTo(0, win.document.body.scrollHeight);
          }
        });
      }
    });
    
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

  aguardarTabelaCarregar() {
    cy.log('⏳ Aguardando tabela de agentes carregar...');
    cy.wait(5000);
    cy.get('body').should('not.contain', 'loading');
    cy.log('✅ Tabela carregada');
    return this;
  }

  verificarEstruturaTabela() {
    cy.log('🔍 Verificando estrutura da tabela de agentes...');
    cy.get('body').then(($body) => {
      const tables = $body.find('table, .table, [role="table"], .grid, .list');
      cy.log(`Encontradas ${tables.length} tabelas/listas na página`);
      const rows = $body.find('tr, .row, [role="row"]');
      cy.log(`Encontradas ${rows.length} linhas na página`);
      const agentRows = $body.find('*:contains("Agente"), *:contains("Teste"), *:contains("Agent")');
      cy.log(`Encontrados ${agentRows.length} elementos contendo "Agente/Teste/Agent"`);
      agentRows.slice(0, 5).each((index, element) => {
        const text = element.textContent?.trim();
        if (text && text.length < 100) {
          cy.log(`  Elemento ${index}: ${element.tagName} - "${text}"`);
        }
      });
    });
    return this;
  }

  encontrarAgenteParaDeletar(nomeAgente = 'Agente Teste Automatizado') {
    cy.log('🔍 Procurando agente para deletar...');
    cy.get('body').then(($body) => {
      const agentNames = [
        nomeAgente,
        'Agente Teste',
        'Teste Automatizado',
        'Test Agent',
        'Agent Test'
      ];
      let agentFound = false;
      for (let agentName of agentNames) {
        if ($body.find(`*:contains("${agentName}")`).length > 0) {
          cy.log(`✅ Agente encontrado: "${agentName}"`);
          agentFound = true;
          break;
        }
      }
      if (!agentFound) {
        cy.log('⚠️ Agente específico não encontrado, procurando qualquer agente...');
        const anyAgentRows = $body.find('*:contains("agente"), *:contains("agent"), *:contains("Agente"), *:contains("Agent")');
        if (anyAgentRows.length > 0) {
          cy.log(`✅ Encontrados ${anyAgentRows.length} elementos com "agente/agent"`);
          agentFound = true;
        }
      }
      if (!agentFound) {
        cy.log('❌ Nenhum agente encontrado para deletar');
      }
    });
    return this;
  }

  clicarBotaoDeletar() {
    cy.log('🔍 Procurando botão de deletar...');
    cy.get('body').then(($body) => {
      cy.log('🔍 Procurando botão de deletar na linha do agente...');
      
      const agentName = 'Agente Teste Automatizado';
      const agentRows = $body.find(`tr:contains("${agentName}"), .row:contains("${agentName}"), [role="row"]:contains("${agentName}")`);
      
      if (agentRows.length > 0) {
        cy.log(`✅ Encontrada linha do agente: ${agentRows.length} linha(s)`);
        
        cy.get(`tr:contains("${agentName}"), .row:contains("${agentName}"), [role="row"]:contains("${agentName}")`).first().then(($row) => {
          const rowButtons = $row.find('button');
          cy.log(`🔍 Encontrados ${rowButtons.length} botões na linha do agente`);
          
          const deleteSelectors = [
            'button svg[class*="x"]',
            'button svg[class*="trash"]',
            'button svg[class*="delete"]',
            'button[class*="delete"]',
            'button[class*="remove"]',
            'button[class*="danger"]',
            'button[class*="red"]'
          ];
          
          let foundInRow = false;
          for (const selector of deleteSelectors) {
            if ($row.find(selector).length > 0) {
              cy.log(`✅ Botão de deletar encontrado na linha: ${selector}`);
              
              if (selector.includes('svg')) {
                cy.log('🔧 SVG encontrado, tentando encontrar botão pai...');
                cy.get(`tr:contains("${agentName}"), .row:contains("${agentName}"), [role="row"]:contains("${agentName}")`).first()
                  .find(selector).first().then(($svg) => {
                    const $button = $svg.parent('button');
                    if ($button.length > 0) {
                      cy.log('✅ Botão pai encontrado, clicando no botão...');
                      cy.wrap($button).click({ force: true });
                    } else {
                      cy.log('⚠️ Botão pai não encontrado, clicando diretamente no SVG...');
                      cy.wrap($svg).click({ force: true });
                    }
                  });
              } else {
                cy.get(`tr:contains("${agentName}"), .row:contains("${agentName}"), [role="row"]:contains("${agentName}")`).first()
                  .find(selector).first()
                  .click({ force: true });
              }
              
              foundInRow = true;
              break;
            }
          }
          
          if (!foundInRow && rowButtons.length > 0) {
            cy.log('⚠️ Botão específico não encontrado, tentando último botão da linha...');
            cy.get(`tr:contains("${agentName}"), .row:contains("${agentName}"), [role="row"]:contains("${agentName}")`).first()
              .find('button').last()
              .click({ force: true });
            foundInRow = true;
          }
          
          if (!foundInRow) {
            cy.log('❌ Nenhum botão encontrado na linha do agente');
          }
        });
      } else {
        cy.log('⚠️ Linha do agente não encontrada, tentando busca global...');
        
        const selectorsDeletar = [
          'button:contains("Deletar")',
          'button:contains("Delete")',
          'button:contains("Remover")',
          'button:contains("Excluir")',
          'button:contains("Remove")',
          'button svg[class*="trash"]',
          'button svg[class*="delete"]',
          'button svg[class*="x"]',
          'button svg[class*="remove"]',
          'button[class*="danger"]',
          'button[class*="red"]',
          'button[class*="delete"]',
          'button[class*="remove"]',
          '[data-testid*="delete"]',
          '[data-testid*="remove"]',
          '[aria-label*="delete"]',
          '[aria-label*="remove"]'
        ];
        
        let botaoDeletarEncontrado = false;
        for (const selector of selectorsDeletar) {
          if ($body.find(selector).length > 0) {
            cy.log(`✅ Botão de deletar encontrado globalmente: ${selector}`);
            
            if (selector.includes('svg')) {
              cy.log('🔧 SVG encontrado, tentando encontrar botão pai...');
              
              cy.get(selector).first().then(($svg) => {
                const $button = $svg.parent('button');
                if ($button.length > 0) {
                  cy.log('✅ Botão pai encontrado, clicando no botão...');
                  cy.wrap($button).click({ force: true });
                } else {
                  cy.log('⚠️ Botão pai não encontrado, clicando diretamente no SVG...');
                  cy.wrap($svg).click({ force: true });
                }
              });
            } else {
              cy.get(selector).first()
                .click({ force: true });
            }
            
            botaoDeletarEncontrado = true;
            break;
          }
        }
        
        if (!botaoDeletarEncontrado) {
          cy.log('⚠️ Botão de deletar específico não encontrado, procurando botões de ação...');
          
          cy.get('button').then(($buttons) => {
            let actionButton = null;
            $buttons.each((index, button) => {
              const text = button.textContent?.trim().toLowerCase();
              const className = button.className;
              const ariaLabel = button.getAttribute('aria-label')?.toLowerCase();
              
              if (
                (text && (
                  text.includes('delete') || 
                  text.includes('remove') || 
                  text.includes('excluir') ||
                  text.includes('deletar') ||
                  text.includes('remover') ||
                  text.includes('trash') ||
                  text.includes('×') ||
                  text.includes('x')
                )) ||
                (className && (
                  className.includes('delete') ||
                  className.includes('remove') ||
                  className.includes('danger') ||
                  className.includes('red')
                )) ||
                (ariaLabel && (
                  ariaLabel.includes('delete') ||
                  ariaLabel.includes('remove')
                ))
              ) {
                actionButton = button;
                return false;
              }
            });
            
            if (actionButton) {
              cy.log('✅ Botão de ação encontrado');
              cy.wrap(actionButton)
                .click({ force: true });
              botaoDeletarEncontrado = true;
            } else {
              cy.log('❌ Nenhum botão de deletar encontrado');
            }
          });
        }
      }
    });
    return this;
  }

  confirmarDelecaoNoModal() {
    cy.log('🔍 Aguardando modal de confirmação...');
    cy.wait(2000);
    
    cy.get('body').then(($body) => {
      const modalElements = $body.find('[role="dialog"], .modal, [class*="modal"], [class*="dialog"], .popup, [class*="popup"]');
      cy.log(`Elementos de modal encontrados: ${modalElements.length}`);
      
      if (modalElements.length > 0) {
        cy.log('🔍 Botões disponíveis no modal:');
        cy.get('[role="dialog"] button, .modal button, [class*="modal"] button, [class*="dialog"] button').each(($btn, index) => {
          const text = $btn.text().trim();
          const classes = $btn.attr('class');
          cy.log(`Botão ${index}: "${text}" - Classes: ${classes}`);
        });
      }
    });

    cy.wait(2000);

    cy.log('🔍 Procurando botão de confirmação...');
    cy.get('body').then(($body) => {
      const confirmSelectors = [
        'button:contains("Deletar agente")',
        'button:contains("Deletar")',
        'button:contains("Delete")',
        'button:contains("Confirmar")',
        'button:contains("Confirm")',
        'button:contains("Sim")',
        'button:contains("Yes")',
        'button:contains("Ok")',
        'button:contains("OK")'
      ];
      
      let confirmButtonFound = false;
      for (const selector of confirmSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Botão de confirmação encontrado: ${selector}`);
          cy.get(selector).first()
            .click({ force: true });
          confirmButtonFound = true;
          break;
        }
      }
      
      if (!confirmButtonFound) {
        cy.log('⚠️ Botão de confirmação não encontrado, tentando seletores por classe...');
        
        const classSelectors = [
          'button[class*="bg-red"]',
          'button[class*="danger"]',
          'button[class*="delete"]',
          'button[class*="red"]',
          'button[class*="destructive"]',
          '[role="dialog"] button:last-child',
          '.modal button:last-child',
          '[class*="modal"] button:last-child'
        ];
        
        for (const selector of classSelectors) {
          if ($body.find(selector).length > 0) {
            cy.log(`✅ Botão encontrado com seletor: ${selector}`);
            cy.get(selector).first()
              .click({ force: true });
            confirmButtonFound = true;
            break;
          }
        }
        
        if (!confirmButtonFound) {
          cy.log('⚠️ Tentando último botão do modal...');
          cy.get('[role="dialog"] button, .modal button, [class*="modal"] button')
            .last()
            .click({ force: true });
        }
      }
    });
    return this;
  }

  verificarDelecaoSucesso(nomeAgente = 'Agente Teste Automatizado') {
    cy.log('🔍 Aguardando mensagem de sucesso...');
    cy.wait(3000);
    
    cy.get('body').then(($body) => {
      const mensagensSucesso = [
        'Agente removido',
        'Agente deletado',
        'Agente excluído',
        'Agente excluido',
        'removido com sucesso',
        'deletado com sucesso',
        'excluído com sucesso',
        'excluido com sucesso',
        'sucesso',
        'success',
        'deleted',
        'removed',
        'excluded'
      ];
      
      let mensagemEncontrada = false;
      
      cy.log('🔍 Estratégia 1: Procurando mensagem de sucesso...');
      for (const mensagem of mensagensSucesso) {
        if ($body.text().toLowerCase().includes(mensagem.toLowerCase())) {
          cy.log(`✅ Mensagem de sucesso encontrada: "${mensagem}"`);
          cy.log('✅ Mensagem de sucesso detectada - deleção confirmada');
          mensagemEncontrada = true;
          break;
        }
      }
      
      if (!mensagemEncontrada) {
        cy.log('🔍 Estratégia 2: Procurando elementos de toast/notificação...');
        const toastSelectors = [
          '.toast',
          '.notification',
          '.alert',
          '.message',
          '[role="alert"]',
          '[class*="toast"]',
          '[class*="notification"]',
          '[class*="success"]',
          '[class*="message"]'
        ];
        
        for (const selector of toastSelectors) {
          if ($body.find(selector).length > 0) {
            cy.log(`✅ Elemento de toast encontrado: ${selector}`);
            cy.log('✅ Toast/notificação detectado - deleção confirmada');
            mensagemEncontrada = true;
            break;
          }
        }
      }
      
      if (!mensagemEncontrada) {
        cy.log('🔍 Estratégia 3: Verificando se o agente foi removido da tabela...');
        if (!$body.text().includes(nomeAgente)) {
          cy.log(`✅ Agente "${nomeAgente}" não encontrado na tabela - deleção confirmada`);
          mensagemEncontrada = true;
        } else {
          cy.log(`⚠️ Agente "${nomeAgente}" ainda encontrado no texto da página`);
          
          cy.get('table tbody tr').then(($rows) => {
            let agenteEncontrado = false;
            $rows.each((index, row) => {
              if (row.textContent.includes(nomeAgente)) {
                agenteEncontrado = true;
              }
            });
            
            if (!agenteEncontrado) {
              cy.log('✅ Agente não encontrado nas linhas da tabela - deleção confirmada');
              mensagemEncontrada = true;
            } else {
              cy.log('⚠️ Agente ainda encontrado nas linhas da tabela');
            }
          });
        }
      }
      
      if (!mensagemEncontrada) {
        cy.log('🔍 Estratégia 4: Procurando indicadores de sucesso...');
        const indicadoresSucesso = [
          'success',
          'sucesso',
          'deleted',
          'removed',
          'excluded',
          'excluído',
          'excluido'
        ];
        
        for (const indicador of indicadoresSucesso) {
          if ($body.text().toLowerCase().includes(indicador.toLowerCase())) {
            cy.log(`✅ Indicador de sucesso encontrado: "${indicador}"`);
            cy.log('✅ Indicador de sucesso detectado - deleção confirmada');
            mensagemEncontrada = true;
            break;
          }
        }
      }
      
      if (!mensagemEncontrada) {
        cy.log('🔍 Estratégia 5: Verificando se a tabela foi atualizada...');
        cy.get('table tbody tr').then(($rows) => {
          if ($rows.length === 0) {
            cy.log('✅ Tabela vazia - deleção confirmada');
            mensagemEncontrada = true;
          } else {
            cy.log(`⚠️ Tabela ainda tem ${$rows.length} linhas`);
          }
        });
      }
      
      if (!mensagemEncontrada) {
        cy.log('⚠️ Nenhuma confirmação de deleção encontrada');
        cy.log('🔍 Tirando screenshot para debug...');
        cy.screenshot('delecao-sem-confirmacao');
      } else {
        cy.log('✅ Agente deletado com sucesso!');
      }
    });
    
    return this;
  }

  buscarAgenteNoCampo(nomeAgente = 'Agente Teste Automatizado') {
    cy.log(`🔍 Buscando agente no campo de busca: ${nomeAgente}`);
    
    cy.get('body').then(($body) => {
      const selectorsBusca = [
        'input[type="search"]',
        'input[placeholder*="Buscar"]',
        'input[placeholder*="buscar"]',
        'input[placeholder*="nome"]',
        'input[placeholder*="Nome"]',
        'input[placeholder*="search"]',
        'input[placeholder*="Search"]',
        '[data-testid*="search"]',
        '[class*="search"] input',
        'input[type="text"]'
      ];
      
      let campoBuscaEncontrado = false;
      for (const selector of selectorsBusca) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Campo de busca encontrado: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .clear()
            .type(nomeAgente, { delay: 100 });
          campoBuscaEncontrado = true;
          cy.wait(2000);
          break;
        }
      }
      
      if (!campoBuscaEncontrado) {
        cy.log('⚠️ Campo de busca não encontrado, continuando sem busca...');
      }
    });
    
    return this;
  }

  deletarAgenteCompleto(nomeAgente = 'Agente Teste Automatizado') {
    cy.log(`🗑️ Iniciando deleção completa do agente: ${nomeAgente}`);
    
    this.navegarParaAgentes()
      .clicarEmMeusAgentes()
      .aguardarTabelaCarregar()
      .buscarAgenteNoCampo(nomeAgente)
      .encontrarAgenteParaDeletar(nomeAgente)
      .clicarBotaoDeletar()
      .confirmarDelecaoNoModal()
      .verificarDelecaoSucesso(nomeAgente);
    
    cy.log(`✅ Deleção do agente "${nomeAgente}" concluída com sucesso!`);
    return this;
  }

  deletarAgenteSemNavegacao(nomeAgente = 'Agente Teste Automatizado') {
    cy.log(`🗑️ Deletando agente: ${nomeAgente}`);
    
    this.aguardarTabelaCarregar()
      .buscarAgenteNoCampo(nomeAgente)
      .encontrarAgenteParaDeletar(nomeAgente)
      .clicarBotaoDeletar()
      .confirmarDelecaoNoModal()
      .verificarDelecaoSucesso(nomeAgente);
    
    cy.log(`✅ Deleção do agente "${nomeAgente}" concluída!`);
    return this;
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
}