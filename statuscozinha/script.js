// Simulação de pedidos (esses dados podem ser manipulados conforme a lógica do seu sistema)
const pedidos = [
    { id: 1, nome: "João", mesa: 5, valor: 50 },
    { id: 2, nome: "Maria", mesa: 3, valor: 30 },
    { id: 3, nome: "Pedro", mesa: 2, valor: 20 }
];

// Função para atualizar a tabela de pedidos
function atualizarTabela(status, pedidosLista) {
    const tbody = document.getElementById(`${status}-lista`);
    tbody.innerHTML = ""; // Limpa a tabela antes de preencher

    pedidosLista.forEach(pedido => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${pedido.id}</td>
            <td>${pedido.nome}</td>
            <td>${pedido.mesa}</td>
            <td>R$${pedido.valor}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Inicializar as tabelas com os pedidos
let pedidosNovo = [...pedidos]; // Pedidos começam como novos
let pedidosEmPreparo = [];
let pedidosPronto = [];

atualizarTabela("novo", pedidosNovo);

// Função para exibir uma mensagem de feedback
function exibirMensagem(tipo, mensagem) {
    const mensagemFeedback = document.getElementById("mensagem-feedback");
    mensagemFeedback.classList.remove("sucesso", "erro");
    mensagemFeedback.classList.add(tipo);
    mensagemFeedback.textContent = mensagem;
    mensagemFeedback.style.display = "block";
}

// Função para mover os pedidos entre os status
function moverPedido(statusDe, statusPara) {
    if (statusDe.length > 0) {
        const pedido = statusDe.shift(); // Pega o primeiro pedido da lista
        statusPara.push(pedido); // Adiciona à lista do próximo status
        atualizarTabela(statusDe === pedidosNovo ? "novo" : (statusDe === pedidosEmPreparo ? "em-preparo" : "pronto"), statusDe);
        atualizarTabela(statusPara === pedidosEmPreparo ? "em-preparo" : (statusPara === pedidosPronto ? "pronto" : "novo"), statusPara);
    }
}

// Evento de avançar da tabela "Novo" para "Em Preparo"
document.getElementById("avancar-novo").addEventListener("click", () => {
    moverPedido(pedidosNovo, pedidosEmPreparo);
});

// Evento de voltar da tabela "Em Preparo" para "Novo"
document.getElementById("voltar-em-preparo").addEventListener("click", () => {
    moverPedido(pedidosEmPreparo, pedidosNovo);
});

// Evento de avançar da tabela "Em Preparo" para "Pronto"
document.getElementById("avancar-em-preparo").addEventListener("click", () => {
    moverPedido(pedidosEmPreparo, pedidosPronto);
});

// Evento de voltar da tabela "Pronto" para "Em Preparo"
document.getElementById("voltar-pronto").addEventListener("click", () => {
    moverPedido(pedidosPronto, pedidosEmPreparo);
});

// Evento de finalizar o pedido
document.getElementById("finalizar").addEventListener("click", () => {
    if (pedidosPronto.length > 0) {
        pedidosPronto.shift(); // Finaliza o primeiro pedido pronto
        atualizarTabela("pronto", pedidosPronto);
        exibirMensagem("sucesso", "Pedido finalizado com sucesso!");
    } else {
        exibirMensagem("erro", "Não há pedidos prontos para finalizar.");
    }
});
