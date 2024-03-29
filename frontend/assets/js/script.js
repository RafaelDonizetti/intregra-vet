function openNav() {
  document.getElementById("mySidebar").style.width = "100%";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
}

// modal sem token

function openModal() {
  document.getElementById('modal').style.display = 'block';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

document.addEventListener("DOMContentLoaded", function () {
  const chatButton = document.getElementById("chat_btn");

  chatButton.addEventListener("click", function (event) {
    // Evita o comportamento padrão de navegação do link
    event.preventDefault();

    // Antes de redirecionar para o chat, verifique a autenticação
    fetch("/verify")
      .then(response => {
        if (!response.ok) {
          // Se a resposta não estiver OK, lance um erro com a mensagem da resposta
          throw new Error(response.statusText);
        }
        // Se o usuário estiver autenticado, redirecione para o chat
        window.location.href = "/chat";
      })
      .catch(error => {
        // Exiba o modal e mostre a mensagem de erro do servidor
        openModal();
        console.error("Erro de autenticação:", error.message);
      });
  });
});




