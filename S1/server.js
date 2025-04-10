const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path'); // Import path for correct directory handling

const app = express();
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Specify the correct views directory

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bd1'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connecté à bd1 depuis S1');
});

// Default route to render the list of users
app.get('/', (req, res) => {
    db.query('SELECT * FROM table1', (err, allUsers) => {
        if (err) throw err;
        res.render('index', { users: allUsers, selectedUser: null });
    });
});

// Route to handle the user search by ID
app.get('/user', (req, res) => {
    const id = req.query.id;  // Get the user ID from the query string
    if (id) {
        db.query('SELECT * FROM table1', (err, allUsers) => {
            if (err) throw err;
            db.query('SELECT * FROM table1 WHERE id = ?', [id], (err2, result) => {
                if (err2) throw err2;
                res.render('index', {
                    users: allUsers,
                    selectedUser: result.length > 0 ? result[0] : null,  // Display the user details
                });
            });
        });
    } else {
        db.query('SELECT * FROM table1', (err, allUsers) => {
            if (err) throw err;
            res.render('index', {
                users: allUsers,
                selectedUser: null,
            });
        });
    }
});

app.listen(3001, () => console.log('Serveur S1 sur port 3001'));
