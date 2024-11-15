let currentEditId = null; // Para armazenar o ID do item que está sendo editado
let currentDeleteId = null; // Para armazenar o ID do item que será excluído

// Carrega os itens ao carregar a página
window.addEventListener("DOMContentLoaded", fetchCardapioItems);

// Função para buscar e exibir itens
async function fetchCardapioItems() {
    const resultContainer = document.getElementById("resultContainer");
    resultContainer.innerHTML = "<p>Carregando...</p>";

    try {
        const response = await fetch("http://localhost:5163/api/CardapioItems", {
            headers: {
                "Accept": "application/json"
            }
        });

        if (!response.ok) throw new Error("Erro ao buscar dados da API");

        const data = await response.json();
        resultContainer.innerHTML = "";

        data.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.classList.add("resultItem");
            itemElement.innerHTML = `
                <h2>${item.titulo}</h2>
                <p>${item.descricao}</p>
                <p class="price">Preço: R$${parseFloat(item.preco).toFixed(2)}</p>
                <p class="preparation">${item.possuiPreparo ? "Requer preparo" : "Pronto para servir"}</p>
                <button class="edit-button" onclick="editItem(${item.id})">Editar</button>
                <button class="delete-button" onclick="openDeleteConfirmationModal(${item.id})">Excluir</button>
            `;
            resultContainer.appendChild(itemElement);
        });
    } catch (error) {
        resultContainer.innerHTML = `<p>Erro: ${error.message}</p>`;
    }
}

// Função para abrir o modal para adicionar um novo item
document.getElementById("openModal").onclick = () => {
    currentEditId = null; // Limpa o ID ao abrir o modal
    document.getElementById("modalTitle").innerText = "Adicionar Novo Item";
    document.getElementById("editModal").style.display = "flex"; // Abre o modal
    // Limpa os campos do formulário
    document.getElementById("editTitulo").value = '';
    document.getElementById("editDescricao").value = '';
    document.getElementById("editPreco").value = '';
    document.getElementById("editPossuiPreparo").checked = false; // Desmarca a checkbox
};

// Adiciona um novo item ao enviar o formulário
document.getElementById("saveEdit").addEventListener("click", async () => {
    const titulo = document.getElementById("editTitulo").value;
    const descricao = document.getElementById("editDescricao").value;
    const preco = parseFloat(document.getElementById("editPreco").value);
    const possuiPreparo = document.getElementById("editPossuiPreparo").checked;

    if (currentEditId) {
        // Editar item existente
        try {
            const response = await fetch(`http://localhost:5163/api/CardapioItems/${currentEditId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ id: currentEditId, titulo, descricao, preco, possuiPreparo })
            });

            if (!response.ok) throw new Error("Erro ao editar item");
        } catch (error) {
            alert(`Erro: ${error.message}`);
        }
    } else {
        // Adicionar novo item
        try {
            const response = await fetch("http://localhost:5163/api/CardapioItems", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ titulo, descricao, preco, possuiPreparo })
            });

            if (!response.ok) throw new Error("Erro ao adicionar item");
        } catch (error) {
            alert(`Erro: ${error.message}`);
        }
    }

    fetchCardapioItems(); // Atualiza a lista
    document.getElementById("editModal").style.display = "none"; // Fecha o modal
});

// Função para editar um item
async function editItem(id) {
    currentEditId = id; // Armazena o ID do item que está sendo editado
    document.getElementById("modalTitle").innerText = "Editar Item do Cardápio";

    // Obtém os dados do item
    try {
        const response = await fetch(`http://localhost:5163/api/CardapioItems/${id}`);
        if (!response.ok) throw new Error("Erro ao buscar item para edição");

        const item = await response.json();
        document.getElementById("editTitulo").value = item.titulo;
        document.getElementById("editDescricao").value = item.descricao;
        document.getElementById("editPreco").value = item.preco;
        document.getElementById("editPossuiPreparo").checked = item.possuiPreparo;

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

// Função para abrir o modal de confirmação de exclusão
function openDeleteConfirmationModal(id) {
    currentDeleteId = id; // Armazena o ID do item a ser excluído
    document.getElementById("deleteConfirmationModal").style.display = "flex"; // Exibe o modal
}

// Função para fechar o modal de confirmação de exclusão
document.getElementById("cancelDelete").onclick = () => {
    document.getElementById("deleteConfirmationModal").style.display = "none"; // Fecha o modal
};

// Função para confirmar a exclusão
document.getElementById("confirmDelete").onclick = async () => {
    if (currentDeleteId !== null) {
        try {
            const response = await fetch(`http://localhost:5163/api/CardapioItems/${currentDeleteId}`, {
                method: "DELETE",
                headers: { "Accept": "application/json" }
            });

            if (!response.ok) throw new Error("Erro ao excluir item");
            fetchCardapioItems(); // Atualiza a lista
        } catch (error) {
            alert(`Erro: ${error.message}`);
        }
    }
    document.getElementById("deleteConfirmationModal").style.display = "none"; // Fecha o modal
};
