const express = require('express');
const router = express.Router();
const { getDB } = require('../config/database');

/**
 * Obtenir les devoirs pour une classe et section
 */
router.get('/class/:className/:section', async (req, res) => {
    try {
        const db = getDB();
        const { className, section } = req.params;
        const { semaine, jour } = req.query;
        
        const collection = section === 'filles' ? 'devoirs_filles' : 'devoirs_garcons';
        
        const filter = { classe: className };
        if (semaine) filter.semaine = semaine;
        if (jour) filter.jour = jour;
        
        const data = await db.collection(collection)
            .find(filter)
            .sort({ date: -1, matiere: 1 })
            .toArray();
        
        res.json({
            success: true,
            data: data,
            count: data.length
        });
    } catch (error) {
        console.error('Erreur récupération devoirs:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Obtenir les devoirs d'un élève
 */
router.get('/student/:studentName/:section', async (req, res) => {
    try {
        const db = getDB();
        const { studentName, section } = req.params;
        const { classe, semaine } = req.query;
        
        const collection = section === 'filles' ? 'devoirs_filles' : 'devoirs_garcons';
        
        const filter = { classe };
        if (semaine) filter.semaine = semaine;
        
        const devoirs = await db.collection(collection)
            .find(filter)
            .sort({ date: -1 })
            .toArray();
        
        // Filtrer les évaluations de cet élève
        const devoirsEleve = devoirs.map(devoir => {
            const evaluation = devoir.evaluations?.find(e => e.nom_eleve === studentName);
            return {
                ...devoir,
                evaluation_eleve: evaluation || null
            };
        });
        
        res.json({
            success: true,
            data: devoirsEleve,
            count: devoirsEleve.length
        });
    } catch (error) {
        console.error('Erreur récupération devoirs élève:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Sauvegarder/Mettre à jour un devoir
 */
router.post('/save', async (req, res) => {
    try {
        const db = getDB();
        const { section, devoir } = req.body;
        
        if (!section || !devoir) {
            return res.status(400).json({
                success: false,
                message: 'Paramètres manquants'
            });
        }
        
        const collection = section === 'filles' ? 'devoirs_filles' : 'devoirs_garcons';
        
        devoir.date_modification = new Date();
        
        const result = await db.collection(collection).updateOne(
            {
                semaine: devoir.semaine,
                classe: devoir.classe,
                matiere: devoir.matiere,
                jour: devoir.jour
            },
            {
                $set: devoir
            },
            { upsert: true }
        );
        
        res.json({
            success: true,
            message: 'Devoir sauvegardé avec succès',
            modified: result.modifiedCount > 0,
            upserted: result.upsertedCount > 0
        });
    } catch (error) {
        console.error('Erreur sauvegarde devoir:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Évaluer un devoir pour un élève
 */
router.post('/evaluate', async (req, res) => {
    try {
        const db = getDB();
        const { section, devoir_id, evaluation } = req.body;
        
        if (!section || !devoir_id || !evaluation) {
            return res.status(400).json({
                success: false,
                message: 'Paramètres manquants'
            });
        }
        
        const collection = section === 'filles' ? 'devoirs_filles' : 'devoirs_garcons';
        
        // Ajouter ou mettre à jour l'évaluation
        const result = await db.collection(collection).updateOne(
            { _id: devoir_id },
            {
                $pull: { evaluations: { nom_eleve: evaluation.nom_eleve } }
            }
        );
        
        await db.collection(collection).updateOne(
            { _id: devoir_id },
            {
                $push: { evaluations: evaluation }
            }
        );
        
        res.json({
            success: true,
            message: 'Évaluation enregistrée avec succès'
        });
    } catch (error) {
        console.error('Erreur évaluation devoir:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Synchroniser depuis les plans hebdo
 */
router.post('/sync-from-plans', async (req, res) => {
    try {
        const { semaine, classe, jour, section } = req.body;
        
        // Appeler l'API de synchronisation
        const fetch = (await import('node-fetch')).default;
        const syncResult = await fetch(`${req.protocol}://${req.get('host')}/api/sync/plans-to-devoirs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ semaine, classe, jour, section })
        });
        
        const result = await syncResult.json();
        res.json(result);
    } catch (error) {
        console.error('Erreur synchronisation:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Obtenir les statistiques des devoirs pour une classe
 */
router.get('/stats/:className/:section', async (req, res) => {
    try {
        const db = getDB();
        const { className, section } = req.params;
        const { semaine } = req.query;
        
        const collection = section === 'filles' ? 'devoirs_filles' : 'devoirs_garcons';
        
        const filter = { classe: className };
        if (semaine) filter.semaine = semaine;
        
        const devoirs = await db.collection(collection)
            .find(filter)
            .toArray();
        
        // Calculer les statistiques
        const stats = {
            total_devoirs: devoirs.length,
            devoirs_evalues: 0,
            devoirs_en_attente: 0,
            moyenne_classe: 0
        };
        
        let total_notes = 0;
        let count_notes = 0;
        
        devoirs.forEach(devoir => {
            if (devoir.evaluations && devoir.evaluations.length > 0) {
                stats.devoirs_evalues++;
                devoir.evaluations.forEach(eval => {
                    if (eval.note !== undefined && eval.note !== null) {
                        total_notes += eval.note;
                        count_notes++;
                    }
                });
            } else {
                stats.devoirs_en_attente++;
            }
        });
        
        if (count_notes > 0) {
            stats.moyenne_classe = (total_notes / count_notes).toFixed(2);
        }
        
        res.json({
            success: true,
            stats: stats
        });
    } catch (error) {
        console.error('Erreur statistiques devoirs:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Obtenir les élèves d'une classe
 */
router.get('/students/:className/:section', async (req, res) => {
    try {
        const db = getDB();
        const { className, section } = req.params;
        
        // Collection des élèves (à créer séparément)
        const studentsCollection = section === 'filles' ? 'eleves_filles' : 'eleves_garcons';
        
        const students = await db.collection(studentsCollection)
            .find({ classe: className })
            .sort({ nom: 1 })
            .toArray();
        
        res.json({
            success: true,
            students: students
        });
    } catch (error) {
        console.error('Erreur récupération élèves:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Health check
 */
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        module: 'devoirs',
        message: 'Module Devoirs fonctionnel'
    });
});

module.exports = router;
