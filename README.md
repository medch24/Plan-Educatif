# Système Scolaire Intégré 2025-2026

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Version](https://img.shields.io/badge/Version-2.1.0-blue)
![Section](https://img.shields.io/badge/Section-Secondaire%20Garçons-orange)
![Node](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green)

## 📚 Description

Système unifié de gestion scolaire qui intègre **quatre modules interconnectés** pour la **Section Secondaire Garçons** :

1. **Distribution Annuelle** : Planification annuelle des matières (31 semaines)
2. **Emplois du Temps** : Organisation hebdomadaire par jour/période ⭐ **NOUVEAU**
3. **Plans Hebdomadaires** : Plans détaillés générés automatiquement
4. **Devoirs** : Suivi quotidien des devoirs et évaluations

## 🚀 Quick Start

```bash
# Installation
npm install

# Configuration (optionnel)
cp .env.example .env

# Démarrage
npm start

# Accès
# Page d'accueil: http://localhost:3000
# Emplois du Temps: http://localhost:3000/emplois.html
```

## 🏗️ Architecture

```
systeme-scolaire-integre/
├── api/                    # Routes API modulaires
│   ├── distribution.js     # API Distribution Annuelle
│   ├── emplois.js         # API Emplois du Temps (NOUVEAU)
│   ├── plans.js           # API Plans Hebdomadaires
│   ├── devoirs.js         # API Devoirs
│   └── sync.js            # API Synchronisation
├── config/                # Configuration
│   └── database.js        # Connexion MongoDB
├── data/                  # Données par défaut
│   └── emplois_default.json  # Emplois du temps par défaut
├── modules/               # Modules réutilisables
├── public/                # Frontend
│   ├── index.html         # Page d'accueil
│   ├── distribution.html  # Module Distribution
│   ├── emplois.html       # Module Emplois du Temps (NOUVEAU)
│   ├── plans.html         # Module Plans
│   ├── devoirs.html       # Module Devoirs
│   ├── css/              # Styles CSS
│   ├── js/               # Scripts JavaScript
│   └── images/           # Images
├── server.js             # Serveur Express principal
├── package.json          # Dépendances
├── ARCHITECTURE.md       # Documentation architecture (NOUVEAU)
└── .env                  # Configuration (à créer)
```

## 🔄 Flux de Synchronisation

```
Distribution Annuelle (Contenu pédagogique)
    ↓
Emplois du Temps (Structure horaire) ←── Chargement emplois par défaut
    ↓ (Synchronisation automatique)
Plans Hebdomadaires = Distribution + Emplois
    ↓ (Mise à jour journalière)
Devoirs (Garçons)
```

### Points importants :
- Les **Emplois du Temps** définissent la structure (jour, période, horaire, matière, enseignant)
- La **Distribution Annuelle** fournit le contenu (objectifs, activités, ressources)
- Les **Plans Hebdomadaires** sont générés automatiquement en combinant Emplois + Distribution
- Les enseignants peuvent modifier les plans sans affecter les sources
- Les **Devoirs** sont synchronisés quotidiennement depuis les plans

## 🚀 Installation

### 1. Cloner le projet

```bash
cd /home/user/webapp
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env` à la racine :

```env
# Configuration MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=systeme_scolaire

# Configuration du serveur
PORT=3000
NODE_ENV=development

# Configuration OpenAI (pour IA Distribution)
OPENAI_API_KEY=votre_cle_openai

# Configuration Google Gemini (pour IA Plans)
GEMINI_API_KEY=votre_cle_gemini

# Configuration Web Push (Notifications)
VAPID_PUBLIC_KEY=votre_vapid_public
VAPID_PRIVATE_KEY=votre_vapid_private
VAPID_SUBJECT=mailto:votre@email.com
```

### 4. Démarrer le serveur

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

## 📖 Utilisation

### Page d'Accueil
- Accédez à `http://localhost:3000`
- Choisissez le module à utiliser

### Module Distribution Annuelle
- URL : `http://localhost:3000/distribution.html`
- Fonctionnalités :
  - Planification par semaine (1-31)
  - Support Maternelle, Primaire, Secondaire
  - Export Excel/Word
  - Génération IA avec Gemini

### Module Plans Hebdomadaires
- URL : `http://localhost:3000/plans.html`
- Fonctionnalités :
  - Plans synchronisés depuis Distribution
  - Sections Garçons séparées
  - Modifications personnalisables par enseignants
  - Génération de plans de leçons IA

### Module Devoirs
- URL : `http://localhost:3000/devoirs.html`
- Fonctionnalités :
  - Suivi quotidien des devoirs
  - Interface Parents & Enseignants
  - Évaluation et notation
  - Statistiques par élève/classe

## 🔌 API Endpoints

### Distribution Annuelle
```
GET    /api/distribution/class/:className
GET    /api/distribution/class/:className/matiere/:matiere
POST   /api/distribution/save
GET    /api/distribution/week/:weekNumber
GET    /api/distribution/classes
GET    /api/distribution/class/:className/matieres
DELETE /api/distribution/class/:className/matiere/:matiere
GET    /api/distribution/health
```

### Plans Hebdomadaires
```
GET    /api/plans/week/:weekNumber/:section
POST   /api/plans/save
POST   /api/plans/save-batch
GET    /api/plans/enseignants/:section
GET    /api/plans/classes/:section
GET    /api/plans/matieres/:section
POST   /api/plans/sync-from-distribution
GET    /api/plans/health
```

### Devoirs
```
GET    /api/devoirs/class/:className/:section
GET    /api/devoirs/student/:studentName/:section
POST   /api/devoirs/save
POST   /api/devoirs/evaluate
POST   /api/devoirs/sync-from-plans
GET    /api/devoirs/stats/:className/:section
GET    /api/devoirs/students/:className/:section
GET    /api/devoirs/health
```

### Synchronisation
```
POST   /api/sync/distribution-to-plans
POST   /api/sync/plans-to-devoirs
POST   /api/sync/sync-week
GET    /api/sync/health
```

## 🗄️ Structure de la Base de Données

### Collections MongoDB

#### `distribution`
- Données de la distribution annuelle
- Champs : Semaine, Classe, Matière, Enseignant, Séance, Contenu, Pages Manuel, Pages Cahier

#### `plans_garcons`
- Plans hebdomadaires (garçons uniquement)
- Champs : semaine, classe, matiere, enseignant, seance, contenu, jour, modifie, date_sync, date_modification

#### `devoirs_garcons`
- Devoirs (garçons uniquement)
- Champs : semaine, classe, matiere, enseignant, jour, date, contenu_devoir, type_devoir, statut, evaluations

#### `eleves_garcons`
- Liste des élèves (garçons uniquement)
- Champs : nom, prenom, classe, photo_url

## 🔧 Maintenance

### Sauvegarde des données
```bash
# Exporter toutes les collections
mongodump --uri="mongodb+srv://..." --db=systeme_scolaire --out=./backup
```

### Restauration des données
```bash
# Importer toutes les collections
mongorestore --uri="mongodb+srv://..." --db=systeme_scolaire ./backup/systeme_scolaire
```

## 🐛 Dépannage

### Problème de connexion MongoDB
- Vérifiez que `MONGODB_URI` est correct dans `.env`
- Testez la connexion : `GET /api/health`

### Synchronisation ne fonctionne pas
- Vérifiez que les données existent dans Distribution Annuelle
- Testez manuellement : `POST /api/sync/distribution-to-plans`

### Port déjà utilisé
```bash
# Changer le port dans .env
PORT=3001
```

## 📝 Notes Importantes

1. **Ordre de remplissage** :
   - Toujours commencer par la Distribution Annuelle
   - Puis synchroniser vers les Plans Hebdomadaires
   - Enfin synchroniser vers les Devoirs

2. **Modifications** :
   - Les enseignants peuvent modifier les plans hebdomadaires
   - Ces modifications ne sont PAS propagées vers la distribution de base
   - Marque `modifie: true` pour tracer les changements

3. **Sections** :
   - Section Garçons uniquement
   - Permet une gestion indépendante
   - Synchronisation possible pour les deux sections simultanément

## 📄 Licence

MIT License - 2025-2026

## 👥 Support

Pour toute question ou problème, contactez l'équipe de développement.
