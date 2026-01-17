const express = require('express');
const router = express.Router();
const { getDB } = require('../config/database');

/**
 * Obtenir toutes les données de distribution pour une classe
 */
router.get('/class/:className', async (req, res) => {
    try {
        const db = getDB();
        const { className } = req.params;
        
        const data = await db.collection('distribution')
            .find({ Classe: className })
            .sort({ Semaine: 1, Matière: 1 })
            .toArray();
        
        res.json({
            success: true,
            data: data,
            count: data.length
        });
    } catch (error) {
        console.error('Erreur récupération distribution:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Obtenir les données de distribution pour une classe et une matière
 */
router.get('/class/:className/matiere/:matiere', async (req, res) => {
    try {
        const db = getDB();
        const { className, matiere } = req.params;
        
        const data = await db.collection('distribution')
            .find({ 
                Classe: className,
                Matière: matiere
            })
            .sort({ Semaine: 1 })
            .toArray();
        
        res.json({
            success: true,
            data: data,
            count: data.length
        });
    } catch (error) {
        console.error('Erreur récupération distribution:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Sauvegarder/Mettre à jour les données de distribution
 */
router.post('/save', async (req, res) => {
    try {
        const db = getDB();
        const { className, matiere, data } = req.body;
        
        if (!className || !matiere || !data) {
            return res.status(400).json({
                success: false,
                message: 'Paramètres manquants'
            });
        }
        
        // Supprimer les anciennes données pour cette classe/matière
        await db.collection('distribution').deleteMany({
            Classe: className,
            Matière: matiere
        });
        
        // Insérer les nouvelles données
        const result = await db.collection('distribution').insertMany(data);
        
        res.json({
            success: true,
            message: 'Données sauvegardées avec succès',
            count: result.insertedCount
        });
    } catch (error) {
        console.error('Erreur sauvegarde distribution:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Obtenir les données pour une semaine spécifique
 */
router.get('/week/:weekNumber', async (req, res) => {
    try {
        const db = getDB();
        const { weekNumber } = req.params;
        const { classe } = req.query;
        
        const filter = { Semaine: `Semaine ${weekNumber}` };
        if (classe) filter.Classe = classe;
        
        const data = await db.collection('distribution')
            .find(filter)
            .sort({ Classe: 1, Matière: 1 })
            .toArray();
        
        res.json({
            success: true,
            data: data,
            count: data.length,
            week: weekNumber
        });
    } catch (error) {
        console.error('Erreur récupération semaine:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Obtenir toutes les classes disponibles
 */
router.get('/classes', async (req, res) => {
    try {
        const db = getDB();
        const classes = await db.collection('distribution')
            .distinct('Classe');
        
        res.json({
            success: true,
            classes: classes.sort()
        });
    } catch (error) {
        console.error('Erreur récupération classes:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Obtenir toutes les matières pour une classe
 */
router.get('/class/:className/matieres', async (req, res) => {
    try {
        const db = getDB();
        const { className } = req.params;
        
        const matieres = await db.collection('distribution')
            .distinct('Matière', { Classe: className });
        
        res.json({
            success: true,
            matieres: matieres.sort()
        });
    } catch (error) {
        console.error('Erreur récupération matières:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Réinitialiser les données d'une matière
 */
router.delete('/class/:className/matiere/:matiere', async (req, res) => {
    try {
        const db = getDB();
        const { className, matiere } = req.params;
        
        const result = await db.collection('distribution').deleteMany({
            Classe: className,
            Matière: matiere
        });
        
        res.json({
            success: true,
            message: 'Données réinitialisées',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Erreur réinitialisation:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Health check
 */
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        module: 'distribution',
        message: 'Module Distribution Annuelle fonctionnel'
    });
});

module.exports = router;
