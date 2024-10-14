// api/pokemons.js
const mongoose = require('mongoose');
const Pokemon = require('./models/pokemon');

// Conectar ao MongoDB (verifique a string de conexão do MongoDB)
const connectDb = async () => {
    if (mongoose.connection.readyState >= 1) return;
    return mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

export default async function handler(req, res) {
    await connectDb(); // Conecte ao banco de dados

    if (req.method === 'GET') {
        // Recuperar todos os Pokémons do banco de dados
        try {
            const pokemons = await Pokemon.find();
            res.status(200).json(pokemons);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao obter Pokémons', error });
        }
    } else if (req.method === 'POST') {
        // Cadastrar um novo Pokémon
        try {
            const { name, type, description, height, weight, abilities, baseExperience, imageUrl } = req.body;

            // Criar um novo documento no MongoDB
            const newPokemon = new Pokemon({
                name,
                type,
                description,
                height,
                weight,
                abilities,
                baseExperience,
                imageUrl
            });

            await newPokemon.save(); // Salvar no banco de dados
            res.status(201).json(newPokemon);
        } catch (error) {
            res.status(400).json({ message: 'Erro ao cadastrar Pokémon', error });
        }
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
}
