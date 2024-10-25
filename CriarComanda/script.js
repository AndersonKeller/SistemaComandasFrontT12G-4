document.getElementById('criarComanda').addEventListener('click', function() {
    criarComanda();
});

function criarComanda() {
    const nome = document.getElementById('nome').value;
    const mesa = document.getElementById('mesa').value;
    const valor = document.getElementById('valor').value;
    const numero = document.getElementById('numero').value;

    if (nome && mesa && valor && numero) {
        document.getElementById('status').innerText = `Comanda criada com sucesso!\nNome: ${nome}\nMesa: ${mesa}\nValor: R$ ${parseFloat(valor).toFixed(2)}\nNúmero da Comanda: ${numero}`;
    } else {
        document.getElementById('status').innerText = 'Por favor, preencha todos os campos.';
    }
}
