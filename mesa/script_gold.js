document.addEventListener('DOMContentLoaded', () => {
  // Seleção dos elementos HTML
  const mesasContainer = document.getElementById('mesas');
  const modalCriarComanda = document.getElementById('modalCriarComanda');
  const cardapioModal = document.getElementById('cardapioModal');
  const revisarPedidoModal = document.getElementById('revisarPedidoModal');
  const nomeClienteInput = document.getElementById('nomeCliente');
  const numeroMesaInput = document.getElementById('numeroMesa');
  const adicionarItensBtn = document.getElementById('adicionarItens');
  const revisarPedidoBtn = document.getElementById('revisarPedido');
  const novaComandaBtn = document.getElementById('novaComanda');
  const itensCardapioContainer = document.getElementById('itensCardapio');
  const revisarNomeCliente = document.getElementById('revisarNomeCliente');
  const revisarNumeroMesa = document.getElementById('revisarNumeroMesa');
  const revisarItens = document.getElementById('revisarItens');
  
  let itensSelecionados = {}; // Usando um objeto para armazenar a quantidade de itens
  let comandaData = {}; // Armazenar os dados da comanda
  let cardapio = []; // Armazenar todos os itens do cardápio

  // Função para buscar mesas e exibir na interface
  function buscarMesas() {
    fetch('http://localhost:5163/api/Mesas', { method: 'GET' })
      .then(response => response.json())
      .then(data => {
        mesasContainer.innerHTML = '';
        data.forEach(mesa => {
          const mesaBtn = document.createElement('button');
          mesaBtn.classList.add('mesa');
          mesaBtn.classList.add(mesa.situacaoMesa === 1 ? 'ocupada' : 'livre');
          mesaBtn.textContent = `Mesa ${mesa.numeroMesa}`;
          mesaBtn.onclick = () => {
            if (mesa.situacaoMesa === 0) {  // Mesa livre
              numeroMesaInput.value = mesa.numeroMesa;
              modalCriarComanda.style.display = 'block';  // Abre o modal de criação de comanda
            } else {
              alert("Mesa ocupada. Escolha outra.");
            }
          };
          mesasContainer.appendChild(mesaBtn);
        });
      });
  }

  // Função para buscar itens do cardápio
  function buscarItensCardapio() {
    fetch('http://localhost:5163/api/CardapioItems', { method: 'GET' })
      .then(response => response.json())
      .then(data => {
        cardapio = data; // Armazenar os itens do cardápio
        itensCardapioContainer.innerHTML = '';
        data.forEach(item => {
          const itemDiv = document.createElement('div');
          itemDiv.classList.add('item-cardapio');
          itemDiv.innerHTML = `
            <span>${item.titulo} - R$${item.preco}</span>
            <button class="adicionar-item" data-id="${item.id}">Adicionar</button>
            <button class="remover-item" data-id="${item.id}">Remover</button>
            <span id="quantidade-${item.id}" class="quantidade">Quantidade: 0</span>
          `;
          itensCardapioContainer.appendChild(itemDiv);
        });

        // Adicionar eventos aos botões de adicionar/remover itens
        document.querySelectorAll('.adicionar-item').forEach(btn => {
          btn.addEventListener('click', () => adicionarItem(Number(btn.dataset.id)));
        });
        
        document.querySelectorAll('.remover-item').forEach(btn => {
          btn.addEventListener('click', () => removerItem(Number(btn.dataset.id)));
        });
      });
  }

  // Função para adicionar item ao array de itens selecionados
  function adicionarItem(id) {
    if (itensSelecionados[id]) {
      itensSelecionados[id].quantidade += 1;
    } else {
      itensSelecionados[id] = { quantidade: 1 };  // Adiciona o item com quantidade 1
    }
    atualizarListaItens(); // Atualiza a lista de itens selecionados no modal
    atualizarQuantidadeItem(id); // Atualiza a quantidade do item no cardápio
  }

  // Função para remover item do array de itens selecionados
  function removerItem(id) {
    if (itensSelecionados[id]) {
      if (itensSelecionados[id].quantidade > 1) {
        itensSelecionados[id].quantidade -= 1;  // Decrementa a quantidade
      } else {
        delete itensSelecionados[id];  // Remove o item se a quantidade chegar a zero
      }
    }
    atualizarListaItens(); // Atualiza a lista de itens selecionados no modal
    atualizarQuantidadeItem(id); // Atualiza a quantidade do item no cardápio
  }

  // Atualizar a lista de itens selecionados no modal de revisão
  function atualizarListaItens() {
    revisarItens.innerHTML = Object.keys(itensSelecionados)
      .map(id => {
        const item = cardapio.find(i => i.id === Number(id)); // Buscar título do item pelo ID
        return `<li>${item ? item.titulo + " - Quantidade: " + itensSelecionados[id].quantidade : 'Item não encontrado'}</li>`;
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
  revisarPedidoBtn.onclick = () => {
    comandaData = {
      nomeCliente: nomeClienteInput.value,
      numeroMesa: numeroMesaInput.value,
      cardapioItems: Object.keys(itensSelecionados).map(id => {
        return { id: Number(id), quantidade: itensSelecionados[id].quantidade };
      })
    };

    revisarNomeCliente.textContent = comandaData.nomeCliente;
    revisarNumeroMesa.textContent = comandaData.numeroMesa;
    
    // Atualiza a lista de itens no modal de revisão
    atualizarListaItens();

    revisarPedidoModal.style.display = 'block'; // Abre o modal de revisão do pedido
  };

  // Função para criar a comanda (realizar o POST)
function criarComanda() {
  // Verificar se os dados estão corretos antes de enviar
  if (!comandaData.nomeCliente.trim() || !comandaData.numeroMesa || comandaData.cardapioItems.length === 0) {
    return; // Não faz nada se os dados estiverem incompletos
  }

  // Exibir os dados que serão enviados para a API (apenas para debug)
  console.log("Dados a serem enviados para a API:", comandaData);

  // Preparar o payload no formato correto
  const comandaPayload = {
    numeroMesa: comandaData.numeroMesa,
    nomeCliente: comandaData.nomeCliente,
    cardapioItems: comandaData.cardapioItems.map(item => item.id) // Só enviamos os IDs dos itens
  };

  // Log para checar o formato do payload
  console.log("Payload para o POST:", JSON.stringify(comandaPayload, null, 2));

  // Realizar o POST
  fetch('http://localhost:5163/api/Comandas', {
    method: 'POST',
    headers: {
      'accept': 'text/plain',  // Como no curl
      'Content-Type': 'application/json'  // Para enviar os dados no formato JSON
    },
    body: JSON.stringify(comandaPayload)  // Envia o JSON
  })
  .then(response => response.json())
  .then(data => {
    // Caso a resposta da API seja bem-sucedida, limpar os dados e atualizar as mesas
    if (data.success) {
      nomeClienteInput.value = '';
      numeroMesaInput.value = '';
      itensSelecionados = {};
      comandaData = {};
      buscarMesas(); // Atualiza a lista de mesas
    }
  })
  .catch(error => {
    // Não exibe erro, apenas loga o problema no console
    console.error("Erro ao realizar o POST:", error);
  })
  .finally(() => {
    // Fechar todos os modais independentemente da resposta
    fecharTodosModais();
    buscarMesas();
  });
}

// Fechar todos os modais
function fecharTodosModais() {
  modalCriarComanda.style.display = 'none';
  cardapioModal.style.display = 'none';
  revisarPedidoModal.style.display = 'none';
}

// Fechar todos os modais
function fecharTodosModais() {
  modalCriarComanda.style.display = 'none';
  cardapioModal.style.display = 'none';
  revisarPedidoModal.style.display = 'none';
}

  // Fechar todos os modais
  function fecharTodosModais() {
    modalCriarComanda.style.display = 'none';
    cardapioModal.style.display = 'none';
    revisarPedidoModal.style.display = 'none';
  }

  // Fechar modais ao clicar fora do conteúdo
  [modalCriarComanda, cardapioModal, revisarPedidoModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });

  // Adicionar evento para fechar modais pelos botões de fechar
  document.querySelectorAll('.btn-fechar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal');  // Encontra o modal mais próximo
      if (modal) {
        modal.style.display = 'none';
      }
    });
  });

  // Exibir modal de adicionar itens ao cardápio
  adicionarItensBtn.onclick = () => {
    cardapioModal.style.display = 'block';
    buscarItensCardapio(); // Carregar os itens do cardápio
  };

  // Exibe o modal de criação da comanda ao clicar no botão
  novaComandaBtn.onclick = () => {
    modalCriarComanda.style.display = 'block';
  };

  // Capturar o clique no botão "Criar Comanda" no modal "Revisar Pedido"
  document.getElementById('criarComanda').addEventListener('click', () => {
    console.log("Botão 'Criar Comanda' foi clicado");
  
    // Chamar a função de criação da comanda
    criarComanda();
  });

  // Iniciar a busca pelas mesas e itens
  buscarMesas();
});
