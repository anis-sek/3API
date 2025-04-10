// S2/
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bd1'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connecté à bd1 depuis S2');
});

app.get('/api/s2-data', (req, res) => {
    db.query('SELECT * FROM table2', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});
app.delete('/api/s2-data/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM table2 WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error("Erreur lors de la suppression:", err);
            res.status(500).json({ error: "Erreur lors de la suppression" });
        } else {
            console.log(`Suppression réussie pour l'ID ${id}`);
            res.json({ message: "Donnée supprimée avec succès", deletedId: id });
        }
    });
});
app.use(express.json()); // Pour parser le JSON dans les requêtes PUT

app.put('/api/s2-data/:id', (req, res) => {
    const { id } = req.params;
    const { name, age } = req.body;

    const sql = "UPDATE table2 SET name = ?, age = ? WHERE id = ?";
    db.query(sql, [name, age, id], (err, result) => {
        if (err) {
            console.error("Erreur SQL:", err);
            return res.status(500).json({ error: "Erreur lors de la mise à jour" });
        }
        // Retourne les nouvelles valeurs mises à jour
        res.json({ id, name, age });
    });
});
// Route pour ajouter un nouvel élément dans la base de données
app.post('/api/s2-data', (req, res) => {
    const { name, age } = req.body;

    // Requête SQL pour insérer un nouvel élément dans la base de données
    const query = 'INSERT INTO table2 (name, age) VALUES (?, ?)';
    db.query(query, [name, age], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'insertion:', err);
            return res.status(500).json({ error: 'Erreur lors de l\'ajout de données' });
        }

        // Renvoie les données ajoutées avec l'ID généré
        res.json({
            id: result.insertId,  // ID généré pour l'élément
            name,
            age
        });
    });
});


app.listen(3002, () => console.log('Serveur S2 sur port 3002'));
