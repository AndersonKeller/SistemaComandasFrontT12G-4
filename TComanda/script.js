document.getElementById('criarComanda').addEventListener('click', function() {
    criarComanda();
});

document.getElementById('atualizarComanda').addEventListener('click', function() {
    atualizarComanda();
});

function criarComanda() {
    
    const numeroComanda = prompt('Digite o número da nova comanda:');
    if (numeroComanda) {
        document.getElementById('status').innerText = 'Comanda ' + numeroComanda + ' criada com sucesso!';
    } else {
        alert('Número da comanda não pode ser vazio.');
    }
}

function atualizarComanda() {
    
    const numeroComanda = prompt('Digite o número da comanda que deseja atualizar:');
    if (numeroComanda) {
        document.getElementById('status').innerText = 'Comanda ' + numeroComanda + ' atualizada com sucesso!';
    } else {
        alert('Número da comanda não pode ser vazio.');
    }
}
