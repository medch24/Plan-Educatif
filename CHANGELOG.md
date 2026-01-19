# Changelog - Système Scolaire Intégré

## [2.1.0] - 2026-01-19 (Latest) 🎉

### ✨ Nouveautés Majeures
- **🗓️ Module Emplois du Temps** : Nouveau module complet pour organiser les matières par jour et période
- **🤖 Génération Automatique des Plans** : Les plans hebdomadaires sont maintenant générés en combinant Emplois du Temps + Distribution Annuelle
- **📋 Emplois par Défaut** : Chargement automatique des emplois du temps depuis le PDF fourni pour les 5 classes
- **🔄 Synchronisation Intelligente** : Nouvelle route `POST /api/sync/emplois-to-plans` pour générer les plans

### 📚 Nouveau Flux de Données
```
Distribution Annuelle (Contenu pédagogique)
    ↓
Emplois du Temps (Structure horaire : jour/période/horaire)
    ↓ [Génération automatique]
Plans Hebdomadaires (Plans détaillés par séance)
    ↓ [Synchronisation quotidienne]
Devoirs (Suivi et évaluation)
```

### 🗄️ Nouvelle Collection MongoDB
- `emplois_temps` : Gestion des emplois du temps par classe
  - Structure : classe, jour, periode, horaire, matiere, enseignant, salle, type

### 🎯 Classes Supportées (Section Secondaire Garçons)
- **PEI1-G** : Programme d'Éducation Intermédiaire 1 Garçons
- **PEI2-G** : Programme d'Éducation Intermédiaire 2 Garçons
- **PEI3-G** : Programme d'Éducation Intermédiaire 3 Garçons
- **PEI4-G** : Programme d'Éducation Intermédiaire 4 Garçons
- **DP2-G** : Diplôme Programme 2 Garçons

### 📖 Périodes Standards
- **8 périodes de cours** : 8:00 - 14:30
  - Période 1 : 8:00 - 8:45
  - Période 2 : 8:45 - 9:30
  - Période 3 : 9:30 - 10:15
  - **Pause 1** : 10:15 - 10:35
  - Période 4 : 10:35 - 11:15
  - Période 5 : 11:15 - 11:55
  - Période 6 : 11:55 - 12:35
  - Période 7 : 12:35 - 13:15
  - **Pause 2** : 13:15 - 13:45
  - Période 8 : 13:45 - 14:30
- **5 jours** : Dimanche, Lundi, Mardi, Mercredi, Jeudi

### 🔧 Nouvelles APIs
- `GET /api/emplois/classe/:className` - Récupérer l'emploi du temps d'une classe
- `POST /api/emplois/save` - Sauvegarder un emploi du temps
- `POST /api/emplois/load-default/:className` - Charger l'emploi par défaut
- `GET /api/emplois/matieres/:className` - Récupérer les matières depuis la distribution
- `GET /api/emplois/enseignants/:className` - Récupérer les enseignants
- `POST /api/sync/emplois-to-plans` - Générer plans depuis emplois + distribution
- `POST /api/plans/generate-from-emplois` - Alternative pour génération plans

### 📝 Documentation
- **ARCHITECTURE.md** : Documentation complète de l'architecture (10KB+)
  - Diagrammes de flux
  - Structure des données
  - Collections MongoDB
  - Workflow complet
  - API Endpoints
- Mise à jour README.md avec nouveau flux
- Mise à jour GUIDE_UTILISATION.md
- Mise à jour INSTALLATION.md

### 🎨 Interface Emplois du Temps
- **URL** : `/emplois.html`
- Grille interactive éditable (5 jours × 10 périodes)
- Sélection par classe (dropdown)
- Affectation enseignant/matière/salle par période
- Gestion automatique des pauses
- Boutons d'action :
  - ✅ Charger emploi par défaut
  - 💾 Enregistrer les modifications
  - 🔄 Réinitialiser
  - 📊 Exporter Excel
  - 🖨️ Imprimer
- Modal d'édition pour chaque cellule
- Autocomplete pour matières et enseignants

### 🗂️ Données Par Défaut
- Fichier `data/emplois_default.json` (11KB+)
- Emplois extraits du PDF fourni
- Pré-remplis pour les 5 classes (PEI1-G, PEI2-G, PEI3-G, PEI4-G, DP2-G)
- Modifiables via l'interface

### 🔗 Intégrations
- Page d'accueil mise à jour avec carte Emplois du Temps
- Flux de synchronisation affiché visuellement
- Navigation fluide entre les 4 modules

---

## [2.0.0] - 2026-01-19

### 🔴 Changements Majeurs
- **Suppression de la section Filles** : Le système ne gère plus que la section Garçons
- **Simplification de l'architecture** : Réduction des collections MongoDB de 6 à 3

### ✨ Ajouts
- Focus unique sur la Section Secondaire Garçons
- Simplification des APIs (suppression conditions filles)

### 🔧 Améliorations
- API simplifiées (plus de conditions `section === 'filles'`)
- Performance améliorée (requêtes uniques au lieu de doubles)
- Code plus maintenable et clair
- Collections MongoDB : `plans_garcons`, `devoirs_garcons`, `eleves_garcons`

### 📝 Documentation
- Mise à jour README.md
- Mise à jour GUIDE_UTILISATION.md
- Création INSTALLATION.md

### 🐛 Corrections
- Standardisation des noms de colonnes
- Correction des références aux sections
- Uniformisation de l'interface utilisateur

---

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

---

**Légende** :
- ✨ Nouveautés
- 🔧 Améliorations
- 🐛 Corrections
- 🔴 Breaking Changes
- 📝 Documentation
- 🗑️ Suppressions
