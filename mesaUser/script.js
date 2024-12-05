document.addEventListener('DOMContentLoaded', () => {
  // Função para selecionar elementos
  function selecionarElemento(id) {
    return document.getElementById(id);
  }

  // Seleção dos elementos HTML
  const elementos = {
    mesasContainer: selecionarElemento('mesas'),
    modalCriarComanda: selecionarElemento('modalCriarComanda'),
    cardapioModal: selecionarElemento('cardapioModal'),
    revisarPedidoModal: selecionarElemento('revisarPedidoModal'),
    nomeClienteInput: selecionarElemento('nomeCliente'),
    numeroMesaInput: selecionarElemento('numeroMesa'),
    adicionarItensBtn: selecionarElemento('adicionarItens'),
    revisarPedidoBtn: selecionarElemento('revisarPedido'),
    novaComandaBtn: selecionarElemento('novaComanda'),
    itensCardapioContainer: selecionarElemento('itensCardapio'),
    revisarNomeCliente: selecionarElemento('revisarNomeCliente'),
    revisarNumeroMesa: selecionarElemento('revisarNumeroMesa'),
    revisarItens: selecionarElemento('revisarItens'),
    btnFechar: document.querySelectorAll('.btn-fechar'),
  };

  // Variáveis de estado
  let itensSelecionados = {}; 
  let comandaData = {}; 
  let cardapio = []; 





// Função para buscar mesas e exibir na interface
function buscarMesas() {
  fetch('http://www.cluckinbell123.somee.com/api/Mesas', { method: 'GET' })
    .then(response => response.json())
    .then(data => {
      elementos.mesasContainer.innerHTML = ''; // Limpar a lista de mesas
      data.forEach(mesa => {
        const mesaBtn = document.createElement('button');
        mesaBtn.classList.add('mesa', mesa.situacaoMesa === 1 ? 'ocupada' : 'livre');
        mesaBtn.textContent = `Mesa ${mesa.numeroMesa}`;
        
        // Verifica se a mesa está ocupada
        mesaBtn.onclick = () => {
          if (mesa.situacaoMesa === 0) {
            // Mesa livre
            elementos.numeroMesaInput.value = mesa.numeroMesa;
            elementos.modalCriarComanda.style.display = 'block';
          } else {
            // Mesa ocupada - Abre o modal de mesa ocupada
            abrirModalMesaOcupada(mesa);
          }
        };
        elementos.mesasContainer.appendChild(mesaBtn);
      });
    })
    .catch(error => {
      console.error("Erro ao carregar as mesas:", error);
      console.log("Erro ao carregar as mesas. Tente novamente.", 'erro');
    });
}
















// Função para abrir o modal de mesa ocupada
function abrirModalMesaOcupada(mesa) {
  // Suponhamos que você tenha um modal para mostrar as informações de uma mesa ocupada
  const modalMesaOcupada = selecionarElemento('modalMesaOcupada');
  
  // Limpar qualquer dado anterior no modal
  modalMesaOcupada.querySelector('#numeroMesaOcupada').textContent = '';
  modalMesaOcupada.querySelector('#clienteOcupado').textContent = '';
  modalMesaOcupada.querySelector('#itensOcupados').innerHTML = '';
  modalMesaOcupada.querySelector('#totalOcupado').textContent = '';

  // Exibir o número da mesa no modal
  modalMesaOcupada.querySelector('#numeroMesaOcupada').textContent = `Mesa: ${mesa.numeroMesa}`;

  // Fazer a requisição para buscar os detalhes da comanda que ocupa a mesa
  fetch('http://www.cluckinbell123.somee.com/api/Comandas', {
    method: 'GET',
    headers: { 'accept': 'text/plain' }
  })
  .then(response => response.json())
  .then(comandas => {
    // Encontrar a comanda que corresponde à mesa clicada, agora usando numeroMesa
    const comanda = comandas.find(c => c.numeroMesa === mesa.numeroMesa);

    if (comanda) {
      // Exibir o nome do cliente
      modalMesaOcupada.querySelector('#clienteOcupado').textContent = `Cliente: ${comanda.nomeCliente}`;

      let total = 0; // Variável para armazenar o total
      // Fazer a requisição para buscar os itens do cardápio
      fetch('http://www.cluckinbell123.somee.com/api/CardapioItems', {
        method: 'GET',
        headers: { 'accept': 'text/plain' }
      })
      .then(response => response.json())
      .then(cardapioItems => {
        console.log("Itens do cardápio:", cardapioItems);  // Exibe os itens do cardápio para depuração

        // Exibir os itens da comanda com preço
        const listaItens = modalMesaOcupada.querySelector('#itensOcupados');
        let itemEncontrado = false; // Variável para saber se ao menos um item foi encontrado no cardápio

        comanda.comandaItens.forEach(item => {
          // Encontrar o item correspondente no cardápio pelo título
          const itemCardapio = cardapioItems.find(cardapioItem => cardapioItem.titulo === item.titulo);
          
          if (itemCardapio) {
            const li = document.createElement('li');
            li.textContent = `${itemCardapio.titulo} - R$ ${itemCardapio.preco.toFixed(2)}`;
            listaItens.appendChild(li);

            // Adicionar o preço do item ao total
            total += itemCardapio.preco;
            itemEncontrado = true; // Marcar como encontrado
          } else {
            console.warn(`Item não encontrado no cardápio: ${item.titulo}`);
          }
        });

        if (!itemEncontrado) {
          console.warn('Nenhum item encontrado no cardápio para esta comanda.');
        }

        // Exibir o total
        modalMesaOcupada.querySelector('#totalOcupado').textContent = `Total: R$ ${total.toFixed(2)}`;

        // Adicionar o botão de "Finalizar Comanda"
        const btnFinalizar = modalMesaOcupada.querySelector('#btnFinalizarComanda');

        if (btnFinalizar) {
          btnFinalizar.addEventListener('click', function() {
            // Exemplo de como preencher o corpo da requisição
            const comandaData = {
              status: 'finalizada', // Defina o status ou outros campos necessários
              finalizadoEm: new Date().toISOString() // Data de finalização, se necessário
            };

            // Verifique o que será enviado no corpo da requisição
            console.log('Comanda ID:', comanda.id); // Verifique se o ID está correto
            console.log('JSON enviado no PATCH:', JSON.stringify(comandaData)); // Imprima o JSON

            // Requisição PATCH para finalizar a comanda
            fetch(`http://www.cluckinbell123.somee.com/api/Comandas/${comanda.id}`, {
              method: 'PATCH',
              headers: {
                'accept': '*/*',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(comandaData)
            })
            .then(response => {
              if (response.ok) {
                // Fechar o modal após finalizar
                modalMesaOcupada.style.display = 'none';

                // Atualizar a lista de mesas
                buscarMesas();
              }
            })
            .catch(error => {
              console.error('Erro ao finalizar a comanda:', error);
            });
          });
        }
      })
      .catch(error => {
        console.error("Erro ao buscar os itens do cardápio:", error);
      });

    } else {
      modalMesaOcupada.querySelector('#clienteOcupado').textContent = 'Comanda não encontrada para esta mesa.';
    }

    // Exibir o modal de mesa ocupada
    modalMesaOcupada.style.display = 'block';
  })
  .catch(error => {
    console.error("Erro ao buscar as comandas:", error);
  });

  // Fechar o modal
  modalMesaOcupada.querySelector('.btn-fechar').addEventListener('click', () => {
    modalMesaOcupada.style.display = 'none';
  });
}









// Vincular o botão "Criar Mesa" à função de criar mesa
document.getElementById('criarMesa').addEventListener('click', criarMesa);

// Função para buscar as mesas e encontrar o número da última mesa
function buscarUltimaMesa() {
  return fetch('http://www.cluckinbell123.somee.com/api/Mesas', { method: 'GET' })
    .then(response => response.json())
    .then(mesas => {
      if (mesas && mesas.length > 0) {
        // Encontrar a última mesa e retornar o número dela
        const ultimaMesa = mesas[mesas.length - 1];
        return ultimaMesa.numeroMesa;
      } else {
        // Se não houver mesas, a primeira será a mesa número 1
        return 0;  // Indica que não há mesas e a primeira será a número 1
      }
    })
    .catch(error => {
      console.error("Erro ao buscar as mesas:", error);
      console.log("Erro ao buscar as mesas. Tente novamente.", 'erro');
      return -1;  // Retorna -1 em caso de erro, indicando que a operação falhou
    });
}

// Função para criar uma nova mesa
function criarMesa() {
  buscarUltimaMesa().then(ultimaMesaNumero => {
    if (ultimaMesaNumero === -1) return;  // Se houve erro na busca, não cria a mesa

    const novoNumeroMesa = ultimaMesaNumero + 1;  // Incrementa 1 para criar a nova mesa
    const mesaPayload = {
      numeroMesa: novoNumeroMesa,
      situacaoMesa: 0  // A mesa será criada como livre (situacaoMesa = 0)
    };

    fetch('http://www.cluckinbell123.somee.com/api/Mesas', {
      method: 'POST',
      headers: {
        'accept': 'text/plain',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mesaPayload)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log(`Mesa ${novoNumeroMesa} criada com sucesso!`, 'sucesso');
        }

        // Chama a função buscarMesas para atualizar a lista de mesas após tentar criar a mesa
        buscarMesas();
      })
      ;
  });
}






document.getElementById('removerMesa').addEventListener('click', removerMesa);

// Função para remover a última mesa
function removerMesa() {
  // Buscar todas as mesas
  fetch('http://www.cluckinbell123.somee.com/api/Mesas')
    .then(response => response.json())
    .then(mesas => {
      if (mesas.length === 0) {
        console.log("Não há mesas para remover.", 'erro');
        return;
      }

      // Encontrar a última mesa, que é a de maior número
      const ultimaMesa = mesas.reduce((ultima, mesa) => {
        return mesa.numeroMesa > ultima.numeroMesa ? mesa : ultima;
      });

      // Verificar a situação da última mesa (situacaoMesa deve ser 0)
      if (ultimaMesa.situacaoMesa === 0) {
        // A mesa está livre e pode ser removida
        const mesaId = ultimaMesa.id; // Usando o ID da mesa

        fetch(`http://www.cluckinbell123.somee.com/api/Mesas/${mesaId}`, {
          method: 'DELETE',
          headers: {
            'accept': '*/*'
          }
        })
        .then(response => {
          if (response.ok) {
            console.log(`Mesa ${ultimaMesa.numeroMesa} removida com sucesso!`, 'sucesso');
            buscarMesas();  // Atualiza a lista de mesas
          } else {
            console.log("Erro ao remover a mesa. Tente novamente.", 'erro');
          }
        })
        .catch(error => {
          console.error("Erro ao remover a mesa:", error);
          console.log("Erro ao remover a mesa. Tente novamente.", 'erro');
        });
      } else {
        // A mesa não está livre, não pode ser removida
        console.log(`A mesa ${ultimaMesa.numeroMesa} não pode ser removida, pois não está livre.`, 'erro');
      }
    })
    .catch(error => {
      console.error("Erro ao buscar as mesas:", error);
      console.log("Erro ao buscar as mesas. Tente novamente.", 'erro');
    });
}













  // Função para buscar itens do cardápio
function buscarItensCardapio() {
  fetch('http://www.cluckinbell123.somee.com/api/CardapioItems', { method: 'GET' })
    .then(response => response.json())
    .then(data => {
      cardapio = data;
      elementos.itensCardapioContainer.innerHTML = ''; // Limpar os itens anteriores

      // Loop para criar os cards dos itens
      data.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.classList.add('card-item'); // Adicionando classe para o card

        itemCard.innerHTML = `
          <div class="item-header">
            <h3>${item.titulo}</h3>
            <p>R$ ${item.preco.toFixed(2)}</p>
          </div>
          <div class="item-footer">
            <button class="adicionar-item" data-id="${item.id}">Adicionar</button>
            <span id="quantidade-${item.id}" class="quantidade">Quantidade: 0</span>
            <button class="remover-item" data-id="${item.id}">Remover</button>
          </div>
        `;
        
        elementos.itensCardapioContainer.appendChild(itemCard);

        // Adicionar eventos aos botões de adicionar/remover itens
        itemCard.querySelector('.adicionar-item').addEventListener('click', () => modificarItem(item.id, 'adicionar'));
        itemCard.querySelector('.remover-item').addEventListener('click', () => modificarItem(item.id, 'remover'));
      });
    })
    .catch(error => {
      console.error("Erro ao carregar os itens do cardápio:", error);
      console.log("Erro ao carregar os itens do cardápio. Tente novamente.", 'erro');
    });
}

  // Função para modificar a quantidade de itens (adicionar/remover)
  function modificarItem(id, operacao) {
    if (!itensSelecionados[id]) itensSelecionados[id] = { quantidade: 0 };
    if (operacao === 'adicionar') {
      itensSelecionados[id].quantidade++;
    } else if (operacao === 'remover' && itensSelecionados[id].quantidade > 0) {
      itensSelecionados[id].quantidade--;
      if (itensSelecionados[id].quantidade === 0) {
        delete itensSelecionados[id];
      }
    }
    atualizarListaItens();
    atualizarQuantidadeItem(id);
  }

  // Atualizar a lista de itens selecionados no modal de revisão
  function atualizarListaItens() {
    elementos.revisarItens.innerHTML = Object.keys(itensSelecionados)
      .map(id => {
        const item = cardapio.find(i => i.id === Number(id));
        return `<li>${item ? `${item.titulo} - Quantidade: ${itensSelecionados[id].quantidade}` : 'Item não encontrado'}</li>`;
      })
      .join('');
  }

  // Atualizar a quantidade de itens no modal de adicionar itens
  function atualizarQuantidadeItem(id) {
    const quantidadeElement = document.getElementById(`quantidade-${id}`);
    if (quantidadeElement) {
      const item = itensSelecionados[id];
      quantidadeElement.textContent = `Quantidade: ${item ? item.quantidade : 0}`;
    }
  }

  // Função para abrir o modal de revisão de pedido
  elementos.revisarPedidoBtn.onclick = () => {
    comandaData = {
      nomeCliente: elementos.nomeClienteInput.value,
      numeroMesa: elementos.numeroMesaInput.value,
      cardapioItems: Object.keys(itensSelecionados).map(id => ({ id: Number(id), quantidade: itensSelecionados[id].quantidade }))
    };

    // Verificar se todos os campos estão preenchidos
    if (!comandaData.nomeCliente.trim()) {
      console.log("Por favor, insira o nome do cliente.", 'erro');
      return;
    }
    if (!comandaData.numeroMesa) {
      console.log("Por favor, selecione uma mesa.", 'erro');
      return;
    }
    if (comandaData.cardapioItems.length === 0) {
      console.log("Adicione ao menos um item ao pedido.", 'erro');
      return;
    }

    // Atualizar modal com informações da comanda
    elementos.revisarNomeCliente.textContent = comandaData.nomeCliente;
    elementos.revisarNumeroMesa.textContent = comandaData.numeroMesa;
    atualizarListaItens();

    elementos.revisarPedidoModal.style.display = 'block';
  };

  // Função para criar a comanda (realizar o POST)
  function criarComanda() {
    if (!comandaData.nomeCliente.trim() || !comandaData.numeroMesa || comandaData.cardapioItems.length === 0) return;

    const comandaPayload = {
      numeroMesa: comandaData.numeroMesa,
      nomeCliente: comandaData.nomeCliente,
      cardapioItems: comandaData.cardapioItems.map(item => item.id)
    };

    // Desabilitar botões enquanto a requisição está sendo feita
    elementos.revisarPedidoBtn.disabled = true;
    document.getElementById('criarComanda').disabled = true;

    fetch('http://www.cluckinbell123.somee.com/api/Comandas', {
      method: 'POST',
      headers: {
        'accept': 'text/plain',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(comandaPayload)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log("Comanda criada com sucesso!", 'sucesso');
        } else {
          console.log("Erro ao criar a comanda. Tente novamente.", 'erro');
        }
      })
      .catch(error => {
        console.error("Erro ao realizar o POST:", error);
        console.log("Erro ao criar a comanda. Tente novamente.", 'erro');
      })
      .finally(() => {
        // Limpar campos e dados
        limparDados();
        fecharTodosModais();
        buscarMesas();
        // Reabilitar botões
        elementos.revisarPedidoBtn.disabled = false;
        document.getElementById('criarComanda').disabled = false;
      });
  }

  // Função para limpar os dados da comanda e itens selecionados
  function limparDados() {
    elementos.nomeClienteInput.value = '';
    elementos.numeroMesaInput.value = '';
    itensSelecionados = {};
    comandaData = {};
    atualizarListaItens();
    document.querySelectorAll('.quantidade').forEach(qtd => qtd.textContent = "Quantidade: 0");
  }

  // Função para fechar todos os modais
  function fecharTodosModais() {
    elementos.modalCriarComanda.style.display = 'none';
    elementos.cardapioModal.style.display = 'none';
    elementos.revisarPedidoModal.style.display = 'none';
  }

  // Fechar modais ao clicar fora do conteúdo
  [elementos.modalCriarComanda, elementos.cardapioModal, elementos.revisarPedidoModal].forEach(modal => {
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.style.display = 'none'; // Fecha o modal
        limparDados(); // Limpa os dados ao fechar o modal
      }
    });
  });

  // Fechar modais pelos botões de fechar
  elementos.btnFechar.forEach(btn => {
    btn.addEventListener('click', e => {
      const modal = e.target.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
        limparDados(); // Limpar os dados ao fechar o modal
      }
    });
  });

  // Exibir modal de adicionar itens ao cardápio
  elementos.adicionarItensBtn.onclick = () => {
    elementos.cardapioModal.style.display = 'block';
    buscarItensCardapio(); 
  };

  // Exibir modal de criação da comanda
  elementos.novaComandaBtn.onclick = () => {
    elementos.modalCriarComanda.style.display = 'block';
  };

  // Criar comanda no modal "Revisar Pedido"
  document.getElementById('criarComanda').addEventListener('click', criarComanda);

  // Iniciar a busca pelas mesas e itens
  buscarMesas();
});
