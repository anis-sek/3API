import React, { useEffect, useState } from 'react';
import './app.css';  // Assurez-vous que le fichier CSS est importé.

function App() {
    const [data, setData] = useState([]);
    const [editMode, setEditMode] = useState(false); // Pour savoir si on est en mode édition
    const [currentItem, setCurrentItem] = useState(null); // L'élément actuellement en édition
    const [newItem, setNewItem] = useState({ name: '', age: '' }); // État pour l'ajout d'un nouvel élément

    // Récupération des données
    useEffect(() => {
        fetch('http://localhost:3010/api/s3-data')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Erreur:', error));
    }, []);

    // Fonction pour supprimer un élément
    const handleDelete = (id) => {
        fetch(`http://localhost:3010/api/s3-data/${id}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    setData(data.filter(item => item.id !== id));
                } else {
                    console.error('Erreur lors de la suppression');
                }
            });
    };

    // Fonction pour activer le mode édition sur une ligne
    const handleEdit = (item) => {
        setEditMode(true);
        setCurrentItem(item);
    };

    // Fonction pour mettre à jour un élément
    const handleUpdate = (e) => {
        e.preventDefault();

        const updatedItem = {
            id: currentItem.id,
            name: e.target.name.value,
            age: e.target.age.value
        };

        fetch(`http://localhost:3010/api/s3-data/${currentItem.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedItem),
        })
        .then(response => response.json())
        .then(updatedData => {
            setData(data.map(item => (item.id === updatedData.id ? updatedData : item)));
            setEditMode(false);
            setCurrentItem(null);
            // recharger la page
            window.location.reload();
        })
        .catch(error => console.error('Erreur lors de la mise à jour:', error));
    };

    // Fonction pour ajouter un élément
    const handleAdd = (e) => {
        e.preventDefault();

        const newItemData = {
            name: newItem.name,
            age: newItem.age
        };

        fetch('http://localhost:3010/api/s3-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItemData),
        })
        .then(response => response.json())
        .then(addedData => {
            setData([...data, addedData]); // Ajout de l'élément au tableau
            setNewItem({ name: '', age: '' }); // Réinitialiser le formulaire
        })
        .catch(error => console.error('Erreur lors de l\'ajout:', error));
    };

    // Fonction pour gérer le changement d'input dans le formulaire d'ajout
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewItem((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="container">
            <h1 className="title">Données</h1>

            {/* Formulaire d'ajout */}
            <form onSubmit={handleAdd}>
                <h2>Ajouter un nouvel élément</h2>
                <label>
                    Nom:
                    <input
                        type="text"
                        name="name"
                        value={newItem.name}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Âge:
                    <input
                        type="number"
                        name="age"
                        value={newItem.age}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Ajouter</button>
            </form>

            {/* Formulaire de mise à jour si on est en mode édition */}
            {editMode && currentItem && (
                <form onSubmit={handleUpdate}>
                    <h2>Modifier l'élément</h2>
                    <label>
                        Nom:
                        <input type="text" name="name" defaultValue={currentItem.name} />
                    </label>
                    <label>
                        Âge:
                        <input type="number" name="age" defaultValue={currentItem.age} />
                    </label>
                    <button type="submit">Mettre à jour</button>
                    <button type="button" onClick={() => setEditMode(false)}>Annuler</button>
                </form>
            )}

            {/* Tableau des données */}
            <table className="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Age</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.age}</td>
                            <td>
                                <button onClick={() => handleEdit(item)}>Modifier</button>
                                <button onClick={() => handleDelete(item.id)}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
