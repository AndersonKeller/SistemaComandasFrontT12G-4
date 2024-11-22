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
            data.forEach(pedido => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `
                    <h3>${pedido.titulo}</h3>
                    <p><strong>Mesa:</strong> ${pedido.numeroMesa}</p>
                    <p><strong>Cliente:</strong> ${pedido.nomeCliente}</p>
                `;
                cardsContainer.appendChild(card);
            });
        })
        .catch(error => console.error('Erro ao carregar os pedidos:', error));
    }

    // Carregar os pedidos para cada status com os novos curl
    fetchAndCreateCards(0, 'novos');        // Pedidos Novos (situacaoId=0)
    fetchAndCreateCards(1, 'em-preparo');   // Pedidos em Preparo (situacaoId=1)
    fetchAndCreateCards(2, 'prontos');      // Pedidos Prontos (situacaoId=2)
});
