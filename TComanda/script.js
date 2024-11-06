let currentAction = '';

document.getElementById('criarComanda').addEventListener('click', function() {
    currentAction = 'criar';
    showForm();
});

document.getElementById('atualizarComanda').addEventListener('click', function() {
    currentAction = 'atualizar';
    showForm();
});

document.getElementById('submitComanda').addEventListener('click', function() {
    const numeroComanda = document.getElementById('numeroComandaInput').value;
    if (numeroComanda) {
        document.getElementById('status').innerText = `Comanda ${numeroComanda} ${currentAction === 'criar' ? 'criada' : 'atualizada'} com sucesso!`;
        hideForm();
        document.getElementById('numeroComandaInput').value = ''; // Limpa o campo após enviar
    } else {
        document.getElementById('status').innerText = 'Número da comanda não pode ser vazio.';
    }
});

document.getElementById('cancelar').addEventListener('click', function() {
    hideForm();
});

function showForm() {
    document.getElementById('formContainer').style.display = 'block';
}

function hideForm() {
    document.getElementById('formContainer').style.display = 'none';
}
