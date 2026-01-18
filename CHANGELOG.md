# Changelog - Système Scolaire Intégré

## [1.1.0] - 2026-01-17

### 🔄 Changed
- **Simplification du système** : Suppression de la section Filles
- Conservation uniquement de la section Garçons
- Optimisation des performances avec une seule section

### 🗑️ Removed
- Collections MongoDB `plans_filles`, `devoirs_filles`, `eleves_filles`
- Routes API spécifiques aux filles
- Références UI aux sections filles

### 📝 Updated
- API `/api/plans/*` : Utilise uniquement `plans_garcons`
- API `/api/devoirs/*` : Utilise uniquement `devoirs_garcons`
- API `/api/sync/*` : Synchronisation simplifiée pour une seule section
- Documentation mise à jour (README, GUIDE_UTILISATION, INSTALLATION)

### 🎯 Impact
- Code simplifié et plus maintenable
- Performance améliorée (moins de requêtes DB)
- Réduction de la complexité de synchronisation

---

## [1.0.0] - 2026-01-17

### ✨ Added
- **Système scolaire intégré** unifiant 3 modules
- Module Distribution Annuelle avec export Excel/Word
- Module Plans Hebdomadaires avec synchronisation auto
- Module Devoirs avec suivi et évaluation
- Synchronisation automatique Distribution → Plans → Devoirs
- API REST complète avec tous les endpoints
- Page d'accueil unifiée avec navigation centralisée
- Documentation complète (README, Guide utilisateur, Guide installation)

### 🏗️ Architecture
- Backend Express.js avec routes modulaires
- Configuration MongoDB avec mode démo
- Frontend HTML/CSS/JS avec designs originaux préservés
- Système de synchronisation bidirectionnelle

### 📦 Structure
```
systeme-scolaire-integre/
├── api/          # Routes API modulaires
├── config/       # Configuration DB
├── public/       # Frontend
├── server.js     # Serveur principal
└── docs/         # Documentation
```

### 🔧 Configuration
- Support MongoDB Atlas et local
- Variables d'environnement (.env)
- Clés API optionnelles (OpenAI, Gemini)
- Mode démo sans base de données

### 📚 Documentation
- README.md : Documentation technique
- GUIDE_UTILISATION.md : Guide utilisateur
- INSTALLATION.md : Guide d'installation
- .env.example : Configuration exemple
