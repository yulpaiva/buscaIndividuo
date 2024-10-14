const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Pokemon = require('./models/Pokemon'); // Modelo do MongoDB

const app = express();
const port = process.env.PORT || 3000;

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pokedex', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Conectado ao MongoDB');
}).catch((err) => {
    console.error('Erro ao conectar ao MongoDB', err);
});


// Middleware para JSON
app.use(express.json());

// Rotas para CRUD
app.get('/api/pokemons', async (req, res) => {
    const pokemons = await Pokemon.find();
    res.json(pokemons);
});

// Adicione aqui a rota POST
app.post('/api/pokemons', async (req, res) => {
    // Seu código para adicionar um Pokémon
});

// Inicializando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
