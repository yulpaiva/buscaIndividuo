const express = require('express');
const Pokemon = require('../models/Pokemon'); // Ajuste o caminho conforme necessário
const router = express.Router();

// Rota para obter todos os Pokémons
router.get('/', async (req, res) => {
    try {
        const pokemons = await Pokemon.find();
        res.json(pokemons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rota para criar um novo Pokémon
router.post('/', async (req, res) => {
    const { name, type, description, height, weight, abilities, baseExperience } = req.body;

    const pokemon = new Pokemon({
        name,
        type,
        description,
        height,
        weight,
        abilities,
        baseExperience,
    });

    try {
        const savedPokemon = await pokemon.save();
        res.status(201).json(savedPokemon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
