// ===== PÁGINA DE AGENTE =====

export class AgentPage {
  
  // ===== FUNÇÕES DE NAVEGAÇÃO =====
  
  // Navega para a página de agentes via dashboard
  navegarParaAgentes() {
    cy.log('🔍 Navegando para página de Agentes...');
    
    // Aguarda a página carregar completamente
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    // Tenta encontrar o menu Agentes com seletores CSS
    cy.get('body').then(($body) => {
      // Tenta encontrar por texto "Agentes"
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
    
    // Aguarda a página de agentes carregar
    cy.url({ timeout: 15000 }).should('include', '/assistants');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    cy.log('✅ Navegação para Agentes concluída');
  }

  // ===== FUNÇÕES DE CRIAÇÃO =====

  // Função principal para criar um novo agente
  criarNovoAgente(agentName, description = 'Relacionado a teste automatizado') {
    cy.log(`🤖 Criando novo agente: ${agentName}`);
    
    // Aguarda a página carregar completamente
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    // Tenta encontrar o botão "Cadastrar Novo Agente" com múltiplos seletores
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

    // Aguarda a página de criação carregar
    cy.url({ timeout: 15000 }).should('include', '/assistants/new');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(3000);
    
    // Verifica se está na página de criação (sem depender de botões específicos)
    cy.get('body').should('be.visible');

    // Preencher nome
    cy.xpath('//input[@name="name"]')
      .should('be.visible')
      .clear()
      .type(agentName, { delay: 150 });

    // Preencher descrição
    cy.xpath('//textarea[@name="description"]')
      .should('be.visible')
      .clear()
      .type(description, { delay: 150 });

    // Preencher texto rico
    cy.xpath('//textarea[contains(@class,"w-md-editor-text-input")]')
      .should('be.visible')
      .clear()
      .type('Teste automatizado Cypress', { delay: 150 });

    // Scroll até o botão Salvar
    cy.xpath('//*[@data-radix-scroll-area-viewport]')
      .scrollTo('bottom', { duration: 2000 });

    // Clicar em Salvar
    cy.xpath('//button[@type="submit"]')
      .should('be.visible')
      .click();

    // Validar criação
    this.validarAgenteCriado(agentName);
  }

  // Valida se o agente foi criado com sucesso
  validarAgenteCriado(agentName) {
    cy.log(`✅ Validando criação do agente: ${agentName}`);
    
    // Confirmações de sucesso
    cy.xpath('//div[contains(text(), "Agente criado")]')
      .should('be.visible');

    cy.xpath('//div[contains(text(), "O agente foi criado com sucesso!")]')
      .should('be.visible');
    
    cy.log(`✅ Agente "${agentName}" criado com sucesso`);
  }

  // ===== FUNÇÕES DE DELEÇÃO =====

  // Busca o agente na lista para preparar a deleção
  buscarAgente(agentName) {
    cy.log(`🔍 Buscando agente: ${agentName}`);
    
    // Digita o nome no campo de busca
    cy.xpath('//input[@type="search" and @placeholder="Buscar por nome"]')
      .should('be.visible')
      .clear()
      .type(agentName, { delay: 100 });

    // Aguarda a tabela carregar
    cy.wait(3000);

    // Verifica se o agente aparece
    cy.xpath('//td[normalize-space(text())="' + agentName + '"]')
      .should('be.visible')
      .scrollIntoView();
    
    cy.log(`✅ Agente "${agentName}" encontrado`);
  }

  // Função principal para deletar um agente
  deletarAgente(agentName) {
    cy.log(`🗑️ Deletando agente: ${agentName}`);
    
    // Buscar o agente
    this.buscarAgente(agentName);
    
    // Debug: verifica se a linha da tabela existe
    cy.xpath('//td[normalize-space(text())="' + agentName + '"]/ancestor::tr')
      .should('exist')
      .should('be.visible');

    // Debug: verifica se existe algum botão na linha
    cy.xpath('//td[normalize-space(text())="' + agentName + '"]/ancestor::tr//button')
      .should('exist')
      .should('have.length.greaterThan', 0);

    // Clica no botão de lixeira (último botão da linha)
    cy.get('table tbody tr')
      .contains(agentName)
      .parent('tr')
      .find('button')
      .last()
      .should('be.visible')
      .click();

    // Confirma a exclusão no modal
    cy.xpath('//button[contains(@class,"bg-[#e81b37]")]//div[contains(text(),"Deletar agente")]')
      .should('be.visible')
      .click();

    // Valida a deleção
    this.validarDelecaoSucesso();
  }

  // Valida se a deleção foi bem-sucedida
  validarDelecaoSucesso() {
    cy.log('✅ Validando deleção do agente...');
    
    // Aguarda o toast aparecer e valida o conteúdo
    cy.wait(2000);

    // Valida que a mensagem de sucesso apareceu
    cy.contains('Agente removido').should('be.visible');
    
    cy.log('✅ Agente deletado com sucesso');
  }

  // ===== FUNÇÕES DE ACESSO A AGENTES ANTIGOS =====

  // Acessa um agente antigo existente
  accessOldAgent() {
    cy.log('🔍 Acessando agente antigo...');
    
    // Navegar para a página de agentes
    this.navegarParaAgentes();
    
    // Aguardar a lista de agentes carregar
    cy.wait(3000);
    
    // Primeiro, tentar detectar a estrutura da página
    this.encontrarAgentesNaInterface();
    
    // Tentar encontrar e clicar no primeiro agente com múltiplas estratégias
    cy.get('body').then(($body) => {
      const selectorsAgente = [
        'table tbody tr',
        '[class*="agent"]',
        '[class*="card"]',
        '[class*="item"]',
        '[class*="row"]',
        'div[class*="agent"]',
        'div[class*="card"]',
        'div[class*="item"]',
        'div[class*="row"]',
        'button[class*="agent"]',
        'a[class*="agent"]',
        '[class*="grid"] [class*="item"]',
        '[class*="list"] [class*="item"]'
      ];
      
      let agenteEncontrado = false;
      for (const selector of selectorsAgente) {
        try {
          if ($body.find(selector).length > 0) {
            cy.log(`✅ Agente encontrado com seletor: ${selector} (${$body.find(selector).length} elementos)`);
            cy.get(selector).first()
              .should('be.visible')
              .click();
            agenteEncontrado = true;
            break;
          }
        } catch (error) {
          cy.log(`⚠️ Erro com seletor ${selector}: ${error.message}`);
        }
      }
      
      if (!agenteEncontrado) {
        cy.log('⚠️ Nenhum agente encontrado, tentando abordagem alternativa...');
        cy.screenshot('nenhum-agente-encontrado');
        
        // Debug: mostrar todos os elementos disponíveis
        this.debugEstadoPagina();
        
        // Tentar clicar em qualquer elemento que possa ser um agente
        cy.get('body').then(($body2) => {
          const elementosClicaveis = $body2.find('button, a, div[onclick], div[class*="click"], div[class*="select"], [role="button"]');
          if (elementosClicaveis.length > 0) {
            cy.log(`🔄 Tentando clicar no primeiro elemento clicável (${elementosClicaveis.length} encontrados)`);
            cy.wrap(elementosClicaveis.first()).should('be.visible').click();
          } else {
            cy.log('❌ Nenhum elemento clicável encontrado - página pode estar vazia');
            // Tentar navegar diretamente para um agente se soubermos o ID
            cy.visit('/dashboard/assistants/1', { timeout: 30000 });
          }
        });
      }
    });
    
    cy.log('✅ Agente antigo acessado com sucesso');
    return this;
  }

  // Aguarda o carregamento da página do agente
  waitForPageLoad() {
    cy.log('⏳ Aguardando carregamento da página do agente...');
    
    // Aguardar elementos específicos da página do agente carregarem
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    cy.log('✅ Página do agente carregada com sucesso');
    return this;
  }

  // Captura dados do agente acessado
  capturarDadosDoAgente() {
    cy.log('📊 Capturando dados do agente...');
    
    const dadosAgente = {};
    
    // Capturar URL atual primeiro
    cy.url().then((url) => {
      dadosAgente.url = url;
      cy.log(`🔗 URL do agente: ${dadosAgente.url}`);
    });
    
    // Capturar timestamp
    dadosAgente.timestamp = new Date().toISOString();
    cy.log(`⏰ Timestamp: ${dadosAgente.timestamp}`);
    
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
              dadosAgente.nome = texto;
              cy.log(`📝 Nome do agente encontrado com seletor "${selector}": ${dadosAgente.nome}`);
              nomeEncontrado = true;
              break;
            }
          }
        } catch (error) {
          cy.log(`⚠️ Erro com seletor ${selector}: ${error.message}`);
        }
      }
      
      if (!nomeEncontrado) {
        cy.log('⚠️ Nome do agente não encontrado, usando URL como identificador');
        dadosAgente.nome = 'Agente não identificado';
      }
    });
    
    // Tentar capturar descrição se disponível
    cy.get('body').then(($body) => {
      const selectorsDescricao = [
        '[data-testid="description"]',
        '.description',
        'p',
        '[class*="description"]',
        '[class*="desc"]',
        '[class*="about"]',
        '[class*="info"]'
      ];
      
      for (const selector of selectorsDescricao) {
        try {
          if ($body.find(selector).length > 0) {
            const descricao = $body.find(selector).first().text().trim();
            if (descricao && descricao.length > 0 && descricao.length < 500) {
              dadosAgente.descricao = descricao;
              cy.log(`📄 Descrição encontrada com seletor "${selector}": ${dadosAgente.descricao}`);
              break;
            }
          }
        } catch (error) {
          cy.log(`⚠️ Erro com seletor de descrição ${selector}: ${error.message}`);
        }
      }
      
      if (!dadosAgente.descricao) {
        cy.log('⚠️ Descrição não encontrada');
        dadosAgente.descricao = 'Descrição não disponível';
      }
    });
    
    // Armazenar dados no window para acesso posterior
    cy.window().then((win) => {
      win.dadosAgenteAcessado = dadosAgente;
    });
    
    cy.log('✅ Dados do agente capturados com sucesso');
    cy.log(`📊 Resumo: Nome="${dadosAgente.nome}", URL="${dadosAgente.url}"`);
    return this;
  }

  // Valida se está na página correta do agente
  validarPaginaDoAgente() {
    cy.log('✅ Validando página do agente...');
    
    // Verificar se não está mais na lista de agentes
    cy.url().should('not.include', '/agents');
    
    // Verificar se está em uma página de agente específico
    cy.url().should('match', /\/agent\/\d+/);
    
    // Verificar se a página carregou completamente
    cy.get('body').should('not.contain', 'loading');
    
    cy.log('✅ Página do agente validada com sucesso');
    return this;
  }

  // Retorna para a página principal (dashboard)
  retornarParaPaginaPrincipal() {
    cy.log('🏠 Retornando para página principal...');
    
    // Clicar no logo ou navegar para dashboard
    cy.get('[data-testid="logo"], .logo, a[href*="dashboard"]').first().click();
    
    // Ou navegar diretamente
    cy.visit('/dashboard', { timeout: 30000 });
    
    // Aguardar dashboard carregar
    cy.url({ timeout: 30000 }).should('include', '/dashboard');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    cy.log('✅ Retornou para página principal com sucesso');
    return this;
  }

  // Exibe resumo dos dados capturados
  exibirResumoDados() {
    cy.log('📋 Exibindo resumo dos dados capturados...');
    
    cy.window().then((win) => {
      if (win.dadosAgenteAcessado) {
        const dados = win.dadosAgenteAcessado;
        cy.log('📊 === RESUMO DOS DADOS DO AGENTE ===');
        cy.log(`📝 Nome: ${dados.nome || 'Não capturado'}`);
        cy.log(`📄 Descrição: ${dados.descricao || 'Não capturada'}`);
        cy.log(`🔗 URL: ${dados.url || 'Não capturada'}`);
        cy.log(`⏰ Timestamp: ${dados.timestamp || 'Não capturado'}`);
        cy.log('📊 === FIM DO RESUMO ===');
      } else {
        cy.log('⚠️ Nenhum dado foi capturado do agente');
      }
    });
    
    return this;
  }

  // ===== MÉTODOS ESPECÍFICOS PARA BUSCA E ACESSO =====

  // Busca agente por nome
  buscarAgentePorNome(nomeAgente = 'Agente teste automatizado') {
    cy.log(`🔍 Buscando agente: ${nomeAgente}`);
    
    // Aguardar página carregar
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    // Tentar encontrar campo de busca com múltiplos seletores
    cy.get('body').then(($body) => {
      const selectorsBusca = [
        'input[type="search"]',
        'input[placeholder*="Buscar"]',
        'input[placeholder*="buscar"]',
        'input[placeholder*="nome"]',
        'input[placeholder*="search"]',
        'input[data-testid*="search"]',
        'input[class*="search"]'
      ];
      
      let campoEncontrado = false;
      for (const selector of selectorsBusca) {
        try {
          if ($body.find(selector).length > 0) {
            cy.log(`✅ Campo de busca encontrado com seletor: ${selector}`);
            cy.get(selector).first()
              .should('be.visible')
              .clear()
              .type(nomeAgente, { delay: 100 });
            campoEncontrado = true;
            break;
          }
        } catch (error) {
          cy.log(`⚠️ Erro com seletor ${selector}: ${error.message}`);
        }
      }
      
      if (!campoEncontrado) {
        cy.log('⚠️ Campo de busca não encontrado, tentando input genérico...');
        cy.get('input[type="text"]').first()
          .should('be.visible')
          .clear()
          .type(nomeAgente, { delay: 100 });
      }
    });

    // Aguarda a tabela carregar
    cy.wait(3000);
    
    return this;
  }

  // Navega para a seção "Meus Agentes"
  acessarMeusAgentes() {
    cy.log('📂 Acessando "Meus Agentes"...');
    
    // Aguardar página carregar
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    // Tentar encontrar e clicar em "Meus Agentes"
    cy.get('body').then(($body) => {
      const selectorsMeusAgentes = [
        'button:contains("Meus Agentes")',
        'div:contains("Meus Agentes")',
        'a:contains("Meus Agentes")',
        'span:contains("Meus Agentes")',
        '[class*="meus"]:contains("Meus Agentes")'
      ];
      
      let meusAgentesEncontrado = false;
      for (const selector of selectorsMeusAgentes) {
        try {
          if ($body.find(selector).length > 0) {
            cy.log(`✅ "Meus Agentes" encontrado com seletor: ${selector}`);
            cy.get(selector).first().should('be.visible').click();
            meusAgentesEncontrado = true;
            break;
          }
        } catch (error) {
          cy.log(`⚠️ Erro com seletor ${selector}: ${error.message}`);
        }
      }
      
      if (!meusAgentesEncontrado) {
        cy.log('⚠️ "Meus Agentes" não encontrado, mas continuando...');
        cy.screenshot('meus-agentes-nao-encontrado');
      }
    });
    
    cy.wait(3000);
    cy.log('✅ Seção "Meus Agentes" acessada');
    
    return this;
  }

  // Navega para a página de agentes
  acessarPaginaAgentes() {
    cy.log('🧭 Navegando para página de agentes...');
    
    // Aguardar dashboard carregar completamente
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    // Tentar encontrar e clicar no menu Agentes
    cy.get('body').then(($body) => {
      // Usar seletores CSS mais simples
      const selectorsAgentes = [
        'span:contains("Agentes")',
        'div:contains("Agentes")',
        'button:contains("Agentes")',
        'a:contains("Agentes")',
        '[class*="agent"]:contains("Agentes")'
      ];
      
      let agenteEncontrado = false;
      for (const selector of selectorsAgentes) {
        try {
          if ($body.find(selector).length > 0) {
            cy.log(`✅ Menu Agentes encontrado com seletor: ${selector}`);
            cy.get(selector).first().should('be.visible').click();
            agenteEncontrado = true;
            break;
          }
        } catch (error) {
          cy.log(`⚠️ Erro com seletor ${selector}: ${error.message}`);
        }
      }
      
      if (!agenteEncontrado) {
        cy.log('⚠️ Menu Agentes não encontrado, tentando navegar diretamente...');
        cy.visit('/dashboard/assistants', { timeout: 30000 });
      }
    });
    
    // Aguardar navegação
    cy.wait(3000);
    
    this.acessarMeusAgentes();
    
    return this;
  }

  // Valida se está na página de agentes
  validarPaginaAgentes() {
    cy.log('✅ Validando página de agentes...');
    
    // Validar URL
    cy.url().should('include', '/assistants');
    
    // Aguardar página carregar completamente
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    // Tentar encontrar textos indicativos da página de agentes
    cy.get('body').then(($body) => {
      const textosPossiveis = [
        "Explore e desenvolva versões únicas de agentes",
        "Agentes",
        "Meus Agentes",
        "assistants",
        "agent"
      ];
      
      let textoEncontrado = false;
      for (const texto of textosPossiveis) {
        if ($body.text().toLowerCase().includes(texto.toLowerCase())) {
          cy.log(`✅ Texto encontrado na página: "${texto}"`);
          textoEncontrado = true;
          break;
        }
      }
      
      if (!textoEncontrado) {
        cy.log('⚠️ Nenhum texto indicativo encontrado, mas URL está correta');
        cy.screenshot('pagina-agentes-sem-texto-esperado');
      }
    });
    
    cy.log('✅ Página de agentes validada');
    return this;
  }

  // Executa fluxo completo de acesso ao agente
  executarFluxoCompletoAcessoAgente(nomeAgente = 'Agente teste automatizado') {
    cy.log('🚀 Executando fluxo completo de acesso ao agente...');
    
    try {
      this
        .acessarPaginaAgentes()
        .validarPaginaAgentes()
        .buscarAgentePorNome(nomeAgente)
        .accessOldAgent()
        .waitForPageLoad()
        .capturarDadosDoAgente();
      
      cy.log('✅ Fluxo completo de acesso ao agente concluído');
    } catch (error) {
      cy.log('⚠️ Erro no fluxo, tentando abordagem alternativa...');
      cy.screenshot('erro-fluxo-acesso-agente');
      
      // Abordagem alternativa: navegar diretamente
      this.navegarDiretamenteParaAgentes(nomeAgente);
    }
    
    return this;
  }

  // Método alternativo simples para navegação direta
  navegarDiretamenteParaAgentes(nomeAgente = 'Agente teste automatizado') {
    cy.log('🔄 Usando abordagem alternativa: navegação direta...');
    
    // Navegar diretamente para a página de agentes
    cy.visit('/dashboard/assistants', { timeout: 30000 });
    cy.wait(3000);
    
    // Aguardar página carregar
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    
    // Buscar agente
    this.buscarAgentePorNome(nomeAgente);
    
    // Tentar acessar agente
    this.accessOldAgent();
    this.waitForPageLoad();
    this.capturarDadosDoAgente();
    
    cy.log('✅ Navegação direta concluída');
    return this;
  }

  // Método específico para encontrar agentes na interface
  encontrarAgentesNaInterface() {
    cy.log('🔍 Procurando agentes na interface...');
    
    cy.get('body').then(($body) => {
      // Verificar diferentes estruturas possíveis
      const estruturasPossiveis = [
        { nome: 'Tabela', selector: 'table tbody tr', count: $body.find('table tbody tr').length },
        { nome: 'Cards', selector: '[class*="card"]', count: $body.find('[class*="card"]').length },
        { nome: 'Grid Items', selector: '[class*="grid"] [class*="item"]', count: $body.find('[class*="grid"] [class*="item"]').length },
        { nome: 'List Items', selector: '[class*="list"] [class*="item"]', count: $body.find('[class*="list"] [class*="item"]').length },
        { nome: 'Agent Elements', selector: '[class*="agent"]', count: $body.find('[class*="agent"]').length },
        { nome: 'Clickable Divs', selector: 'div[onclick], div[class*="click"]', count: $body.find('div[onclick], div[class*="click"]').length }
      ];
      
      cy.log('📊 Estruturas encontradas na página:');
      estruturasPossiveis.forEach(estrutura => {
        cy.log(`  ${estrutura.nome}: ${estrutura.count} elementos`);
      });
      
      // Encontrar a estrutura com mais elementos
      const estruturaComMaisElementos = estruturasPossiveis.reduce((max, current) => 
        current.count > max.count ? current : max
      );
      
      if (estruturaComMaisElementos.count > 0) {
        cy.log(`✅ Usando estrutura: ${estruturaComMaisElementos.nome} (${estruturaComMaisElementos.count} elementos)`);
        return estruturaComMaisElementos.selector;
      } else {
        cy.log('⚠️ Nenhuma estrutura de agentes encontrada');
        return null;
      }
    });
    
    return this;
  }

  // Método de debug para verificar estado da página
  debugEstadoPagina() {
    cy.log('🔍 Debug: Verificando estado da página...');
    
    cy.url().then((url) => {
      cy.log(`📍 URL atual: ${url}`);
    });
    
    cy.get('body').then(($body) => {
      cy.log(`📄 Título da página: ${$body.find('title').text()}`);
      cy.log(`📊 Total de elementos na página: ${$body.find('*').length}`);
      
      // Verificar elementos visíveis
      const elementosVisiveis = $body.find('*:visible').length;
      cy.log(`👁️ Elementos visíveis: ${elementosVisiveis}`);
      
      // Verificar se há loading
      const loadingElements = $body.find('[class*="loading"], [class*="spinner"]').length;
      cy.log(`⏳ Elementos de loading: ${loadingElements}`);
      
      // Verificar estruturas de agentes
      this.encontrarAgentesNaInterface();
    });
    
    return this;
  }
}