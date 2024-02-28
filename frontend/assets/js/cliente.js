// Obtendo o valor do cookie
const cookieValue = document.cookie
  ? document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1]
  : null;

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

document.addEventListener("DOMContentLoaded", function () {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];

  const decodedToken = cookieValue ? decodeJwt(cookieValue) : null;
  console.log("Decoded Token:", decodedToken); // Adiciona este log para verificar se o token está sendo decodificado corretamente

  if (decodedToken) {
    console.log("User is logged in. Username:", decodedToken.userName);
    toggleLoginLogoutButton(decodedToken.userName);
  } else {
    console.log("User is not logged in.");
    toggleLoginLogoutButton(null);
  }
});

function toggleLoginLogoutButton(username) {
  console.log("Toggling login/logout button. Username:", username);
  // Restante do código da função...
}

function toggleLoginLogoutButton(username) {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const profileBtn = document.getElementById("profileBtn");
  const userBtn = document.getElementById("userBtn");
  const profileDropdown = document.getElementById("profileDropdown");
  const logoutBtnInDropdown = document.getElementById("logoutBtnInDropdown");
  const loginBtnSideBar = document.getElementById("loginBtn-sideBar");

  console.log("Toggling login/logout button. Username:", username);

  if (logoutBtn && logoutBtnInDropdown) {
    if (username) {
      // Se o usuário estiver logado, exibe os botões relacionados ao perfil e oculta o de login
      if (loginBtn && loginBtnSideBar) {
        loginBtn.style.display = "none";
        loginBtnSideBar.style.display = "none";
      }
      logoutBtn.style.display = "block";
      profileBtn.style.display = "block";
      userBtn.innerText = username;

      // Adiciona evento para mostrar/ocultar dropdown do perfil
      userBtn.addEventListener("click", function () {
        if (profileDropdown.style.display === "none") {
          profileDropdown.style.display = "block";
        } else {
          profileDropdown.style.display = "none";
        }
      });

      // Adiciona evento de logout para botão de logout
      logoutBtn.addEventListener("click", function () {
        document.cookie =
          "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/"; // Ajuste o caminho conforme necessário
      });

      // Adiciona evento de logout para botão de logout no dropdown
      logoutBtnInDropdown.addEventListener("click", function () {
        document.cookie =
          "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "/"; // Ajuste o caminho conforme necessário
      });
    } else {
      // Se o usuário não estiver logado, exibe o botão de login e oculta os relacionados ao perfil
      if (loginBtn && loginBtnSideBar) {
        loginBtn.style.display = "block";
        loginBtnSideBar.style.display = "block";
      }
      logoutBtn.style.display = "none";
      profileBtn.style.display = "none";
      if (profileDropdown) profileDropdown.style.display = "none";
    }
  }
}

//Troca a escrita do botão de login para o nome do user
document.addEventListener("DOMContentLoaded", function () {
  const cookieValue = document.cookie
    ? document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1]
    : null;

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

//botão de login some se estiver logado, e caso esteja deslogado apareça apenas o botão de login
document.addEventListener("DOMContentLoaded", function () {
  const cookieValue = document.cookie
    ? document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1]
    : null;

  const decodedToken = cookieValue ? decodeJwt(cookieValue) : null;
  const loginBtnSideBar = document.getElementById("loginBtn-sideBar");
  const logoutBtn = document.getElementById("logoutBtn");

  if (decodedToken) {
    // Se o usuário estiver logado, exibe o botão de logout e oculta o de login
    if (loginBtnSideBar) {
      loginBtnSideBar.style.display = "none";
    }
    if (logoutBtn) {
      logoutBtn.style.display = "block";
    }
  } else {
    // Se o usuário não estiver logado, exibe o botão de login e oculta o de logout
    if (loginBtnSideBar) {
      loginBtnSideBar.style.display = "block";
    }
    if (logoutBtn) {
      logoutBtn.style.display = "none";
    }
  }
});

// profile.js

document.addEventListener("DOMContentLoaded", function () {
  const cookieValue = document.cookie
    ? document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1]
    : null;

  const decodedToken = cookieValue ? decodeJwt(cookieValue) : null;
  const profileUserName = document.getElementById("profileUserName");
  const profileImage = document.getElementById("profileImage");
  const fileInput = document.getElementById("fileInput");
  const uploadButton = document.getElementById("uploadButton");

  if (decodedToken && profileUserName) {
    profileUserName.innerText = decodedToken.userName;
    // Se você tiver uma URL de foto no token, substitua "decodedToken.photoUrl"
    // pela chave real que contém a URL da foto em seu objeto de token.
    // Exemplo: decodedToken.photoUrl
    profileImage.src =
      decodedToken.photoUrl ||
      "caminho-para-sua-foto-padrao/default-avatar.jpg";
    console.log("URL da foto do token:", decodedToken.photoUrl);
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
      };
      reader.readAsDataURL(file);
    }
  });
});
