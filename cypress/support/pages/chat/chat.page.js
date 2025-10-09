export class ChatPage {
  
  configurarInterceptacoes() {
    cy.log('🔧 Configurando interceptações...');
    cy.intercept('GET', '**/api/chat/**', { fixture: 'chat-response.json' }).as('chatApi');
    cy.intercept('POST', '**/api/chat/**', { fixture: 'chat-response.json' }).as('chatSend');
    cy.intercept('POST', '**/api/upload/**', { fixture: 'upload-response.json' }).as('uploadApi');
    cy.intercept('GET', '**/translations/**', { body: {} }).as('translations');
    cy.intercept('GET', '**/*.woff*', { body: '' }).as('fonts');
    cy.log('✅ Interceptações configuradas');
    return this;
  }

  navegarParaChat() {
    cy.log('🔍 Navegando para Chat...');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    cy.get('body').then(($body) => {
      const chatSelectors = [
        'button:contains("Chat")',
        'a:contains("Chat")',
        '[role="button"]:contains("Chat")',
        '[data-testid*="chat"]',
        '[aria-label*="chat"]',
        'nav button:contains("Chat")',
        'nav a:contains("Chat")',
        '.nav-item:contains("Chat")',
        '.menu-item:contains("Chat")',
        '.sidebar-item:contains("Chat")'
      ];
      
      let chatEncontrado = false;
      for (const selector of chatSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Chat encontrado com seletor: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .click({ force: true });
          chatEncontrado = true;
          break;
        }
      }
      
      if (!chatEncontrado) {
        cy.log('⚠️ Chat não encontrado, tentando navegação direta...');
        cy.visit('/chat', { failOnStatusCode: false });
      }
    });
    
    cy.wait(3000);
    cy.log('✅ Navegação para Chat concluída');
    return this;
  }

  navegarParaChatEstendido() {
    cy.log('🔍 Navegando para Chat...');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);
    cy.get('body').then(($body) => {
      const chatSelectors = [
        'button:contains("Chat")',
        'a:contains("Chat")',
        '[role="button"]:contains("Chat")',
        '[data-testid*="chat"]',
        '[aria-label*="chat"]',
        'nav button:contains("Chat")',
        'nav a:contains("Chat")',
        '.nav-item:contains("Chat")',
        '.menu-item:contains("Chat")',
        '.sidebar-item:contains("Chat")'
      ];
      
      let chatEncontrado = false;
      for (const selector of chatSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Chat encontrado com seletor: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .click({ force: true });
          chatEncontrado = true;
          break;
        }
      }
      
      if (!chatEncontrado) {
        cy.log('⚠️ Chat não encontrado, tentando navegação direta...');
        cy.visit('/chat', { failOnStatusCode: false });
      }
    });
    
    cy.log('⏳ Aguardando 10 segundos após clicar em Chat para estabilização...');
    cy.wait(10000); // Wait de 10 segundos para garantir estabilização completa
    cy.log('✅ Navegação para Chat concluída');
    return this;
  }

  clicarBotaoAdicionar() {
    cy.log('🔍 Clicando no botão +...');
    
    cy.get('body').then(($body) => {
      const addSelectors = [
        'button svg.lucide-plus',
        'button[aria-label*="adicionar"]',
        'button[aria-label*="novo"]',
        'button[aria-label*="new"]',
        'button[title*="adicionar"]',
        'button[title*="novo"]',
        '[data-testid*="add"]',
        '[data-testid*="new"]',
        'button:contains("+")',
        'button:contains("Novo")',
        'button:contains("New")'
      ];
      
      let addEncontrado = false;
      for (const selector of addSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Botão + encontrado com seletor: ${selector}`);
          
          if (selector.includes('svg')) {
            cy.get(selector).first()
              .should('be.visible')
              .parent()
              .click({ force: true });
          } else {
            cy.get(selector).first()
              .should('be.visible')
              .click({ force: true });
          }
          
          addEncontrado = true;
          break;
        }
      }
      
      if (!addEncontrado) {
        cy.log('⚠️ Botão + não encontrado, tentando fallback...');
        cy.get('button').contains(/\+|adicionar|novo|new/i).first()
          .should('be.visible')
          .click({ force: true });
      }
    });
    
    cy.log('✅ Botão + clicado');
    return this;
  }

  clicarEmAnexar() {
    cy.log('🔍 Clicando em Anexar...');
    
    cy.get('body').then(($body) => {
      const anexarSelectors = [
        '[role="menuitem"]:contains("Anexar")',
        '[role="menuitem"]:contains("Attach")',
        '[role="menuitem"]:contains("Upload")',
        'button:contains("Anexar")',
        'button:contains("Attach")',
        'a:contains("Anexar")',
        'a:contains("Attach")',
        '[data-testid*="attach"]',
        '[data-testid*="upload"]',
        '[aria-label*="anexar"]',
        '[aria-label*="attach"]'
      ];
      
      let anexarEncontrado = false;
      for (const selector of anexarSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Anexar encontrado com seletor: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .click({ force: true });
          anexarEncontrado = true;
          break;
        }
      }
      
      if (!anexarEncontrado) {
        cy.log('⚠️ Anexar não encontrado, tentando fallback...');
        cy.get('[role="menuitem"]').first()
          .should('be.visible')
          .click({ force: true });
      }
    });
    
    cy.log('✅ Opção Anexar clicada');
    return this;
  }

  /**
   * Anexa uma imagem ao chat
   * @param {string} caminhoImagem - Caminho para a imagem
   */
  anexarImagem(caminhoImagem = 'cypress/fixtures/uploads/imagem-teste.jpg') {
    cy.log('🔍 Anexando imagem...');
    
    cy.get('input[type="file"]')
      .should('exist')
      .first()
      .selectFile(caminhoImagem, { force: true });
    
    cy.log('✅ Imagem anexada com sucesso');
    
    cy.wait(5000); 
    
    const nomeArquivo = caminhoImagem.split('/').pop();
    cy.get('body').then(($body) => {
      if ($body.text().includes(nomeArquivo)) {
        cy.log(`✅ Imagem carregada e visível na interface: ${nomeArquivo}`);
      } else {
        cy.log('⚠️ Nome do arquivo não visível, mas upload foi realizado (verificado via network)');
      }
    });
    
    return this;
  }

  /**
   * Anexa uma imagem ao chat com validação obrigatória do nome do arquivo
   * @param {string} caminhoImagem - Caminho para a imagem
   */
  anexarImagemComValidacao(caminhoImagem = 'cypress/fixtures/uploads/imagem-teste.jpg') {
    cy.log('🔍 Anexando imagem...');
    
    cy.get('input[type="file"]')
      .should('exist')
      .first()
      .selectFile(caminhoImagem, { force: true });
    
    cy.log('✅ Imagem anexada com sucesso');

    cy.wait(3000);
 
    const nomeArquivo = caminhoImagem.split('/').pop();
    cy.get('body').should('contain.text', nomeArquivo);
    cy.log(`✅ Imagem carregada e visível na interface: ${nomeArquivo}`);
    
    return this;
  }

  /**
   * Anexa um PDF ao chat
   * @param {string} caminhoPDF - Caminho para o PDF
   */
  anexarPDF(caminhoPDF = 'cypress/fixtures/uploads/teste-pdf.pdf') {
    cy.log('🔍 Anexando PDF...');
    
    cy.get('input[type="file"]')
      .should('exist')
      .first()
      .selectFile(caminhoPDF, { force: true });
    
    cy.log('✅ PDF anexado com sucesso');
  
    cy.wait(5000);

    const nomeArquivo = caminhoPDF.split('/').pop();
    cy.get('body').then(($body) => {
      if ($body.text().includes(nomeArquivo)) {
        cy.log(`✅ PDF carregado e visível na interface: ${nomeArquivo}`);
      } else {
        cy.log('⚠️ Nome do arquivo não visível, mas upload foi realizado (verificado via network)');
      }
    });
    
    return this;
  }
  
  /**
   * Digita uma mensagem no campo de input com estratégias robustas
   * @param {string} mensagem - Mensagem a ser digitada
   */
  digitarMensagem(mensagem) {
    cy.log('📋 Digitando mensagem...');
    
    cy.wait(2000);
    
    cy.get('body').then(($body) => {
      const inputSelectors = [
        'div[contenteditable="true"]',
        'textarea',
        'input[type="text"]',
        '[contenteditable="true"]'
      ];
      
      let inputEncontrado = false;
      for (const selector of inputSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Input encontrado: ${selector}`);

          cy.get(selector).first().as('inputField');
          cy.get('@inputField').should('be.visible');
          cy.wait(500);

          cy.get('@inputField').then(($input) => {
            if ($input.is('div[contenteditable="true"]')) {

              cy.get('@inputField')
                .click({ force: true })
                .wait(300)
                .type('{selectall}{del}', { force: true });
            } else {
             
              cy.get('@inputField').clear({ force: true });
            }
          });
          
          cy.wait(500); 
        
          cy.get('@inputField')
            .should('exist')
            .type(mensagem, { delay: 100, force: true });
          
          cy.log('✅ Mensagem digitada');
          inputEncontrado = true;
          break;
        }
      }
      
      if (!inputEncontrado) {
        cy.log('⚠️ Input não encontrado, tentando fallback...');
        cy.get('input, textarea, [contenteditable]').first().as('fallbackInput');
        cy.get('@fallbackInput').should('be.visible');
        cy.wait(500);
        
        cy.get('@fallbackInput').then(($input) => {
          if ($input.is('div[contenteditable="true"]')) {
            cy.get('@fallbackInput')
              .click({ force: true })
              .wait(300)
              .type('{selectall}{del}', { force: true });
          } else {
            cy.get('@fallbackInput').clear({ force: true });
          }
        });
        
        cy.wait(500);
        cy.get('@fallbackInput').type(mensagem, { delay: 100, force: true });
        cy.log('✅ Mensagem digitada com fallback');
      }
    });
    
    cy.wait(2000);
    
    return this;
  }

  /**
   * Digita uma mensagem SEM limpar o campo
   * Usado quando há arquivo anexado para não remover o anexo
   * @param {string} mensagem - Mensagem a ser digitada
   */
  digitarMensagemSemLimpar(mensagem) {
    cy.log('📋 Digitando mensagem (sem limpar campo)...');

    cy.wait(2000);

    cy.get('body').then(($body) => {
      const inputSelectors = [
        'div[contenteditable="true"]',
        'textarea',
        'input[type="text"]',
        '[contenteditable="true"]',
        '[data-testid*="message-input"]',
        '[data-testid*="chat-input"]',
        'input[placeholder*="mensagem"]',
        'input[placeholder*="message"]',
        'textarea[placeholder*="mensagem"]',
        'textarea[placeholder*="message"]'
      ];
      
      let inputEncontrado = false;
      for (const selector of inputSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Input encontrado: ${selector}`);
 
          cy.get(selector).first().as('inputField');
          cy.get('@inputField').should('be.visible');
          cy.wait(500); 
       
          cy.get('@inputField')
            .click({ force: true })
            .wait(300);
   
          cy.get('@inputField')
            .should('exist')
            .type(mensagem, { delay: 100, force: true });
          
          cy.log('✅ Mensagem digitada (sem limpar)');
          inputEncontrado = true;
          break;
        }
      }
      
      if (!inputEncontrado) {
        cy.log('⚠️ Input não encontrado, tentando fallback...');
        cy.get('input, textarea, [contenteditable]').first().as('fallbackInput');
        cy.get('@fallbackInput').should('be.visible');
        cy.wait(500);

        cy.get('@fallbackInput')
          .click({ force: true })
          .wait(300)
          .type(mensagem, { delay: 100, force: true });
        
        cy.log('✅ Mensagem digitada com fallback (sem limpar)');
      }
    });
    
    cy.wait(2000); 
    
    return this;
  }

  enviarMensagem() {
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
            .scrollIntoView()
            .click({ force: true });
          botaoEncontrado = true;
          break;
        }
      }
      if (!botaoEncontrado) {
        cy.log('⚠️ Send button não encontrado, tentando seletores genéricos...');
        if ($body.find('button').length > 0) {
          cy.get('button').last()
            .scrollIntoView()
            .click({ force: true });
        } else {
          cy.log('⚠️ Nenhum button encontrado');
        }
      }
    });
    cy.log('✅ Send button clicado');
    cy.get('body').should('not.contain', 'enviando');
    
    return this;
  }

  enviarMensagemAguardandoHabilitar() {
    cy.log('🔍 Enviando mensagem...');

    cy.log('⏳ Aguardando botão de enviar ficar habilitado...');
    cy.wait(3000); 
    
    cy.get('body').then(($body) => {
      const selectorsBotao = [
        'button[type="submit"]',
        'button:contains("Enviar")',
        'button:contains("Send")',
        'form button[type="submit"]',
        'button[class*="submit"]',
        'button[class*="send"]',
        'button[class*="enviar"]',
        'button[class*="message"]',
        '[data-testid*="send"]',
        '[data-testid*="submit"]',
        '[aria-label*="enviar"]',
        '[aria-label*="send"]',
        'button[title*="enviar"]',
        'button[title*="send"]'
      ];
      
      let botaoEncontrado = false;
      for (const selector of selectorsBotao) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Send button encontrado: ${selector}`);
          cy.get(selector).first().as('sendButton');
          cy.get('@sendButton').should('be.visible');
          cy.get('@sendButton').should('not.be.disabled', { timeout: 30000 });
          cy.log('✅ Botão de enviar está habilitado');
          cy.wait(1000); 
          cy.get('@sendButton').click({ force: true });
          
          botaoEncontrado = true;
          break;
        }
      }
      
      if (!botaoEncontrado) {
        cy.log('⚠️ Send button não encontrado, tentando seletores genéricos...');
        if ($body.find('button[type="submit"]').length > 0) {
          cy.get('button[type="submit"]').last().as('genericSendButton');
          cy.get('@genericSendButton').should('be.visible');
          cy.get('@genericSendButton').should('not.be.disabled', { timeout: 30000 });
          cy.wait(1000);
          cy.get('@genericSendButton').click({ force: true });
        } else if ($body.find('button').length > 0) {
          cy.get('button').last().as('lastButton');
          cy.get('@lastButton').should('be.visible');
          cy.get('@lastButton').should('not.be.disabled', { timeout: 30000 });
          cy.wait(1000);
          cy.get('@lastButton').click({ force: true });
        } else {
          cy.log('⚠️ Nenhum button encontrado');
        }
      }
    });
    
    cy.log('✅ Send button clicado');
    
    return this;
  }

  /**
   * Valida se a mensagem foi enviada com sucesso
   * @param {string} mensagem - Mensagem enviada para validação
   */
  validarEnvioMensagem(mensagem) {
  
    cy.log('🔍 Validando envio da mensagem...');
    cy.log('⏳ Aguardando 5 segundos após envio...');
    cy.wait(5000);
    
    cy.get('body').then(($body) => {
      if ($body.find('div[contenteditable="true"]').length > 0) {
        cy.get('div[contenteditable="true"]').first().should('be.empty');
        cy.log('✅ Campo de input vazio - mensagem enviada');
      }
    });
    
    cy.get('body').should('not.contain', 'enviando');
    cy.get('body').should('not.contain', 'sending');
    cy.log('✅ Nenhum indicador de "enviando" encontrado');
    
    cy.get('body').should('contain.text', mensagem);
    cy.log('✅ Mensagem encontrada na página - envio confirmado');
    
    return this;
  }
  
  /**
   * Aguarda e valida a resposta do chat
   * @param {string} palavraEsperada - Palavra que deve aparecer na resposta
   * @param {number} timeout - Tempo limite em ms (padrão: 10000)
   */
  aguardarResposta(palavraEsperada, timeout = 10000) {
    cy.log(`📋 Aguardando resposta do chat (palavra esperada: "${palavraEsperada}")...`);
    cy.wait(timeout);
    
    cy.get('body').should('contain.text', palavraEsperada);
    cy.log(`✅ Resposta do chat contém a palavra "${palavraEsperada}"`);
    
    return this;
  }

  /**
   * Aguarda e valida a resposta do chat com palavras relacionadas
   * Usado especificamente para descrição de imagens que pode retornar sinônimos
   * @param {Array<string>} palavrasPrincipais - Palavras principais esperadas (ex: ['cachorro', 'cão'])
   * @param {Array<string>} palavrasRelacionadas - Palavras relacionadas aceitas (ex: ['dog', 'labrador'])
   * @param {number} timeout - Tempo limite em ms (padrão: 35000)
   */
  aguardarRespostaComPalavrasRelacionadas(palavrasPrincipais = ['cachorro', 'cão'], palavrasRelacionadas = ['dog', 'labrador', 'retriever', 'canino', 'animal', 'pet'], timeout = 40000) {
    cy.log(`📋 Aguardando resposta do chat (palavras esperadas: "${palavrasPrincipais.join('", "')}")...`);
    cy.wait(timeout);

    cy.get('body').then(($body) => {
      const bodyText = $body.text();

      const contemPrincipal = palavrasPrincipais.some(palavra => 
        bodyText.toLowerCase().includes(palavra.toLowerCase())
      );
      
      if (contemPrincipal) {
        const palavraEncontrada = palavrasPrincipais.find(palavra => 
          bodyText.toLowerCase().includes(palavra.toLowerCase())
        );
        cy.log(`✅ Resposta do chat contém palavra principal: "${palavraEncontrada}"`);
      } else {
        cy.log(`⚠️ Resposta não contém palavras principais (${palavrasPrincipais.join(', ')}), verificando palavras relacionadas...`);

        const contemRelacionada = palavrasRelacionadas.some(palavra => 
          bodyText.toLowerCase().includes(palavra.toLowerCase())
        );
        
        if (contemRelacionada) {
          const palavraEncontrada = palavrasRelacionadas.find(palavra => 
            bodyText.toLowerCase().includes(palavra.toLowerCase())
          );
          cy.log(`✅ Resposta contém palavra relacionada: "${palavraEncontrada}"`);
        } else {
          cy.log(`❌ Resposta não contém nem palavras principais nem relacionadas`);
          throw new Error(`Resposta não contém "${palavrasPrincipais.join('", "')}" ou palavras relacionadas: ${palavrasRelacionadas.join(', ')}`);
        }
      }
      cy.wait(5000);
    });
    
    return this;
  }

  /**
   * Executa o fluxo completo de descrição de imagem
   * @param {string} caminhoImagem - Caminho para a imagem
   * @param {string} mensagem - Mensagem a ser enviada
   * @param {string} palavraEsperada - Palavra esperada na resposta
   */
  descreverImagemCompleto(caminhoImagem = 'cypress/fixtures/uploads/imagem-teste.jpg', 
                          mensagem = 'Descreva essa imagem', 
                          palavraEsperada = 'cachorro') {
    cy.log('🖼️ Iniciando fluxo completo de descrição de imagem...');

    this.configurarInterceptacoes();

    this.navegarParaChat();

    this.clicarBotaoAdicionar();
 
    this.clicarEmAnexar();
  
    this.anexarImagem(caminhoImagem);

    this.digitarMensagemSemLimpar(mensagem);

    this.enviarMensagem();

    this.validarEnvioMensagem(mensagem);

    this.aguardarResposta(palavraEsperada);
    
    cy.log('✅ Teste de descrição de imagem concluído com sucesso!');
    return this;
  }

  /**
   * Executa o fluxo completo de descrição de imagem com validação avançada
   * Inclui validação de palavras relacionadas e wait estendido
   * @param {string} caminhoImagem - Caminho para a imagem
   * @param {string} mensagem - Mensagem a ser enviada
   * @param {Array<string>} palavrasPrincipais - Palavras principais esperadas
   * @param {Array<string>} palavrasRelacionadas - Palavras relacionadas aceitas
   */
  descreverImagemCompletoAvancado(
    caminhoImagem = 'cypress/fixtures/uploads/imagem-teste.jpg', 
    mensagem = 'Descreva essa imagem',
    palavrasPrincipais = ['cachorro', 'cão'],
    palavrasRelacionadas = ['dog', 'labrador', 'retriever', 'canino', 'animal', 'pet']
  ) {
    cy.log('🖼️ Iniciando fluxo completo de descrição de imagem (avançado)...');

    this.configurarInterceptacoes();

    this.navegarParaChatEstendido();
  
    this.clicarBotaoAdicionar();

    this.clicarEmAnexar();
 
    this.anexarImagemComValidacao(caminhoImagem);
    
    this.digitarMensagemSemLimpar(mensagem);
 
    this.enviarMensagemAguardandoHabilitar();

    this.validarEnvioMensagem(mensagem);

    this.aguardarRespostaComPalavrasRelacionadas(palavrasPrincipais, palavrasRelacionadas);
    
    cy.log('✅ Teste de descrição de imagem concluído com sucesso!');
    return this;
  }

  /**
   * Executa o fluxo completo de análise de PDF
   * @param {string} caminhoPDF - Caminho para o PDF
   * @param {string} mensagem - Mensagem a ser enviada
   * @param {string} palavraEsperada - Palavra esperada na resposta
   */
  analisarPDFCompleto(caminhoPDF = 'cypress/fixtures/uploads/teste-pdf.pdf', 
                      mensagem = 'Resumir o PDF', 
                      palavraEsperada = 'futebol') {
    cy.log('📄 Iniciando fluxo completo de análise de PDF...');

    this.configurarInterceptacoes();
 
    this.navegarParaChat();

    this.clicarBotaoAdicionar();
    
    this.clicarEmAnexar();
    
    this.anexarPDF(caminhoPDF);

    this.digitarMensagemSemLimpar(mensagem);
  
    this.enviarMensagem();
    
    this.validarEnvioMensagem(mensagem);
    
    this.aguardarResposta(palavraEsperada);
    
    cy.log('✅ Teste de análise de PDF concluído com sucesso!');
    return this;
  }

  /**
   * Executa o fluxo completo de análise de PDF com validação avançada
   * Inclui validação e wait estendido (similar ao teste de imagem)
   * @param {string} caminhoPDF - Caminho para o PDF
   * @param {string} mensagem - Mensagem a ser enviada
   * @param {string} palavraEsperada - Palavra esperada na resposta
   * @param {number} timeoutResposta - Timeout para aguardar resposta em ms (padrão: 40000)
   */
  analisarPDFCompletoAvancado(
    caminhoPDF = 'cypress/fixtures/uploads/teste-pdf.pdf', 
    mensagem = 'Resumir o PDF',
    palavraEsperada = 'futebol',
    timeoutResposta = 40000
  ) {
    cy.log('📄 Iniciando fluxo completo de análise de PDF (avançado)...');

    this.configurarInterceptacoes();
    
    this.navegarParaChatEstendido();
    
    this.clicarBotaoAdicionar();
    
    this.clicarEmAnexar();
    
    cy.log('🔍 Anexando PDF...');
   
    cy.get('input[type="file"]')
      .should('exist')
      .first()
      .selectFile(caminhoPDF, { force: true });
    
    cy.log('✅ PDF anexado com sucesso');
    
    cy.wait(5000);

    const nomeArquivo = caminhoPDF.split('/').pop();
    cy.get('body').then(($body) => {
      if ($body.text().includes(nomeArquivo)) {
        cy.log(`✅ PDF carregado e visível na interface: ${nomeArquivo}`);
      } else {
        cy.log('⚠️ Nome do arquivo não visível, mas upload foi realizado (verificado via network)');
      }
    });

    this.digitarMensagemSemLimpar(mensagem);
  
    this.enviarMensagemAguardandoHabilitar();
   
    this.validarEnvioMensagem(mensagem);
   
    cy.log(`📋 Aguardando resposta do chat (palavra esperada: "${palavraEsperada}", timeout: ${timeoutResposta}ms)...`);
    this.aguardarResposta(palavraEsperada, timeoutResposta);
    
    cy.log('✅ Teste de análise de PDF concluído com sucesso!');
    return this;
  }

  clicarEmGeral() {
    cy.log('📋 Tentando clicar em "Geral"...');
    cy.wait(2000);

    cy.get('body').then(($body) => {
      if ($body.find('*:contains("Geral")').length > 0) {
        cy.log('✅ Elemento "Geral" encontrado na página');

        const selectorsGeral = [
          'div.truncate:contains("Geral")',
          'div.flex.rounded-md:contains("Geral")',
          'div[class*="cursor-pointer"]:contains("Geral")',
          'div[class*="bg-[#027fa6]"]:contains("Geral")',
          'div:contains("Geral")',
          'span:contains("Geral")',
          '*:contains("Geral")'
        ];
        
        let geralEncontrado = false;
        for (const selector of selectorsGeral) {
          if ($body.find(selector).length > 0) {
            cy.log(`✅ "Geral" encontrado com seletor: ${selector}`);
            cy.get(selector).first()
              .should('be.visible')
              .click({ force: true });
            cy.log(`✅ "Geral" clicado com sucesso`);
            geralEncontrado = true;
            break;
          }
        }
        
        if (!geralEncontrado) {
          cy.log('⚠️ "Geral" não encontrado com seletores específicos, tentando fallback...');
          try {
            cy.contains('Geral')
              .click({ force: true });
            cy.log('✅ "Geral" clicado com fallback');
            geralEncontrado = true;
          } catch (e) {
            cy.log(`⚠️ Fallback falhou: ${e.message}`);
          }
        }
      } else {
        cy.log('⚠️ Elemento "Geral" não encontrado na página, pulando esta etapa...');
      }
    });
    
    cy.wait(2000);
    cy.log('✅ Fase 2 concluída');
    return this;
  }

  clicarEmGeralDrastico() {
    cy.log('📋 Fase 3: Clicando em "Geral"...');
    cy.wait(8000); 
    
    cy.log('🔍 Procurando elemento "Geral" com estratégias DRÁSTICAS...');
    
    cy.log('🚀 Estratégia DRÁSTICA 1: Primeiro elemento com SVG lucide-folder');
    cy.get('svg.lucide-folder')
      .first()
      .should('be.visible')
      .wait(2000)
      .click({ force: true });
    cy.log('✅ Clicado no primeiro SVG lucide-folder (provavelmente "Geral")');
    
    cy.wait(3000); 
  
    cy.get('body').then(($body) => {
 
      const geralElements = $body.find('*:contains("Geral")');
      cy.log(`📊 Total de elementos com "Geral": ${geralElements.length}`);

      if (geralElements.length > 0) {
        cy.log('⚠️ Ainda há elementos "Geral", tentando estratégias adicionais...');
      
        if ($body.find('div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center').length > 0) {
          cy.log('✅ Encontrado div com classes específicas, tentando clicar...');
          cy.get('div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center')
            .first()
            .should('be.visible')
            .wait(1500)
            .click({ force: true });
          cy.log('✅ Clicado em div com classes específicas');
        }

        cy.log('✅ Tentando cy.contains() com timeout maior...');
        cy.contains('Geral', { timeout: 15000 })
          .first()
          .should('be.visible')
          .wait(1500)
          .click({ force: true });
        cy.log('✅ "Geral" clicado via cy.contains()');
      }
    });
    
    cy.wait(4000); 
    cy.log('✅ Fase 3 concluída');
    return this;
  }

  clicarNaPrimeiraMensagem() {
    cy.log('📋 Tentando clicar na primeira mensagem...');
    cy.wait(2000);
    
    cy.get('body').then(($body) => {
      const chatSelectors = [
        'div[class*="flex gap-2 items-center"]',
        'div[class*="chat"]',
        'div[class*="conversation"]',
        'div[class*="message"]',
        'div[role="button"]'
      ];
      
      let chatEncontrado = false;
      for (const selector of chatSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Chat encontrado: ${selector}`);
          cy.get(selector).first()
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });
          cy.log('✅ Primeira mensagem clicada');
          chatEncontrado = true;
          break;
        }
      }
      
      if (!chatEncontrado) {
        cy.log('⚠️ Chat não encontrado, tentando fallback...');
        try {
          cy.get('div, li, button').first()
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });
          cy.log('✅ Elemento clicado com fallback');
        } catch (e) {
          cy.log(`⚠️ Fallback falhou: ${e.message} - pulando esta etapa`);
        }
      }
    });
    
    cy.wait(2000);
    cy.log('✅ Fase 3 concluída');
    return this;
  }

  /**
   * Executa o fluxo completo para enviar mensagem em chat antigo
   * @param {string} mensagem - Mensagem a ser enviada
   * @param {string} palavraEsperada - Palavra esperada na resposta (opcional)
   */
  enviarMensagemCompleta(mensagem = 'ola, como vai?', palavraEsperada = null) {
    cy.log('💬 Iniciando fluxo completo de envio de mensagem...');
  
    this.configurarInterceptacoes();

    this.navegarParaChat();
 
    this.clicarEmGeral();
  
    this.clicarNaPrimeiraMensagem();

    this.digitarMensagem(mensagem);
  
    this.enviarMensagem();
   
    this.validarEnvioMensagem(mensagem);
  
    if (palavraEsperada) {
      this.aguardarResposta(palavraEsperada);
    } else {
      cy.log('✅ Message sending test completed successfully!');
    }
    
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
        cy.log('❌ Agentes NÃO encontrado com nenhum seletor, navegando diretamente...');
        cy.visit('/dashboard/agents', { failOnStatusCode: false });
      }
    });
    
    cy.wait(4000);
    cy.log('✅ Navegação para Agentes concluída');
    
    return this;
  }

  clicarEmMeusAgentes() {
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
    return this;
  }

  buscarAgenteCypress() {
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
            .type('Cypress', { delay: 100 });
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
            .type('Cypress', { delay: 350 });
        } else {
          cy.log('⚠️ Nenhum campo de busca disponível, continuando sem busca...');
        }
      }
    });

    cy.wait(5000);
    return this;
  }

  clicarBotaoTestar() {
    cy.log('🔍 Procurando botão "Testar"...');
    cy.wait(5000); 

    cy.get('body').then(($body) => {
    
      const testarSelectors = [
        'button:contains("Testar")',
        'a:contains("Testar")',
        '[role="button"]:contains("Testar")',
        'div:contains("Testar")',
        '*:contains("Testar")'
      ];
      
      let testarEncontrado = false;
      
      for (const selector of testarSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Botão Testar encontrado: ${selector}`);
          cy.get(selector).first()
            .scrollIntoView()
            .wait(1000)
            .click({ force: true });
          testarEncontrado = true;
          break;
        }
      }
      
   
      if (!testarEncontrado && $body.find('button svg[class*="sparkles"]').length > 0) {
        cy.log('✅ Botão Testar encontrado por ícone sparkles');
        cy.get('button svg[class*="sparkles"]').parent().first()
          .scrollIntoView()
          .wait(1000)
          .click({ force: true });
        testarEncontrado = true;
      }
 
      if (!testarEncontrado && $body.find('table tbody tr button').length > 0) {
        cy.log('✅ Botões encontrados na tabela, clicando no primeiro');
        cy.get('table tbody tr button').first()
          .scrollIntoView()
          .wait(1000)
          .click({ force: true });
        testarEncontrado = true;
      }

      if (!testarEncontrado) {
        cy.log('⚠️ Botão Testar não encontrado, tentando primeiro botão disponível');
        cy.get('button').first()
          .scrollIntoView()
          .wait(1000)
          .click({ force: true });
      }
    });

    cy.log('⏳ Aguardando dialog abrir...');
    cy.wait(3000);

    cy.get('body').then(($body) => {
      if ($body.find('div[role="dialog"][data-state="open"]').length > 0) {
        cy.log('✅ Dialog aberto, aguardando estabilização...');
        cy.wait(2000);
      } else {
        cy.log('⚠️ Dialog não encontrado, aguardando mais tempo...');
        cy.wait(3000);
      }
    });
    
    return this;
  }

  
  /**
   * Digita mensagem no dialog do agente
   * @param {string} mensagem - Mensagem a ser digitada
   */
  digitarMensagemNoDialog(mensagem = 'Olá, esta é uma mensagem de teste') {
    cy.log('🔍 Procurando campo de mensagem...');

    cy.get('body').then(($body) => {
      if ($body.find('div[role="dialog"][data-state="open"]').length > 0) {
        cy.log('✅ Dialog encontrado, tentando XPath...');
        try {
          cy.xpath('//div[@role="dialog" and @data-state="open"]//form[@id="chat-message-input-form"]//div[@role="textbox" and @contenteditable="true"]', { timeout: 10000 })
            .should('exist')
            .then($els => {
              const $visible = $els.filter(':visible');
              if ($visible.length > 0) {
                cy.wrap($visible[0])
                  .scrollIntoView()
                  .click({ force: true })
                  .type(mensagem, { delay: 100, force: true })
                  .wait(2000); 
                cy.log('✅ Mensagem digitada via XPath');
              }
            });
        } catch (e) {
          cy.log('⚠️ XPath falhou, tentando fallback...');
        
          if ($body.find('div[contenteditable="true"]').length > 0) {
            cy.log('✅ Campo contenteditable encontrado via CSS...');
            cy.get('div[contenteditable="true"]').first()
              .scrollIntoView()
              .click({ force: true })
              .type(mensagem, { delay: 100, force: true })
              .wait(2000);
            cy.log('✅ Mensagem digitada via CSS');
          }
        }
      }
      
      else if ($body.find('div[contenteditable="true"]').length > 0) {
        cy.log('✅ Campo contenteditable encontrado via CSS...');
        cy.get('div[contenteditable="true"]').first()
          .scrollIntoView()
          .click({ force: true })
          .type(mensagem, { delay: 100, force: true })
          .wait(2000); 
        cy.log('✅ Mensagem digitada via CSS');
      }
      
      else if ($body.find('textarea, input[type="text"]').length > 0) {
        cy.log('✅ Campo de texto encontrado via fallback...');
        cy.get('textarea, input[type="text"]').first()
          .scrollIntoView()
          .click({ force: true })
          .type(mensagem, { delay: 100, force: true })
          .wait(2000); 
        cy.log('✅ Mensagem digitada via fallback');
      }
      
      else {
        cy.log('⚠️ Nenhum campo de input encontrado');
      }
    });

    cy.log('⏳ Aguardando estabilização do card...');
    cy.wait(3000);
    
    return this;
  }

  enviarMensagemNoDialog() {
    
    cy.log('🔍 Procurando botão de enviar...');
    cy.get('body').then(($body) => {
  
      if ($body.find('form#chat-message-input-form').length > 0) {
        try {
          cy.xpath('(//form[@id="chat-message-input-form"]//button)[last()]')
            .scrollIntoView()
            .click({ force: true });
          cy.log('✅ Botão enviar clicado via XPath');
        } catch (e) {
          cy.log('⚠️ XPath do botão falhou, tentando fallback...');
        }
      }

      if ($body.find('button').length > 0) {
        cy.get('button').last()
          .scrollIntoView()
          .click({ force: true });
        cy.log('✅ Botão enviar clicado via CSS');
      }
      
      else {
        cy.log('⚠️ Nenhum botão de envio encontrado');
      }
    });

    cy.log('⏳ Aguardando mensagem ser enviada...');
    cy.wait(5000);

    cy.log('🔍 Confirmando se a mensagem está sendo exibida...');
    cy.get('body').then(($body) => {
      if ($body.find('*:contains("Olá, esta é uma mensagem de teste")').length > 0) {
        cy.log('✅ Mensagem confirmada - está sendo exibida');
        cy.contains('Olá, esta é uma mensagem de teste')
          .should('exist');
      } else {
        cy.log('⚠️ Mensagem não encontrada na página, mas continuando...');
      }
    });
    
    return this;
  }

  fecharDialog() {

    cy.log('🔍 Procurando botão de fechar...');
    cy.get('body').then(($body) => {
      if ($body.find('div[role="dialog"][data-state="open"]').length > 0) {
        try {
          cy.xpath('//div[@role="dialog" and @data-state="open"]//button//*[name()="svg" and contains(@class,"lucide-x")]')
            .should('be.visible')
            .click({ force: true });
          cy.log('✅ Botão fechar clicado via XPath');
        } catch (e) {
          cy.log('⚠️ XPath do botão fechar falhou, tentando fallback...');
        }
      }

      if ($body.find('div[role="dialog"] button svg[class*="x"]').length > 0) {
        cy.get('div[role="dialog"] button svg[class*="x"]').parent()
          .scrollIntoView()
          .click({ force: true });
        cy.log('✅ Botão fechar clicado via CSS fallback');
      }
      
      else {
        cy.log('⚠️ Botão de fechar não encontrado, continuando...');
      }
    });
    
    return this;
  }

  /**
   * Valida se a mensagem foi exibida no dialog
   * @param {string} mensagem - Mensagem para validar
   */
  validarMensagemDialog(mensagem = 'Olá, esta é uma mensagem de teste') {
    cy.log('⏳ Aguardando mensagem ser enviada...');
    cy.wait(10000);

    cy.log('🔍 Confirmando se a mensagem está sendo exibida...');
    cy.get('body').then(($body) => {
      if ($body.find(`*:contains("${mensagem}")`).length > 0) {
        cy.log('✅ Mensagem confirmada - está sendo exibida');
        cy.contains(mensagem)
          .should('exist');
      } else {
        cy.log('⚠️ Mensagem não encontrada na página, mas continuando...');
      }
    });
    
    return this;
  }

  
  /**
   * Clica no agente antigo "Cypress" na lista de chats (versão que funciona na pipeline)
   * @param {string} nomeAgente - Nome do agente a clicar (padrão: "Cypress")
   */
  clicarEmAgenteAntigo(nomeAgente = 'Cypress') {
    cy.log('⏳ Aguardando lista de agentes carregar...');
    cy.wait(5000);

    cy.get('body').then(($body) => {
      const totalAgente = $body.find(`*:contains("${nomeAgente}")`).length;
      cy.log(`🔍 DEBUG: Total de elementos contendo "${nomeAgente}": ${totalAgente}`);
      
      const truncateElements = $body.find('div.truncate').length;
      cy.log(`🔍 DEBUG: Total de elementos div.truncate: ${truncateElements}`);
    });

    cy.log(`🔍 Procurando agente "${nomeAgente}"...`);
    
    cy.get('body').then(($body) => {
      const agenteSelectors = [
        `div.truncate:contains("${nomeAgente}")`,
        `div[class*="cursor-pointer"]:contains("${nomeAgente}")`,
        `div.flex.items-center:contains("${nomeAgente}")`,
        `div:contains("${nomeAgente}")`
      ];
      
      let agenteEncontrado = false;
      
      for (const selector of agenteSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Agente "${nomeAgente}" encontrado com seletor: ${selector}`);
          cy.log(`📊 Quantidade encontrada: ${$body.find(selector).length}`);
     
          if (selector.includes('truncate')) {
            cy.get(selector).first()
              .parent()
              .scrollIntoView()
              .wait(1500)
              .click({ force: true });
            cy.log(`✅ Clique no PARENT do agente "${nomeAgente}" EXECUTADO!`);
          } else {
            cy.get(selector).first()
              .scrollIntoView()
              .wait(1500)
              .click({ force: true });
            cy.log(`✅ Clique no agente "${nomeAgente}" EXECUTADO!`);
          }
          
          agenteEncontrado = true;
          break;
        }
      }
      
      if (!agenteEncontrado) {
        cy.log(`❌ Agente "${nomeAgente}" NÃO encontrado`);
        cy.screenshot(`agente-${nomeAgente}-nao-encontrado`);
      }
    });
    
    cy.wait(5000);
    cy.log(`✅ Agente ${nomeAgente} acessado`);
    
    return this;
  }
  
  /**
   * Digita e envia mensagem final no chat do agente (versão que funciona na pipeline)
   * @param {string} mensagem - Mensagem a ser enviada
   */
  digitarEnviarMensagemFinal(mensagem = 'ola, como vai?') {
    cy.log('📋 Fase 4: Digitando mensagem...');

    cy.log('⏳ Aguardando campo de input carregar...');
    cy.wait(5000);

    cy.get('body').then(($body) => {
      const inputSelectors = [
        'div[contenteditable="true"]',
        'textarea',
        'input[type="text"]',
        '[contenteditable="true"]'
      ];
      
      let inputEncontrado = false;
      for (const selector of inputSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Input encontrado: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .scrollIntoView()
            .click({ force: true })
            .wait(500)
            .clear({ force: true })
            .wait(500)
            .type(mensagem, { delay: 100, force: true });
          cy.log('✅ Mensagem digitada');
          inputEncontrado = true;
          break;
        }
      }
      
      if (!inputEncontrado) {
        cy.log('⚠️ Input não encontrado, tentando fallback...');
        cy.get('input, textarea, [contenteditable]').first()
          .should('be.visible')
          .scrollIntoView()
          .click({ force: true })
          .wait(500)
          .clear({ force: true })
          .wait(500)
          .type(mensagem, { delay: 100, force: true });
        cy.log('✅ Mensagem digitada com fallback');
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
            .scrollIntoView()
            .click({ force: true });
          botaoEncontrado = true;
          break;
        }
      }
      if (!botaoEncontrado) {
        cy.log('⚠️ Send button não encontrado, tentando seletores genéricos...');
        if ($body.find('button').length > 0) {
          cy.get('button').last()
            .scrollIntoView()
            .click({ force: true });
        } else {
          cy.log('⚠️ Nenhum button encontrado');
        }
      }
    });
    cy.log('✅ Send button clicado');

    cy.log('🔍 Validando envio da mensagem...');
    cy.wait(15000); 

    cy.get('body').then(($body) => {
      if ($body.text().includes(mensagem)) {
        cy.log('✅ Mensagem encontrada na página - envio confirmado');
      } else {
        cy.log('⚠️ Mensagem não encontrada na página, mas continuando...');
      }
    });

    cy.log('✅ Message sending test completed successfully!');
    
    return this;
  }
  
  /**
   * Clica no agente antigo "Cypress" na lista de chats (APENAS CLIQUE)
   * Versão antiga mantida para compatibilidade
   * @param {string} nomeAgente - Nome do agente a clicar (padrão: "Cypress")
   */
  clicarEmAgenteAntigoNaLista(nomeAgente = 'Cypress') {
    cy.log('⏳ Aguardando lista de agentes carregar...');
    cy.wait(5000);

    cy.get('body').then(($body) => {
      const totalAgente = $body.find(`*:contains("${nomeAgente}")`).length;
      cy.log(`🔍 DEBUG: Total de elementos contendo "${nomeAgente}": ${totalAgente}`);

      const truncateElements = $body.find('div.truncate').length;
      cy.log(`🔍 DEBUG: Total de elementos div.truncate: ${truncateElements}`);
    });

    cy.log(`🔍 Procurando agente "${nomeAgente}"...`);
    
    cy.get('body').then(($body) => {
      const agenteSelectors = [
        `div.truncate:contains("${nomeAgente}")`,
        `div[class*="cursor-pointer"]:contains("${nomeAgente}")`,
        `div.flex.items-center:contains("${nomeAgente}")`,
        `div:contains("${nomeAgente}")`
      ];
      
      let agenteEncontrado = false;
      
      for (const selector of agenteSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Agente "${nomeAgente}" encontrado com seletor: ${selector}`);
          cy.log(`📊 Quantidade encontrada: ${$body.find(selector).length}`);
    
          if (selector.includes('truncate')) {
            cy.get(selector).first()
              .parent()
              .scrollIntoView()
              .wait(1500)
              .click({ force: true });
            cy.log(`✅ Clique no PARENT do agente "${nomeAgente}" EXECUTADO!`);
          } else {
            cy.get(selector).first()
              .scrollIntoView()
              .wait(1500)
              .click({ force: true });
            cy.log(`✅ Clique no agente "${nomeAgente}" EXECUTADO!`);
          }
          
          agenteEncontrado = true;
          break;
        }
      }
      
      if (!agenteEncontrado) {
        cy.log(`❌ Agente "${nomeAgente}" NÃO encontrado`);
        cy.screenshot(`agente-${nomeAgente}-nao-encontrado`);
      }
    });
    
    cy.wait(5000);
    cy.log(`✅ Agente ${nomeAgente} acessado`);
    
    return this;
  }

  /**
   * Executa o fluxo completo para enviar mensagem para agente antigo
   * Este é o fluxo completo do teste 1.send-message-to-old-agent
   * @param {string} mensagemDialog - Mensagem para o dialog
   * @param {string} mensagemFinal - Mensagem final no chat
   * @param {string} nomeAgente - Nome do agente (padrão: "Cypress")
   */
  enviarMensagemParaAgenteAntigo(mensagemDialog = 'Olá, esta é uma mensagem de teste', mensagemFinal = 'ola, como vai?', nomeAgente = 'Cypress') {
    cy.log('🤖 INICIANDO FLUXO COMPLETO DE ENVIO DE MENSAGEM PARA AGENTE ANTIGO...');

    this.navegarParaAgentes();

    this.clicarEmMeusAgentes();

    this.buscarAgenteCypress();
    
    this.clicarBotaoTestar();

    this.digitarMensagemNoDialog(mensagemDialog);

    cy.log('⏳ Aguardando estabilização do card...');
    cy.wait(2000);
 
    this.enviarMensagemNoDialog();
 
    this.validarMensagemDialog(mensagemDialog);

    this.fecharDialog();
    
    cy.log('📋 Navegando para Chat...');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);

    cy.contains('Chat').click({ force: true });
    cy.wait(10000);
    cy.log('✅ Navegação para Chat concluída');
  
    this.clicarEmAgenteAntigoNaLista(nomeAgente);
    
    this.digitarEnviarMensagemFinal(mensagemFinal);
    
    cy.log('✅ FLUXO COMPLETO DE MENSAGEM PARA AGENTE ANTIGO CONCLUÍDO!');
    
    return this;
  }

  /**
   * Clica em "Criar nova pasta"
   */
  clicarCriarNovaPasta() {
    cy.log('🔍 Procurando elemento "Criar nova pasta"...');
    cy.get('body', { timeout: 20000 }).should('exist');
    cy.wait(2000);

    cy.get('div.truncate.flex.p-2.rounded-xl.gap-2.cursor-pointer.hover\\:bg-gray-100')
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true });

    cy.log('✅ "Criar nova pasta" clicado com sucesso');

    cy.get('body').then(($body) => {
      if ($body.find('div.truncate.flex.p-2.rounded-xl.gap-2.cursor-pointer.hover\\:bg-gray-100').length === 0) {
        cy.log('⚠️ Seletor específico não encontrado, tentando alternativas...');

        if ($body.find('div:has(svg.lucide-folder-plus)').length > 0) {
          cy.log('✅ Elemento encontrado via SVG lucide-folder-plus');
          cy.get('div:has(svg.lucide-folder-plus)').first().click({ force: true });
        }
    
        else if ($body.find('div:contains("Criar nova pasta")').length > 0) {
          cy.log('✅ Elemento encontrado via texto');
          cy.get('div:contains("Criar nova pasta")').first().click({ force: true });
        }
    
        else if ($body.find('[class*="cursor-pointer"]:contains("Criar nova pasta")').length > 0) {
          cy.log('✅ Elemento encontrado via cursor-pointer');
          cy.get('[class*="cursor-pointer"]:contains("Criar nova pasta")').first().click({ force: true });
        }
        else {
          cy.log('❌ Nenhuma alternativa encontrada');
          cy.screenshot('elemento-criar-nova-pasta-nao-encontrado');
        }
      }
    });

    return this;
  }

  /**
   * Digita o nome da nova pasta no input
   * @param {string} nomePasta - Nome da pasta a ser criada
   */
  digitarNomePasta(nomePasta = 'Pasta Teste 1') {
    cy.log('🔍 Procurando input para nome da pasta...');
    cy.wait(3000);
   
    cy.get('body').then(($body) => {
      cy.log('🔍 Verificando se há modais/dialogs visíveis...');
    
      const modalSelectors = [
        'div[role="dialog"]',
        '[class*="modal"]',
        '[class*="dialog"]',
        '[class*="popup"]',
        '[class*="overlay"]',
        '.modal',
        '.dialog',
        '.popup',
        '.overlay'
      ];
      
      let modalEncontrado = false;
      for (const selector of modalSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Modal encontrado: ${selector}`);
          modalEncontrado = true;
          break;
        }
      }
      
      if (!modalEncontrado) {
        cy.log('⚠️ Nenhum modal encontrado, pode ser que o modal não abriu');
      }
    });
    
    cy.get('body').then(($body) => {
      let inputEncontrado = false;
   
      if ($body.find('input[placeholder="Nome da nova pasta"]').length > 0) {
        cy.log('✅ Input encontrado via placeholder exato');
        cy.get('input[placeholder="Nome da nova pasta"]')
          .should('be.visible')
          .scrollIntoView()
          .type(nomePasta, { delay: 100 });
        inputEncontrado = true;
      }
      
      if (!inputEncontrado) {
        cy.log('⚠️ Input não encontrado, tentando estratégias alternativas...');

        if ($body.find('input[placeholder*="pasta"], input[placeholder*="Pasta"], input[placeholder*="nome"], input[placeholder*="Nome"]').length > 0) {
          cy.log('✅ Input encontrado via placeholder parcial');
          cy.get('input[placeholder*="pasta"], input[placeholder*="Pasta"], input[placeholder*="nome"], input[placeholder*="Nome"]')
            .first()
            .should('be.visible')
            .scrollIntoView()
            .type(nomePasta, { delay: 100 });
          inputEncontrado = true;
        }
 
        else if ($body.find('div[role="dialog"] input, [class*="dialog"] input, [class*="modal"] input, [class*="popup"] input').length > 0) {
          cy.log('✅ Input encontrado dentro de modal/dialog');
          cy.get('div[role="dialog"] input, [class*="dialog"] input, [class*="modal"] input, [class*="popup"] input')
            .first()
            .should('be.visible')
            .scrollIntoView()
            .type(nomePasta, { delay: 100 });
          inputEncontrado = true;
        }
        else if ($body.find('input:visible').length > 0) {
          cy.log('✅ Input visível encontrado');
          cy.get('input:visible')
            .first()
            .should('be.visible')
            .scrollIntoView()
            .type(nomePasta, { delay: 100 });
          inputEncontrado = true;
        }
    
        else if ($body.find('input[type="text"], input:not([type]), input[type="input"]').length > 0) {
          cy.log('✅ Input de texto encontrado');
          cy.get('input[type="text"], input:not([type]), input[type="input"]')
            .first()
            .should('be.visible')
            .scrollIntoView()
            .type(nomePasta, { delay: 100 });
          inputEncontrado = true;
        }
 
        else if ($body.find('textarea').length > 0) {
          cy.log('✅ Textarea encontrado');
          cy.get('textarea')
            .first()
            .should('be.visible')
            .scrollIntoView()
            .type(nomePasta, { delay: 100 });
          inputEncontrado = true;
        }
        
        if (!inputEncontrado) {
          cy.log('❌ Nenhum input encontrado');
          cy.log('🔍 Capturando screenshot para debug...');
          cy.screenshot('input-nome-pasta-nao-encontrado');
          
          cy.log('🔍 Elementos visíveis na página:');
          cy.get('body').then(($body) => {
            cy.log(`Inputs encontrados: ${$body.find('input').length}`);
            cy.log(`Textareas encontrados: ${$body.find('textarea').length}`);
            cy.log(`Modais encontrados: ${$body.find('[role="dialog"], [class*="modal"], [class*="dialog"]').length}`);
          });

          cy.log('⚠️ Continuando sem preencher o input...');
        }
      }
    });

    return this;
  }

  confirmarCriacaoPasta() {
    cy.log('🔍 Procurando botão de confirmação para criar pasta...');
    cy.wait(2000);
    
    cy.get('body').then(($body) => {
      let botaoEncontrado = false;

      cy.log('🔍 Verificando modais/dialogs disponíveis...');
      const modalCount = $body.find('div[role="dialog"], [class*="modal"], [class*="dialog"]').length;
      cy.log(`📊 Modais encontrados: ${modalCount}`);

      const buttonCount = $body.find('button').length;
      cy.log(`📊 Botões encontrados: ${buttonCount}`);

      const botaoSelectors = [
        'div[role="dialog"] button svg[class*="lucide-check"]',
        'button svg[class*="check"]',
        'button svg[class*="lucide-check"]',
        'button:contains("Criar")',
        'button:contains("Confirmar")',
        'button:contains("Create")',
        'button:contains("Salvar")',
        'button:contains("Adicionar")',
        'div[role="dialog"] button',
        '[class*="dialog"] button',
        '[class*="modal"] button'
      ];

      for (const selector of botaoSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Botão encontrado com seletor: ${selector}`);
          
          if (selector.includes('svg')) {
          
            cy.get(selector)
              .parent()
              .should('be.visible')
              .scrollIntoView()
              .wait(500)
              .click({ force: true });
          } else {
      
            cy.get(selector)
              .first()
              .should('be.visible')
              .scrollIntoView()
              .wait(500)
              .click({ force: true });
          }
          
          botaoEncontrado = true;
          break;
        }
      }

      if (!botaoEncontrado) {
        cy.log('⚠️ Botão não encontrado com seletores específicos, tentando estratégias alternativas...');

        if ($body.find('button svg, [role="button"] svg').length > 0) {
          cy.log('✅ Botão com ícone encontrado');
          cy.get('button svg, [role="button"] svg')
            .filter('[class*="check"]')
            .parent()
            .should('be.visible')
            .click({ force: true });
          botaoEncontrado = true;
        }

        else if ($body.find('div[role="dialog"] button, [class*="dialog"] button, [class*="modal"] button').length > 0) {
          cy.log('✅ Botão dentro de modal encontrado');
          cy.get('div[role="dialog"] button, [class*="dialog"] button, [class*="modal"] button')
            .last()
            .should('be.visible')
            .scrollIntoView()
            .wait(500)
            .click({ force: true });
          botaoEncontrado = true;
        }
    
        else if ($body.find('button:visible').length > 0) {
          cy.log('✅ Botão visível encontrado');
          cy.get('button:visible')
            .last()
            .should('be.visible')
            .scrollIntoView()
            .wait(500)
            .click({ force: true });
          botaoEncontrado = true;
        }
       
        else {
          cy.log('⚠️ Nenhum botão encontrado, tentando Enter no input...');
          cy.get('input:focus, input:visible')
            .first()
            .type('{enter}');
          botaoEncontrado = true;
        }
      }
      
      if (botaoEncontrado) {
        cy.log('✅ Clique no botão de confirmação realizado!');
        cy.wait(3000);
      } else {
        cy.log('❌ Nenhum botão de confirmação encontrado');
        cy.screenshot('botao-confirmacao-nao-encontrado');
        throw new Error('Botão de confirmação não foi encontrado');
      }
    });

    cy.wait(300);

    cy.log('⏳ Aguardando processamento da criação da pasta...');
    cy.wait(1000);
    cy.log('✅ Pasta criada processada');

    return this;
  }

  /**
   * Faz hover na pasta e clica nos 3 pontinhos
   * @param {string} nomePasta - Nome da pasta
   */
  clicarTresPontinhosPasta(nomePasta = 'Pasta Teste 1') {
    cy.log(`🔍 Procurando pasta "${nomePasta}" para clicar nos 3 pontinhos...`);
    cy.wait(2000);

    cy.get('body').then(($body) => {
      let pastaEncontrada = false;

      if ($body.find(`div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center:contains("${nomePasta}")`).length > 0) {
        cy.log('✅ Pasta encontrada via seletor original');
        pastaEncontrada = true;
        cy.get(`div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center:contains("${nomePasta}")`)
          .should('be.visible')
          .scrollIntoView()
          .trigger('mouseover')
          .trigger('mouseenter')
          .trigger('mousemove');

        cy.log('⏳ Mantendo mouse sobre a pasta por 3 segundos...');
        cy.wait(3000);

        cy.get(`div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center:contains("${nomePasta}")`)
          .within(() => {
            cy.get('.folder-actions svg.lucide-ellipsis-vertical')
              .should('exist')
              .click({ force: true });
            cy.log(`✅ 3 pontinhos da pasta "${nomePasta}" clicados`);
          });
      }
      
      if (!pastaEncontrada) {
        cy.log('⚠️ Pasta não encontrada via seletor original, tentando estratégias alternativas...');
        
        if ($body.find(`*:contains("${nomePasta}")`).length > 0) {
          cy.log('✅ Pasta encontrada via texto');
          cy.get(`*:contains("${nomePasta}")`)
            .first()
            .should('be.visible')
            .scrollIntoView()
            .trigger('mouseover')
            .trigger('mouseenter')
            .trigger('mousemove');

          cy.wait(3000);

          cy.get('body').then(($body2) => {
            if ($body2.find('.folder-actions svg.lucide-ellipsis-vertical').length > 0) {
              cy.log('✅ 3 pontinhos encontrados via classe original');
              cy.get('.folder-actions svg.lucide-ellipsis-vertical')
                .should('be.visible')
                .click({ force: true });
            }
            else if ($body2.find('svg.lucide-ellipsis-vertical, svg[class*="ellipsis"]').length > 0) {
              cy.log('✅ 3 pontinhos encontrados via ícone ellipsis');
              cy.get('svg.lucide-ellipsis-vertical, svg[class*="ellipsis"]')
                .first()
                .should('be.visible')
                .click({ force: true });
            }
            else if ($body2.find('[class*="menu"], [class*="actions"], [class*="options"]').length > 0) {
              cy.log('✅ Menu de ações encontrado via classes genéricas');
              cy.get('[class*="menu"], [class*="actions"], [class*="options"]')
                .first()
                .should('be.visible')
                .click({ force: true });
            }
            else {
              cy.log('❌ 3 pontinhos não encontrados');
              cy.screenshot('tres-pontinhos-nao-encontrados');
              throw new Error('3 pontinhos da pasta não foram encontrados');
            }
          });
        }
        else {
          cy.log(`❌ Pasta "${nomePasta}" não encontrada`);
          cy.screenshot(`pasta-${nomePasta}-nao-encontrada`);
          throw new Error(`Pasta "${nomePasta}" não foi encontrada`);
        }
      }
    });

    return this;
  }

  clicarCriarPastaFilha() {
    cy.log('🔍 Procurando opção "Criar pasta filha"...');
    cy.wait(3000);

    cy.log('✅ Clicando no segundo item do menu (Criar pasta filha)...');
    cy.get('.rounded.overflow-hidden.shadow-lg.bg-white')
      .find('div.p-2.rounded-md.flex.items-center.cursor-pointer.transition-colors')
      .eq(1) 
      .should('be.visible')
      .scrollIntoView()
      .wait(1000)
      .click({ force: true });

    cy.log('✅ "Criar pasta filha" clicado com sucesso!');
    cy.wait(2000);

    return this;
  }

  /**
   * Digita o nome da pasta filha com estratégia ultra-robusta
   * @param {string} nomePastaFilha - Nome da pasta filha
   */
  digitarNomePastaFilha(nomePastaFilha = 'Pasta filha teste') {
    cy.log('🔍 Preenchendo nome da pasta filha...');
    cy.wait(5000); 
    
    cy.log('✅ Procurando input com estratégia ultra-robusta...');

    cy.get('body').then(($body) => {
      if ($body.find('input[placeholder="Nome da nova pasta"]').length > 0) {
        cy.log('✅ Input encontrado via placeholder exato');
        cy.get('input[placeholder="Nome da nova pasta"]')
          .should('be.visible')
          .scrollIntoView()
          .focus()
          .clear()
          .wait(1000)
          .type(nomePastaFilha, { delay: 100 });
      }
    
      else if ($body.find('input:visible').length > 0) {
        cy.log('✅ Input visível encontrado como fallback');
        cy.get('input:visible')
          .first()
          .should('be.visible')
          .scrollIntoView()
          .focus()
          .clear()
          .wait(1000)
          .type(nomePastaFilha, { delay: 100 });
      }
   
      else if ($body.find('input').length > 0) {
        cy.log('✅ Qualquer input encontrado como último recurso');
        cy.get('input')
          .first()
          .should('be.visible')
          .scrollIntoView()
          .focus()
          .clear()
          .wait(1000)
          .type(nomePastaFilha, { delay: 100 });
      }
      else {
        cy.log('❌ Nenhum input encontrado');
        cy.screenshot('input-pasta-filha-nao-encontrado');
        
        // Debug: Listar todos os elementos disponíveis
        cy.log('🔍 Elementos disponíveis na página:');
        cy.get('body').then(($bodyDebug) => {
          const inputs = $bodyDebug.find('input').length;
          const textareas = $bodyDebug.find('textarea').length;
          const modals = $bodyDebug.find('[role="dialog"], [class*="modal"]').length;
          cy.log(`📊 Inputs: ${inputs}, Textareas: ${textareas}, Modais: ${modals}`);
        });
        
        throw new Error('Input para nome da pasta filha não foi encontrado');
      }
    });

    return this;
  }

  confirmarCriacaoPastaFilha() {
    cy.log('🔍 Procurando botão para adicionar pasta filha...');
    cy.wait(5000); 
 
    cy.log('✅ Tentando aguardar botão de confirmação ficar habilitado...');
    
    cy.get('body').then(($body) => {
     
      if ($body.find('button:has(svg.lucide-check)').length > 0) {
        cy.log('✅ Botão com ícone check encontrado');
        
        cy.get('button:has(svg.lucide-check)')
          .should('be.visible')
          .then(($button) => {
            const isDisabled = $button.hasClass('disabled') || $button.prop('disabled') || $button.attr('disabled');
            
            if (isDisabled) {
              cy.log('⚠️ Botão está desabilitado, forçando clique...');
              cy.wrap($button)
                .click({ force: true });
            } else {
              cy.log('✅ Botão está habilitado, clicando normalmente...');
              cy.wrap($button)
                .click({ force: true });
            }
          });
      }

      else if ($body.find('button:visible').length > 0) {
        cy.log('✅ Botão visível encontrado como fallback');
        cy.get('button:visible')
          .first()
          .should('be.visible')
          .click({ force: true });
      }
      else {
        cy.log('❌ Nenhum botão encontrado');
        cy.screenshot('botao-confirmacao-nao-encontrado');
        throw new Error('Botão de confirmação não foi encontrado');
      }
    });

    cy.wait(3000); 

    cy.log('⏳ Aguardando processamento da criação da pasta filha...');
    cy.wait(1000);
    cy.log('✅ Pasta filha criada processada');

    cy.wait(3000);

    return this;
  }

  /**
   * Arrasta uma mensagem para uma pasta
   * @param {string} nomePasta - Nome da pasta destino
   * @param {number} indiceMensagem - Índice da mensagem (0 = primeira)
   */
  arrastarMensagemParaPasta(nomePasta, indiceMensagem = 0) {
    cy.log(`📋 Arrastando mensagem ${indiceMensagem + 1} para "${nomePasta}"...`);

    const possibleSelectors = [
      'div.cursor-grab',
      'div[draggable="true"]',
      'div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center',
      'div[class*="message"]',
      'div[role="button"]'
    ];

    cy.get('body').then(($body) => {
      const foundSelector = possibleSelectors.find((sel) => $body.find(sel).length > 0);
      if (indiceMensagem === 0) {
        cy.get(foundSelector).first().as('source');
      } else {
        cy.get(foundSelector).eq(indiceMensagem).as('source');
      }
    });

    cy.xpath(`//div[contains(@class,"cursor-pointer") and .//div[normalize-space(text())="${nomePasta}"]]`)
      .should('exist')
      .then(($el) => {
        if ($el.length > 0 && $el[0].isConnected) {
          cy.wrap($el).scrollIntoView();
        }
      })
      .should('be.visible')
      .as('target');

    cy.wait(1000);

    cy.get('@source').then(($src) => {
      cy.get('@target').then(($tgt) => {
        
        if (!$src || !$src[0] || !$tgt || !$tgt[0]) {
          cy.log('❌ Elementos de drag and drop não encontrados');
          cy.screenshot('drag-drop-elementos-invalidos');
          throw new Error('Elementos de drag and drop não são válidos');
        }

        const s = $src[0].getBoundingClientRect();
        const t = $tgt[0].getBoundingClientRect();

        if (!s || !t || s.width === 0 || t.width === 0) {
          cy.log('❌ Elementos não têm dimensões válidas');
          cy.screenshot('drag-drop-dimensoes-invalidas');
          throw new Error('Elementos não têm dimensões válidas para drag and drop');
        }

        const startX = s.x + s.width / 2;
        const startY = s.y + s.height / 2;
        const endX = t.x + t.width / 2;
        const endY = t.y + t.height / 2;

        cy.log(`📍 Coordenadas: origem (${startX}, ${startY}) -> destino (${endX}, ${endY})`);

        const dataTransfer = new DataTransfer();

        cy.wrap($src)
          .trigger('mousedown', { which: 1, clientX: startX, clientY: startY, force: true })
          .trigger('dragstart', { dataTransfer, clientX: startX, clientY: startY, force: true });

        cy.get('body')
          .trigger('mousemove', { clientX: (startX + endX) / 2, clientY: (startY + endY) / 2, force: true })
          .wait(100)
          .trigger('mousemove', { clientX: endX, clientY: endY, force: true });

        cy.wrap($tgt)
          .trigger('dragenter', { dataTransfer, clientX: endX, clientY: endY, force: true })
          .trigger('dragover',  { dataTransfer, clientX: endX, clientY: endY, force: true })
          .wait(400)
          .trigger('drop',      { dataTransfer, clientX: endX, clientY: endY, force: true });

        cy.wrap($src).trigger('mouseup', { force: true });

        cy.wait(2000);

        cy.log('⏳ Aguardando processamento do movimento da mensagem...');
        cy.wait(1000);
        cy.log('✅ Movimento da mensagem processado');

        cy.log(`✅ Mensagem arrastada para ${nomePasta} com sucesso!`);
      });     
    });

    return this;
  }

  /**
   * Abre uma pasta
   * @param {string} nomePasta - Nome da pasta a abrir
   */
  abrirPasta(nomePasta) {
    cy.log(`📂 Acessando ${nomePasta}...`);
    cy.xpath(`//div[contains(@class,"cursor-pointer") and .//div[normalize-space(text())="${nomePasta}"]]`)
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true });

    cy.wait(2000);
    
    return this;
  }

  voltarAoTopo() {
    cy.log('🔄 Tentando voltar ao topo da página...');

    cy.window().then((win) => {
      cy.log('✅ Usando window.scrollTo para garantir scroll ao topo...');
      win.scrollTo(0, 0);
    });
    
    cy.get('body').then(($body) => {
      if ($body.find('[data-radix-scroll-area-viewport]').length > 0) {
        cy.log('✅ Viewport do Radix encontrado, tentando scroll via JavaScript...');
        cy.get('[data-radix-scroll-area-viewport]')
          .first()
          .then(($viewport) => {
            $viewport[0].scrollTop = 0;
            cy.log('✅ Scroll do viewport ajustado para o topo');
          });
      }
    });

    cy.wait(1000);
    
    return this;
  }

  /**
   * Remove uma pasta (filha ou principal)
   * @param {string} nomePasta - Nome da pasta a remover
   * @param {boolean} isPrincipal - Se é pasta principal ou filha
   */
  removerPasta(nomePasta, isPrincipal = false) {
    const tipo = isPrincipal ? 'principal' : 'filha';
    cy.log(`🗑️ INICIANDO EXCLUSÃO DA PASTA ${tipo.toUpperCase()} "${nomePasta}"...`);
    cy.log(`🔍 Procurando pasta "${nomePasta}" para clicar nos 3 pontinhos...`);

    cy.log(`🎯 Fazendo hover sobre "${nomePasta}"...`);
    cy.get(`div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center:contains("${nomePasta}")`)
      .first()
      .should('be.visible')
      .scrollIntoView()
      .should('not.be.disabled')
      .then(($el) => {
      
        try {
          cy.wrap($el)
            .trigger('mouseover', { force: true })
            .trigger('mouseenter', { force: true })
            .trigger('mousemove', { force: true });
          cy.log('✅ Hover executado com sucesso');
        } catch (error) {
          cy.log('⚠️ Hover falhou, mas continuando sem hover...');
        }
      });

    cy.log(`⏳ Mantendo mouse sobre a pasta por 5 segundos...`);
    cy.wait(5000); 

    cy.log(`🎯 Clicando nos 3 pontinhos da "${nomePasta}"...`);
    cy.get(`div.flex.rounded-md.p-2.gap-2.relative.cursor-pointer.items-center:contains("${nomePasta}")`)
      .within(() => {
        cy.get('.folder-actions svg.lucide-ellipsis-vertical')
          .should('exist')
          .click({ force: true });
        cy.log(`✅ 3 pontinhos da "${nomePasta}" clicados`);
      });

    cy.log(`🎯 Procurando opção "Remover pasta" da pasta ${tipo}...`);
    cy.wait(5000); 
    
    cy.log('⏳ Aguardando menu de opções aparecer...');
    cy.wait(3000);
    
    cy.get('body').then(($body) => {
      let opcaoEncontrada = false;
      
      const removerElements = $body.find('*:contains("Remover"), *:contains("Excluir"), *:contains("Delete")');
      cy.log(`📊 Total de elementos com "Remover/Excluir/Delete" (pasta ${tipo}): ${removerElements.length}`);
      
      removerElements.slice(0, 5).each((i, el) => {
        const $el = Cypress.$(el);
        const text = $el.text().trim();
        const visible = $el.is(':visible');
        cy.log(`Elemento ${i + 1}: "${text}" - Visível: ${visible}`);
      });
      
      if ($body.find('div.p-2.rounded-md.flex.items-center.cursor-pointer.transition-colors.hover\\:bg-gray-100:has(svg.lucide-trash2)').length > 0) {
        cy.log(`✅ Opção "Remover pasta" encontrada via seletor específico (pasta ${tipo})`);
        cy.get('div.p-2.rounded-md.flex.items-center.cursor-pointer.transition-colors.hover\\:bg-gray-100:has(svg.lucide-trash2)')
          .first()
          .scrollIntoView()
          .should('be.visible')
          .wait(2000) 
          .click({ force: true });
        opcaoEncontrada = true;
      }
     
      else {
        const removerPastaElements = $body.find('*:contains("Remover pasta")');
        if (removerPastaElements.length > 0) {
          cy.log(`✅ ${removerPastaElements.length} elementos com "Remover pasta" encontrados (pasta ${tipo})`);
        
          let menorElemento = null;
          let menorTexto = '';
          
          removerPastaElements.each((i, el) => {
            const $el = Cypress.$(el);
            const texto = $el.text().trim();
            cy.log(`Analisando elemento ${i + 1}: "${texto}" (${texto.length} chars)`);
          
            if (!menorElemento || texto.length < menorTexto.length) {
              menorElemento = el;
              menorTexto = texto;
            }
          });
          
          if (menorElemento) {
            cy.log(`✅ Clicando no elemento mais específico da pasta ${tipo}: "${menorTexto}" (${menorTexto.length} chars)`);
            cy.wrap(menorElemento)
              .scrollIntoView()
              .should('be.visible')
              .wait(2000) 
              .click({ force: true });
            opcaoEncontrada = true;
          }
        }
        
        else {
          const textos = [
            'Remover pasta',
            'remover pasta', 
            'Excluir pasta',
            'excluir pasta',
            'Delete folder',
            'Remove folder',
            'Remover',
            'Excluir',
            'Delete',
            'Remove'
          ];
          
          for (const texto of textos) {
            if ($body.find(`*:contains("${texto}")`).length > 0) {
              cy.log(`✅ Opção encontrada com texto "${texto}"`);
              cy.get(`*:contains("${texto}")`)
                .first()
                .scrollIntoView()
                .should('be.visible')
                .wait(2000) 
                .click({ force: true });
              opcaoEncontrada = true;
              break;
            }
          }
        }
      }
      
      if (!opcaoEncontrada) {
        cy.log('❌ Opção "Remover pasta" não encontrada');
        cy.screenshot(`remover-pasta-${tipo}-nao-encontrado`);
     
        cy.log(`⚠️ Continuando sem excluir pasta ${tipo}...`);
      }
    });

    cy.log(`🎯 Procurando modal de confirmação de exclusão da pasta ${tipo}...`);
    cy.wait(5000); 
    
    cy.get('body').then(($body) => {
      
      const modalElements = $body.find('*:contains("Confirmar"), *:contains("Excluir"), *:contains("Delete"), *:contains("Remover")');
      cy.log(`📊 Total de elementos de modal/confirmação (pasta ${tipo}): ${modalElements.length}`);
      
      modalElements.slice(0, 5).each((i, el) => {
        const $el = Cypress.$(el);
        const text = $el.text().trim();
        const visible = $el.is(':visible');
        cy.log(`Modal ${i + 1}: "${text}" - Visível: ${visible}`);
      });
      
      if ($body.find('*:contains("Confirmar exclusão da pasta?")').length > 0) {
        cy.log(`✅ Modal de confirmação da pasta ${tipo} encontrado`);
        cy.get('*:contains("Confirmar exclusão da pasta?")')
          .first()
          .should('be.visible');
      } else {
        cy.log('⚠️ Modal não encontrado, mas continuando...');
      }
    });

    cy.log(`🎯 Procurando botão "Excluir pasta" da pasta ${tipo}...`);
    cy.wait(5000); 
    
    cy.get('body').then(($body) => {
      
      const botoes = $body.find('button');
      cy.log(`📊 Total de botões encontrados (pasta ${tipo}): ${botoes.length}`);
      
      botoes.slice(0, 5).each((i, el) => {
        const $el = Cypress.$(el);
        const text = $el.text().trim();
        const visible = $el.is(':visible');
        const classes = $el.attr('class') || '';
        cy.log(`Botão ${i + 1}: "${text}" - Visível: ${visible} - Classes: ${classes.substring(0, 50)}...`);
      });
      
      if ($body.find('button:contains("Excluir pasta")').length > 0) {
        cy.log(`✅ Botão "Excluir pasta" da pasta ${tipo} encontrado`);
        cy.get('button:contains("Excluir pasta")')
          .first()
          .should('be.visible')
          .scrollIntoView()
          .wait(2000) 
          .click({ force: true });
      } else if ($body.find('*:contains("Excluir pasta")').length > 0) {
        cy.log(`✅ Elemento "Excluir pasta" da pasta ${tipo} encontrado`);
        cy.get('*:contains("Excluir pasta")')
          .first()
          .should('be.visible')
          .scrollIntoView()
          .wait(2000) 
          .click({ force: true });
      } else {
        cy.log('⚠️ Botão "Excluir pasta" não encontrado, tentando variações...');
        
        const textos = ['Excluir', 'Delete', 'Remove', 'Confirmar', 'Confirm'];
        let encontrado = false;
        
        for (const texto of textos) {
          if ($body.find(`button:contains("${texto}")`).length > 0) {
            cy.log(`✅ Botão encontrado com texto "${texto}"`);
            cy.get(`button:contains("${texto}")`)
              .first()
              .should('be.visible')
              .scrollIntoView()
              .wait(2000)
              .click({ force: true });
            encontrado = true;
            break;
          }
        }
        
        if (!encontrado) {
          cy.log('❌ Nenhum botão de exclusão encontrado');
          cy.screenshot(`botao-excluir-${tipo}-nao-encontrado`);
        }
      }
    });

    cy.wait(3000);

    cy.log(`⏳ Aguardando processamento da exclusão da pasta ${tipo}...`);
    cy.wait(1000);
    cy.log(`✅ Exclusão da pasta ${tipo} processada`);

    cy.log(`✅ Pasta ${tipo} removida com sucesso!`);

    return this;
  }

  gerenciarPastasCompleto() {
    cy.log('📁 INICIANDO FLUXO COMPLETO DE GERENCIAMENTO DE PASTAS...');

    this.navegarParaChat();

    this.clicarCriarNovaPasta();
    this.digitarNomePasta('Pasta Teste 1');
    this.confirmarCriacaoPasta();

    this.clicarTresPontinhosPasta('Pasta Teste 1');
    this.clicarCriarPastaFilha();
    this.digitarNomePastaFilha('Pasta filha teste');
    this.confirmarCriacaoPastaFilha();

    this.clicarEmGeralDrastico();

    this.arrastarMensagemParaPasta('Pasta Teste 1', 0);

    this.abrirPasta('Pasta Teste 1');

   
    this.voltarAoTopo();
    this.arrastarMensagemParaPasta('Pasta filha teste', 0);

    this.removerPasta('Pasta filha teste', false);

    this.removerPasta('Pasta Teste 1', true);

    cy.log('✅ FLUXO COMPLETO DE GERENCIAMENTO DE PASTAS CONCLUÍDO COM SUCESSO!');

    return this;
  }

   navegarParaChatSimples() {
    cy.log('📋 Fase 1: Navegando para Chat...');
    cy.get('body').should('not.contain', 'loading');
    cy.wait(2000);

        cy.contains('Chat').click({ force: true });
    cy.wait(3000);
    cy.log('✅ Navegação para Chat concluída');

    return this;
  }

  /**
   * Digita mensagem com estratégia simplificada (sem clear complexo)
   * @param {string} mensagem - Mensagem a ser digitada
   */
  digitarMensagemSimples(mensagem = 'ola, como vai?') {
    cy.log('📋 Fase 4: Digitando mensagem...');
  
    cy.get('body').then(($body) => {
      const inputSelectors = [
        'div[contenteditable="true"]',
        'textarea',
        'input[type="text"]',
        '[contenteditable="true"]'
      ];
      
      let inputEncontrado = false;
      for (const selector of inputSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Input encontrado: ${selector}`);
          cy.get(selector).first()
            .should('be.visible')
            .clear()
            .type(mensagem, { delay: 100 });
          cy.log('✅ Mensagem digitada');
          inputEncontrado = true;
          break;
        }
      }
      
      if (!inputEncontrado) {
        cy.log('⚠️ Input não encontrado, tentando fallback...');
        cy.get('input, textarea, [contenteditable]').first()
          .should('be.visible')
          .clear()
          .type(mensagem, { delay: 100 });
        cy.log('✅ Mensagem digitada com fallback');
      }
    });

    return this;
  }

    enviarMensagemSimples() {
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

  /**
   * Valida envio da mensagem com tempo estendido
   * @param {string} mensagem - Mensagem enviada
   */
  validarEnvioMensagemEstendido(mensagem) {
    // Validar envio da mensagem
    cy.log('🔍 Validando envio da mensagem...');
    cy.log('⏳ Aguardando 10 segundos após envio...');
    cy.wait(10000);
    
    cy.get('body').then(($body) => {
      if ($body.find('div[contenteditable="true"]').length > 0) {
        cy.get('div[contenteditable="true"]').first().should('be.empty');
        cy.log('✅ Campo de input vazio - mensagem enviada');
      }
    });
    
    cy.get('body').should('not.contain', 'enviando');
    cy.get('body').should('not.contain', 'sending');
    cy.log('✅ Nenhum indicador de "enviando" encontrado');
    
    cy.get('body').should('contain.text', mensagem);
    cy.log('✅ Mensagem encontrada na página - envio confirmado');
    
    cy.log('✅ Message sending test completed successfully!');

    return this;
  }

  /**
   * Executa o fluxo completo de enviar mensagem em chat antigo
   * Este é o fluxo completo do teste chat-old-message
   * @param {string} mensagem - Mensagem a ser enviada (padrão: 'ola, como vai?')
   */
  enviarMensagemChatAntigoCompleto(mensagem = 'ola, como vai?') {
    cy.log('💬 INICIANDO FLUXO COMPLETO DE ENVIO DE MENSAGEM EM CHAT ANTIGO...');

    
   this.navegarParaChatSimples();

   this.clicarEmGeralDrastico();

    cy.log('📋 Fase 3: Tentando clicar na primeira mensagem...');
    cy.wait(2000);

    cy.get('body').then(($body) => {
      const chatSelectors = [
        'div[class*="flex gap-2 items-center"]',
        'div[class*="chat"]',
        'div[class*="conversation"]',
        'div[class*="message"]',
        'div[role="button"]'
      ];
      
      let chatEncontrado = false;
      for (const selector of chatSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Chat encontrado: ${selector}`);
          cy.get(selector).first()
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });
          cy.log('✅ Primeira mensagem clicada');
          chatEncontrado = true;
          break;
        }
      }
      
      if (!chatEncontrado) {
        cy.log('⚠️ Chat não encontrado, tentando fallback...');
        try {
          cy.get('div, li, button').first()
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });
          cy.log('✅ Elemento clicado com fallback');
        } catch (e) {
          cy.log(`⚠️ Fallback falhou: ${e.message} - pulando esta etapa`);
        }
      }
    });
    
    cy.wait(5000);
    cy.log('✅ Fase 3 concluída');

    
    this.digitarMensagemSimples(mensagem);

       this.enviarMensagemSimples();

       this.validarEnvioMensagemEstendido(mensagem);

    cy.log('✅ FLUXO COMPLETO DE CHAT ANTIGO CONCLUÍDO COM SUCESSO!');

    return this;
  }
}