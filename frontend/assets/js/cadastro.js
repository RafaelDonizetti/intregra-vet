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
  
  let btnCadastro = document.getElementById('btnCadastro')
  
  btnCadastro.addEventListener('click', function (e) {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const emailConfirm = document.getElementById('emailConfirm').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const nomeDoUsuario = document.getElementById('nomeDoUsuario').value;
    const btnClose = document.getElementById('botaoFechar');
  
    const data = {
        nomeDoUsuario: nomeDoUsuario,
        email: email,
        password: password,
        emailConfirm: emailConfirm,
        passwordConfirm: passwordConfirm
    };
  
    fetch('/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data).toString()
    })
    .then(response => response.text())
    .then(responseText => {
        if (responseText === "Usuário adicionado com sucesso!") {
            btnClose.style.display = "none";
            showModal("Usuário adicionado com sucesso! Redirecionando...");
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            showModal(responseText);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showModal('Erro na conexão. Tente novamente mais tarde.');
    });
  });