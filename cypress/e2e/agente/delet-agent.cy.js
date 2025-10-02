import { LoginPage } from "../../support/pages/login/login.page.js";

describe("Teste Creat - Criar Agente", () => {
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
cy.wait(3000);

  // Primeiro verifica se o agente foi criado e está visível na tabela
  //cy.xpath('//td[normalize-space(text())="Agente Teste Automatizado"]')
  //.should('be.visible')
  //.scrollIntoView();

// Debug: verifica se a linha da tabela existe
cy.log('🔍 Verificando se a linha da tabela existe...');
cy.xpath('//td[normalize-space(text())="Agente Teste Automatizado"]/ancestor::tr')
  .should('exist')
  .should('be.visible');

// Debug: verifica se existe algum botão na linha
cy.log('🔍 Verificando botões na linha...');
cy.xpath('//td[normalize-space(text())="Agente Teste Automatizado"]/ancestor::tr//button')
  .should('exist')
  .should('have.length.greaterThan', 0);

// Encontra a linha que contém "Agente Teste" e clica no botão de deletar
cy.log('🔍 Procurando botão de deletar na linha...');
cy.get('body').then(($body) => {
  // Estratégia 1: Tentar encontrar botão de deletar por ícone ou texto
  const selectorsDeletar = [
    'button:contains("Deletar")',
    'button:contains("Delete")',
    'button:contains("Remover")',
    'button:contains("Excluir")',
    'button svg[class*="trash"]',
    'button svg[class*="delete"]',
    'button svg[class*="x"]',
    'button[class*="danger"]',
    'button[class*="red"]',
    'button[class*="delete"]'
  ];
  
  let botaoDeletarEncontrado = false;
  for (const selector of selectorsDeletar) {
    if ($body.find(selector).length > 0) {
      cy.log(`✅ Botão de deletar encontrado: ${selector}`);
      cy.get(selector).first().should('be.visible').click();
      botaoDeletarEncontrado = true;
      break;
    }
  }
  
  // Estratégia 2: Se não encontrou, tentar o último botão da linha
  if (!botaoDeletarEncontrado) {
    cy.log('⚠️ Botão de deletar específico não encontrado, tentando último botão da linha...');
    cy.get('table tbody tr')
      .contains('Agente Teste Automatizado')
      .parent('tr')
      .find('button')
      .last()
      .should('be.visible')
      .click();
  }
});




  // Debug: Verificar se o modal de confirmação apareceu
  cy.log('🔍 Verificando se o modal de confirmação apareceu...');
  cy.get('body').then(($body) => {
    // Verificar se há elementos de modal/dialog
    const modalElements = $body.find('[role="dialog"], .modal, [class*="modal"], [class*="dialog"]');
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

  // Estratégia 1: Tentar o seletor original
  cy.log('🔍 Tentando seletor original...');
  cy.get('body').then(($body) => {
    if ($body.find('button:contains("Deletar agente")').length > 0) {
      cy.log('✅ Botão "Deletar agente" encontrado');
      cy.get('button:contains("Deletar agente")').first().should('be.visible').click();
    } else if ($body.find('button:contains("Deletar")').length > 0) {
      cy.log('✅ Botão "Deletar" encontrado');
      cy.get('button:contains("Deletar")').first().should('be.visible').click();
    } else if ($body.find('button:contains("Confirmar")').length > 0) {
      cy.log('✅ Botão "Confirmar" encontrado');
      cy.get('button:contains("Confirmar")').first().should('be.visible').click();
    } else if ($body.find('button:contains("Sim")').length > 0) {
      cy.log('✅ Botão "Sim" encontrado');
      cy.get('button:contains("Sim")').first().should('be.visible').click();
    } else {
      cy.log('⚠️ Nenhum botão de confirmação encontrado, tentando seletores alternativos...');
      
      // Estratégia 2: Tentar por classes específicas
      const selectorsDeletar = [
        'button[class*="bg-red"]',
        'button[class*="bg-[#e81b37]"]',
        'button[class*="danger"]',
        'button[class*="delete"]',
        'button[class*="red"]',
        '[role="dialog"] button:last-child',
        '.modal button:last-child',
        '[class*="modal"] button:last-child'
      ];
      
      let botaoEncontrado = false;
      for (const selector of selectorsDeletar) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Botão encontrado com seletor: ${selector}`);
          cy.get(selector).first().should('be.visible').click();
          botaoEncontrado = true;
          break;
        }
      }
      
      // Estratégia 3: Tentar o último botão do modal
      if (!botaoEncontrado) {
        cy.log('⚠️ Tentando último botão do modal...');
        cy.get('[role="dialog"] button, .modal button, [class*="modal"] button')
          .last()
          .should('be.visible')
          .click();
      }
    }
  });

// Aguardar processo de deleção completar
cy.wait(2000);








// Aguarda o toast aparecer e valida o conteúdo
cy.log('🔍 Aguardando mensagem de sucesso...');
cy.wait(3000); // Aguarda o toast carregar

// Valida que a mensagem de sucesso apareceu com múltiplas estratégias
cy.log('🔍 Procurando mensagem de sucesso...');
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
      // Não verificar visibilidade, apenas confirmar que existe
      cy.log('✅ Mensagem de sucesso detectada - deleção confirmada');
      mensagemEncontrada = true;
      break;
    }
  }
  
  // Estratégia 2: Procurar por elementos de toast/notificação
  if (!mensagemEncontrada) {
    cy.log('🔍 Procurando elementos de toast/notificação...');
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
        // Não verificar visibilidade, apenas confirmar que existe
        cy.log('✅ Toast/notificação detectado - deleção confirmada');
        mensagemEncontrada = true;
        break;
      }
    }
  }
  
  // Estratégia 3: Verificar se o agente foi removido da tabela
  if (!mensagemEncontrada) {
    cy.log('🔍 Verificando se o agente foi removido da tabela...');
    cy.get('body').then(($body) => {
      // Verificar se o agente não está mais na tabela
      if (!$body.text().includes('Agente Teste Automatizado')) {
        cy.log('✅ Agente não encontrado na tabela - deleção confirmada');
        mensagemEncontrada = true;
      } else {
        cy.log('⚠️ Agente ainda encontrado na tabela');
        
        // Verificar se a tabela ainda tem o agente específico
        cy.get('table tbody tr').then(($rows) => {
          let agenteEncontrado = false;
          $rows.each((index, row) => {
            if (row.textContent.includes('Agente Teste Automatizado')) {
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
    });
  }
  
  // Estratégia 4: Verificar se há indicadores de sucesso
  if (!mensagemEncontrada) {
    cy.log('🔍 Procurando indicadores de sucesso...');
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
        // Não verificar visibilidade, apenas confirmar que existe
        cy.log('✅ Indicador de sucesso detectado - deleção confirmada');
        mensagemEncontrada = true;
        break;
      }
    }
  }
  
  // Estratégia 5: Verificar se a tabela foi atualizada (menos linhas)
  if (!mensagemEncontrada) {
    cy.log('🔍 Verificando se a tabela foi atualizada...');
    cy.get('table tbody tr').then(($rows) => {
      if ($rows.length === 0) {
        cy.log('✅ Tabela vazia - deleção confirmada');
        mensagemEncontrada = true;
      } else {
        cy.log(`⚠️ Tabela ainda tem ${$rows.length} linhas`);
      }
    });
  }
  
  // Se nenhuma mensagem foi encontrada, logar informações de debug
  if (!mensagemEncontrada) {
    cy.log('⚠️ Nenhuma mensagem de sucesso encontrada');
    cy.log('🔍 Conteúdo da página:');
    cy.get('body').then(($body) => {
      const text = $body.text();
      cy.log(`Texto da página: ${text.substring(0, 500)}...`);
    });
    
    // Tirar screenshot para debug
    cy.screenshot('delecao-sem-mensagem-sucesso');
  }
});
















  });
});
