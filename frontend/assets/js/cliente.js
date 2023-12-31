// Obtendo o valor do cookie
const cookieValue = document.cookie
  .split('; ')
  .find(row => row.startsWith('authToken='))
  .split('=')[1];

// Decodificando o token JWT com suporte a caracteres especiais
function base64UrlDecode(str) {
  const base64 = str.replace('-', '+').replace('_', '/');
  return decodeURIComponent(atob(base64).split('').map(c => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

function decodeJwt(token) {
  const [header, payload] = token.split('.').slice(0, 2);
  const decodedHeader = JSON.parse(base64UrlDecode(header));
  const decodedPayload = JSON.parse(base64UrlDecode(payload));
  return { ...decodedHeader, ...decodedPayload };
}

document.addEventListener('DOMContentLoaded', function() {
    const decodedToken = decodeJwt(cookieValue);
    const nome = decodedToken.userName;
    // Faz a mensagem na tela inicial a depender do token
    const saudacao = document.getElementById('saudacao');
    if (saudacao != null){
        saudacao.innerText = `Olá, ${nome}! Bem-vindo de volta.`;
    }
    const nomeChat = document.getElementById('nome');
    if (nomeChat != null){
        nomeChat.innerText = `${nome}`;
    }
});
