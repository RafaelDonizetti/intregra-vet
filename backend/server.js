require('dotenv').config();
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const path = require('path')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const http = require('http')
const socketIo = require('socket.io')
const formatarMensagem = require('../frontend/assets/js/mensagens')


const app = express()
//Criando server HTTP
const server = http.createServer(app)

//Inicando o Socket.io
const io = socketIo(server)

app.use(express.static(path.join(__dirname, '..', 'frontend')))
    
    // Conexão MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.stack);
        return;
    }
    console.log('Conectado ao banco de dados com o ID', connection.threadId);
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'sua-chave-secreta-aqui',
    resave: false,
    saveUninitialized: true
}))

// Rota para exibir o formulário
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});
app.get('/quemsomos', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'quemsomos.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
});
app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'cadastro.html'));
});
app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'chat.html'));
});

// Rota para inserir usuário
app.post('/cadastro', (req, res) => {
    const {nomeDoUsuario, email, password, emailConfirm, passwordConfirm} = req.body;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !emailConfirm) {
        return res.send('Preencha ambos os campos de e-mail.');

    } else if (email !== emailConfirm) {
        return res.send('Os E-mails não estão iguais.');

    }else if(!email.match(emailRegex)){
        return res.send('Você não digitou um e-mail valido')
    } else {
        if (!password || !passwordConfirm) {
            return res.send('Preencha ambos os campos de senha.');
        } else if (password !== passwordConfirm) {
            return res.send('As senhas não estão iguais.');
        }
    }
    

    
    //vericando se o emial já existe
    connection.query('SELECT * FROM usuarios WHERE email = ?', [email], async (error, results) => {
        if (error) throw error;

        if (results.length > 0) {
            return res.send('E-mail já existente');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Criação de usuário
            connection.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nomeDoUsuario, email, hashedPassword], async (insertError, insertResults) => {
                if (insertError) {
                    console.log(insertError.message);
                    return res.send('Erro ao adicionar usuário.');
                }

                const userId = insertResults.insertId;
                const token = jwt.sign({ userId, userName: nomeDoUsuario }, 'seu-segredo-secreto', { expiresIn: '7d' });

                // Atualização do token no banco de dados
                connection.query('UPDATE usuarios SET token = ? WHERE id = ?', [token, userId], (updateError) => {
                    if (updateError) {
                        console.log('Erro ao atualizar o token no banco de dados: ', updateError);
                        res.send('Erro ao fazer login');
                    } else {
                        res.send('Usuário adicionado com sucesso!');
                    }
                });
            });
        }
    });
});


// login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    connection.query('SELECT * FROM usuarios WHERE email = ?', [email], async (error, results) => {
        if (error) throw error;

        if (results.length === 0) {
            res.send('Email não encontrado!');
        } else {
            const isMatch = await bcrypt.compare(password, results[0].senha);

            if (isMatch) {
                const userId = results[0].id;
                const userName = results[0].nome;
                const token = jwt.sign({ userId, userName }, 'seu-segredo-secreto', { expiresIn: '7d' });

                // Atualização do token no banco de dados
                connection.query('UPDATE usuarios SET token = ? WHERE id = ?', [token, userId], (updateError) => {
                    if (updateError) {
                        console.error('Erro ao atualizar o token no banco de dados:', updateError);
                        res.send('Erro ao fazer login.');
                    } else {
                        res.send('Login bem-sucedido!')
                    }
                });
            } else {
                res.send('Senha incorreta!');
            }
        }
    });
});


//Configuaração de evento de conexão para novos clientes

//Mexi nisso tudo -->

const nomeUsuario = "NomeAleatorio" // <-- Temo que colocar o nome do banco aqui

io.on('connection', (socket) =>{

    socket.emit('mensagem', formatarMensagem(nomeUsuario, 'Bem-Vindo'));
    //Diz que alguem entrou, para todos os usuarios
    socket.broadcast.emit('mensagem', formatarMensagem(nomeUsuario, 'Um Usuario Entrou no chat!'));
    //Quando alguem sai
    socket.on('disconnect',() =>{
        io.emit('mensagem', formatarMensagem(nomeUsuario, ', Saiu do Chat!'));
    });

    //
    socket.on('chatMessage', (msg) => {
        io.emit('mensagem', formatarMensagem(nomeUsuario, msg))
    })
});

// <--

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});