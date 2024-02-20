const express = require('express');
const app = express();

// Configurar o motor de visualização EJS
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    // Dados dinâmicos para preencher o modelo
    const userData = {
        username: 'John Doe'
    };

    // Renderizar a visualização e enviar como resposta
    res.render('index', userData);
});

app.listen(3000, () => {
    console.log('Servidor Express em execução na porta 3000');
  });
  
