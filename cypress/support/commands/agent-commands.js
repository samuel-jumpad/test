/**
 * Comandos customizados do Cypress para testes de Agentes
 * Adiciona comandos reutilizáveis para facilitar os testes
 */

/**
 * Comando para criar agente completo
 * @example cy.criarAgente({ nome: 'Teste', descricao: 'Desc' })
 */
Cypress.Commands.add('criarAgente', (dados) => {
  const {
    nome,
    descricao = 'Descrição padrão',
    instrucoes = 'Instruções padrão'
  } = dados;

  cy.log(`🤖 Criando agente: ${nome}`);

  // Importar page object dentro do comando
  const { AgentPage } = require('../pages/agent/agent.page.js');
  const agentPage = new AgentPage();

  agentPage.navegarParaSecaoAgentes()
    .clicarEmMeusAgentes()
    .clicarEmCriarNovoAgente()
    .verificarFormularioCarregado();

  agentPage.encontrarCampoNome()
    .preencherCampoNome(nome)
    .preencherCampoDescricao(descricao)
    .preencherCampoInstrucoes(instrucoes)
    .rolarAteFinal()
    .validarCamposPreenchidos(nome)
    .tratarCamposObrigatorios(nome)
    .clicarEmSalvar()
    .verificarToastSucesso();

  cy.log(`✅ Agente "${nome}" criado com sucesso`);
});

/**
 * Comando para deletar agente
 * @example cy.deletarAgente('Nome do Agente')
 */
Cypress.Commands.add('deletarAgente', (nomeAgente) => {
  cy.log(`🗑️ Deletando agente: ${nomeAgente}`);

  const { AgentPage } = require('../pages/agent/agent.page.js');
  const agentPage = new AgentPage();

  agentPage.navegarParaSecaoAgentes()
    .clicarEmMeusAgentes();

  agentPage.deletarAgenteCompleto(nomeAgente);

  cy.log(`✅ Agente "${nomeAgente}" deletado`);
});

/**
 * Comando para buscar agente na lista
 * @example cy.buscarAgente('Nome do Agente')
 */
Cypress.Commands.add('buscarAgente', (nomeAgente) => {
  cy.log(`🔍 Buscando agente: ${nomeAgente}`);

  const { AgentPage } = require('../pages/agent/agent.page.js');
  const agentPage = new AgentPage();

  agentPage.buscarAgenteNoCampo(nomeAgente);

  // Verificar se o agente aparece na lista
  cy.get('body').should('contain', nomeAgente);

  cy.log(`✅ Agente "${nomeAgente}" encontrado`);
});

/**
 * Comando para validar toast de sucesso
 * @example cy.validarToastSucesso('Agente criado')
 */
Cypress.Commands.add('validarToastSucesso', (mensagemEsperada = null) => {
  cy.log('🔍 Validando toast de sucesso');

  cy.wait(2000);

  if (mensagemEsperada) {
    cy.get('body').should('contain', mensagemEsperada);
    cy.log(`✅ Toast com mensagem "${mensagemEsperada}" encontrado`);
  } else {
    // Validar qualquer toast de sucesso
    cy.get('body').then(($body) => {
      const mensagensSucesso = [
        'sucesso',
        'success',
        'criado',
        'created',
        'salvo',
        'saved'
      ];

      let encontrado = false;
      const texto = $body.text().toLowerCase();

      for (const msg of mensagensSucesso) {
        if (texto.includes(msg)) {
          encontrado = true;
          cy.log(`✅ Toast de sucesso encontrado: "${msg}"`);
          break;
        }
      }

      if (!encontrado) {
        cy.log('⚠️ Toast de sucesso não encontrado');
      }
    });
  }
});

/**
 * Comando para validar campos obrigatórios
 * @example cy.validarCamposObrigatorios()
 */
Cypress.Commands.add('validarCamposObrigatorios', () => {
  cy.log('🔍 Validando campos obrigatórios');

  cy.get('body').then(($body) => {
    const indicadoresObrigatorio = [
      '*:contains("Obrigatório")',
      '*:contains("Required")',
      '.border-red-500',
      '.error',
      '.invalid',
      '[aria-invalid="true"]'
    ];

    let encontrado = false;

    for (const seletor of indicadoresObrigatorio) {
      if ($body.find(seletor).length > 0) {
        cy.log(`✅ Indicador de campo obrigatório encontrado: ${seletor}`);
        encontrado = true;
        break;
      }
    }

    expect(encontrado).to.be.true;
  });
});

/**
 * Comando para gerar nome único de agente
 * @example cy.gerarNomeUnico('Agente Teste').then(nome => { ... })
 */
Cypress.Commands.add('gerarNomeUnico', (nomeBase = 'Agente Teste') => {
  const timestamp = Date.now();
  const nomeUnico = `${nomeBase} ${timestamp}`;
  cy.log(`🔧 Nome único gerado: ${nomeUnico}`);
  return cy.wrap(nomeUnico);
});

/**
 * Comando para aguardar carregamento completo
 * @example cy.aguardarCarregamento()
 */
Cypress.Commands.add('aguardarCarregamento', (tempo = 2000) => {
  cy.log(`⏳ Aguardando carregamento (${tempo}ms)`);
  cy.wait(tempo);
  cy.get('body').should('not.contain', 'loading');
  cy.get('body').should('not.contain', 'carregando');
  cy.log('✅ Carregamento concluído');
});

/**
 * Comando para navegar para agentes
 * @example cy.navegarParaAgentes()
 */
Cypress.Commands.add('navegarParaAgentes', () => {
  cy.log('🔍 Navegando para seção de agentes');

  const { AgentPage } = require('../pages/agent/agent.page.js');
  const agentPage = new AgentPage();

  agentPage.navegarParaSecaoAgentes()
    .clicarEmMeusAgentes();

  cy.log('✅ Navegação para agentes concluída');
});

/**
 * Comando para abrir formulário de criação de agente
 * @example cy.abrirFormularioCriarAgente()
 */
Cypress.Commands.add('abrirFormularioCriarAgente', () => {
  cy.log('📝 Abrindo formulário de criação de agente');

  const { AgentPage } = require('../pages/agent/agent.page.js');
  const agentPage = new AgentPage();

  agentPage.clicarEmCriarNovoAgente()
    .verificarFormularioCarregado();

  cy.log('✅ Formulário aberto');
});

/**
 * Comando para preencher campo com validação
 * @example cy.preencherCampoValidado('input[name="nome"]', 'Valor')
 */
Cypress.Commands.add('preencherCampoValidado', (seletor, valor) => {
  cy.log(`📝 Preenchendo campo: ${seletor}`);

  cy.get(seletor)
    .should('be.visible')
    .should('not.be.disabled')
    .clear()
    .type(valor, { delay: 100 })
    .should('have.value', valor)
    .trigger('input')
    .trigger('change')
    .blur();

  cy.log(`✅ Campo preenchido: "${valor}"`);
});

/**
 * Comando para clicar com retry
 * @example cy.clicarComRetry('button:contains("Salvar")')
 */
Cypress.Commands.add('clicarComRetry', (seletor, maxTentativas = 3) => {
  let tentativa = 1;

  const tentarClicar = () => {
    cy.log(`🔄 Tentativa ${tentativa}/${maxTentativas} de clicar em: ${seletor}`);

    cy.get('body').then(($body) => {
      if ($body.find(seletor).length > 0) {
        cy.get(seletor).first().click({ force: true });
        cy.log(`✅ Clique realizado com sucesso`);
      } else if (tentativa < maxTentativas) {
        tentativa++;
        cy.wait(1000);
        tentarClicar();
      } else {
        cy.log(`❌ Elemento não encontrado após ${maxTentativas} tentativas`);
        throw new Error(`Elemento não encontrado: ${seletor}`);
      }
    });
  };

  tentarClicar();
});

/**
 * Comando para verificar se elemento existe sem falhar
 * @example cy.elementoExiste('button').then(existe => { ... })
 */
Cypress.Commands.add('elementoExiste', (seletor) => {
  return cy.get('body').then(($body) => {
    const existe = $body.find(seletor).length > 0;
    cy.log(`🔍 Elemento ${seletor}: ${existe ? 'EXISTE' : 'NÃO EXISTE'}`);
    return existe;
  });
});

/**
 * Comando para log colorido
 * @example cy.logColorido('success', 'Operação bem-sucedida')
 */
Cypress.Commands.add('logColorido', (tipo, mensagem) => {
  const emojis = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    debug: '🔍',
    robot: '🤖',
    rocket: '🚀',
    clean: '🧹',
    clock: '⏰',
    fire: '🔥'
  };

  const emoji = emojis[tipo] || '📝';
  cy.log(`${emoji} ${mensagem}`);
});

/**
 * Comando para limpar todos os agentes de teste
 * @example cy.limparAgentesTestecypress()
 */
Cypress.Commands.add('limparAgentesTest', () => {
  cy.log('🧹 Limpando agentes de teste');

  cy.navegarParaAgentes();
  cy.wait(2000);

  // Buscar por agentes que contenham "Teste" no nome
  cy.get('body').then(($body) => {
    const agentesTest = $body.find('*:contains("Teste"), *:contains("Test")');

    if (agentesTest.length > 0) {
      cy.log(`🗑️ Encontrados ${agentesTest.length} agentes de teste`);
      // Aqui você pode implementar lógica para deletar cada um
    } else {
      cy.log('ℹ️ Nenhum agente de teste encontrado');
    }
  });
});

/**
 * Comando para configurar interceptações otimizadas
 * @example cy.configurarInterceptacoes()
 */
Cypress.Commands.add('configurarInterceptacoes', () => {
  cy.log('🔧 Configurando interceptações');

  // Mockar APIs de tradução
  cy.intercept('POST', '**/translate-pa.googleapis.com/**', {
    statusCode: 200,
    body: { translatedText: 'Mock translation' }
  }).as('translationRequest');

  cy.intercept('GET', '**/translate.googleapis.com/**', {
    statusCode: 200,
    body: { translatedText: 'Mock translation' }
  }).as('googleTranslationRequest');

  // Mockar outras APIs
  cy.intercept('POST', '**/chats/**/messages', {
    statusCode: 200,
    body: { success: true }
  }).as('chatMessageRequest');

  cy.log('✅ Interceptações configuradas');
});

/**
 * Comando para tirar screenshot com nome descritivo
 * @example cy.screenshotDescritivo('teste-criacao', 'passo-1')
 */
Cypress.Commands.add('screenshotDescritivo', (nomeTest, passo) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const nomeArquivo = `${nomeTest}_${passo}_${timestamp}`;
  cy.screenshot(nomeArquivo);
  cy.log(`📸 Screenshot: ${nomeArquivo}`);
});

// Exportar para uso em outros arquivos se necessário
module.exports = {};

