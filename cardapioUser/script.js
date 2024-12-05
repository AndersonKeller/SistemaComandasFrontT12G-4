// Carrega os itens ao carregar a página
window.addEventListener("DOMContentLoaded", fetchCardapioItems);

// Função para buscar e exibir itens
async function fetchCardapioItems() {
    const resultContainer = document.getElementById("resultContainer");
    resultContainer.innerHTML = "<p>Carregando...</p>";

    try {
        const response = await fetch("http://www.cluckinbell123.somee.com/api/CardapioItems", {
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
            `;
            resultContainer.appendChild(itemElement);
        });
    } catch (error) {
        resultContainer.innerHTML = `<p>Erro: ${error.message}</p>`;
    }
}
