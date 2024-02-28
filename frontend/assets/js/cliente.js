// Obtendo o valor do cookie
const cookieValue = document.cookie
  .split("; ")
  .find((row) => row.startsWith("authToken="))
  .split("=")[1];

// Decodificando o token JWT com suporte a caracteres especiais
function base64UrlDecode(str) {
  const base64 = str.replace("-", "+").replace("_", "/");
  return decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}

function decodeJwt(token) {
  const [header, payload] = token.split(".").slice(0, 2);
  const decodedHeader = JSON.parse(base64UrlDecode(header));
  const decodedPayload = JSON.parse(base64UrlDecode(payload));
  return { ...decodedHeader, ...decodedPayload };
}

//Mensagem na saudação
document.addEventListener("DOMContentLoaded", function () {
  const decodedToken = decodeJwt(cookieValue);
  const textoSaudacao = document.getElementById("titulo_infos");
  const nome = decodedToken.userName;
  const email = decodedToken.userEmail;
  // Faz a mensagem na tela inicial a depender do token
  const saudacao = document.getElementById("saudacao");

  if (saudacao != null) {
    textoSaudacao.style.display = "none";
    saudacao.innerText = `Olá, ${nome}! Bem-vindo de volta.`;
  }
  const nomeChat = document.getElementById("nome");
  if (nomeChat != null) {
    nomeChat.innerText = `${nome}`;
  }
});

function hideLoginButtonOnLogin() {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (loginBtn && logoutBtn) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
  }
}

//caso de login, troca o nome do botão para o nome do usuário
document.addEventListener("DOMContentLoaded", function () {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    .split("=")[1];

  const decodedToken = cookieValue ? decodeJwt(cookieValue) : null;
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (decodedToken) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
  } else {
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
  }
});

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/"; // Ajuste o caminho conforme necessário
  });
}

//logout function
function showProfileButton(username) {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const profileBtn = document.getElementById("profileBtn");
  const userBtn = document.getElementById("userBtn");
  const profileDropdown = document.getElementById("profileDropdown");
  const logoutBtnInDropdown = document.getElementById("logoutBtnInDropdown");

  if (
    loginBtn &&
    logoutBtn &&
    profileBtn &&
    userBtn &&
    profileDropdown &&
    logoutBtnInDropdown
  ) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    profileBtn.style.display = "block";
    userBtn.innerText = username;

    userBtn.addEventListener("click", function () {
      if (profileDropdown.style.display === "none") {
        profileDropdown.style.display = "block";
      } else {
        profileDropdown.style.display = "none";
      }
    });

    logoutBtnInDropdown.addEventListener("click", function () {
      document.cookie =
        "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/"; // Ajuste o caminho conforme necessário
    });
  }
}

//Habilita e desabilita botão de login
document.addEventListener("DOMContentLoaded", function () {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    .split("=")[1];

  const decodedToken = cookieValue ? decodeJwt(cookieValue) : null;
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const profileBtn = document.getElementById("profileBtn");
  const profileDropdown = document.getElementById("profileDropdown");
  const loginDrop = document.getElementById("loginBtn-sideBar");

  if (decodedToken) {
    showProfileButton(decodedToken.userName);
  } else {
    if (loginDrop) {
      loginDrop.style.display = "none";
    }
    if (loginBtn) {
      loginBtn.style.display = "block";
    } else {
      logoutBtn.style.display = "none";
    }
    if (profileBtn) {
      profileBtn.style.display = "none";
    }
    if (profileDropdown) profileDropdown.style.display = "none";
  }
});

// profile.js

document.addEventListener("DOMContentLoaded", function () {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    .split("=")[1];

  const decodedToken = cookieValue ? decodeJwt(cookieValue) : null;
  const profileUserName = document.getElementById("profileUserName");
  const profileUserEmail = document.getElementById("profileEmail")
  const profileImage = document.getElementById("profileImage");
  const profileImageAdm = document.getElementById("profileImageAdm")
  const fileInput = document.getElementById("fileInput");
  const uploadButton = document.getElementById("uploadButton");

  if (decodedToken && profileUserName) {
    profileUserName.innerText = decodedToken.userName;
    profileUserEmail.innerText = decodedToken.userEmail;
  }

  if(profileImage) {
  profileImage.src = "assets/img/userPadrao.png";
  }
  // Trocar o caminho das fotos
  if (profileImageAdm) {
  profileImageAdm.src = "assets/img/userPadrao.png";
  }
  // Adiciona um ouvinte de evento para o botão de upload
  uploadButton.addEventListener("click", function () {
    fileInput.click();
  });

  // Adiciona um ouvinte de evento para o campo de arquivo (input type="file")
  fileInput.addEventListener("change", function () {
    const file = fileInput.files[0];
    if (file) {
      // Aqui você pode enviar o arquivo para o servidor ou fazer o que for necessário
      // para armazenar a foto do perfil do usuário.
      // Neste exemplo, apenas exibimos a foto localmente.
      const reader = new FileReader();
      reader.onload = function (e) {
        profileImage.src = e.target.result;
        profileImageAdm.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
});

//Adiciona o nome do usuário no dropdown
