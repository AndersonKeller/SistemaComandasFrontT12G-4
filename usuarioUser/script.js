// Carrega os itens ao carregar a página
window.addEventListener("DOMContentLoaded", fetchUsuarios);

// Função para buscar e exibir itens
async function fetchUsuarios() {
    const resultContainer = document.getElementById("resultContainer");
    resultContainer.innerHTML = "<p>Carregando...</p>";

    try {
        const response = await fetch("http://www.cluckinbell123.somee.com/api/Usuarios", {
            headers: {
                "Accept": "application/json"
            }
        });

        if (!response.ok) throw new Error("Erro ao buscar dados da API");

        const data = await response.json();
        resultContainer.innerHTML = "";

        data.forEach(usuario => {
            const usuarioElement = document.createElement("div");
            usuarioElement.classList.add("resultUsuario");

            // Cria o conteúdo HTML do usuário
            let buttonsHTML = `
                <h2>${usuario.nome}</h2>
                <p>${usuario.email}</p>
                <p>ㅤ<p>
            `;
            
            // Define o conteúdo HTML do elemento do usuário
            usuarioElement.innerHTML = buttonsHTML;

            // Adiciona o usuário ao container
            resultContainer.appendChild(usuarioElement);
        });
    } catch (error) {
        resultContainer.innerHTML = `<p>Erro: ${error.message}</p>`;
    }
}

// Fecha o modal ao clicar no "x" ou fora do modal
document.getElementById("closeModal").onclick = () => {
    document.getElementById("editModal").style.display = "none";
};

// Fecha o modal de confirmação ao clicar fora
window.onclick = (event) => {
    const modal = document.getElementById("editModal");
    const confirmDeleteModal = document.getElementById("confirmDeleteModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
    if (event.target === confirmDeleteModal) {
        confirmDeleteModal.style.display = "none";
    }
};
