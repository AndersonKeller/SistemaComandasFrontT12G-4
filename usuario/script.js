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
                <button class="edit-button">Editar</button>
            `;
            
            // Se não for o admin, adiciona o botão de excluir
            if (usuario.nome !== 'admin') {
                buttonsHTML += `<button class="delete-button">Excluir</button>`;
            }

            // Define o conteúdo HTML do elemento do usuário
            usuarioElement.innerHTML = buttonsHTML;

            // Adiciona os eventos aos botões depois que o HTML é inserido
            const editButton = usuarioElement.querySelector('.edit-button');
            const deleteButton = usuarioElement.querySelector('.delete-button');

            // Se o botão de editar existir, adiciona o evento
            if (editButton) {
                editButton.addEventListener("click", () => editUsuario(usuario.id));
            }

            // Se o botão de excluir existir, adiciona o evento
            if (deleteButton) {
                deleteButton.addEventListener("click", () => prepareDelete(usuario.id));
            }

            // Adiciona o usuário ao container
            resultContainer.appendChild(usuarioElement);
        });
    } catch (error) {
        resultContainer.innerHTML = `<p>Erro: ${error.message}</p>`;
    }
}

// Função para abrir o modal para adicionar um novo usuário
document.getElementById("openModal").onclick = () => {
    currentEditId = null; // Limpa o ID ao abrir o modal
    document.getElementById("modalTitle").innerText = "Criar usuário";
    document.getElementById("editModal").style.display = "flex"; // Abre o modal
    // Limpa os campos do formulário
    document.getElementById("editNome").value = '';
    document.getElementById("editEmail").value = '';
    document.getElementById("editSenha").value = '';
};

// Adiciona ou edita um usuário ao enviar o formulário
document.getElementById("saveEdit").addEventListener("click", async () => {
    const nome = document.getElementById("editNome").value;
    const email = document.getElementById("editEmail").value;
    const senha = document.getElementById("editSenha").value;

    if (currentEditId) {
        // Editar usuário existente
        try {
            const response = await fetch(`http://www.cluckinbell123.somee.com/api/Usuarios/${currentEditId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ id: currentEditId, nome, email, senha })
            });

            if (!response.ok) throw new Error("Erro ao editar usuário");
        } catch (error) {
            alert(`Erro: ${error.message}`);
        }
    } else {
        // Adicionar novo usuário
        try {
            const response = await fetch("http://www.cluckinbell123.somee.com/api/Usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ nome, email, senha })
            });

            if (!response.ok) throw new Error("Erro ao criar usuário");
        } catch (error) {
            alert(`Erro: ${error.message}`);
        }
    }

    fetchUsuarios(); // Atualiza a lista
    document.getElementById("editModal").style.display = "none"; // Fecha o modal
});

// Função para editar um usuário
async function editUsuario(id) {
    currentEditId = id; // Armazena o ID do usuário que está sendo editado
    document.getElementById("modalTitle").innerText = "Editar usuário";

    // Obtém os dados do usuário
    try {
        const response = await fetch(`http://www.cluckinbell123.somee.com/api/Usuarios/${id}`);
        if (!response.ok) throw new Error("Erro ao buscar usuário para edição");

        const usuario = await response.json();
        document.getElementById("editNome").value = usuario.nome;
        document.getElementById("editEmail").value = usuario.email;
        document.getElementById("editSenha").value = usuario.senha;

        document.getElementById("editModal").style.display = "flex"; // Abre o modal
    } catch (error) {
        alert(`Erro: ${error.message}`);
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

// Função para preparar a exclusão de um usuário
function prepareDelete(id) {
    userToDeleteId = id; // Armazena o ID do usuário a ser excluído
    document.getElementById("confirmDeleteModal").style.display = "flex"; // Exibe o modal de confirmação
}

// Função para confirmar a exclusão de um usuário
async function confirmDelete() {
    if (!userToDeleteId) return;

    try {
        const response = await fetch(`http://www.cluckinbell123.somee.com/api/Usuarios/${userToDeleteId}`, {
            method: "DELETE",
            headers: { "Accept": "application/json" }
        });

        if (!response.ok) throw new Error("Erro ao excluir usuário");

        // Atualiza a lista de usuários
        fetchUsuarios();
        document.getElementById("confirmDeleteModal").style.display = "none"; // Fecha o modal de confirmação
    } catch (error) {
        alert(`Erro: ${error.message}`);
        document.getElementById("confirmDeleteModal").style.display = "none"; // Fecha o modal de erro
    }
}

// Função para cancelar a exclusão e fechar o modal
document.getElementById("cancelDeleteButton").onclick = () => {
    document.getElementById("confirmDeleteModal").style.display = "none";
};

// Função para fechar o modal de confirmação ao clicar no "x"
document.getElementById("closeConfirmDeleteModal").onclick = () => {
    document.getElementById("confirmDeleteModal").style.display = "none";
};
