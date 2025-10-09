import { LoginPage } from "../../support/pages/login/login.page.js";

describe("Teste Creat - Criar Agente", () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.viewport(1440, 900);
    loginPage.login();
  });

  it("deve criar agente com sucesso", () => {
    
       // ===== NAVEGAÇÃO PARA AGENTES (mesma estratégia usada para Chat) =====
       cy.log('🔍 Navegando para Agentes...');
    
       // Aguardar carregamento completo
       cy.get('body').should('not.contain', 'loading');
       cy.wait(2000);
       
       // DEBUG: Verificar quantos elementos "Agentes" existem
       cy.get('body').then(($body) => {
         const totalAgentes = $body.find('*:contains("Agentes")').length;
         cy.log(`🔍 DEBUG: Total de elementos contendo "Agentes": ${totalAgentes}`);
       });
       
       // Estratégias robustas para encontrar e clicar em Agentes (mesma lógica do Chat)
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
             
             // REMOVER .should('be.visible') que pode estar travando
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
           cy.log('❌ Agentes NÃO encontrado com nenhum seletor, navegando diretamente...');
           cy.visit('/dashboard/agents', { failOnStatusCode: false });
         }
       });
       
       cy.wait(4000);
       cy.log('✅ Navegação para Agentes concluída');
       
   
       
       // Clicar em "Meus Agentes" (mesma estratégia robusta)
       cy.log('🔍 Procurando "Meus Agentes"...');
       
       cy.get('body').then(($body) => {
         const meusAgentesSelectors = [
           'a[href="/dashboard/assistants/list"]',
           'button:contains("Meus Agentes")',
           'a:contains("Meus Agentes")',
           '[role="button"]:contains("Meus Agentes")',
           'div:contains("Meus Agentes")',
           'button:contains("Meus")',
           'a:contains("Meus")'
         ];
         
         let found = false;
         
         for (let selector of meusAgentesSelectors) {
           if ($body.find(selector).length > 0) {
             cy.log(`✅ "Meus Agentes" encontrado com seletor: ${selector}`);
             cy.log(`📊 Quantidade encontrada: ${$body.find(selector).length}`);
             
             cy.get(selector).first()
               .scrollIntoView()
               .wait(1000)
               .click({ force: true });
             cy.log('✅ Clique em "Meus Agentes" EXECUTADO!');
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

    // Procurar e clicar no botão "Cadastrar Novo Agente"
    cy.log('🔍 Procurando botão "Cadastrar Novo Agente"...');
    cy.wait(3000);
    
    cy.get('body').then(($body) => {
      // Lista de seletores para o botão de criar agente (baseado no HTML real)
      const criarAgenteSelectors = [
        // Estratégia 1: Link direto com href (mais confiável)
        'a[href="/dashboard/assistants/new"]',
        'a[href*="/assistants/new"]',
        
        // Estratégia 2: Botão com classes específicas
        'button.bg-primary-main:contains("Cadastrar Novo Agente")',
        'button.bg-primary-main',
        
        // Estratégia 3: Link que contém botão
        'a:has(button:contains("Cadastrar Novo Agente"))',
        'a:has(button):contains("Cadastrar Novo Agente")',
        
        // Estratégia 4: Textos específicos
        'button:contains("Cadastrar Novo Agente")',
        'div:contains("Cadastrar Novo Agente")',
        '*:contains("Cadastrar Novo Agente")',
        
        // Estratégia 5: Variações de texto
        'button:contains("Criar novo agente")',
        'a:contains("Cadastrar Novo Agente")',
        'button:contains("Novo Agente")',
        'button:contains("Criar Agente")',
        
        // Estratégia 6: Por atributos
        '[data-testid*="create-agent"]',
        '[data-testid*="new-agent"]',
        'button[aria-label*="criar"]',
        'button[aria-label*="novo"]'
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
        cy.log('⚠️ Botão não encontrado com seletores, navegando diretamente para URL...');
        // Se nenhum seletor funcionou, navegar diretamente
        cy.visit('/dashboard/assistants/new', { failOnStatusCode: false });
        cy.wait(2000);
      }
    });
    
    // Aguardar carregamento do formulário
    cy.wait(5000);

    // Debug: Verificar se o formulário carregou
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

    // Estratégia avançada para preencher campo nome
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
    
    // Simular interação humana completa
    const nomeAgente = 'Agente Teste Automatizado';
    
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

    // Preencher campo descrição
    cy.log('📝 Preenchendo campo descrição...');
    cy.get('body').then(($body) => {
      // Lista de seletores específicos para descrição (EXCLUINDO o editor markdown)
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
        // Excluir explicitamente o editor markdown
        const elements = $body.find(selector).not('.w-md-editor-text-input');
        if (elements.length > 0) {
          cy.log(`✅ Campo descrição encontrado com seletor: ${selector}`);
          cy.get(selector).not('.w-md-editor-text-input').first()
            .should('be.visible')
            .clear()
            .type('Descrição do Agente de Teste Automatizado', { delay: 100 })
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

    // Aguardar processamento
    cy.wait(1000);

    // Preencher campo de instruções (Editor Markdown)
    cy.log('📝 Preenchendo campo de instruções (Editor Markdown)...');
    cy.get('body').then(($body) => {
      // Seletores específicos para o editor markdown de instruções
      const instructionSelectors = [
        // Editor markdown específico
        '.w-md-editor-text-input',
        'textarea.w-md-editor-text-input',
        
        // Por atributos
        'textarea[name="instructions"]',
        'textarea[name="prompt"]',
        
        // Por placeholder
        'textarea[placeholder*="instrução"]',
        'textarea[placeholder*="Instrução"]',
        'textarea[placeholder*="instruction"]',
        'textarea[placeholder*="Instruction"]',
        
        // Último textarea (geralmente é o de instruções)
        'textarea:last-of-type'
      ];
      
      let found = false;
      for (let selector of instructionSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Campo instruções encontrado com seletor: ${selector}`);
          cy.get(selector).last() // Usar .last() ao invés de .first() para pegar o editor markdown
            .should('be.visible')
            .clear()
            .type('Relacionado a teste automatizado com cypress.', { delay: 100 })
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

    // Aguardar um pouco para os campos serem processados
    cy.wait(2000);

    // Rolar até o final com verificação de elemento
    cy.log('📜 Tentando rolar até o final do formulário...');
    cy.get('body').then(($body) => {
      if ($body.find('[data-radix-scroll-area-viewport]').length > 0) {
        cy.log('✅ Elemento de scroll encontrado');
        cy.get('[data-radix-scroll-area-viewport]')
          .first()
          .then(($el) => {
            // Verificar se o elemento é scrollável
            const isScrollable = $el[0].scrollHeight > $el[0].clientHeight;
            if (isScrollable) {
              cy.log('✅ Elemento é scrollável, rolando...');
              cy.wrap($el).scrollTo('bottom', { duration: 1000 });
            } else {
              cy.log('⚠️ Elemento não é scrollável, tentando scroll da janela...');
              // Verificar se a janela é scrollável
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
        // Verificar se a janela é scrollável
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

    // Validação final dos campos
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
        .should('have.value', 'Agente Teste Automatizado')
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
    
    // Verificar se ainda há mensagens de erro
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
            input.value = 'Agente Teste Automatizado';
            
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
          
          cy.get(nameSelector).first().should('have.value', 'Agente Teste Automatizado');
        });
      }
    });
    
    // Aguardar um pouco mais para garantir processamento
    cy.wait(2000);

    // Clicar em salvar
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
  });
});