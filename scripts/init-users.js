#!/usr/bin/env node

/**
 * Script d'initialisation des utilisateurs dans MongoDB
 * Charge les données de data/users.json dans la collection users
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initializeUsers() {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI n\'est pas défini dans .env');
        console.log('ℹ️  Les utilisateurs seront chargés depuis le fichier JSON par défaut');
        process.exit(0);
    }
    
    let client;
    
    try {
        console.log('👥 Initialisation des utilisateurs...\n');
        
        // 1. Charger le fichier JSON
        const jsonPath = path.join(__dirname, '../data/users.json');
        if (!fs.existsSync(jsonPath)) {
            console.error(`❌ Fichier ${jsonPath} introuvable`);
            process.exit(1);
        }
        
        const rawData = fs.readFileSync(jsonPath, 'utf8');
        const usersData = JSON.parse(rawData);
        
        // Support pour les deux formats: users ou enseignants
        const users = usersData.users || usersData.enseignants || [];
        console.log(`✅ Fichier JSON chargé: ${users.length} utilisateurs`);
        
        // 2. Connexion MongoDB
        console.log('🔌 Connexion à MongoDB...');
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        const db = client.db();
        console.log('✅ Connecté à MongoDB\n');
        
        // 3. Supprimer les anciennes données
        console.log('🗑️  Suppression des anciennes données...');
        const deleteResult = await db.collection('users').deleteMany({});
        console.log(`   Supprimé: ${deleteResult.deletedCount} documents\n`);
        
        // 4. Ajouter le rôle 'enseignant' par défaut si non spécifié
        const usersToInsert = users.map(u => ({
            ...u,
            role: u.role || 'enseignant'
        }));
        
        // 5. Insérer les nouvelles données
        console.log('💾 Insertion des nouvelles données...');
        const insertResult = await db.collection('users').insertMany(usersToInsert);
        console.log(`   Inséré: ${insertResult.insertedCount} documents\n`);
        
        // 6. Vérification
        console.log('📊 Vérification:');
        console.log('─'.repeat(50));
        
        const enseignants = await db.collection('users').find({ role: 'enseignant' }).toArray();
        const admins = await db.collection('users').find({ role: 'admin' }).toArray();
        
        console.log(`\nEnseignants: ${enseignants.length}`);
        enseignants.slice(0, 3).forEach(e => {
            console.log(`  - ${e.username} (${e.nom_complet})`);
        });
        if (enseignants.length > 3) {
            console.log(`  ... et ${enseignants.length - 3} autres`);
        }
        
        console.log(`\nAdmins: ${admins.length}`);
        admins.forEach(a => {
            console.log(`  - ${a.username} (${a.nom_complet})`);
        });
        
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
    initializeUsers().catch(console.error);
}

module.exports = { initializeUsers };
