const express = require('express');
const mongoose = require('mongoose');
const Pokemon = require('./models/Pokemon'); // Ajuste o caminho conforme necessário
const pokemonRouter = require('./api/pokemons'); // Ajuste o caminho conforme necessário

const app = express();
const port = process.env.PORT || 3000;

// Middleware para JSON
app.use(express.json());

// Usar rotas de Pokémon
app.use('/api/pokemons', pokemonRouter);

// Inicializando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
