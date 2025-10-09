/**
 * Helper functions para testes de Agentes
 * Centraliza funções utilitárias comuns aos testes
 */

/**
 * Gera um nome único para agente usando timestamp
 * @param {string} baseName - Nome base do agente
 * @returns {string} Nome único com timestamp
 */
export function gerarNomeUnico(baseName = 'Agente Teste') {
  const timestamp = Date.now();
  return `${baseName} ${timestamp}`;
}

/**
 * Gera dados aleatórios para criação de agente
 * @returns {object} Objeto com dados do agente
 */
export function gerarDadosAgente() {
  const random = Math.floor(Math.random() * 10000);
  return {
    nome: `Agente Teste ${random}`,
    descricao: `Descrição do agente de teste número ${random}`,
    instrucoes: `Instruções para teste automatizado ${random}`,
  };
}

/**
 * Valida se uma mensagem de sucesso está presente
 * @param {string[]} mensagens - Array de possíveis mensagens de sucesso
 * @returns {Cypress.Chainable} Chainable do Cypress
 */
export function validarMensagemSucesso(mensagens) {
  cy.get('body').then(($body) => {
    let mensagemEncontrada = false;
    const bodyText = $body.text().toLowerCase();
    
    for (const mensagem of mensagens) {
      if (bodyText.includes(mensagem.toLowerCase())) {
        cy.log(`✅ Mensagem de sucesso encontrada: "${mensagem}"`);
        mensagemEncontrada = true;
        break;
      }
    }
    
    if (!mensagemEncontrada) {
      cy.log('⚠️ Nenhuma mensagem de sucesso específica encontrada');
    }
    
    return mensagemEncontrada;
  });
}

/**
 * Aguarda elemento aparecer com retry
 * @param {string} selector - Seletor do elemento
 * @param {number} maxRetries - Número máximo de tentativas
 * @param {number} delay - Delay entre tentativas em ms
 * @returns {Cypress.Chainable} Chainable do Cypress
 */
export function aguardarElementoComRetry(selector, maxRetries = 5, delay = 1000) {
  let tentativas = 0;
  
  const verificar = () => {
    cy.get('body').then(($body) => {
      if ($body.find(selector).length > 0) {
        cy.log(`✅ Elemento encontrado: ${selector}`);
        return cy.get(selector);
      } else if (tentativas < maxRetries) {
        tentativas++;
        cy.log(`⏳ Tentativa ${tentativas}/${maxRetries} - Aguardando elemento: ${selector}`);
        cy.wait(delay);
        return verificar();
      } else {
        cy.log(`❌ Elemento não encontrado após ${maxRetries} tentativas: ${selector}`);
        throw new Error(`Elemento não encontrado: ${selector}`);
      }
    });
  };
  
  return verificar();
}

/**
 * Limpa campo de input de forma robusta
 * @param {string} selector - Seletor do campo
 * @returns {Cypress.Chainable} Chainable do Cypress
 */
export function limparCampo(selector) {
  return cy.get(selector)
    .focus()
    .clear()
    .type('{selectall}')
    .type('{del}')
    .should('have.value', '');
}

/**
 * Preenche campo com validação
 * @param {string} selector - Seletor do campo
 * @param {string} valor - Valor a ser preenchido
 * @param {number} delay - Delay entre caracteres
 * @returns {Cypress.Chainable} Chainable do Cypress
 */
export function preencherCampoComValidacao(selector, valor, delay = 100) {
  return cy.get(selector)
    .focus()
    .clear()
    .type(valor, { delay })
    .should('have.value', valor)
    .trigger('input')
    .trigger('change')
    .blur();
}

/**
 * Verifica se está na URL esperada
 * @param {string} expectedPath - Caminho esperado na URL
 * @param {number} timeout - Timeout em ms
 * @returns {Cypress.Chainable} Chainable do Cypress
 */
export function verificarURL(expectedPath, timeout = 10000) {
  return cy.url({ timeout }).should('include', expectedPath);
}

/**
 * Tira screenshot com nome descritivo
 * @param {string} testName - Nome do teste
 * @param {string} step - Passo do teste
 */
export function tirarScreenshot(testName, step) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `${testName}_${step}_${timestamp}`;
  cy.screenshot(fileName);
  cy.log(`📸 Screenshot salvo: ${fileName}`);
}

/**
 * Intercepta e mocka chamada de API
 * @param {string} method - Método HTTP
 * @param {string} url - URL da API
 * @param {object} response - Resposta mockada
 * @param {string} alias - Alias para a interceptação
 */
export function mockAPI(method, url, response, alias) {
  cy.intercept(method, url, {
    statusCode: 200,
    body: response
  }).as(alias);
  cy.log(`🔧 API mockada: ${method} ${url} (${alias})`);
}

/**
 * Aguarda múltiplas interceptações
 * @param {string[]} aliases - Array de aliases
 */
export function aguardarAPIs(aliases) {
  aliases.forEach(alias => {
    cy.wait(`@${alias}`);
    cy.log(`✅ API respondida: @${alias}`);
  });
}

/**
 * Verifica se elemento está visível e habilitado
 * @param {string} selector - Seletor do elemento
 * @returns {Cypress.Chainable} Chainable do Cypress
 */
export function verificarElementoInterativo(selector) {
  return cy.get(selector)
    .should('be.visible')
    .should('not.be.disabled')
    .should('exist');
}

/**
 * Rola até elemento de forma suave
 * @param {string} selector - Seletor do elemento
 * @returns {Cypress.Chainable} Chainable do Cypress
 */
export function rolarParaElemento(selector) {
  return cy.get(selector)
    .scrollIntoView({ duration: 500, easing: 'ease-in-out' })
    .should('be.visible');
}

/**
 * Formata dados para log
 * @param {object} dados - Dados a serem formatados
 * @returns {string} String formatada
 */
export function formatarDadosLog(dados) {
  return JSON.stringify(dados, null, 2);
}

/**
 * Valida estrutura de resposta da API
 * @param {object} response - Resposta da API
 * @param {string[]} camposObrigatorios - Campos que devem existir
 * @returns {boolean} Se a estrutura é válida
 */
export function validarEstruturaResposta(response, camposObrigatorios) {
  const valido = camposObrigatorios.every(campo => 
    response.hasOwnProperty(campo)
  );
  
  if (valido) {
    cy.log('✅ Estrutura da resposta válida');
  } else {
    cy.log('❌ Estrutura da resposta inválida');
    cy.log(`Campos obrigatórios: ${camposObrigatorios.join(', ')}`);
    cy.log(`Campos recebidos: ${Object.keys(response).join(', ')}`);
  }
  
  return valido;
}

/**
 * Gera string aleatória
 * @param {number} length - Tamanho da string
 * @returns {string} String aleatória
 */
export function gerarStringAleatoria(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Converte timestamp para data legível
 * @param {number} timestamp - Timestamp em ms
 * @returns {string} Data formatada
 */
export function formatarData(timestamp) {
  const data = new Date(timestamp);
  return data.toLocaleString('pt-BR');
}

/**
 * Aguarda condição com timeout customizado
 * @param {function} condicao - Função que retorna booleano
 * @param {number} timeout - Timeout em ms
 * @param {number} intervalo - Intervalo de verificação em ms
 * @returns {Promise} Promise que resolve quando condição é atendida
 */
export function aguardarCondicao(condicao, timeout = 10000, intervalo = 500) {
  const inicio = Date.now();
  
  const verificar = () => {
    if (condicao()) {
      cy.log('✅ Condição atendida');
      return true;
    } else if (Date.now() - inicio < timeout) {
      cy.wait(intervalo);
      return verificar();
    } else {
      cy.log('❌ Timeout aguardando condição');
      throw new Error('Timeout aguardando condição');
    }
  };
  
  return verificar();
}

/**
 * Sanitiza string para uso em seletores
 * @param {string} str - String a ser sanitizada
 * @returns {string} String sanitizada
 */
export function sanitizarParaSeletor(str) {
  return str.replace(/[^a-zA-Z0-9-_]/g, '');
}

/**
 * Verifica se teste está rodando em modo headless
 * @returns {boolean} True se headless
 */
export function isHeadless() {
  return Cypress.browser.isHeadless;
}

/**
 * Log colorido para melhor visualização
 * @param {string} tipo - Tipo de log (info, success, warning, error)
 * @param {string} mensagem - Mensagem a ser logada
 */
export function logColorido(tipo, mensagem) {
  const emojis = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    debug: '🔍',
    robot: '🤖',
    rocket: '🚀',
    clean: '🧹'
  };
  
  const emoji = emojis[tipo] || '📝';
  cy.log(`${emoji} ${mensagem}`);
}

// Exportar todas as funções como objeto também
export default {
  gerarNomeUnico,
  gerarDadosAgente,
  validarMensagemSucesso,
  aguardarElementoComRetry,
  limparCampo,
  preencherCampoComValidacao,
  verificarURL,
  tirarScreenshot,
  mockAPI,
  aguardarAPIs,
  verificarElementoInterativo,
  rolarParaElemento,
  formatarDadosLog,
  validarEstruturaResposta,
  gerarStringAleatoria,
  formatarData,
  aguardarCondicao,
  sanitizarParaSeletor,
  isHeadless,
  logColorido
};

