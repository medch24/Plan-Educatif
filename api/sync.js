const express = require('express');
const router = express.Router();
const { getDB } = require('../config/database');

/**
 * Synchronisation : Distribution Annuelle → Plans Hebdomadaires (garçons uniquement)
 * Copie automatique des données de distribution vers les plans hebdo
 */
router.post('/distribution-to-plans', async (req, res) => {
    try {
        const db = getDB();
        const { semaine, classe, section } = req.body; // section sera toujours 'garcons'
        
        // Récupérer les données de la distribution pour cette semaine/classe
        const distributionData = await db.collection('distribution')
            .find({ 
                Semaine: semaine,
                Classe: classe
            })
            .toArray();
        
        if (distributionData.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Aucune donnée de distribution trouvée'
            });
        }
        
        // Préparer les données pour les plans hebdo
        const plansData = distributionData.map(item => ({
            semaine: item.Semaine,
            classe: item.Classe,
            matiere: item.Matière || item.Matiere,
            enseignant: item.Enseignant,
            seance: item.Séance || item.Seance,
            contenu: item.Contenu || '',
            pages_manuel: item['Pages Manuel'] || '',
            pages_cahier: item['Pages Cahier'] || '',
            section: section,
            source: 'distribution',
            date_sync: new Date(),
            modifie: false, // Permet de savoir si l'enseignant a modifié
            date_modification: null
        }));
        
        // Toujours utiliser plans_garcons
        const targetCollection = 'plans_garcons';
        
        // Supprimer les anciennes données pour cette semaine/classe avant d'insérer
        await db.collection(targetCollection).deleteMany({
            semaine: semaine,
            classe: classe,
            source: 'distribution' // Ne supprimer que les données non modifiées
        });
        
        // Insérer les nouvelles données
        const result = await db.collection(targetCollection).insertMany(plansData);
        
        res.json({
            success: true,
            message: `${result.insertedCount} éléments synchronisés vers ${targetCollection}`,
            count: result.insertedCount,
            semaine: semaine,
            classe: classe,
            section: section
        });
        
    } catch (error) {
        console.error('Erreur sync distribution → plans:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Synchronisation : Plans Hebdomadaires → Devoirs (garçons uniquement)
 * Mise à jour journalière des devoirs basée sur les plans
 */
router.post('/plans-to-devoirs', async (req, res) => {
    try {
        const db = getDB();
        const { semaine, classe, jour, section } = req.body;
        
        // Toujours utiliser plans_garcons
        const sourceCollection = 'plans_garcons';
        const plansData = await db.collection(sourceCollection)
            .find({
                semaine: semaine,
                classe: classe,
                jour: jour
            })
            .toArray();
        
        if (plansData.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Aucun plan trouvé pour cette semaine/classe/jour'
            });
        }
        
        // Préparer les données pour les devoirs
        const devoirsData = plansData.map(plan => ({
            semaine: plan.semaine,
            classe: plan.classe,
            matiere: plan.matiere,
            enseignant: plan.enseignant,
            jour: jour,
            date: new Date(),
            contenu_devoir: plan.contenu || '',
            type_devoir: 'Quotidien',
            section: section,
            source: 'plan_hebdo',
            date_sync: new Date(),
            statut: 'en_attente', // statut par défaut
            evaluations: [] // Sera rempli par les enseignants
        }));
        
        // Toujours utiliser devoirs_garcons
        const targetCollection = 'devoirs_garcons';
        
        // Vérifier si des devoirs existent déjà pour ce jour
        const existingDevoirs = await db.collection(targetCollection).find({
            semaine: semaine,
            classe: classe,
            jour: jour
        }).toArray();
        
        if (existingDevoirs.length > 0) {
            // Mettre à jour au lieu d'insérer
            for (const devoir of devoirsData) {
                await db.collection(targetCollection).updateOne(
                    {
                        semaine: devoir.semaine,
                        classe: devoir.classe,
                        matiere: devoir.matiere,
                        jour: devoir.jour
                    },
                    {
                        $set: {
                            contenu_devoir: devoir.contenu_devoir,
                            date_sync: devoir.date_sync
                        }
                    },
                    { upsert: true }
                );
            }
            
            res.json({
                success: true,
                message: `Devoirs mis à jour pour ${targetCollection}`,
                count: devoirsData.length,
                action: 'update'
            });
        } else {
            // Insérer de nouveaux devoirs
            const result = await db.collection(targetCollection).insertMany(devoirsData);
            
            res.json({
                success: true,
                message: `${result.insertedCount} devoirs créés dans ${targetCollection}`,
                count: result.insertedCount,
                action: 'insert'
            });
        }
        
    } catch (error) {
        console.error('Erreur sync plans → devoirs:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Synchronisation complète pour une semaine (garçons uniquement)
 */
router.post('/sync-week', async (req, res) => {
    try {
        const { semaine, section } = req.body; // section sera toujours 'garcons'
        
        const db = getDB();
        
        // Récupérer toutes les classes de la distribution pour cette semaine
        const classes = await db.collection('distribution')
            .distinct('Classe', { Semaine: semaine });
        
        const results = {
            distribution_to_plans: [],
            plans_to_devoirs: []
        };
        
        // Toujours garcons uniquement
        const sections = ['garcons'];
        
        // Pour chaque section
        for (const sec of sections) {
            // Pour chaque classe
            for (const classe of classes) {
                // Sync distribution → plans
                const syncPlanResult = await fetch(`${req.protocol}://${req.get('host')}/api/sync/distribution-to-plans`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ semaine, classe, section: sec })
                });
                
                results.distribution_to_plans.push({
                    classe,
                    section: sec,
                    success: syncPlanResult.ok
                });
            }
        }
        
        res.json({
            success: true,
            message: `Synchronisation complète effectuée pour la semaine ${semaine}`,
            results: results,
            semaine: semaine
        });
        
    } catch (error) {
        console.error('Erreur sync complète:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Health check du module de synchronisation
 */
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        module: 'sync',
        message: 'Module de synchronisation fonctionnel'
    });
});

module.exports = router;
