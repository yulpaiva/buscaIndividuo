const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Pokemon = require('./models/Pokemon'); // Modelo do MongoDB

const app = express();
const port = process.env.PORT || 3000;

// Verifica se a pasta 'uploads' existe, caso contrário, cria a pasta
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configuração do Multer para o upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

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
app.use('/uploads', express.static('uploads')); // Serve os arquivos de imagem da pasta 'uploads'

// Rotas para CRUD
app.get('/api/pokemons', async (req, res) => {
    try {
        const pokemons = await Pokemon.find();
        res.json(pokemons);
    } catch (error) {
        console.error('Erro ao carregar Pokémons:', error);
        res.status(500).json({ message: 'Erro ao carregar Pokémons' });
    }
});

// Rota POST para cadastrar um novo Pokémon
app.post('/api/pokemons', upload.single('image'), async (req, res) => {
    const { name, type, description, height, weight, abilities, baseExperience } = req.body;
    const imageUrl = req.file ? req.file.path : null; // Pega o caminho da imagem, se existir

    try {
        const pokemon = new Pokemon({
            name,
            type,
            description,
            imageUrl,
            height,
            weight,
            abilities: abilities ? abilities.split(',').map((ability) => ability.trim()) : [],
            baseExperience,
        });

        await pokemon.save();
        res.status(201).json(pokemon); // Retorna o Pokémon criado com status 201
    } catch (error) {
        console.error('Erro ao cadastrar Pokémon:', error);
        res.status(500).json({ message: 'Erro ao cadastrar Pokémon' });
    }
});

// Inicializando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
