const mongoose = require('mongoose');

const pokemonSchema = new mongoose.Schema({
    name: { type: String, required: true },          // Aceita qualquer string
    type: { type: String, required: true },          // Aceita qualquer string
    description: { type: String, required: true },   // Aceita qualquer string
    height: { type: String, required: true },        // Alterado para string para aceitar qualquer formato
    weight: { type: String, required: true },        // Alterado para string para aceitar qualquer formato
    abilities: { type: [String], required: true },   // Permite um array de strings
    baseExperience: { type: String, required: true }, // Alterado para string para aceitar qualquer formato
    imageUrl: { type: String, required: true }       // Aceita qualquer string
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);
module.exports = Pokemon;

export default function handler(req, res) {
    if (req.method === 'GET') {
        // Simulação de resposta com JSON
        res.status(200).json([{ name: 'Pikachu', type: 'Elétrico' }]);
    } else {
        res.status(405).json({ message: 'Método não permitido' });
    }
}
