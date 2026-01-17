const express = require('express');
const router = express.Router();
const { getDB } = require('../config/database');

/**
 * Obtenir les plans hebdomadaires pour une semaine et section
 */
router.get('/week/:weekNumber/:section', async (req, res) => {
    try {
        const db = getDB();
        const { weekNumber, section } = req.params;
        const { classe, enseignant } = req.query;
        
        const collection = section === 'filles' ? 'plans_filles' : 'plans_garcons';
        
        const filter = { semaine: `Semaine ${weekNumber}` };
        if (classe) filter.classe = classe;
        if (enseignant) filter.enseignant = enseignant;
        
        const data = await db.collection(collection)
            .find(filter)
            .sort({ classe: 1, matiere: 1, jour: 1 })
            .toArray();
        
        res.json({
            success: true,
            data: data,
            count: data.length,
            week: weekNumber,
            section: section
        });
    } catch (error) {
        console.error('Erreur récupération plans:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Sauvegarder/Mettre à jour un plan hebdomadaire
 */
router.post('/save', async (req, res) => {
    try {
        const db = getDB();
        const { section, plan } = req.body;
        
        if (!section || !plan) {
            return res.status(400).json({
                success: false,
                message: 'Paramètres manquants'
            });
        }
        
        const collection = section === 'filles' ? 'plans_filles' : 'plans_garcons';
        
        // Marquer comme modifié par l'enseignant
        plan.modifie = true;
        plan.date_modification = new Date();
        
        // Mettre à jour ou insérer
        const result = await db.collection(collection).updateOne(
            {
                semaine: plan.semaine,
                classe: plan.classe,
                matiere: plan.matiere,
                jour: plan.jour
            },
            {
                $set: plan
            },
            { upsert: true }
        );
        
        res.json({
            success: true,
            message: 'Plan sauvegardé avec succès',
            modified: result.modifiedCount > 0,
            upserted: result.upsertedCount > 0
        });
    } catch (error) {
        console.error('Erreur sauvegarde plan:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Sauvegarder plusieurs plans en une seule fois
 */
router.post('/save-batch', async (req, res) => {
    try {
        const db = getDB();
        const { section, plans } = req.body;
        
        if (!section || !plans || !Array.isArray(plans)) {
            return res.status(400).json({
                success: false,
                message: 'Paramètres invalides'
            });
        }
        
        const collection = section === 'filles' ? 'plans_filles' : 'plans_garcons';
        
        // Marquer tous comme modifiés
        const modifiedPlans = plans.map(plan => ({
            ...plan,
            modifie: true,
            date_modification: new Date()
        }));
        
        // Utiliser bulk write pour performance
        const bulkOps = modifiedPlans.map(plan => ({
            updateOne: {
                filter: {
                    semaine: plan.semaine,
                    classe: plan.classe,
                    matiere: plan.matiere,
                    jour: plan.jour
                },
                update: { $set: plan },
                upsert: true
            }
        }));
        
        const result = await db.collection(collection).bulkWrite(bulkOps);
        
        res.json({
            success: true,
            message: 'Plans sauvegardés avec succès',
            modified: result.modifiedCount,
            inserted: result.upsertedCount
        });
    } catch (error) {
        console.error('Erreur sauvegarde batch:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Obtenir tous les enseignants
 */
router.get('/enseignants/:section', async (req, res) => {
    try {
        const db = getDB();
        const { section } = req.params;
        
        const collection = section === 'filles' ? 'plans_filles' : 'plans_garcons';
        
        const enseignants = await db.collection(collection)
            .distinct('enseignant');
        
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
 * Obtenir toutes les classes pour une section
 */
router.get('/classes/:section', async (req, res) => {
    try {
        const db = getDB();
        const { section } = req.params;
        
        const collection = section === 'filles' ? 'plans_filles' : 'plans_garcons';
        
        const classes = await db.collection(collection)
            .distinct('classe');
        
        res.json({
            success: true,
            classes: classes.filter(c => c).sort()
        });
    } catch (error) {
        console.error('Erreur récupération classes:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Obtenir toutes les matières pour une section
 */
router.get('/matieres/:section', async (req, res) => {
    try {
        const db = getDB();
        const { section } = req.params;
        const { classe } = req.query;
        
        const collection = section === 'filles' ? 'plans_filles' : 'plans_garcons';
        
        const filter = classe ? { classe } : {};
        const matieres = await db.collection(collection)
            .distinct('matiere', filter);
        
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
 * Synchroniser depuis la distribution
 */
router.post('/sync-from-distribution', async (req, res) => {
    try {
        const { semaine, classe, section } = req.body;
        
        // Appeler l'API de synchronisation
        const fetch = (await import('node-fetch')).default;
        const syncResult = await fetch(`${req.protocol}://${req.get('host')}/api/sync/distribution-to-plans`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ semaine, classe, section })
        });
        
        const result = await syncResult.json();
        res.json(result);
    } catch (error) {
        console.error('Erreur synchronisation:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Health check
 */
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        module: 'plans',
        message: 'Module Plans Hebdomadaires fonctionnel'
    });
});

module.exports = router;
