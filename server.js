const express = require('express');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const { connectDB } = require('./config/database');

// Import des routes modulaires
const distributionRoutes = require('./api/distribution');
const plansRoutes = require('./api/plans');
const devoirsRoutes = require('./api/devoirs');
const syncRoutes = require('./api/sync');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Routes API modulaires
app.use('/api/distribution', distributionRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/devoirs', devoirsRoutes);
app.use('/api/sync', syncRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Système Scolaire Intégré fonctionnel',
        modules: ['distribution', 'plans', 'devoirs'],
        timestamp: new Date().toISOString()
    });
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error('❌ Erreur serveur:', err);
    res.status(500).json({ 
        error: 'Erreur serveur interne',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
    });
});

// Démarrage du serveur
async function startServer() {
    try {
        // Connexion à la base de données
        await connectDB();
        
        // Démarrage du serveur
        app.listen(PORT, () => {
            console.log(`\n🚀 Serveur démarré sur le port ${PORT}`);
            console.log(`📍 URL: http://localhost:${PORT}`);
            console.log(`📊 Modules actifs:`);
            console.log(`   - Distribution Annuelle: http://localhost:${PORT}/distribution.html`);
            console.log(`   - Plans Hebdomadaires: http://localhost:${PORT}/plans.html`);
            console.log(`   - Devoirs: http://localhost:${PORT}/devoirs.html`);
            console.log(`\n✅ Système prêt à l'utilisation\n`);
        });
    } catch (error) {
        console.error('❌ Erreur au démarrage du serveur:', error);
        process.exit(1);
    }
}

// Gestion de l'arrêt propre
process.on('SIGINT', async () => {
    console.log('\n⏹️  Arrêt du serveur...');
    const { closeDB } = require('./config/database');
    await closeDB();
    process.exit(0);
});

// Démarrage
startServer();

module.exports = app;
