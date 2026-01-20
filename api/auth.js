const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

/**
 * Charger les utilisateurs depuis le fichier JSON
 */
function loadUsers() {
    try {
        const usersPath = path.join(__dirname, '../data/users.json');
        const data = fs.readFileSync(usersPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur chargement users.json:', error);
        return { enseignants: [] };
    }
}

/**
 * Login - Authentification enseignant
 */
router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Nom d\'utilisateur et mot de passe requis'
            });
        }
        
        const users = loadUsers();
        
        // Chercher l'enseignant
        const enseignant = users.enseignants.find(e => 
            e.username === username && e.password === password
        );
        
        if (!enseignant) {
            return res.status(401).json({
                success: false,
                message: 'Nom d\'utilisateur ou mot de passe incorrect'
            });
        }
        
        // Connexion réussie
        res.json({
            success: true,
            message: 'Connexion réussie',
            user: {
                username: enseignant.username,
                nom_complet: enseignant.nom_complet,
                matieres: enseignant.matieres,
                role: enseignant.role || 'enseignant'
            }
        });
    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
});

/**
 * Obtenir la liste des enseignants (sans mots de passe)
 */
router.get('/enseignants', (req, res) => {
    try {
        const users = loadUsers();
        
        // Retourner sans les mots de passe
        const enseignants = users.enseignants.map(e => ({
            username: e.username,
            nom_complet: e.nom_complet,
            matieres: e.matieres
        }));
        
        res.json({
            success: true,
            enseignants: enseignants
        });
    } catch (error) {
        console.error('Erreur récupération enseignants:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Health check
 */
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        module: 'auth',
        message: 'Module d\'authentification fonctionnel'
    });
});

module.exports = router;
