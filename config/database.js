const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'systeme_scolaire';

let client;
let db;

async function connectDB() {
    try {
        if (!uri || uri === 'mongodb://localhost:27017') {
            console.log('⚠️  MongoDB non configuré - Mode démo (sans base de données)');
            console.log('📝 Configurez MONGODB_URI dans .env pour utiliser la base de données');
            return null;
        }
        
        if (!client) {
            client = new MongoClient(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            await client.connect();
            db = client.db(dbName);
            console.log(`✅ Connecté à MongoDB: ${dbName}`);
        }
        return db;
    } catch (error) {
        console.error('❌ Erreur de connexion MongoDB:', error);
        console.log('⚠️  Le serveur continue en mode démo (sans base de données)');
        return null;
    }
}

function getDB() {
    if (!db) {
        console.warn('⚠️  Base de données non disponible - Mode démo');
        return null;
    }
    return db;
}

async function closeDB() {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log('🔌 Connexion MongoDB fermée');
    }
}

module.exports = { connectDB, getDB, closeDB };
