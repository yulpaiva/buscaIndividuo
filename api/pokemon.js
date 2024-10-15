module.exports = async (req, res) => {
    if (req.method === 'POST') {
      // Lógica para cadastrar o Pokémon
      res.status(200).json({ message: 'Pokémon cadastrado com sucesso!' });
    } else if (req.method === 'GET') {
      // Lógica para listar os Pokémons
      res.status(200).json([]);
    } else {
      res.status(405).json({ message: 'Método não permitido' });
    }
  };
  