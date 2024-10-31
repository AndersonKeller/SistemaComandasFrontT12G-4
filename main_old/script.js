document.getElementById('cardapio').addEventListener('click', function() {
    navigate('Cardápio');
});

document.getElementById('comanda').addEventListener('click', function() {
    navigate('Comanda');
});

document.getElementById('cozinha').addEventListener('click', function() {
    navigate('Cozinha');
});

document.getElementById('usuarios').addEventListener('click', function() {
    navigate('Usuários');
});

function navigate(section) {
    alert('Navegando para: ' + section);

}
