#!/usr/bin/env node

/**
 * Script d'initialisation des emplois du temps dans MongoDB
 * Charge les données de data/emplois_default.json dans la collection emplois_temps
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initializeEmplois() {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI n\'est pas défini dans .env');
        console.log('ℹ️  Les emplois du temps seront chargés depuis le fichier JSON par défaut');
        process.exit(0);
    }
    
    let client;
    
    try {
        console.log('📚 Initialisation des emplois du temps...\n');
        
        // 1. Charger le fichier JSON
        const jsonPath = path.join(__dirname, '../data/emplois_default.json');
        if (!fs.existsSync(jsonPath)) {
            console.error(`❌ Fichier ${jsonPath} introuvable`);
            process.exit(1);
        }
        
        const rawData = fs.readFileSync(jsonPath, 'utf8');
        const emploisData = JSON.parse(rawData);
        
        console.log(`✅ Fichier JSON chargé: ${Object.keys(emploisData).length} classes`);
        
        // 2. Connexion MongoDB
        console.log('🔌 Connexion à MongoDB...');
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        const db = client.db();
        console.log('✅ Connecté à MongoDB\n');
        
        // 3. Préparer les documents pour insertion
        const documents = [];
        for (const [classe, emploi] of Object.entries(emploisData)) {
            if (Array.isArray(emploi)) {
                emploi.forEach(seance => {
                    documents.push({
                        ...seance,
                        classe: classe
                    });
                });
            }
        }
        
        console.log(`📝 ${documents.length} séances à insérer\n`);
        
        // 4. Supprimer les anciennes données
        console.log('🗑️  Suppression des anciennes données...');
        const deleteResult = await db.collection('emplois_temps').deleteMany({});
        console.log(`   Supprimé: ${deleteResult.deletedCount} documents\n`);
        
        // 5. Insérer les nouvelles données
        console.log('💾 Insertion des nouvelles données...');
        if (documents.length > 0) {
            const insertResult = await db.collection('emplois_temps').insertMany(documents);
            console.log(`   Inséré: ${insertResult.insertedCount} documents\n`);
        }
        
        // 6. Vérification par classe
        console.log('📊 Vérification par classe:');
        console.log('─'.repeat(50));
        
        const classes = ['PEI1-G', 'PEI2-G', 'PEI3-G', 'PEI4-G', 'DP2-G'];
        for (const classe of classes) {
            const count = await db.collection('emplois_temps').countDocuments({ classe });
            const sample = await db.collection('emplois_temps')
                .find({ classe, jour: 'Dimanche' })
                .limit(2)
                .toArray();
            
            console.log(`\n${classe}: ${count} séances`);
            if (sample.length > 0) {
                console.log(`  Exemple: ${sample[0].matiere} - ${sample[0].enseignant}`);
            }
        }
        
        console.log('\n' + '─'.repeat(50));
        console.log('✅ Initialisation terminée avec succès!\n');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error.message);
        process.exit(1);
    } finally {
        if (client) {
            await client.close();
            console.log('🔌 Déconnexion de MongoDB');
        }
    }
}

// Exécution
if (require.main === module) {
    initializeEmplois().catch(console.error);
}

module.exports = { initializeEmplois };
