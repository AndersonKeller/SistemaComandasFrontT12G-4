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
              // Requisição PATCH para finalizar a comanda
              fetch(`http://www.cluckinbell123.somee.com/api/Comandas/${comanda.id}`, {
                method: 'PATCH',
                headers: {
                  'accept': '*/*',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  // Corpo da requisição, caso precise
                })
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