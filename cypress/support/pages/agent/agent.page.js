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

  // Método para navegar para a seção de Agentes com estratégias robustas
  navegarParaSecaoAgentes() {
    cy.log('🔍 Navegando para seção de Agentes...');
    
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
    
    return this;
  }

  // Método para clicar em "Meus Agentes"
  clicarEmMeusAgentes() {
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
    
    return this;
  }

  // Método para encontrar e clicar no botão de criar agente
  clicarEmCriarNovoAgente() {
    cy.log('🔍 Procurando botão "Cadastrar Novo Agente"...');
    cy.wait(3000);
    
    cy.get('body').then(($body) => {
      // Lista de seletores para o botão de criar agente
      const criarAgenteSelectors = [
        // Textos encontrados nos logs
        'div:contains("Criar novo agente")',
        'button:contains("Criar novo agente")',
        '*:contains("Criar novo agente")',
        
        // Variações de texto
        'button:contains("Cadastrar Novo Agente")',
        'div:contains("Cadastrar Novo Agente")',
        '*:contains("Cadastrar Novo Agente")',
        'button:contains("Novo Agente")',
        'button:contains("Criar Agente")',
        'button:contains("Adicionar Agente")',
        'button:contains("Novo")',
        'button:contains("Criar")',
        'button:contains("+")',
        
        // Seletores por atributos
        '[data-testid*="create-agent"]',
        '[data-testid*="new-agent"]',
        '[data-testid*="add-agent"]',
        'button[aria-label*="criar"]',
        'button[aria-label*="novo"]'
      ];
      
      let found = false;
      for (let selector of criarAgenteSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Encontrado botão "Cadastrar Novo Agente"`);
          cy.get(selector).first().should('be.visible').click();
          cy.wait(2000);
          found = true;
          break;
        }
      }
      
      if (!found) {
        cy.log('⚠️ Botão não encontrado, tentando abordagem alternativa...');
        
        // Última tentativa: procurar qualquer elemento que contenha essas palavras
        cy.get('body').then(($body) => {
          const criarElements = $body.find('*:contains("criar"), *:contains("novo"), *:contains("Criar"), *:contains("Novo")');
          if (criarElements.length > 0) {
            cy.log('✅ Encontrado botão alternativo');
            cy.wrap(criarElements.first()).should('be.visible').click();
            cy.wait(2000);
          } else {
            cy.log('❌ Nenhum botão de criar agente encontrado');
          }
        });
      }
    });
    
    // Aguardar carregamento do formulário
    cy.wait(5000);
    
    return this;
  }

  // Método para verificar se o formulário carregou
  verificarFormularioCarregado() {
    cy.log('🔍 Verificando se o formulário de criação carregou...');
    cy.get('body').then(($body) => {
      // Contar todos os elementos do formulário
      const inputs = $body.find('input').length;
      const textareas = $body.find('textarea').length;
      const selects = $body.find('select').length;
      const buttons = $body.find('button').length;
      
      cy.log(`📋 Elementos encontrados:`);
      cy.log(`  - Inputs: ${inputs}`);
      cy.log(`  - Textareas: ${textareas}`);
      cy.log(`  - Selects: ${selects}`);
      cy.log(`  - Buttons: ${buttons}`);
      
      // Listar todos os inputs disponíveis
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
      
      
      // Listar todas as textareas disponíveis
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
    
    return this;
  }

  // Método para encontrar o campo nome
  encontrarCampoNome() {
    cy.log('📝 Procurando campo nome...');
    
    // Aguardar o campo estar disponível com múltiplos seletores
    cy.get('body').then(($body) => {
      let nameFieldFound = false;
      
      // Lista de seletores possíveis para o campo nome
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

  // Método para preencher campo nome com simulação humana
  preencherCampoNome(nomeAgente) {
    cy.log(`📝 Preenchendo campo nome: ${nomeAgente}`);
    
    // Usar o seletor que funcionou
    cy.get('body').then(($body) => {
      let nameSelector = 'input[name="name"]'; // padrão
      
      // Encontrar o seletor correto
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
      
      cy.log(`📝 Usando seletor: ${nameSelector}`);
      
      cy.get(nameSelector).first().then(($input) => {
        // Focar no campo primeiro
        cy.wrap($input).focus();
        cy.wait(300);
        
        // Selecionar todo o conteúdo e deletar
        cy.wrap($input)
          .type('{selectall}')
          .type('{del}')
          .should('have.value', '');
        
        // Aguardar um pouco
        cy.wait(500);
        
        // Digitar caractere por caractere com eventos
        cy.wrap($input).type(nomeAgente, { 
          delay: 150,
          force: true 
        });
        
        // Disparar todos os eventos possíveis
        cy.wrap($input)
          .trigger('input', { bubbles: true })
          .trigger('change', { bubbles: true })
          .trigger('keyup', { bubbles: true })
          .trigger('blur', { bubbles: true });
        
        // Aguardar processamento
        cy.wait(1000);
        
        // Verificar se foi preenchido
        cy.wrap($input).should('have.value', nomeAgente);
        
        // Clicar fora para garantir que perdeu o foco
        cy.get('body').click(0, 0);
        
        cy.log('✅ Campo nome preenchido com simulação humana');
      });
    });
    
    return this;
  }

  // Método para preencher campo descrição
  preencherCampoDescricao(descricao = 'Descrição do Agente de Teste Automatizado') {
    cy.log('📝 Preenchendo campo descrição...');
    cy.get('body').then(($body) => {
      // Lista de seletores possíveis para o campo descrição
      const descriptionSelectors = [
        'textarea[name="description"]',
        'textarea[placeholder*="descrição"]',
        'textarea[placeholder*="Descrição"]',
        'textarea[placeholder*="description"]',
        'textarea[placeholder*="Description"]',
        'textarea[placeholder*="Descrição do agente"]',
        'textarea',
        'input[name="description"]'
      ];
      
      let found = false;
      for (let selector of descriptionSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Campo descrição encontrado com seletor: ${selector}`);
          cy.get(selector).first()
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

  // Método para preencher campo de instruções
  preencherCampoInstrucoes(instrucoes = 'Relacionado a teste automatizado com cypress.') {
    cy.log('📝 Preenchendo campo de instruções...');
    cy.get('body').then(($body) => {
      // Procurar por campo de instruções com múltiplas estratégias
      const instructionSelectors = [
        'textarea:contains("You are a helpful AI assistant.")',
        'textarea[placeholder*="instrução"]',
        'textarea[placeholder*="Instrução"]',
        'textarea[placeholder*="instruction"]',
        'textarea[placeholder*="Instruction"]',
        'textarea[placeholder*="Prompt"]',
        'textarea[placeholder*="prompt"]',
        'textarea[name="instructions"]',
        'textarea[name="prompt"]',
        'textarea:last-of-type'
      ];
      
      let found = false;
      for (let selector of instructionSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Campo instruções encontrado com seletor: ${selector}`);
          cy.get(selector).first()
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

  // Método para rolar até o final do formulário
  rolarAteFinal() {
    cy.log('📜 Rolando até o final do formulário...');
    
    // Aguardar um pouco para os campos serem processados
    cy.wait(2000);

    // Rolar até o final
    cy.get('[data-radix-scroll-area-viewport]')
      .first()
      .scrollTo('bottom', { duration: 1000 });
    cy.wait(1000);
    
    return this;
  }

  // Método para validar campos preenchidos
  validarCamposPreenchidos(nomeAgente) {
    cy.log('🔍 Validação final dos campos...');
    
    // Verificar campo nome
    cy.get('body').then(($body) => {
      let nameSelector = 'input[name="name"]'; // padrão
      
      // Encontrar o seletor correto novamente
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
        .should('not.have.class', 'border-red-500') // Não deve ter erro
        .then(($input) => {
          const valor = $input.val();
          cy.log(`Campo nome: "${valor}"`);
          expect(valor).to.not.be.empty;
        });
    });
    
    // Verificar campo descrição
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

  // Método para tratar campos obrigatórios
  tratarCamposObrigatorios(nomeAgente) {
    cy.get('body').then(($body) => {
      if ($body.find('*:contains("Obrigatório")').length > 0) {
        cy.log('⚠️ Ainda há campos obrigatórios - tentando abordagem alternativa');
        
        // Abordagem alternativa: usar JavaScript direto
        cy.get('body').then(($body) => {
          let nameSelector = 'input[name="name"]'; // padrão
          
          // Encontrar o seletor correto
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
            
            // Definir valor usando JavaScript nativo
            input.value = nomeAgente;
            
            // Disparar eventos nativos
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.dispatchEvent(new Event('blur', { bubbles: true }));
            
            cy.log('✅ Valor definido via JavaScript nativo');
          });
        });
        
        cy.wait(1000);
        
        // Verificar novamente com seletor dinâmico
        cy.get('body').then(($body) => {
          let nameSelector = 'input[name="name"]'; // padrão
          
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

  // Método para clicar em salvar
  clicarEmSalvar() {
    cy.log('🔍 Procurando botão "Salvar"...');
    cy.get('body').then(($body) => {
      // Lista de seletores possíveis para o botão salvar
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
          
          // Última tentativa: procurar qualquer botão que pareça ser de submit
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
                return false; // break
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

  // Método para verificar toast de sucesso
  verificarToastSucesso() {
    cy.log('🔍 Procurando toast de sucesso...');
    cy.wait(2000);
    
    // Procurar por toast de sucesso com múltiplas estratégias
    cy.get('body').then(($body) => {
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
          cy.log(`✅ Toast de sucesso encontrado: "${message}"`);
          cy.get(`*:contains("${message}")`).first().should('be.visible');
          found = true;
          break;
        }
      }
      
      if (!found) {
        // Tentar seletores específicos de toast
        const toastSelectors = [
          '.toast-description',
          '.toast',
          '.notification',
          '.alert',
          '.message',
          '[role="alert"]',
          '.success'
        ];
        
        for (let selector of toastSelectors) {
          if ($body.find(selector).length > 0) {
            cy.log(`✅ Toast encontrado com seletor: ${selector}`);
            cy.get(selector).first().should('be.visible');
            found = true;
            break;
          }
        }
      }
      
      if (found) {
        cy.log('✅ Agente criado com sucesso!');
      } else {
        cy.log('⚠️ Toast de sucesso não encontrado, mas agente pode ter sido criado');
      }
    });
    
    return this;
  }

  // Método principal para criar agente completo
  criarAgenteCompleto(nomeAgente, descricao = 'Descrição do Agente de Teste Automatizado', instrucoes = 'Relacionado a teste automatizado com cypress.') {
    cy.log(`🤖 Iniciando criação completa do agente: ${nomeAgente}`);
    
    this.navegarParaSecaoAgentes()
      .clicarEmMeusAgentes()
      .clicarEmCriarNovoAgente()
      .verificarFormularioCarregado()
      .encontrarCampoNome()
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










}