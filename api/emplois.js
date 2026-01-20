const express = require('express');
const router = express.Router();
const { getDB } = require('../config/database');

/**
 * Structure d'un emploi du temps:
 * {
 *   classe: 'PEI1-G',
 *   jour: 'Dimanche' | 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi',
 *   periode: 1-8,
 *   horaire: '8:00 - 8:45',
 *   matiere: 'Sciences',
 *   enseignant: 'Zine',
 *   salle: '',
 *   type: 'cours' | 'pause'
 * }
 */

/**
 * Obtenir l'emploi du temps pour une classe
 */
router.get('/classe/:className', async (req, res) => {
    try {
        const db = getDB();
        const { className } = req.params;
        
        if (!db) {
            return res.json({
                success: true,
                data: getDefaultEmploi(className),
                source: 'default'
            });
        }
        
        const emploi = await db.collection('emplois_temps')
            .find({ classe: className })
            .sort({ jour: 1, periode: 1 })
            .toArray();
        
        if (emploi.length === 0) {
            return res.json({
                success: true,
                data: getDefaultEmploi(className),
                source: 'default'
            });
        }
        
        res.json({
            success: true,
            data: emploi,
            source: 'database'
        });
    } catch (error) {
        console.error('Erreur récupération emploi:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Sauvegarder l'emploi du temps d'une classe
 */
router.post('/save', async (req, res) => {
    try {
        const db = getDB();
        const { classe, emploi } = req.body;
        
        if (!classe || !emploi || !Array.isArray(emploi)) {
            return res.status(400).json({
                success: false,
                message: 'Paramètres invalides'
            });
        }
        
        if (!db) {
            return res.status(503).json({
                success: false,
                message: 'Base de données non disponible'
            });
        }
        
        // Supprimer l'ancien emploi
        await db.collection('emplois_temps').deleteMany({ classe });
        
        // Insérer le nouveau
        const result = await db.collection('emplois_temps').insertMany(emploi);
        
        res.json({
            success: true,
            message: 'Emploi du temps sauvegardé',
            count: result.insertedCount
        });
    } catch (error) {
        console.error('Erreur sauvegarde emploi:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Obtenir toutes les matières d'une classe depuis la distribution
 */
router.get('/matieres/:className', async (req, res) => {
    try {
        const db = getDB();
        const { className } = req.params;
        
        if (!db) {
            return res.json({
                success: true,
                matieres: []
            });
        }
        
        const matieres = await db.collection('distribution')
            .distinct('Matière', { Classe: className });
        
        res.json({
            success: true,
            matieres: matieres.filter(m => m).sort()
        });
    } catch (error) {
        console.error('Erreur récupération matières:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Obtenir les enseignants depuis la distribution
 */
router.get('/enseignants/:className', async (req, res) => {
    try {
        const db = getDB();
        const { className } = req.params;
        
        if (!db) {
            return res.json({
                success: true,
                enseignants: []
            });
        }
        
        const enseignants = await db.collection('distribution')
            .distinct('Enseignant', { Classe: className });
        
        res.json({
            success: true,
            enseignants: enseignants.filter(e => e).sort()
        });
    } catch (error) {
        console.error('Erreur récupération enseignants:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Charger emplois depuis le fichier JSON
 */
function loadEmploisFromJSON() {
    try {
        const fs = require('fs');
        const path = require('path');
        const jsonPath = path.join(__dirname, '../data/emplois_default.json');
        
        if (fs.existsSync(jsonPath)) {
            const data = fs.readFileSync(jsonPath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Erreur chargement emplois JSON:', error);
    }
    return null;
}

/**
 * Générer emploi du temps par défaut basé sur le fichier JSON
 */
function getDefaultEmploi(className) {
    const horaires = [
        { periode: 1, horaire: '8:00 - 8:45' },
        { periode: 2, horaire: '8:45 - 9:30' },
        { periode: 3, horaire: '9:30 - 10:15' },
        { periode: 4, horaire: '10:35 - 11:15' }, // Après pause
        { periode: 5, horaire: '11:15 - 11:55' },
        { periode: 6, horaire: '11:55 - 12:35' },
        { periode: 7, horaire: '12:35 - 13:15' },
        { periode: 8, horaire: '13:45 - 14:30' }  // Après pause
    ];
    
    const pauses = [
        { periode: 'pause1', horaire: '10:15 - 10:35', nom: '1st Secondary Break' },
        { periode: 'pause2', horaire: '13:15 - 13:45', nom: '2nd Secondary Break' }
    ];
    
    // Charger depuis JSON
    const emploisJSON = loadEmploisFromJSON();
    let emploiData = null;
    
    if (emploisJSON && emploisJSON[className]) {
        emploiData = emploisJSON[className];
    }
    
    const emploi = [];
    const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi'];
    
    jours.forEach(jour => {
        const seances = emploiData ? (emploiData[jour] || []) : [];
        
        horaires.forEach((h, index) => {
            const seance = seances[index] || { matiere: '', enseignant: '' };
            
            emploi.push({
                classe: className,
                jour: jour,
                periode: h.periode,
                horaire: h.horaire,
                matiere: seance.matiere,
                enseignant: seance.enseignant,
                salle: '',
                type: 'cours'
            });
            
            // Ajouter les pauses
            if (h.periode === 3) {
                emploi.push({
                    classe: className,
                    jour: jour,
                    periode: 'pause1',
                    horaire: pauses[0].horaire,
                    matiere: pauses[0].nom,
                    enseignant: '',
                    salle: '',
                    type: 'pause'
                });
            } else if (h.periode === 7) {
                emploi.push({
                    classe: className,
                    jour: jour,
                    periode: 'pause2',
                    horaire: pauses[1].horaire,
                    matiere: pauses[1].nom,
                    enseignant: '',
                    salle: '',
                    type: 'pause'
                });
            }
        });
    });
    
    return emploi;
}

/**
 * Charger emploi par défaut dans la base de données
 */
router.post('/load-default/:className', async (req, res) => {
    try {
        const db = getDB();
        const { className } = req.params;
        
        if (!db) {
            return res.status(503).json({
                success: false,
                message: 'Base de données non disponible'
            });
        }
        
        const emploiDefault = getDefaultEmploi(className);
        
        if (!emploiDefault || emploiDefault.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Aucun emploi par défaut trouvé pour ${className}`
            });
        }
        
        // Supprimer l'ancien et insérer le nouveau
        await db.collection('emplois_temps').deleteMany({ classe: className });
        await db.collection('emplois_temps').insertMany(emploiDefault);
        
        res.json({
            success: true,
            message: `Emploi par défaut chargé pour ${className}`,
            count: emploiDefault.length
        });
    } catch (error) {
        console.error('Erreur chargement emploi par défaut:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Health check
 */
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        module: 'emplois',
        message: 'Module Emplois du Temps fonctionnel'
    });
});

module.exports = router;
