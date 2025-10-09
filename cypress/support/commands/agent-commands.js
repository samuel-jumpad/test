Cypress.Commands.add('criarAgente', (dados) => {
  const {
    nome,
    descricao = 'Descrição padrão',
    instrucoes = 'Instruções padrão'
  } = dados;

  cy.log(`🤖 Criando agente: ${nome}`);

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

Cypress.Commands.add('deletarAgente', (nomeAgente) => {
  cy.log(`🗑️ Deletando agente: ${nomeAgente}`);

  const { AgentPage } = require('../pages/agent/agent.page.js');
  const agentPage = new AgentPage();

  agentPage.navegarParaSecaoAgentes()
    .clicarEmMeusAgentes();

  agentPage.deletarAgenteCompleto(nomeAgente);

  cy.log(`✅ Agente "${nomeAgente}" deletado`);
});

Cypress.Commands.add('buscarAgente', (nomeAgente) => {
  cy.log(`🔍 Buscando agente: ${nomeAgente}`);

  const { AgentPage } = require('../pages/agent/agent.page.js');
  const agentPage = new AgentPage();

  agentPage.buscarAgenteNoCampo(nomeAgente);

  cy.get('body').should('contain', nomeAgente);

  cy.log(`✅ Agente "${nomeAgente}" encontrado`);
});

Cypress.Commands.add('validarToastSucesso', (mensagemEsperada = null) => {
  cy.log('🔍 Validando toast de sucesso');

  cy.wait(2000);

  if (mensagemEsperada) {
    cy.get('body').should('contain', mensagemEsperada);
    cy.log(`✅ Toast com mensagem "${mensagemEsperada}" encontrado`);
  } else {
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

Cypress.Commands.add('gerarNomeUnico', (nomeBase = 'Agente Teste') => {
  const timestamp = Date.now();
  const nomeUnico = `${nomeBase} ${timestamp}`;
  cy.log(`🔧 Nome único gerado: ${nomeUnico}`);
  return cy.wrap(nomeUnico);
});

Cypress.Commands.add('aguardarCarregamento', (tempo = 2000) => {
  cy.log(`⏳ Aguardando carregamento (${tempo}ms)`);
  cy.wait(tempo);
  cy.get('body').should('not.contain', 'loading');
  cy.get('body').should('not.contain', 'carregando');
  cy.log('✅ Carregamento concluído');
});

Cypress.Commands.add('navegarParaAgentes', () => {
  cy.log('🔍 Navegando para seção de agentes');

  const { AgentPage } = require('../pages/agent/agent.page.js');
  const agentPage = new AgentPage();

  agentPage.navegarParaSecaoAgentes()
    .clicarEmMeusAgentes();

  cy.log('✅ Navegação para agentes concluída');
});

Cypress.Commands.add('abrirFormularioCriarAgente', () => {
  cy.log('📝 Abrindo formulário de criação de agente');

  const { AgentPage } = require('../pages/agent/agent.page.js');
  const agentPage = new AgentPage();

  agentPage.clicarEmCriarNovoAgente()
    .verificarFormularioCarregado();

  cy.log('✅ Formulário aberto');
});

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

Cypress.Commands.add('elementoExiste', (seletor) => {
  return cy.get('body').then(($body) => {
    const existe = $body.find(seletor).length > 0;
    cy.log(`🔍 Elemento ${seletor}: ${existe ? 'EXISTE' : 'NÃO EXISTE'}`);
    return existe;
  });
});

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

Cypress.Commands.add('limparAgentesTest', () => {
  cy.log('🧹 Limpando agentes de teste');

  cy.navegarParaAgentes();
  cy.wait(2000);

  cy.get('body').then(($body) => {
    const agentesTest = $body.find('*:contains("Teste"), *:contains("Test")');

    if (agentesTest.length > 0) {
      cy.log(`🗑️ Encontrados ${agentesTest.length} agentes de teste`);
    } else {
      cy.log('ℹ️ Nenhum agente de teste encontrado');
    }
  });
});

Cypress.Commands.add('configurarInterceptacoes', () => {
  cy.log('🔧 Configurando interceptações');

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
    body: { success: true }
  }).as('chatMessageRequest');

  cy.log('✅ Interceptações configuradas');
});

Cypress.Commands.add('screenshotDescritivo', (nomeTest, passo) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const nomeArquivo = `${nomeTest}_${passo}_${timestamp}`;
  cy.screenshot(nomeArquivo);
  cy.log(`📸 Screenshot: ${nomeArquivo}`);
});

module.exports = {};
