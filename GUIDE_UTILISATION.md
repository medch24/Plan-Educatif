# Guide d'Utilisation - Système Scolaire Intégré

## 🚀 Accès au Système

### URL de l'Application
- **Production** : https://3000-i1grez4pqs9hl8g25g1eq-5634da27.sandbox.novita.ai
- **Local** : http://localhost:3000

## 📋 Modules Disponibles

### 1️⃣ Distribution Annuelle
**URL** : `/distribution.html`

**Fonctionnalités** :
- ✅ Planification annuelle par semaine (Semaines 1-31)
- ✅ Gestion par section : Maternelle, Primaire, Secondaire
- ✅ Classes disponibles :
  - Maternelle : TPS, PS, MS, GS
  - Primaire : PP1, PP2, PP3, PP4, PP5
  - Secondaire : PEI1-5, DP1-2
  - Secondaire Garçons : PEI1-4, DP2 (avec IA)
- ✅ Export Excel et Word par semaine
- ✅ Génération automatique avec IA Gemini
- ✅ Sauvegarde automatique dans la base de données

**Comment utiliser** :
1. Choisir une section (Maternelle/Primaire/Secondaire)
2. Sélectionner une classe
3. Choisir une matière
4. Remplir la distribution semaine par semaine
5. Cliquer sur "Enregistrer" pour sauvegarder
6. Exporter en Excel/Word si nécessaire

### 2️⃣ Plans Hebdomadaires
**URL** : `/plans.html`

**Fonctionnalités** :
- ✅ Synchronisation automatique depuis Distribution Annuelle
- ✅ Sections séparées : Garçons
- ✅ Connexion par enseignant (nom d'utilisateur = mot de passe)
- ✅ Modification personnalisée des plans (sans affecter la distribution de base)
- ✅ Filtres par : Enseignant, Classe, Matière, Période, Jour
- ✅ Génération de plans de leçons avec IA
- ✅ Export Excel et Word par classe
- ✅ Notes par classe
- ✅ Suivi des enseignants incomplets

**Comment utiliser** :
1. Se connecter avec votre nom d'utilisateur (mot de passe = nom)
2. Sélectionner une semaine
3. Les données de la distribution s'affichent automatiquement
4. Modifier les plans selon vos besoins
5. Cliquer sur "Enregistrer Lignes Affichées"
6. Générer les exports si nécessaire

**🔄 Synchronisation Distribution → Plans** :
- Les données sont copiées automatiquement lors de la première consultation
- Les modifications des enseignants sont marquées et ne sont pas écrasées
- Pour forcer une re-synchronisation, utiliser l'API : `POST /api/plans/sync-from-distribution`

### 3️⃣ Devoirs
**URL** : `/devoirs.html`

**Fonctionnalités** :
- ✅ Deux espaces : Parent et Enseignant
- ✅ Sections séparées : Garçons
- ✅ Suivi quotidien des devoirs par élève
- ✅ Évaluation avec notation par étoiles
- ✅ Statistiques de progression
- ✅ Photos de félicitations et célébrations
- ✅ Élève de la semaine

**Espace Parent** :
1. Choisir une classe
2. Sélectionner votre enfant
3. Consulter les devoirs quotidiens
4. Voir les notes et la progression

**Espace Enseignant** :
1. Se connecter avec votre nom
2. Choisir une semaine
3. Sélectionner un devoir à évaluer
4. Évaluer les élèves
5. Ajouter des photos de félicitations (admin uniquement)

**🔄 Synchronisation Plans → Devoirs** :
- Les devoirs sont créés automatiquement depuis les plans hebdomadaires
- Mise à jour journalière
- Pour forcer une synchronisation : `POST /api/devoirs/sync-from-plans`

## 🔄 Flux de Travail Complet

### Étape 1 : Remplir la Distribution Annuelle
```
1. Accéder à Distribution Annuelle
2. Choisir section et classe
3. Remplir les matières semaine par semaine
4. Enregistrer les données
```

### Étape 2 : Synchroniser vers Plans Hebdomadaires
```
1. Accéder à Plans Hebdomadaires
2. Se connecter comme enseignant
3. Sélectionner une semaine
4. Les données de distribution apparaissent automatiquement
5. Modifier si nécessaire
6. Enregistrer
```

### Étape 3 : Synchroniser vers Devoirs
```
1. Les devoirs sont créés automatiquement jour par jour
2. Les enseignants évaluent les élèves
3. Les parents consultent les résultats
```

## 🔧 Configuration

### Configuration MongoDB
Pour activer la base de données, éditer `.env` :
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=systeme_scolaire
```

### Configuration IA
Pour activer les fonctionnalités IA, ajouter dans `.env` :
```env
# Pour la génération automatique de distribution (Gemini)
GEMINI_API_KEY=votre_cle_gemini

# Pour la génération de plans de leçons (OpenAI ou Gemini)
OPENAI_API_KEY=votre_cle_openai
```

## 📊 API Endpoints

### Santé des Modules
```bash
GET /api/health                    # Santé générale
GET /api/distribution/health       # Module Distribution
GET /api/plans/health             # Module Plans
GET /api/devoirs/health           # Module Devoirs
GET /api/sync/health              # Module Synchronisation
```

### Distribution
```bash
GET  /api/distribution/class/:className
POST /api/distribution/save
GET  /api/distribution/week/:weekNumber
```

### Plans Hebdomadaires
```bash
GET  /api/plans/week/:weekNumber/:section
POST /api/plans/save
POST /api/plans/save-batch
POST /api/plans/sync-from-distribution
```

### Devoirs
```bash
GET  /api/devoirs/class/:className/:section
POST /api/devoirs/save
POST /api/devoirs/evaluate
POST /api/devoirs/sync-from-plans
```

### Synchronisation
```bash
POST /api/sync/distribution-to-plans
POST /api/sync/plans-to-devoirs
POST /api/sync/sync-week
```

## 🆘 Dépannage

### Problème : Les données ne s'affichent pas
**Solution** : Vérifier que MongoDB est configuré et que les données existent dans Distribution Annuelle

### Problème : La synchronisation ne fonctionne pas
**Solution** : 
1. Vérifier que les données existent dans le module source
2. Utiliser l'API de synchronisation manuelle
3. Vérifier les logs du serveur

### Problème : Erreur de connexion
**Solution** : Vérifier que le serveur est démarré (`npm start`)

## 📱 Support

Pour toute question ou problème :
- Consulter la documentation complète : `README.md`
- Vérifier les logs du serveur
- Contacter l'équipe de développement

## 📝 Notes Importantes

1. **Toujours commencer par la Distribution Annuelle** avant de remplir les autres modules
2. **Les modifications des plans par les enseignants ne modifient pas la distribution de base**
3. **Les données des sections Garçons sont séparées**
4. **Sauvegarder régulièrement** pour éviter la perte de données
5. **Utiliser les exports Excel/Word** pour les archives
