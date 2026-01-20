const express = require('express');
const router = express.Router();
const { getDB } = require('../config/database');

/**
 * Obtenir les plans hebdomadaires pour une semaine (garçons uniquement)
 */
router.get('/week/:weekNumber/:section', async (req, res) => {
    try {
        const db = getDB();
        const { weekNumber, section } = req.params;
        const { classe, enseignant } = req.query;
        
        // Toujours utiliser plans_garcons
        const collection = 'plans_garcons';
        
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
 * Sauvegarder/Mettre à jour un plan hebdomadaire (garçons uniquement)
 */
router.post('/save', async (req, res) => {
    try {
        const db = getDB();
        const { section, plan } = req.body;
        
        if (!plan) {
            return res.status(400).json({
                success: false,
                message: 'Paramètres manquants'
            });
        }
        
        // Toujours utiliser plans_garcons
        const collection = 'plans_garcons';
        
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
 * Sauvegarder plusieurs plans en une seule fois (garçons uniquement)
 */
router.post('/save-batch', async (req, res) => {
    try {
        const db = getDB();
        const { section, plans } = req.body;
        
        if (!plans || !Array.isArray(plans)) {
            return res.status(400).json({
                success: false,
                message: 'Paramètres invalides'
            });
        }
        
        // Toujours utiliser plans_garcons
        const collection = 'plans_garcons';
        
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
 * Obtenir tous les enseignants (garçons uniquement)
 */
router.get('/enseignants/:section', async (req, res) => {
    try {
        const db = getDB();
        const { section } = req.params;
        
        // Toujours utiliser plans_garcons
        const collection = 'plans_garcons';
        
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
 * Obtenir toutes les classes (garçons uniquement)
 */
router.get('/classes/:section', async (req, res) => {
    try {
        const db = getDB();
        const { section } = req.params;
        
        // Toujours utiliser plans_garcons
        const collection = 'plans_garcons';
        
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
 * Obtenir toutes les matières (garçons uniquement)
 */
router.get('/matieres/:section', async (req, res) => {
    try {
        const db = getDB();
        const { section } = req.params;
        const { classe } = req.query;
        
        // Toujours utiliser plans_garcons
        const collection = 'plans_garcons';
        
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
 * Générer plans à partir de Distribution + Emplois du Temps
 */
router.post('/generate-from-emplois', async (req, res) => {
    try {
        const db = getDB();
        const { classe, semaine } = req.body;
        
        if (!classe || !semaine) {
            return res.status(400).json({
                success: false,
                message: 'Classe et semaine requises'
            });
        }
        
        // 1. Récupérer l'emploi du temps de la classe
        const emplois = await db.collection('emplois_temps')
            .find({ classe })
            .sort({ jour: 1, periode: 1 })
            .toArray();
        
        if (emplois.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Aucun emploi du temps trouvé pour ${classe}`
            });
        }
        
        // 2. Récupérer les données de la distribution pour cette semaine et classe
        const distribution = await db.collection('distribution')
            .find({ 
                Semaine: semaine, 
                Classe: classe 
            })
            .toArray();
        
        // 3. Créer un plan pour chaque séance de l'emploi
        const plans = [];
        const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi'];
        
        emplois.forEach(emploi => {
            if (emploi.type === 'pause' || !emploi.matiere) return;
            
            // Trouver les données de distribution correspondantes
            const distData = distribution.find(d => 
                d.Matière === emploi.matiere && 
                d.Enseignant === emploi.enseignant
            );
            
            plans.push({
                semaine: semaine,
                classe: classe,
                matiere: emploi.matiere,
                enseignant: emploi.enseignant,
                jour: emploi.jour,
                periode: emploi.periode,
                horaire: emploi.horaire,
                salle: emploi.salle || '',
                objectifs: distData?.Objectifs || '',
                competences: distData?.Compétences || '',
                activites: distData?.Activités || '',
                ressources: distData?.Ressources || '',
                evaluation: distData?.Évaluation || '',
                notes: '',
                modifie: false,
                date_creation: new Date()
            });
        });
        
        // 4. Insérer les plans (ou mettre à jour si existants)
        const operations = plans.map(plan => ({
            updateOne: {
                filter: {
                    semaine: plan.semaine,
                    classe: plan.classe,
                    matiere: plan.matiere,
                    jour: plan.jour,
                    periode: plan.periode
                },
                update: { $set: plan },
                upsert: true
            }
        }));
        
        const result = await db.collection('plans_garcons').bulkWrite(operations);
        
        res.json({
            success: true,
            message: `Plans générés pour ${classe} - ${semaine}`,
            inserted: result.upsertedCount,
            updated: result.modifiedCount,
            total: plans.length
        });
    } catch (error) {
        console.error('Erreur génération plans:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * Générer un plan de leçon IA pour UNE seule séance (bouton disquette)
 */
router.post('/generate-single-ai-lesson-plan', async (req, res) => {
    try {
        const { week, rowData } = req.body;
        
        if (!week || !rowData) {
            return res.status(400).json({
                success: false,
                message: 'Paramètres manquants (week, rowData)'
            });
        }
        
        // Import dynamique pour éviter les erreurs si le module n'est pas installé
        const Docxtemplater = require('docxtemplater');
        const PizZip = require('pizzip');
        const fs = require('fs');
        const path = require('path');
        
        // Template simple pour plan de leçon
        const templatePath = path.join(__dirname, '../templates/lesson_plan_template.docx');
        
        // Si le template n'existe pas, créer un document simple
        let docBuffer;
        
        if (fs.existsSync(templatePath)) {
            const content = fs.readFileSync(templatePath, 'binary');
            const zip = new PizZip(content);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true
            });
            
            doc.render({
                semaine: week,
                classe: rowData.Classe || '',
                matiere: rowData.Matière || '',
                enseignant: rowData.Enseignant || '',
                jour: rowData.Jour || '',
                periode: rowData.Période || '',
                lecon: rowData.Leçon || '',
                travaux: rowData['Travaux de classe'] || '',
                support: rowData.Support || '',
                devoirs: rowData.Devoirs || '',
                date: new Date().toLocaleDateString('fr-FR')
            });
            
            docBuffer = doc.getZip().generate({ type: 'nodebuffer' });
        } else {
            // Créer un document Word simple sans template
            const Document = require('docx').Document;
            const Packer = require('docx').Packer;
            const Paragraph = require('docx').Paragraph;
            const TextRun = require('docx').TextRun;
            
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Plan de Leçon - Semaine ${week}`,
                                    bold: true,
                                    size: 32
                                })
                            ]
                        }),
                        new Paragraph({ text: '' }),
                        new Paragraph({ children: [new TextRun({ text: `Classe: ${rowData.Classe || ''}`, bold: true })] }),
                        new Paragraph({ children: [new TextRun({ text: `Matière: ${rowData.Matière || ''}`, bold: true })] }),
                        new Paragraph({ children: [new TextRun({ text: `Enseignant: ${rowData.Enseignant || ''}` })] }),
                        new Paragraph({ children: [new TextRun({ text: `Jour: ${rowData.Jour || ''}, Période: ${rowData.Période || ''}` })] }),
                        new Paragraph({ text: '' }),
                        new Paragraph({ children: [new TextRun({ text: 'Leçon:', bold: true })] }),
                        new Paragraph({ text: rowData.Leçon || '' }),
                        new Paragraph({ text: '' }),
                        new Paragraph({ children: [new TextRun({ text: 'Travaux de classe:', bold: true })] }),
                        new Paragraph({ text: rowData['Travaux de classe'] || '' }),
                        new Paragraph({ text: '' }),
                        new Paragraph({ children: [new TextRun({ text: 'Support:', bold: true })] }),
                        new Paragraph({ text: rowData.Support || '' }),
                        new Paragraph({ text: '' }),
                        new Paragraph({ children: [new TextRun({ text: 'Devoirs:', bold: true })] }),
                        new Paragraph({ text: rowData.Devoirs || '' })
                    ]
                }]
            });
            
            docBuffer = await Packer.toBuffer(doc);
        }
        
        const filename = `Plan_Lecon_${rowData.Classe}_${rowData.Matière}_S${week}.docx`
            .replace(/[^a-zA-Z0-9_\-\.]/g, '_');
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(docBuffer);
        
    } catch (error) {
        console.error('Erreur génération plan IA unique:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la génération du plan de leçon',
            error: error.message 
        });
    }
});

/**
 * Générer plusieurs plans de leçon IA (bouton tableau) - ZIP
 */
router.post('/generate-multiple-ai-lesson-plans', async (req, res) => {
    try {
        const { week, rowsData } = req.body;
        
        if (!week || !rowsData || !Array.isArray(rowsData)) {
            return res.status(400).json({
                success: false,
                message: 'Paramètres manquants (week, rowsData array)'
            });
        }
        
        const archiver = require('archiver');
        const { Document, Packer, Paragraph, TextRun } = require('docx');
        
        // Créer un ZIP
        const archive = archiver('zip', { zlib: { level: 9 } });
        
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="Plans_Lecon_IA_S${week}.zip"`);
        
        archive.pipe(res);
        
        // Générer un document Word pour chaque ligne
        for (let i = 0; i < rowsData.length; i++) {
            const rowData = rowsData[i];
            
            const doc = new Document({
                sections: [{
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `Plan de Leçon - Semaine ${week}`,
                                    bold: true,
                                    size: 32
                                })
                            ]
                        }),
                        new Paragraph({ text: '' }),
                        new Paragraph({ children: [new TextRun({ text: `Classe: ${rowData.Classe || ''}`, bold: true })] }),
                        new Paragraph({ children: [new TextRun({ text: `Matière: ${rowData.Matière || ''}`, bold: true })] }),
                        new Paragraph({ children: [new TextRun({ text: `Enseignant: ${rowData.Enseignant || ''}` })] }),
                        new Paragraph({ children: [new TextRun({ text: `Jour: ${rowData.Jour || ''}, Période: ${rowData.Période || ''}` })] }),
                        new Paragraph({ text: '' }),
                        new Paragraph({ children: [new TextRun({ text: 'Leçon:', bold: true })] }),
                        new Paragraph({ text: rowData.Leçon || '' }),
                        new Paragraph({ text: '' }),
                        new Paragraph({ children: [new TextRun({ text: 'Travaux de classe:', bold: true })] }),
                        new Paragraph({ text: rowData['Travaux de classe'] || '' }),
                        new Paragraph({ text: '' }),
                        new Paragraph({ children: [new TextRun({ text: 'Support:', bold: true })] }),
                        new Paragraph({ text: rowData.Support || '' }),
                        new Paragraph({ text: '' }),
                        new Paragraph({ children: [new TextRun({ text: 'Devoirs:', bold: true })] }),
                        new Paragraph({ text: rowData.Devoirs || '' })
                    ]
                }]
            });
            
            const docBuffer = await Packer.toBuffer(doc);
            
            const filename = `Plan_${String(i + 1).padStart(3, '0')}_${rowData.Classe}_${rowData.Matière}_${rowData.Jour}.docx`
                .replace(/[^a-zA-Z0-9_\-\.]/g, '_');
            
            archive.append(docBuffer, { name: filename });
        }
        
        await archive.finalize();
        
    } catch (error) {
        console.error('Erreur génération plans IA multiples:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de la génération des plans de leçon',
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
        module: 'plans',
        message: 'Module Plans Hebdomadaires fonctionnel'
    });
});

module.exports = router;
