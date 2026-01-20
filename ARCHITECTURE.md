# 🏗️ Architecture du Système Scolaire Intégré

## Vue d'ensemble

Le système est composé de **4 modules** interconnectés qui gèrent l'ensemble du processus pédagogique pour la **Section Secondaire Garçons**.

## 📊 Diagramme de flux

```
┌─────────────────────────────────┐
│  1. Distribution Annuelle       │
│  - Contenu pédagogique          │
│  - 31 semaines                  │
│  - Par matière/classe           │
└──────────┬──────────────────────┘
           │
           ↓
┌─────────────────────────────────┐
│  2. Emplois du Temps            │◄─── emplois_default.json
│  - Structure horaire            │     (PEI1-G à DP2-G)
│  - Jours × Périodes             │
│  - Matières × Enseignants       │
└──────────┬──────────────────────┘
           │
           ↓ Synchronisation automatique
           │
┌─────────────────────────────────┐
│  3. Plans Hebdomadaires         │
│  - Distribution + Emplois       │
│  - Modifiable par enseignants   │
│  - Génération IA (optionnel)    │
└──────────┬──────────────────────┘
           │
           ↓ Mise à jour quotidienne
           │
┌─────────────────────────────────┐
│  4. Devoirs                     │
│  - Suivi par élève/jour         │
│  - Évaluations                  │
│  - Interface Parents/Profs      │
└─────────────────────────────────┘
```

## 🗄️ Structure MongoDB

### Base de données : `systeme_scolaire`

#### Collections

1. **distributions**
   - Contenu pédagogique annuel
   - Structure : `{ Semaine, Classe, Matière, Enseignant, Séance, Contenu, Pages, ... }`

2. **emplois_temps**
   - Organisation horaire
   - Structure : `{ classe, jour, periode, horaire, matiere, enseignant, salle, type }`

3. **plans_garcons**
   - Plans hebdomadaires générés
   - Structure : `{ Semaine, Classe, Matière, Enseignant, Jour, Période, Contenu, Modifié }`

4. **devoirs_garcons**
   - Devoirs quotidiens
   - Structure : `{ Semaine, Classe, Matière, Jour, Contenu, Statut, Évaluations }`

5. **eleves_garcons**
   - Informations élèves
   - Structure : `{ nom, prenom, classe, ... }`

## 📋 Modules détaillés

### Module 1 : Distribution Annuelle

**URL**: `/distribution.html`

**Fonctionnalités**:
- Planning annuel 31 semaines
- 5 classes : PEI1-G, PEI2-G, PEI3-G, PEI4-G, DP2-G
- Export Excel/Word
- Génération IA (Gemini)
- Gestion par semaine/matière/enseignant

**API**:
- `GET /api/distribution/health` - Health check
- `GET /api/distribution/classes` - Liste des classes
- `POST /api/distribution/save` - Sauvegarder distribution
- `GET /api/distribution/export` - Exporter Excel

### Module 2 : Emplois du Temps

**URL**: `/emplois.html`

**Fonctionnalités**:
- Organisation par jour (Dim-Jeu)
- 8 périodes + 2 pauses (10:15-10:35, 13:15-13:45)
- Horaires : 8:00 - 14:30
- Affectation matière/enseignant/salle
- Chargement emplois par défaut depuis JSON
- Modification et sauvegarde

**Emplois par défaut**:
Fichier : `data/emplois_default.json`
- PEI1-G : Emploi complet Dim-Jeu (8 périodes/jour)
- PEI2-G : Emploi complet
- PEI3-G : Emploi complet
- PEI4-G : Emploi complet
- DP2-G : Emploi complet

**API**:
- `GET /api/emplois/health` - Health check
- `GET /api/emplois/classe/:className` - Charger emploi
- `POST /api/emplois/save` - Sauvegarder emploi
- `POST /api/emplois/load-default/:className` - Charger emploi par défaut
- `GET /api/emplois/matieres/:className` - Liste matières
- `GET /api/emplois/enseignants/:className` - Liste enseignants

### Module 3 : Plans Hebdomadaires

**URL**: `/plans.html`

**Fonctionnalités**:
- Synchronisation Distribution + Emplois
- Plans hebdomadaires détaillés
- Modification par enseignants
- Génération plans de leçons IA
- Export Word/Excel

**Synchronisation**:
```javascript
Plans[semaine][classe][jour][période] = {
  matiere: Emplois[classe][jour][période].matiere,
  enseignant: Emplois[classe][jour][période].enseignant,
  contenu: Distribution[semaine][classe][matiere].contenu
}
```

**API**:
- `GET /api/plans/health` - Health check
- `GET /api/plans/semaine/:week/:section` - Charger plans
- `POST /api/plans/save` - Sauvegarder plans
- `POST /api/plans/generate-ai` - Générer plans IA

### Module 4 : Devoirs

**URL**: `/devoirs.html`

**Fonctionnalités**:
- Génération automatique depuis Plans
- Interface Parents : consultation devoirs
- Interface Enseignants : ajout/modification
- Évaluations et notes
- Statistiques par élève/classe

**API**:
- `GET /api/devoirs/health` - Health check
- `GET /api/devoirs/semaine/:week/:section` - Charger devoirs
- `POST /api/devoirs/save` - Sauvegarder devoirs
- `GET /api/devoirs/eleve/:id` - Devoirs d'un élève

## 🔌 API Synchronisation

**Base URL**: `/api/sync`

### Endpoints

1. **Distribution → Plans**
   ```
   POST /api/sync/distribution-to-plans
   Body: { semaine: 1, classe: 'PEI1-G' }
   ```

2. **Plans → Devoirs**
   ```
   POST /api/sync/plans-to-devoirs
   Body: { semaine: 1, classe: 'PEI1-G' }
   ```

3. **Health check**
   ```
   GET /api/sync/health
   ```

## 🎨 Frontend

### Technologies
- HTML5 / CSS3 / JavaScript (Vanilla)
- Remix Icons
- XLSX.js (export Excel)
- Docxtemplater (export Word)

### Pages

1. **index.html** : Page d'accueil avec navigation
2. **distribution.html** : Module Distribution
3. **emplois.html** : Module Emplois du Temps
4. **plans.html** : Module Plans Hebdomadaires
5. **devoirs.html** : Module Devoirs

### Styles CSS modulaires

- `main.css` : Styles communs
- `distribution.css` : Styles Distribution
- `emplois.css` : Styles Emplois
- `plans.css` : Styles Plans
- `devoirs.css` : Styles Devoirs

## 🚀 Déploiement

### Prérequis
- Node.js 18+
- MongoDB 6+ (optionnel, mode démo sans DB)

### Installation

```bash
# 1. Cloner le projet
git clone https://github.com/medch24/Plan-Educatif.git
cd Plan-Educatif

# 2. Installer dépendances
npm install

# 3. Configuration
cp .env.example .env
# Éditer .env avec vos paramètres MongoDB, OpenAI, etc.

# 4. Démarrer
npm start
```

### Configuration .env

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/systeme_scolaire

# OpenAI (optionnel, pour génération IA)
OPENAI_API_KEY=sk-...

# Gemini (optionnel, pour génération IA)
GEMINI_API_KEY=...

# Port serveur
PORT=3000
```

## 📦 Dépendances

```json
{
  "express": "^4.19.2",
  "mongodb": "^6.5.0",
  "cors": "^2.8.5",
  "dotenv": "^16.4.5",
  "exceljs": "^4.4.0",
  "openai": "^4.57.0",
  "@google/generative-ai": "latest",
  "docxtemplater": "^3.47.1",
  "pizzip": "^3.1.6"
}
```

## 🔐 Sécurité

- Variables d'environnement dans `.env`
- Validation des entrées utilisateur
- Protection CORS
- Gestion des erreurs

## 📈 Évolutions futures

- [ ] Authentification utilisateurs (JWT)
- [ ] Notifications push
- [ ] Application mobile (React Native)
- [ ] Système de messagerie interne
- [ ] Rapports et statistiques avancés
- [ ] Integration avec systèmes externes (LMS, etc.)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

MIT License - voir fichier [LICENSE](LICENSE)

## 👥 Équipe

- **Développement** : GenSpark AI Developer
- **Client** : École Al-Kawthar International Schools
- **Année** : 2025-2026

---

**Version** : 2.0.0  
**Dernière mise à jour** : 2026-01-19
