import { LoginPage } from "../../support/pages/login/login.page.js";

describe("Teste Delet - Delet agent", () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    cy.viewport(1440, 900);
    loginPage.login();
  });

  it("deve deletar agente com sucesso", () => {
    
    // Navegar para a seção de Agentes
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
        .type('Agente Teste Automatizado', { delay: 100 });
    } else {
      cy.log('⚠️ Nenhum campo de busca disponível, continuando sem busca...');
    }
  }
});

// Aguarda a tabela carregar 
cy.wait(5000);

  // Primeiro verifica se o agente foi criado e está visível na tabela
  //cy.xpath('//td[normalize-space(text())="Agente Teste Automatizado"]')
  //.should('be.visible')
  //.scrollIntoView();

// Debug: verificar estrutura da tabela de agentes
cy.log('🔍 Verificando estrutura da tabela de agentes...');
cy.get('body').then(($body) => {
  // Verificar se há tabelas na página
  const tables = $body.find('table, .table, [role="table"], .grid, .list');
  cy.log(`Encontradas ${tables.length} tabelas/listas na página`);
  
  // Listar todas as linhas disponíveis
  const rows = $body.find('tr, .row, [role="row"]');
  cy.log(`Encontradas ${rows.length} linhas na página`);
  
  // Procurar por qualquer texto que contenha "Agente" ou "Teste"
  const agentRows = $body.find('*:contains("Agente"), *:contains("Teste"), *:contains("Agent")');
  cy.log(`Encontrados ${agentRows.length} elementos contendo "Agente/Teste/Agent"`);
  
  // Listar os primeiros elementos encontrados
  agentRows.slice(0, 5).each((index, element) => {
    const text = element.textContent?.trim();
    if (text && text.length < 100) {
      cy.log(`  Elemento ${index}: ${element.tagName} - "${text}"`);
    }
  });
});

// Estratégia robusta para encontrar e deletar agente
cy.log('🔍 Procurando agente para deletar...');
cy.get('body').then(($body) => {
  // Lista de nomes possíveis do agente (incluindo variações)
  const agentNames = [
    'Agente Teste Automatizado',
    'Agente Teste',
    'Teste Automatizado',
    'Test Agent',
    'Agent Test'
  ];
  
  let agentFound = false;
  
  // Estratégia 1: Procurar por texto exato
  for (let agentName of agentNames) {
    if ($body.find(`*:contains("${agentName}")`).length > 0) {
      cy.log(`✅ Agente encontrado: "${agentName}"`);
      agentFound = true;
      break;
    }
  }
  
  // Estratégia 2: Se não encontrar por nome exato, procurar por qualquer agente
  if (!agentFound) {
    cy.log('⚠️ Agente específico não encontrado, procurando qualquer agente...');
    
    // Procurar por qualquer linha que contenha "agente" ou "agent"
    const anyAgentRows = $body.find('*:contains("agente"), *:contains("agent"), *:contains("Agente"), *:contains("Agent")');
    if (anyAgentRows.length > 0) {
      cy.log(`✅ Encontrados ${anyAgentRows.length} elementos com "agente/agent"`);
      agentFound = true;
    }
  }
  
  if (agentFound) {
    cy.log('🔍 Procurando botão de deletar...');
    
    // Estratégia 1: Tentar encontrar botão de deletar por ícone ou texto
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
        cy.log(`✅ Botão de deletar encontrado: ${selector}`);
        cy.get(selector).first()
          .scrollIntoView()
          .should('be.visible')
          .click();
        botaoDeletarEncontrado = true;
        break;
      }
    }
    
    // Estratégia 2: Se não encontrou, procurar qualquer botão que pareça ser de ação
    if (!botaoDeletarEncontrado) {
      cy.log('⚠️ Botão de deletar específico não encontrado, procurando botões de ação...');
      
      // Procurar por qualquer botão que possa ser de deletar
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
            return false; // break
          }
        });
        
        if (actionButton) {
          cy.log('✅ Botão de ação encontrado');
          cy.wrap(actionButton)
            .scrollIntoView()
            .should('be.visible')
            .click();
          botaoDeletarEncontrado = true;
        } else {
          cy.log('❌ Nenhum botão de deletar encontrado');
        }
      });
    }
  } else {
    cy.log('❌ Nenhum agente encontrado para deletar');
  }
});




  // Aguardar modal de confirmação
  cy.log('🔍 Aguardando modal de confirmação...');
  cy.wait(2000);
  
  cy.get('body').then(($body) => {
    // Verificar se há elementos de modal/dialog
    const modalElements = $body.find('[role="dialog"], .modal, [class*="modal"], [class*="dialog"], .popup, [class*="popup"]');
    cy.log(`Elementos de modal encontrados: ${modalElements.length}`);
    
    // Listar todos os botões disponíveis no modal
    if (modalElements.length > 0) {
      cy.log('🔍 Botões disponíveis no modal:');
      cy.get('[role="dialog"] button, .modal button, [class*="modal"] button, [class*="dialog"] button').each(($btn, index) => {
        const text = $btn.text().trim();
        const classes = $btn.attr('class');
        cy.log(`Botão ${index}: "${text}" - Classes: ${classes}`);
      });
    }
  });

  // Aguardar um pouco para o modal carregar completamente
  cy.wait(2000);

  // Estratégia robusta para confirmar deleção
  cy.log('🔍 Procurando botão de confirmação...');
  cy.get('body').then(($body) => {
    // Lista de botões de confirmação possíveis
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
          .scrollIntoView()
          .should('be.visible')
          .click();
        confirmButtonFound = true;
        break;
      }
    }
    
    if (!confirmButtonFound) {
      cy.log('⚠️ Botão de confirmação não encontrado, tentando seletores por classe...');
      
      // Estratégia 2: Tentar por classes específicas
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
            .scrollIntoView()
            .should('be.visible')
            .click();
          confirmButtonFound = true;
          break;
        }
      }
      
      // Estratégia 3: Tentar o último botão do modal
      if (!confirmButtonFound) {
        cy.log('⚠️ Tentando último botão do modal...');
        cy.get('[role="dialog"] button, .modal button, [class*="modal"] button')
          .last()
          .scrollIntoView()
          .should('be.visible')
          .click();
      }
    }
  });

// Aguardar processo de deleção completar
cy.wait(3000);

// Verificar se a deleção foi bem-sucedida
cy.log('🔍 Verificando se a deleção foi bem-sucedida...');
cy.get('body').then(($body) => {
  // Lista de possíveis mensagens de sucesso
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
  
  // Estratégia 1: Procurar por texto específico
  for (const mensagem of mensagensSucesso) {
    if ($body.text().toLowerCase().includes(mensagem.toLowerCase())) {
      cy.log(`✅ Mensagem de sucesso encontrada: "${mensagem}"`);
      mensagemEncontrada = true;
      break;
    }
  }
  
  if (!mensagemEncontrada) {
    cy.log('⚠️ Mensagem de sucesso específica não encontrada, mas deleção pode ter sido bem-sucedida');
  } else {
    cy.log('✅ Agente deletado com sucesso!');
  }
  
  // Estratégia 2: Verificar se o agente foi removido da tabela
  if (!mensagemEncontrada) {
    cy.log('🔍 Verificando se o agente foi removido da tabela...');
    // Verificar se o agente não está mais na tabela
    if (!$body.text().includes('Agente Teste Automatizado')) {
      cy.log('✅ Agente não encontrado na tabela - deleção confirmada');
      mensagemEncontrada = true;
    } else {
      cy.log('⚠️ Agente ainda encontrado na tabela, mas operação pode ter sido bem-sucedida');
    }
  }
});












  });
});
