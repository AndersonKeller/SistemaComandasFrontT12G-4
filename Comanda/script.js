// Simulação de comandas (uma lista simples)
let comandas = [];

// Função para criar uma nova comanda
function criarComanda() {
    const idComanda = 'C' + (comandas.length + 1);  // Criando um ID único para a comanda
    comandas.push({ id: idComanda, mesas: [] });
    atualizarStatus(`Comanda criada com ID: ${idComanda}`, 'success');
}

// Função para buscar uma comanda pelo ID
function buscarComanda() {
    const comandaId = document.getElementById('comanda-id').value.trim();
    
    if (!comandaId) {
        atualizarStatus("Por favor, insira um ID de comanda.", 'error');
        return;
    }

    const comanda = comandas.find(c => c.id === comandaId);
    if (comanda) {
        atualizarStatus(`Comanda encontrada: ${comanda.id}`, 'success');
    } else {
        atualizarStatus("Comanda não encontrada.", 'error');
    }
}

// Função para selecionar uma mesa e associar a uma comanda
function selecionarMesa(mesaNum) {
    const comandaId = document.getElementById('comanda-id').value.trim();
    
    if (!comandaId) {
        atualizarStatus("Por favor, insira um ID de comanda antes de selecionar uma mesa.", 'error');
        return;
    }

    const comanda = comandas.find(c => c.id === comandaId);
    if (comanda) {
        if (!comanda.mesas.includes(mesaNum)) {
            comanda.mesas.push(mesaNum);
            atualizarStatus(`Mesa ${mesaNum} adicionada à comanda ${comandaId}`, 'success');
        } else {
            atualizarStatus(`Mesa ${mesaNum} já está associada à comanda ${comandaId}.`, 'error');
        }
    } else {
        atualizarStatus
    }
}