function showModal(message) {
  const modal = document.getElementById('errorModal');
  const errorMsg = document.getElementById('errorMsg');

  errorMsg.textContent = message;
  modal.style.display = 'block';
} 

 function closeModal() {
  const modal = document.getElementById('errorModal');
  modal.style.display = 'none';
}

let btnChat = document.getElementById('chat_btn');

btnChat.addEventListener('click', function(e) {
  e.preventDefault();

  // Enviar uma solicitação POST para a rota '/'
  fetch('/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(data).toString()
  })
  .then(response => response.text())
  .then(responseText => {
    // Verificar a resposta do servidor
    if (responseText === 'Token não fornecido' || responseText === 'Token inválido') {
      // Se o token não foi fornecido ou é inválido, exibir o modal
      showModal(responseText);
      
    } else {
      // Se o token é válido, redirecionar para a página de chat
      window.location.href = '/chat';
    }
  })
  .catch(error => {
    console.error('Erro ao processar a solicitação:', error);
  });
});
