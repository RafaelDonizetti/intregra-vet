require("dotenv").config();
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const http = require("http");
const socketIo = require("socket.io");
const cookieParser = require("cookie-parser");
const formatarMensagem = require("../frontend/assets/js/mensagens");
const moment = require("moment");
const {userJoin, getCurrentUser, getRoomUsers, userLeave } = require("../backend/utils");


const app = express();
//Criando server HTTP
const server = http.createServer(app);

//Iniciando o cookieParser
app.use(cookieParser());

//Inicando o Socket.io
const io = socketIo(server);

app.use(express.static(path.join(__dirname, "..", "frontend")));

// Conexão MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.stack);
    return;
  }
  console.log("Conectado ao banco de dados com o ID", connection.threadId);
});

function historyMsg(mensagem, destiny_id, autor_id){
  const query =`
  INSERT INTO historico (mensagem, destiny_id, autor_id)
  VALUES (?, ?, ?)
`;

const values = [mensagem, destiny_id, autor_id];

connection.query(query, values, (err, results) => {
  if (err) {
    console.error('Erro ao inserir mensagem no banco de dados:', err);
  }
})
};

function historyChat(destiny_id, autor_id, callback){
  const query = `SELECT sender.nome AS sender_name, 
  sender.id AS sender_id, his.mensagem, 
  his.send_date FROM historico his JOIN 
  usuarios sender ON his.autor_id = sender.id 
  WHERE (his.autor_id = 1 AND his.destiny_id = ?) 
  OR (his.autor_id = ? AND his.destiny_id = 1) 
  ORDER BY his.send_date asc;`;

  const values = [destiny_id, autor_id];
  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Erro ao obter histórico do chat do banco de dados:', err);
      callback(err, null);
    } else {
      callback(null, results);
    }
  })
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "sua-chave-secreta-aqui",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware para verificar o token em cada solicitação
const verifyToken = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).send("Token não fornecido");
  }

  jwt.verify(token, "seu-segredo-secreto", (err, decoded) => {
    if (err) {
      return res.status(401).send("Token inválido");
    }
    nomeUsuario = decoded.userName || "";
    req.userId = decoded.userId;
    req.userName = nomeUsuario;
    next();
  });
};

const verifyAdmin = (req, res, next) => {
  const userId = req.userId;
  connection.query(
    "SELECT roles FROM usuarios WHERE id = ?",
    [userId],
    (error, results) => {
      if (error) {
        console.error("Erro ao verificar a role do usuário:", error);
        return res.status(500).send("Erro interno do servidor");
      }
      const userRole = results[0].roles;
      next();
    }
  );
};

// Rota para exibir o formulário e tambem verificar os tokens
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});
app.get("/quemsomos", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "quemsomos.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "login.html"));
});
app.get("/cadastro", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "cadastro.html"));
});

app.get("/projetos", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "projetos.html"));
});

app.get("/perfil", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "perfil.html"));
});

app.get("/chat", verifyToken, verifyAdmin, (req, res) => {
  if (req.userId === 1) {
    res.sendFile(path.join(__dirname, "..", "frontend", "chatAdmin.html"));
  } else {
    res.sendFile(path.join(__dirname, "..", "frontend", "chat.html"));
  }
});

// Rota para inserir usuário
app.post("/cadastro", (req, res) => {
  const { nomeDoUsuario, email, password } = req.body;

  /*  */

  //vericando se o emial já existe
  connection.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) throw error;

      if (results.length > 0) {
        return res.send("E-mail já existente");
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Cadastro
      connection.query(
        "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
        [nomeDoUsuario, email, hashedPassword],
        async (insertError, insertResults) => {
          if (insertError) {
            console.log(insertError.message);
            return res.send("Erro ao adicionar usuário.");
          }

          // Atualização do token no banco de dados
          return res.send("Usuário adicionado com sucesso!");
        }
      );
    }
  );
});

// login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  connection.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) throw error;

      if (results.length === 0) {
        return res.send("Email não encontrado!");
      }
      const isMatch = await bcrypt.compare(password, results[0].senha);
      //TIRAR O TRUE
      if (isMatch) {
        const userId = results[0].id;
        const userName = results[0].nome;
        const token = jwt.sign({ userId, userName }, "seu-segredo-secreto", {
          expiresIn: "7d",
        });

        // Atualização do token no banco de dados

        res.cookie("authToken", token, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: false,
        });
        return res.send("Login bem-sucedido!");
      }
      return res.send("Senha incorreta!");
    }
  );
});

//Rota Logout

//Configuaração de evento de conexão para novos clientes

//Mexi nisso tudo -->

let nomeUsuario = "";
// Mantenha um mapa para associar o socket.id ao nome de usuário
const usuariosConectados = new Map();

io.on("connection", (socket) => {
  socket.emit("mensagem", formatarMensagem("SISTEMA", "Bem-Vindo"));

  // Obtém o token do cabeçalho da solicitação
  const token = socket.handshake.headers.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    .split("=")[1];


socket.on("joinRoom", async() => {
  obterUsuariosDoBanco((error, dadosBanco) => {
    if (error) {
      console.error("Erro ao obter usuários do banco de dados:", error);
      return;
    }
    const usuarios = dadosBanco.map(usuario => usuario.id);
    const usuariosBanco = dadosBanco.map(usuario => usuario.nome)
    
  
  // Verifica se há um token
  if (token) {
    jwt.verify(token, "seu-segredo-secreto", (err, decoded) => {
      if (err) {
        // Tratar erro de token inválido, se necessário
        console.error("Erro ao verificar o token:", err);
        return;
      }
      const idDecoded = jwt.decode(token)
      const nomeUsuario = decoded.userName || "Usuário Desconhecido";

      // Associe o nome de usuário ao socket.id

      usuariosConectados.set(socket.id, nomeUsuario);

      const user = userJoin(socket.id, nomeUsuario, idDecoded.userId);

      
      if (user.room === 1){
        socket.join(user.room)
        io.emit("roomUsers", {
          users: usuariosBanco,
          room: usuarios
        })
      } else {
      socket.join(user.room); 
      // Envie uma mensagem de entrada para todos os usuários
      socket.broadcast.to(user.room).emit(
        "mensagem",
        formatarMensagem("SISTEMA", `${nomeUsuario} entrou no chat!`)
      );

      historyChat(user.room, user.room, (error, historico) => {
        if (error) {
          console.error('Erro ao recuperar histórico do chat:', error);
        } else {
          // Enviar histórico para o cliente que está entrando no chat
          socket.emit("chatHistoryClient", historico)
        }
      });

      }
    });

  } else {
    // Se não houver token, defina um nome de usuário padrão ou trate conforme necessário
    const nomeUsuarioPadrao = "Usuário Desconhecido";

    // Associe o nome de usuário ao socket.id
    usuariosConectados.set(socket.id, nomeUsuarioPadrao);

    // Envie uma mensagem de entrada para todos os usuários
    io.emit("mensagem",
      formatarMensagem("SISTEMA", `${nomeUsuarioPadrao} entrou no chat!`)
    );
  }
})
})

const obterUsuariosDoBanco = (callback) => {
  connection.query(
    "SELECT nome, id FROM usuarios WHERE roles != 'admin'",
    (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        // Mapeie os resultados para o formato desejado
        const usuarios = results.map(result => ({ nome: result.nome, id: result.id }));
        callback(null, usuarios);
      }
    }
  );
};

const apagarHistoricoBanco = (autor_id) => {
  connection.query(
    "DELETE FROM historico WHERE autor_id = '?' OR destiny_id = '?' ",
    [autor_id, autor_id],
    (error) => {
      if (error) throw error;
    }
  )
}

let globalRoomValue;

// Lida com os clicks nos contatos
socket.on("roomClick", (userName, roomValue) => {
  socket.leave(globalRoomValue)
  globalRoomValue = roomValue;
  socket.join(roomValue);

  historyChat(globalRoomValue, globalRoomValue, (error, historico) => {
    if (error) {
      console.error('Erro ao recuperar histórico do chat:', error);
    } else {
      // Enviar histórico para o cliente que está entrando no chat
      socket.emit("chatHistory", historico)
    }
  });

  socket.broadcast.to(roomValue).emit(
    "mensagem",
    formatarMensagem("SISTEMA", `Debora entrou no chat!`)
    );
});

socket.on("deleteHistory", (historico) => {
  apagarHistoricoBanco(historico)
})


  // Lida com mensagens do chat
  socket.on("chatMessage", (msg) => {
    obterUsuariosDoBanco((error, dadosBanco) => {
      if (error) {
        console.error("Erro ao obter usuários do banco de dados:", error);
        return;
      }
      const usuarios = dadosBanco.map(usuario => usuario.id);    

    // Obtém o nome de usuário associado ao socket.id
    const nomeUsuario =
      usuariosConectados.get(socket.id) || "Usuário Desconhecido";

    const user = getCurrentUser(socket.id);
    if (user.room === 1){
      historyMsg(msg, globalRoomValue, user.room)
      io.to(globalRoomValue).emit("mensagem", formatarMensagem(nomeUsuario, msg));
    } else {
      historyMsg(msg, 1, user.room)
      io.to(user.room).emit("mensagem", formatarMensagem(nomeUsuario, msg));
    }
    });
  })

  // Lida com desconexões
  socket.on("disconnect", () => {
    const user = userLeave(socket.id)
    
    // Obtém o nome de usuário associado ao socket.id
    const nomeUsuario =
      usuariosConectados.get(socket.id) || "Usuário Desconhecido";

    // Remove o mapeamento do socket.id ao desconectar
    usuariosConectados.delete(socket.id);
    
    // Emite uma mensagem de saída para todos os usuários
    if(user) {
    io.emit(
      "mensagem",
      formatarMensagem("Servidor", `${nomeUsuario} saiu do chat.`)
    )};
  });
});

server.listen(3000, (req) => {
  console.log("Servidor rodando na porta 3000");
});
