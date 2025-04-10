// S3/
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/s3-data', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3002/api/s2-data');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des données de S2' });
    }
});
// Route pour mettre à jour un élément
app.put('/api/s3-data/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age } = req.body;

        const response = await axios.put(`http://localhost:3002/api/s2-data/${id}`, { name, age });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour des données' });
    }
});

// Route pour supprimer un élément
app.delete('/api/s3-data/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const response = await axios.delete(`http://localhost:3002/api/s2-data/${id}`);
        res.json({ message: "Supprimé avec succès", data: response.data });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression des données' });
    }
});
app.post('/api/s3-data', async (req, res) => {
    try {
        const { name, age } = req.body;

        // Supposons que l'API de S2 accepte l'ajout
        const response = await axios.post('http://localhost:3002/api/s2-data', { name, age });

        res.json(response.data); // Renvoie les données ajoutées
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout des données' });
    }
});

app.listen(3010, () => console.log('Serveur S3 sur port 3010'));
