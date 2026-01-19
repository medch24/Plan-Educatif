# 🏗️ Architecture du Système Scolaire Intégré

## Vue d'Ensemble

Le système est composé de **4 modules principaux** interconnectés qui gèrent l'ensemble du processus éducatif :

```
┌──────────────────────┐
│  Distribution        │
│  Annuelle           │  ←─── Planification annuelle (semaines 1-31)
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│  Emplois du Temps   │  ←─── Organisation hebdomadaire (jours/périodes)
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│  Plans              │
│  Hebdomadaires      │  ←─── Plans détaillés par séance
└──────────┬───────────┘
           │
           ↓
┌──────────────────────┐
│  Devoirs            │  ←─── Suivi quotidien et évaluation
└──────────────────────┘
```

---

## 📚 Module 1 : Distribution Annuelle

### Objectif
Planifier l'ensemble des contenus pédagogiques pour l'année scolaire.

### Structure de Données
```json
{
  "Semaine": "Semaine 1",
  "Classe": "PEI1-G",
  "Matière": "Mathématiques",
  "Enseignant": "Zine",
  "Séance": "1",
  "Contenu": "Nombres réels",
  "Pages Manuel": "12-15",
  "Pages Cahier": "5-7",
  "Objectifs": "Comprendre les nombres réels",
  "Compétences": "Calcul, raisonnement",
  "Activités": "Exercices pratiques",
  "Ressources": "Manuel, calculatrice",
  "Évaluation": "Quiz"
}
```

### Collection MongoDB
- **Nom** : `distribution`
- **Clés** : Semaine, Classe, Matière, Séance

### Fonctionnalités
- ✅ Gestion par semaine (1-31)
- ✅ Section Secondaire Garçons uniquement
- ✅ Export Excel/Word
- ✅ Génération IA (Gemini)
- ✅ Import Excel

---

## 🗓️ Module 2 : Emplois du Temps

### Objectif
Organiser les matières par jour et période pour chaque classe.

### Structure de Données
```json
{
  "classe": "PEI1-G",
  "jour": "Dimanche",
  "periode": 1,
  "horaire": "8:00 - 8:45",
  "matiere": "Mathématiques",
  "enseignant": "Zine",
  "salle": "A101",
  "type": "cours"
}
```

### Collection MongoDB
- **Nom** : `emplois_temps`
- **Clés** : classe, jour, periode

### Périodes Standard
| Période | Horaire | Type |
|---------|---------|------|
| 1 | 8:00 - 8:45 | Cours |
| 2 | 8:45 - 9:30 | Cours |
| 3 | 9:30 - 10:15 | Cours |
| **Pause 1** | **10:15 - 10:35** | **Pause** |
| 4 | 10:35 - 11:15 | Cours |
| 5 | 11:15 - 11:55 | Cours |
| 6 | 11:55 - 12:35 | Cours |
| 7 | 12:35 - 13:15 | Cours |
| **Pause 2** | **13:15 - 13:45** | **Pause** |
| 8 | 13:45 - 14:30 | Cours |

### Fonctionnalités
- ✅ Emplois par défaut (basés sur PDF fourni)
- ✅ Modification par classe
- ✅ Grille interactive éditable
- ✅ Export Excel
- ✅ Impression
- ✅ Affectation enseignant/salle

### Jours de la Semaine
- Dimanche
- Lundi
- Mardi
- Mercredi
- Jeudi

---

## 📖 Module 3 : Plans Hebdomadaires

### Objectif
Générer des plans détaillés pour chaque séance en combinant Distribution + Emplois du Temps.

### Structure de Données
```json
{
  "semaine": "Semaine 1",
  "classe": "PEI1-G",
  "matiere": "Mathématiques",
  "enseignant": "Zine",
  "jour": "Dimanche",
  "periode": 1,
  "horaire": "8:00 - 8:45",
  "salle": "A101",
  "contenu": "Nombres réels",
  "pages_manuel": "12-15",
  "pages_cahier": "5-7",
  "objectifs": "Comprendre les nombres réels",
  "competences": "Calcul, raisonnement",
  "activites": "Exercices pratiques",
  "ressources": "Manuel, calculatrice",
  "evaluation": "Quiz",
  "notes": "",
  "modifie": false,
  "date_sync": "2026-01-19T..."
}
```

### Collection MongoDB
- **Nom** : `plans_garcons`
- **Clés** : semaine, classe, matiere, jour, periode

### Génération Automatique
Le système combine :
1. **Emplois du Temps** → Structure (jour, période, horaire, enseignant)
2. **Distribution** → Contenu pédagogique (objectifs, activités, ressources)

### Fonctionnalités
- ✅ Génération automatique depuis Emplois + Distribution
- ✅ Modification par enseignants (sans affecter la source)
- ✅ Génération IA de plans de leçons
- ✅ Export Excel/Word
- ✅ Filtres par classe/matière/semaine

---

## 📝 Module 4 : Devoirs

### Objectif
Gérer les devoirs quotidiens et leur évaluation.

### Structure de Données
```json
{
  "semaine": "Semaine 1",
  "classe": "PEI1-G",
  "matiere": "Mathématiques",
  "enseignant": "Zine",
  "jour": "Dimanche",
  "date": "2026-01-19T...",
  "contenu_devoir": "Exercices page 15",
  "type_devoir": "Quotidien",
  "statut": "en_attente",
  "evaluations": [
    {
      "eleve_id": "123",
      "note": 18,
      "commentaire": "Bon travail",
      "date_evaluation": "2026-01-20T..."
    }
  ]
}
```

### Collection MongoDB
- **Nom** : `devoirs_garcons`
- **Clés** : semaine, classe, matiere, jour

### Fonctionnalités
- ✅ Génération automatique depuis Plans Hebdo
- ✅ Interface Parents (consultation)
- ✅ Interface Enseignants (évaluation)
- ✅ Statistiques par élève/classe
- ✅ Suivi de progression

---

## 🔄 Flux de Synchronisation

### 1️⃣ Distribution → Emplois du Temps (Manuel)
L'enseignant organise les matières par jour/période selon l'emploi du temps fourni.

**API** : `POST /api/emplois/save`

### 2️⃣ Emplois + Distribution → Plans Hebdomadaires (Automatique)
Le système génère automatiquement les plans en combinant :
- Structure horaire de l'emploi du temps
- Contenu pédagogique de la distribution

**API** : `POST /api/sync/emplois-to-plans`
```json
{
  "classe": "PEI1-G",
  "semaine": "Semaine 1"
}
```

### 3️⃣ Plans Hebdomadaires → Devoirs (Automatique)
Le système crée les devoirs quotidiens basés sur les plans.

**API** : `POST /api/sync/plans-to-devoirs`
```json
{
  "semaine": "Semaine 1",
  "classe": "PEI1-G",
  "jour": "Dimanche"
}
```

### 4️⃣ Modifications par Enseignants
Les enseignants peuvent modifier :
- ✅ Plans Hebdomadaires (sans affecter Distribution)
- ✅ Devoirs (évaluation, notes, commentaires)
- ✅ Emplois du Temps (changement de période/salle)

---

## 🗄️ Structure MongoDB

### Base de Données : `systeme_scolaire`

```
systeme_scolaire/
├── distribution          # Distribution annuelle
├── emplois_temps        # Emplois du temps
├── plans_garcons        # Plans hebdomadaires garçons
├── devoirs_garcons      # Devoirs garçons
└── eleves_garcons       # Données élèves
```

### Standardisation des Colonnes

#### Distribution
- `Semaine`, `Classe`, `Matière`, `Enseignant`, `Séance`
- `Contenu`, `Pages Manuel`, `Pages Cahier`
- `Objectifs`, `Compétences`, `Activités`, `Ressources`, `Évaluation`

#### Emplois du Temps
- `classe`, `jour`, `periode`, `horaire`
- `matiere`, `enseignant`, `salle`, `type`

#### Plans Hebdomadaires
- `semaine`, `classe`, `matiere`, `enseignant`
- `jour`, `periode`, `horaire`, `salle`
- `contenu`, `pages_manuel`, `pages_cahier`
- `objectifs`, `competences`, `activites`, `ressources`, `evaluation`
- `notes`, `modifie`, `date_sync`

#### Devoirs
- `semaine`, `classe`, `matiere`, `enseignant`, `jour`
- `contenu_devoir`, `type_devoir`, `statut`
- `evaluations[]` (array d'objets)

---

## 🎯 Classes Supportées (Section Secondaire Garçons)

- **PEI1-G** : Programme d'Éducation Intermédiaire 1 Garçons
- **PEI2-G** : Programme d'Éducation Intermédiaire 2 Garçons
- **PEI3-G** : Programme d'Éducation Intermédiaire 3 Garçons
- **PEI4-G** : Programme d'Éducation Intermédiaire 4 Garçons
- **DP2-G** : Diplôme Programme 2 Garçons

---

## 🔐 Sécurité et Permissions

### Niveaux d'Accès
1. **Administrateur** : Tous les modules
2. **Enseignant** : Plans, Devoirs (sa classe uniquement)
3. **Parent** : Devoirs (consultation uniquement)
4. **Élève** : Devoirs (consultation uniquement)

### Traçabilité
- `date_creation` : Date de création
- `date_modification` : Date de dernière modification
- `modifie` : Indicateur de modification manuelle
- `source` : Source des données (`distribution`, `emploi_distribution`, `plan_hebdo`)

---

## 🚀 Déploiement

### Variables d'Environnement (.env)
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/systeme_scolaire

# API Keys (Optionnel)
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Serveur
PORT=3000
NODE_ENV=production
```

### Lancement
```bash
# Installation
npm install

# Développement
npm run dev

# Production
npm start
```

### URLs d'Accès
- **Accueil** : http://localhost:3000
- **Distribution** : http://localhost:3000/distribution.html
- **Emplois** : http://localhost:3000/emplois.html
- **Plans** : http://localhost:3000/plans.html
- **Devoirs** : http://localhost:3000/devoirs.html

---

## 📊 Workflow Complet

### Étape 1 : Configuration Initiale
1. Remplir la **Distribution Annuelle** pour les 31 semaines
2. Charger les **Emplois du Temps par défaut** pour chaque classe
3. Vérifier et ajuster les emplois si nécessaire

### Étape 2 : Génération Hebdomadaire
1. Sélectionner la semaine courante
2. Lancer la synchronisation `Emplois + Distribution → Plans`
3. Les plans sont générés automatiquement

### Étape 3 : Personnalisation
1. Les enseignants consultent leurs plans
2. Modifications possibles (notes, activités supplémentaires)
3. Sauvegarde des modifications

### Étape 4 : Devoirs Quotidiens
1. Synchronisation automatique `Plans → Devoirs`
2. Les devoirs sont créés pour chaque jour
3. Les enseignants évaluent les devoirs

### Étape 5 : Suivi
1. Parents et élèves consultent les devoirs
2. Statistiques de progression
3. Élève de la semaine

---

## 🛠️ API Endpoints

### Distribution
- `GET /api/distribution/week/:weekNumber`
- `POST /api/distribution/save`
- `GET /api/distribution/export-excel`

### Emplois du Temps
- `GET /api/emplois/classe/:className`
- `POST /api/emplois/save`
- `POST /api/emplois/load-default/:className`

### Plans Hebdomadaires
- `GET /api/plans/week/:weekNumber/:section`
- `POST /api/plans/save`
- `POST /api/plans/generate-from-emplois`

### Devoirs
- `GET /api/devoirs/week/:weekNumber/:section`
- `POST /api/devoirs/save`
- `POST /api/devoirs/evaluate`

### Synchronisation
- `POST /api/sync/emplois-to-plans`
- `POST /api/sync/plans-to-devoirs`
- `POST /api/sync/sync-week`

---

## 📝 Notes Importantes

### ✅ Points Forts
1. **Automatisation** : Génération automatique des plans et devoirs
2. **Flexibilité** : Modifications possibles sans affecter la source
3. **Traçabilité** : Historique complet des modifications
4. **Section Unique** : Garçons uniquement (simplifié)

### ⚠️ Limitations Actuelles
1. Nécessite MongoDB configuré pour la persistance
2. Mode démo disponible sans MongoDB
3. Emplois par défaut doivent être chargés manuellement

### 🔮 Améliorations Futures
1. Système d'authentification complet
2. Notifications push pour les devoirs
3. Application mobile
4. Génération automatique complète avec IA

---

**Version** : 2.0  
**Date** : 19 janvier 2026  
**Section** : Secondaire Garçons  
**Statut** : ✅ Production Ready
