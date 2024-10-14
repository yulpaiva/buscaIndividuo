app.get('/api/pokemons', async (req, res) => {
    try {
        const pokemons = await Pokemon.find();
        res.json(pokemons);
    } catch (error) {
        res.status(500).send('Erro ao carregar Pokémons');
    }
});
