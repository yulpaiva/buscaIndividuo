const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Pokemon = require('./models/Pokemon'); // Modelo do MongoDB

const app = express();
const port = 3000;

// Verifica se a pasta 'uploads' existe, caso contrário, cria a pasta
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configuração do Multer para o upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

// Conexão com o MongoDB
mongoose.connect('mongodb+srv://yulbrynner73:HEZdgKtubL5ccvqa@cluster0.4roqo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

// Middleware para JSON
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Rotas para CRUD
app.get('/api/pokemons', async (req, res) => {
    const pokemons = await Pokemon.find();
    res.json(pokemons); // Isso deve incluir o _id por padrão
});

app.delete('/api/pokemons/:id', async (req, res) => {
    const { id } = req.params; // Captura o ID da URL
    try {
        const result = await Pokemon.deleteOne({ _id: id }); // Exclui o Pokémon baseado no _id
        if (result.deletedCount === 0) {
            return res.status(404).send({ message: 'Pokémon não encontrado' }); // Retorna 404 se não encontrar o Pokémon
        }
        res.sendStatus(204); // Envia um status 204 No Content se a exclusão for bem-sucedida
    } catch (error) {
        console.error(error); // Log do erro no servidor
        res.status(500).send({ message: 'Erro ao tentar apagar Pokémon' }); // Retorna 500 em caso de erro
    }
});



app.post('/api/pokemons', upload.single('image'), async (req, res) => {
    const { name, type, description, height, weight, abilities, baseExperience } = req.body;
    const imageUrl = req.file ? req.file.path : null;

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
    res.json(pokemon);
});

// Inicializando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
