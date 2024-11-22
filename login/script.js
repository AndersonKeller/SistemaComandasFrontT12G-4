document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim(); // Trim para remover espaços em branco
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        document.getElementById('message').textContent = 'Preencha todos os campos!';
        document.getElementById('message').style.color = 'red';
        return;
    }

    try {
        const response = await fetch('http://www.cluckinbell123.somee.com/api/Usuarios', {
            method: 'GET',
            headers: {
                'Accept': 'application/json' // Alterado para receber JSON
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar dados da API');
        }

        const usuarios = await response.json();
        const usuarioEncontrado = usuarios.find(usuario => usuario.nome === username && usuario.senha === password);

        const messageDiv = document.getElementById('message');
        if (usuarioEncontrado) {
            messageDiv.textContent = 'Login bem-sucedido!';
            messageDiv.style.color = 'green';

            // Redireciona para a página \main\index.html após 1 segundo
            setTimeout(() => {
                window.location.href = '../main/index.html'; 
            }, 1000);
        } else {
            messageDiv.textContent = 'Nome ou senha incorretos!';
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('message').textContent = 'Ocorreu um erro. Tente novamente mais tarde.';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.login-header img');

    logo.addEventListener('mouseenter', function() {
        document.body.classList.add('vibrate');
        playSound();
    });

    logo.addEventListener('mouseleave', function() {
        document.body.classList.remove('vibrate');
    });
});

function playSound() {
    const sound = new Audio('somsino.mp3'); // Certifique-se de que o caminho está correto e acessível
    sound.currentTime = 0; // Reinicia o som se estiver tocando
    sound.play();
}
