document.addEventListener('DOMContentLoaded', function () {
    // Função para fazer a requisição e criar os cards
    function fetchAndCreateCards(situacaoId, columnId) {
        fetch(`http://www.cluckinbell123.somee.com/api/PedidoCozinhas?situacaoId=${situacaoId}`, {
            method: 'GET',
            headers: {
                'Accept': 'text/plain',
            }
        })
        .then(response => response.json())
        .then(data => {
            const column = document.getElementById(columnId);
            const cardsContainer = column.querySelector('.kanban-cards');
            
            // Limpar os cards existentes antes de adicionar novos
            cardsContainer.innerHTML = '';

            // Criar os novos cards
            data.forEach(pedido => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.setAttribute('data-id', pedido.id);  // Adiciona o ID no card
                card.innerHTML = `
                    <h3>${pedido.titulo}</h3>
                    <p><strong>Numero do pedido:</strong> ${pedido.id}</p>
                    <p><strong>Mesa:</strong> ${pedido.numeroMesa}</p>
                    <p><strong>Cliente:</strong> ${pedido.nomeCliente}</p>
                `;

                // Botões de Voltar e Avançar Status nas colunas
                if (columnId === 'novos') {
                    card.innerHTML += '<button class="avancar-status">Avançar Status</button>';
                }

                if (columnId === 'em-preparo') {
                    card.innerHTML += `
                        <button class="voltar-status">Voltar Status</button>
                        <button class="avancar-status">Avançar Status</button>
                    `;
                } else if (columnId === 'prontos') {
                    card.innerHTML += `
                        <button class="voltar-status">Voltar Status</button>
                        <button class="avancar-status">Finalizar Pedido</button>
                    `;
                }

                // Adicionar o card no container
                cardsContainer.appendChild(card);
            });

            // Adicionar eventos aos botões
            const avancarButtons = column.querySelectorAll('.avancar-status');
            avancarButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const pedidoId = this.closest('.card').getAttribute('data-id');
                    avancarStatus(pedidoId, columnId);  // Passa o columnId para a função
                });
            });

            const voltarButtons = column.querySelectorAll('.voltar-status');
            voltarButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const pedidoId = this.closest('.card').getAttribute('data-id');
                    voltarStatus(pedidoId, columnId);  // Passa o columnId para a função
                });
            });
        })
        .catch(error => console.error('Erro ao carregar os pedidos:', error));
    }

    // Função para avançar o status do pedido
function avancarStatus(pedidoId, columnId) {
    let novoStatusId;

    // Definir o novo status com base na coluna
    if (columnId === 'novos') {
        novoStatusId = 2; // De Novos para Em Preparo
    } else if (columnId === 'em-preparo') {
        novoStatusId = 3; // De Em Preparo para Pronto
    } else if (columnId === 'prontos') {
        novoStatusId = 4; // De Pronto para Finalizado ou outro status
    }

    // Atualiza o status na API
    fetch(`http://www.cluckinbell123.somee.com/api/PedidoCozinhas/${pedidoId}`, {
        method: 'PUT',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "novoStatusId": novoStatusId })
    })
    .then(response => {
        // Verificar se o código da resposta é 2xx (sucesso)
        if (!response.ok) {
            throw new Error('Erro ao atualizar o status do pedido. Código de resposta: ' + response.status);
        }

        // Caso a resposta seja vazia (204), não há necessidade de chamar response.json()
        if (response.status === 204) {
            return null;
        }

        // Tentar converter a resposta em JSON se houver conteúdo
        return response.json();
    })
    .then(data => {
        if (data) {
            console.log('Status do pedido avançado:', data);
        }

        // Recarregar todas as colunas após a alteração
        // Carregar as colunas após a mudança de status
        fetchAndCreateCards(1, 'novos');        // Recarrega a coluna "novos"
        fetchAndCreateCards(2, 'em-preparo');   // Recarrega a coluna "em-preparo"
        fetchAndCreateCards(3, 'prontos');      // Recarrega a coluna "prontos"
    })
    .catch(error => {
        console.error('Erro ao avançar o status do pedido:', error);
    });
}

// Função para voltar o status do pedido
function voltarStatus(pedidoId, columnId) {
    let novoStatusId;

    // Definir o novo status com base na coluna
    if (columnId === 'em-preparo') {
        novoStatusId = 1; // De Em Preparo para Novos
    } else if (columnId === 'prontos') {
        novoStatusId = 2; // De Pronto para Em Preparo
    }

    fetch(`http://www.cluckinbell123.somee.com/api/PedidoCozinhas/${pedidoId}`, {
        method: 'PUT',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "novoStatusId": novoStatusId })
    })
    .then(response => {
        // Verificar se o código da resposta é 2xx (sucesso)
        if (!response.ok) {
            throw new Error('Erro ao atualizar o status do pedido. Código de resposta: ' + response.status);
        }

        // Caso a resposta seja vazia (204), não há necessidade de chamar response.json()
        if (response.status === 204) {
            return null;
        }

        // Tentar converter a resposta em JSON se houver conteúdo
        return response.json();
    })
    .then(data => {
        if (data) {
            console.log('Status do pedido revertido:', data);
        }

        // Recarregar todas as colunas após a alteração
        // Carregar as colunas após a mudança de status
        fetchAndCreateCards(1, 'novos');        // Recarrega a coluna "novos"
        fetchAndCreateCards(2, 'em-preparo');   // Recarrega a coluna "em-preparo"
        fetchAndCreateCards(3, 'prontos');      // Recarrega a coluna "prontos"
    })
    .catch(error => {
        console.error('Erro ao voltar o status do pedido:', error);
    });
}

    // Carregar os pedidos para cada status com os novos curl
    fetchAndCreateCards(1, 'novos');        // Pedidos Novos (situacaoId=1)
    fetchAndCreateCards(2, 'em-preparo');   // Pedidos em Preparo (situacaoId=2)
    fetchAndCreateCards(3, 'prontos');      // Pedidos Prontos (situacaoId=3)
});
