# Scripts d'Initialisation MongoDB

Ce dossier contient les scripts pour initialiser la base de données MongoDB avec les données par défaut.

## 📋 Scripts Disponibles

### 1. `init-all.js` - Initialisation Complète
Initialise toutes les données (utilisateurs + emplois du temps) dans MongoDB.

```bash
npm run init
```

### 2. `init-users.js` - Utilisateurs Uniquement
Charge les utilisateurs depuis `data/users.json` dans la collection `users`.

```bash
npm run init:users
```

### 3. `init-emplois.js` - Emplois du Temps Uniquement
Charge les emplois du temps depuis `data/emplois_default.json` dans la collection `emplois_temps`.

```bash
npm run init:emplois
```

## 🔧 Configuration Requise

### 1. Variable d'environnement MongoDB
Assurez-vous que `MONGODB_URI` est défini dans votre fichier `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/systeme_scolaire
# ou
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/systeme_scolaire
```

### 2. Fichiers de Données
Les fichiers suivants doivent exister:
- `data/users.json` - Liste des utilisateurs (enseignants et admins)
- `data/emplois_default.json` - Emplois du temps par classe

## 📊 Données Initialisées

### Collection `users`
- 13 comptes utilisateurs
- 12 enseignants + 1 admin
- Mots de passe = nom d'utilisateur (sauf Admin: Admin2026)

### Collection `emplois_temps`
- 5 classes: PEI1-G, PEI2-G, PEI3-G, PEI4-G, DP2-G
- 50 séances par classe
- Total: 250 séances

## 🚀 Utilisation Typique

### Première Installation
```bash
# 1. Installer les dépendances
npm install

# 2. Configurer MongoDB dans .env
echo "MONGODB_URI=mongodb://localhost:27017/systeme_scolaire" > .env

# 3. Initialiser toutes les données
npm run init

# 4. Démarrer le serveur
npm start
```

### Réinitialisation Sélective
```bash
# Réinitialiser uniquement les utilisateurs
npm run init:users

# Réinitialiser uniquement les emplois du temps
npm run init:emplois
```

## ⚠️ Avertissements

1. **Suppression des Données Existantes**: Ces scripts suppriment TOUTES les données existantes dans les collections concernées avant d'insérer les nouvelles données.

2. **Connexion MongoDB Requise**: Si MongoDB n'est pas accessible, les scripts se termineront avec une erreur.

3. **Mode Demo**: Si `MONGODB_URI` n'est pas défini, le système fonctionnera en mode démo avec les fichiers JSON comme source de données.

## 📝 Logs de Vérification

Chaque script affiche des logs détaillés:
- ✅ Succès des opérations
- ❌ Erreurs rencontrées
- 📊 Statistiques des données insérées
- 🔍 Exemples de données pour vérification

## 🔗 Ressources

- Documentation principale: `../README.md`
- Architecture: `../ARCHITECTURE.md`
- Données utilisateurs: `../data/users.json`
- Emplois par défaut: `../data/emplois_default.json`
- Logins/Mots de passe: `../LOGINS_MOTS_DE_PASSE.md`
