// Função para limpar os campos do formulário
function limparCampos() {
    document.getElementById("pedido-form").reset();
    // Limpar a mensagem de feedback
    const mensagemFeedback = document.getElementById("mensagem-feedback");
    mensagemFeedback.style.display = "none";
}

// Função para exibir uma mensagem de feedback
function exibirMensagem(tipo, mensagem) {
    const mensagemFeedback = document.getElementById("mensagem-feedback");
    mensagemFeedback.classList.remove("sucesso", "erro");
    mensagemFeedback.classList.add(tipo);
    mensagemFeedback.textContent = mensagem;
    mensagemFeedback.style.display = "block";
}

// Função para criar o pedido
function criarPedido() {
    const nome = document.getElementById("nome").value;
    const mesa = document.getElementById("mesa").value;
    const numero = document.getElementById("numero").value;
    const valor = document.getElementById("valor").value;

    // Verificação simples para garantir que todos os campos foram preenchidos
    if (!nome || !mesa || !numero || !valor) {
        exibirMensagem("erro", "Todos os campos são obrigatórios.");
        return;
    }

    // Exibir mensagem de sucesso
    exibirMensagem("sucesso", `Pedido Criado!\nNome: ${nome}\nMesa: ${mesa}\nNúmero: ${numero}\nValor: R$${valor}`);
    
    // Limpar campos após a criação
    limparCampos();
}

// Adicionando os ouvintes de eventos para os botões
document.getElementById("criar-btn").addEventListener("click", criarPedido);
document.getElementById("cancelar-btn").addEventListener("click", limparCampos);
