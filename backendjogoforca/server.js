const express = require('express');
const session = require('express-session');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const flash = require('express-flash');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'ipf129u342hf8he8fh8he0fhe4e3frg', resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(flash());

const dbPath = path.join(__dirname, '../jogodaforca.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Conectado ao banco de dados');
  }
});

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Conexão com o banco de dados finalizada');
      process.exit(0);
    }
  });
});

app.get('/categorias', (req, res) => {
  db.all('SELECT * FROM categorias', (err, categorias) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erro interno do servidor');
      return;
    }
    res.json(categorias);
  });
});

app.get('/palavras', (req, res) => {
  db.all('SELECT * FROM palavras', (err, palavras) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erro interno do servidor');
      return;
    }
    res.json(palavras);
  });
});

app.get('/', (req, res) => {
  res.send('Bem-vindo! <a href="/registro">Registrar</a> ou <a href="/login">Entrar</a>');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});







