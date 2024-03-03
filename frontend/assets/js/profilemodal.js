// chatmodal.js

// Função para exibir o modal
function showModal(message) {
    const modal = document.getElementById("deleteModal");
  
    // Adiciona a mensagem diretamente ao parágrafo do modal
    const paragraph = modal.querySelector('p');
    paragraph.textContent = message;
  
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("deleteModal");
    modal.style.display = "none";
}

// Adapte o JavaScript para o seu modal
document.addEventListener("DOMContentLoaded", function () {
    // Adiciona um evento de clique ao botão
    const btnDeletes = document.getElementById("btnDelete");
    btnDeletes.addEventListener("click", function () {
        showModal("Tem certeza de que deseja excluir permanentemente sua conta?");
    });
    
    // Adiciona eventos de clique aos botões dentro do modal
    const confirmDelete = document.getElementById("confirmDelete");
    const cancelDelete = document.getElementById("cancelDelete");
    
    confirmDelete.addEventListener("click", function () {
        // Lógica para confirmar a exclusão aqui
    
        // Fechar o modal após a confirmação
        closeModal();
    });
    
    cancelDelete.addEventListener("click", closeModal);
});


