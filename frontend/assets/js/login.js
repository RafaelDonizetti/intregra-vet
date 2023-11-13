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


let btnLogin = document.getElementById('btnLogin');

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const btnClose = document.getElementById('botaoFechar');

  const data = {
      email: email,
      password: password,
  };

  fetch('/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(data).toString()
  })
  .then(response => response.text())
  .then(responseText => {
      if (responseText === "Login bem-sucedido!") {
        btnClose.style.display = "none";
        showModal("Logado com sucesso! Redirecionando...");  
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
          showModal(responseText) 
      }
  })
  .catch(error => {
      console.error('Error:', error);
      showModal('Erro na conexão. Tente novamente mais tarde.'); 
  });
});