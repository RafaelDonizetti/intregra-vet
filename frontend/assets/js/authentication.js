function handleSuccessfulLogin() {
  // Redirecionar para a página desejada ou realizar outras ações necessárias
  window.location.href = "/chat";
}

// Obtenha os valores do email e senha do formulário ou de onde quer que estejam disponíveis
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

const data = {
  email: email,
  password: password,
};

// Exemplo de uso do fetch com token no header
fetch("/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Cookie: document.cookie, // Inclua o cookie nas solicitações
  },
  body: new URLSearchParams(data).toString(),
})
  .then((response) => {
    if (!response.ok) {
      // Loga o corpo da resposta em caso de erro
      response.text().then((errorBody) => {
        console.error("Erro na solicitação:", errorBody);
      });

      throw new Error("Erro na solicitação: " + response.statusText);
    }
    return response.json();
  })
  .then((data) => {
    // Se a resposta contiver um cookie, configure-o
    if (data.token) {
      document.cookie = `token=${data.token}; max-age=${
        7 * 24 * 60 * 60
      }; path=/`; // ajuste o caminho conforme necessário
    }

    // Chame a função para lidar com o login bem-sucedido
    handleSuccessfulLogin();
  })
  .catch((error) => {
    console.error("Erro na requisição:", error);
    // Trate o erro adequadamente, por exemplo, mostrando uma mensagem para o usuário
  });
