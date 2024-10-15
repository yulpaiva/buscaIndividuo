const express = require('express');
const mongoose = require('mongoose');
const Pokemon = require('./models/Pokemon'); // Modelo do MongoDB

const app = express();
const port = process.env.PORT || 3000;

// Conexão com o MongoDB
mongoose.connect('mongodb+srv://yulbrynner73:HEZdgKtubL5ccvqa@cluster0.4roqo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB com sucesso!'))
.catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1); // Encerra o servidor se a conexão falhar
});

// Middleware para JSON
app.use(express.json());
app.use(express.static('public'));

// Rotas para CRUD
app.get('/api/pokemons', async (req, res) => {
    const start = Date.now(); // Início do cálculo de tempo
    try {
        const pokemons = await Pokemon.find();
        const duration = Date.now() - start; // Cálculo do tempo decorrido
        console.log(`Consulta realizada em ${duration} ms`); // Log do tempo de consulta
        res.json(pokemons);
    } catch (error) {
        console.error('Erro ao buscar Pokémons:', error);
        res.status(500).json({ message: 'Erro ao buscar Pokémons' });
    }
});

app.post('/api/pokemons', async (req, res) => {
    const { name, type, description, height, weight, abilities, baseExperience } = req.body;

    const pokemon = new Pokemon({
        name,
        type,
        description,
        height,
        weight,
        abilities: abilities ? abilities.split(',').map((ability) => ability.trim()) : [],
        baseExperience,
    });

    try {
        await pokemon.save();
        res.status(201).json(pokemon);
    } catch (error) {
        console.error('Erro ao cadastrar Pokémon:', error);
        res.status(500).json({ message: 'Erro ao cadastrar Pokémon' });
    }
});

app.delete('/api/pokemons/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Pokemon.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Pokémon não encontrado' });
        }
        res.sendStatus(204);
    } catch (error) {
        console.error('Erro ao tentar apagar Pokémon:', error);
        res.status(500).json({ message: 'Erro ao tentar apagar Pokémon' });
    }
});

// Inicializando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
