#!/usr/bin/env node

/**
 * Script maître d'initialisation de toutes les données MongoDB
 * Exécute tous les scripts d'initialisation dans l'ordre
 */

const { initializeUsers } = require('./init-users');
const { initializeEmplois } = require('./init-emplois');

async function initializeAll() {
    console.log('═'.repeat(60));
    console.log('     INITIALISATION COMPLÈTE DU SYSTÈME SCOLAIRE');
    console.log('═'.repeat(60));
    console.log('\n');
    
    try {
        // 1. Initialiser les utilisateurs
        console.log('📍 ÉTAPE 1/2: Initialisation des utilisateurs');
        console.log('─'.repeat(60));
        await initializeUsers();
        
        console.log('\n');
        
        // 2. Initialiser les emplois du temps
        console.log('📍 ÉTAPE 2/2: Initialisation des emplois du temps');
        console.log('─'.repeat(60));
        await initializeEmplois();
        
        console.log('\n');
        console.log('═'.repeat(60));
        console.log('     ✅ INITIALISATION COMPLÈTE RÉUSSIE!');
        console.log('═'.repeat(60));
        console.log('\n');
        console.log('📌 Prochaines étapes:');
        console.log('   1. Démarrez le serveur: npm start');
        console.log('   2. Accédez à: http://localhost:3000');
        console.log('   3. Connectez-vous avec: Mohamed / Mohamed');
        console.log('\n');
        
    } catch (error) {
        console.error('\n❌ Erreur lors de l\'initialisation:', error.message);
        process.exit(1);
    }
}

// Exécution
if (require.main === module) {
    initializeAll().catch(console.error);
}

module.exports = { initializeAll };
