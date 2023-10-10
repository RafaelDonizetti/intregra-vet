const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const path = require('path')
const bcrypt = require('bcryptjs')
const { error } = require('console')

const app = express()

app.use(express.static(path.join(__dirname, '..', 'frontend')))
    // Conexão MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'guitarhero90@',
    database: 'test'
});

connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.stack);
        return;
    }
    console.log('Conectado ao banco de dados com o ID', connection.threadId);
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

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

// Rota para inserir usuário
app.post('/cadastro', (req, res) => {
    const { email, password, emailConfirm, passwordConfirm } = req.body;

    if (email !== emailConfirm) {
        return res.send('email nao confere')

    } else {
        if (password !== passwordConfirm) {
            window.confirm('senha nao confere')
        }
    }
    //vericando se o emial já existe
    connection.query('SELECT * FROM users WHERE email = ?', [email], async(error, results) => {
        if (error) throw error

        if (results.length > 0) {
            return res.send('E-mail já existente')
        } else {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            console.log(hashedPassword)

            // criação de usiário
            connection.query('INSERT INTO users (email, senha) VALUES (?, ?)', [email, hashedPassword], (error, results) => {
                if (error) {
                    console.log(error.message);
                    res.send('Erro ao adicionar usuário.');
                } else {
                    res.send('Usuário adicionado com sucesso!');
                }

            });
        }
    })
})

// login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    connection.query('SELECT * FROM users WHERE email = ?', [email], async(error, results) => {
        if (error) throw error;

        if (results.length === 0) {
            res.send("Email não encontrado!");
        } else {
            // Compare a senha fornecida com a senha armazenada no banco de dados
            const isMatch = await bcrypt.compare(password, results[0].senha);

            if (isMatch) {
                res.send("Login bem-sucedido!");
            } else {
                res.send("Senha incorreta!");
            }
        }
    });
})

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
})