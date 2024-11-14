// Função para buscar e exibir as mesas
function carregarMesas() {
    fetch('http://localhost:5163/api/Mesas', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const mesasContainer = document.getElementById('mesas');
        mesasContainer.innerHTML = ''; // Limpar qualquer conteúdo anterior

        // Criar os elementos para cada mesa
        data.forEach(mesa => {
            const mesaDiv = document.createElement('div');
            mesaDiv.classList.add('mesa');
            mesaDiv.textContent = `Mesa ${mesa.numeroMesa}`;

            // Verifica se a mesa está ocupada ou livre e aplica a cor correspondente
            if (mesa.situacaoMesa === 0) {
                mesaDiv.classList.add('livre'); // Mesa livre
            } else {
                mesaDiv.classList.add('ocupada'); // Mesa ocupada
            }

            // Adicionar o evento de clique para abrir o modal
            mesaDiv.addEventListener('click', function() {
                mostrarDetalhesComanda(mesa.numeroMesa);
            });

            mesasContainer.appendChild(mesaDiv);
        });
    })
    .catch(error => console.error('Erro ao carregar as mesas:', error));
}

// Função para exibir o modal com os detalhes da comanda
function mostrarDetalhesComanda(numeroMesa) {
    // Mostrar o número da mesa no modal
    document.getElementById('numeroMesa').textContent = `Mesa: ${numeroMesa}`;

    // Limpar os detalhes anteriores no modal
    const comandasDetalhes = document.getElementById('comandasDetalhes');
    comandasDetalhes.innerHTML = '';

    // Buscar as comandas associadas ao numeroMesa
    fetch('http://localhost:5163/api/Comandas', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(comandas => {
        // Filtrar as comandas pela mesa que foi clicada
        const comandasNaMesa = comandas.filter(comanda => comanda.numeroMesa === numeroMesa);

        if (comandasNaMesa.length > 0) {
            comandasNaMesa.forEach(comanda => {
                // Criar elementos para exibir os detalhes da comanda
                const comandaDiv = document.createElement('div');
                comandaDiv.classList.add('comanda');

                // Nome do cliente
                const clienteNome = document.createElement('p');
                clienteNome.innerHTML = `<strong>Cliente:</strong> ${comanda.nomeCliente}`;
                comandaDiv.appendChild(clienteNome);

                // Itens da comanda
                const itensList = document.createElement('ul');
                comanda.comandaItens.forEach(item => {
                    const itemList = document.createElement('li');
                    itemList.textContent = item.titulo;
                    itensList.appendChild(itemList);
                });
                comandaDiv.appendChild(itensList);

                comandasDetalhes.appendChild(comandaDiv);
            });
        } else {
            // Se não houver comandas associadas a mesa, mostrar mensagem
            const mensagemVazio = document.createElement('p');
            mensagemVazio.textContent = `Esta mesa está vazia. Nenhuma comanda associada.`;
            comandasDetalhes.appendChild(mensagemVazio);
        }

        // Exibir o modal
        document.getElementById('modal').style.display = 'block';
    })
    .catch(error => console.error('Erro ao carregar as comandas:', error));
}

// Função para fechar o modal
function fecharModal() {
    document.getElementById('modal').style.display = 'none';
}

// Adicionar o evento de fechar o modal
document.getElementById('closeModal').addEventListener('click', fecharModal);

// Inicialização do carregamento das mesas
window.onload = carregarMesas;
