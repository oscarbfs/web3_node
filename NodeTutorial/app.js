// app.js

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Configurar o motor de visualização EJS
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

let userData = {
  username: 'John Doe'
};

app.post('/', (req, res) => {
  const { username, office, hobby } = req.body

  const newUser = { username, office, hobby }
  userData = newUser

  res.send({ message: "usuário alterado com sucesso!" })
});


app.get('/', (req, res) => {
  // Dados dinâmicos para preencher o modelo
  // const userData = {
  //   username: 'John Doe'
  // };

  // Renderizar a visualização e enviar como resposta
  res.render('index', userData);
});

app.get('/change', (req, res) => {
  // Dados dinâmicos para preencher o modelo
  // const userData = {
  //   username: 'John Doe'
  // };

  // Renderizar a visualização e enviar como resposta
  res.render('changeName', userData);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
