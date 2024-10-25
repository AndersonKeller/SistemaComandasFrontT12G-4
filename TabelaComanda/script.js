document.getElementById('buscarPedido').addEventListener('click', function() {
    buscarPedido();
});

function buscarPedido() {
    const nomeCliente = document.getElementById('nomeCliente').value;
    const numeroPedido = document.getElementById('numeroPedido').value;

    
    const pedidos = [
        { nome: 'João', mesa: '5', pedido: 'Pizza', valor: '25.00' },
        { nome: 'Maria', mesa: '3', pedido: 'Lanche', valor: '15.00' },
        { nome: 'Carlos', mesa: '1', pedido: 'Refrigerante', valor: '5.00' }
    ];

    
    const resultado = pedidos.filter(pedido => 
        pedido.nome.toLowerCase().includes(nomeCliente.toLowerCase()) &&
        pedido.pedido.includes(numeroPedido)
    );

    
    atualizarTabela(resultado);
}

function atualizarTabela(pedidos) {
    const tabelaCorpo = document.getElementById('tabelaCorpo');
    tabelaCorpo.innerHTML = '';

    if (pedidos.length > 0) {
        pedidos.forEach((pedido, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pedido.nome}</td>
                <td>${pedido.mesa}</td>
                <td>${pedido.pedido}</td>
                <td>R$ ${parseFloat(pedido.valor).toFixed(2)}</td>
                <td>
                    <button onclick="editar(${index})">Editar</button>
                    <button onclick="finalizar(${index})">Finalizar</button>
                    <button onclick="excluir(${index})">Excluir</button>
                </td>
            `;
            tabelaCorpo.appendChild(row);
        });

        document.getElementById('tabelaContainer').style.display = 'block';
    } else {
        tabelaCorpo.innerHTML = '<tr><td colspan="5">Nenhum pedido encontrado.</td></tr>';
        document.getElementById('tabelaContainer').style.display = 'block';
    }
}


function editar(index) {
    alert('Editando pedido na linha: ' + index);
}

function finalizar(index) {
    alert('Finalizando pedido na linha: ' + index);
}

function excluir(index) {
    alert('Excluindo pedido na linha: ' + index);
}
