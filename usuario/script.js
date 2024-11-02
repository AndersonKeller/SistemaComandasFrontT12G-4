let currentEditId = null; // Para armazenar o ID do usuario que está sendo editado

// Carrega os itens ao carregar a página
window.addEventListener("DOMContentLoaded", fetchUsuarios);

// Função para buscar e exibir itens
async function fetchUsuarios() {
    const resultContainer = document.getElementById("resultContainer");
    resultContainer.innerHTML = "<p>Carregando...</p>";

    try {
        const response = await fetch("http://localhost:5163/api/Usuarios", {
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
            usuarioElement.innerHTML = `
                <h2>${usuario.nome}</h2>
                <p>${usuario.email}</p>
                <button class="edit-button" onclick="editUsuario(${usuario.id})">Editar</button>
                <button class="delete-button" onclick="deleteUsuario(${usuario.id})">Excluir</button>
            `;
            resultContainer.appendChild(usuarioElement);
        });
    } catch (error) {
        resultContainer.innerHTML = `<p>Erro: ${error.message}</p>`;
    }
}

// Função para abrir o modal para adicionar um novo usuario
document.getElementById("openModal").onclick = () => {
    currentEditId = null; // Limpa o ID ao abrir o modal
    document.getElementById("modalTitle").innerText = "Criar usuário";
    document.getElementById("editModal").style.display = "flex"; // Abre o modal
    // Limpa os campos do formulário
    document.getElementById("editUsuario").value = '';
    document.getElementById("editEmail").value = '';
    document.getElementById("editSenha").value = '';
};

// Adiciona um novo usuario ao enviar o formulário
document.getElementById("saveEdit").addEventListener("click", async () => {
    const nome = document.getElementById("editNome").value;
    const email = document.getElementById("editEmail").value;
    const senha = document.getElementById("editSenha").value;
    

    if (currentEditId) {
        // Editar usuario existente
        try {
            const response = await fetch(`http://localhost:5163/api/Usuarios/${currentEditId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ id: currentEditId, nome, email, senha})
            });

            if (!response.ok) throw new Error("Erro ao editar usuário");
        } catch (error) {
            alert(`Erro: ${error.message}`);
        }
    } else {
        // Adicionar novo usuario
        try {
            const response = await fetch("http://localhost:5163/api/Usuarios", {
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

// Função para editar um usuario
async function editUsuario(id) {
    currentEditId = id; // Armazena o ID do usuario que está sendo editado
    document.getElementById("modalTitle").innerText = "Editar usuario";

    // Obtém os dados do usuario
    try {
        const response = await fetch(`http://localhost:5163/api/Usuarios/${id}`);
        if (!response.ok) throw new Error("Erro ao buscar usuario para edição");

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

window.onclick = (event) => {
    const modal = document.getElementById("editModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

// Função para remover um usuario
async function deleteUsuario(id) {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
        const response = await fetch(`http://localhost:5163/api/Usuarios/${id}`, {
            method: "DELETE",
            headers: { "Accept": "application/json" }
        });

        if (!response.ok) throw new Error("Erro ao excluir usuário");
        fetchUsuarios(); // Atualiza a lista
    } catch (error) {
        alert(`Erro: ${error.message}`);
    }
}
