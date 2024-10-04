document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5163/api/Usuarios', {
            method: 'GET',
            headers: {
                'Accept': 'text/plain'
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
    var sound = new Audio('\somsino.mp3'); // Adicione o caminho do seu arquivo de som
    sound.currentTime = 0; // Reinicia o som se estiver tocando
    sound.play();
}
function playSound() {
    var sound = new Audio('\somsino.mp3'); // Adicione o caminho do seu arquivo de som
    sound.currentTime = 0; // Reinicia o som se estiver tocando
    sound.play();
}
function playSound() {
    var sound = new Audio('\somsino.mp3'); // Adicione o caminho do seu arquivo de som
    sound.currentTime = 0; // Reinicia o som se estiver tocando
    sound.play();
}
function playSound() {
    var sound = new Audio('\somsino.mp3'); // Adicione o caminho do seu arquivo de som
    sound.currentTime = 0; // Reinicia o som se estiver tocando
    sound.play();
}
function playSound() {
    var sound = new Audio('\somsino.mp3'); // Adicione o caminho do seu arquivo de som
    sound.currentTime = 0; // Reinicia o som se estiver tocando
    sound.play();
}