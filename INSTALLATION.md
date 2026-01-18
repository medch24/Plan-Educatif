# Guide d'Installation - Système Scolaire Intégré

## 📋 Prérequis

- Node.js version 18.0.0 ou supérieure
- MongoDB (optionnel - mode démo disponible sans DB)
- Git

## 🚀 Installation Rapide

### 1. Cloner le projet

```bash
git clone https://github.com/medch24/Plan-Educatif.git
cd Plan-Educatif
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration (Optionnel)

Copier le fichier d'exemple et le configurer :

```bash
cp .env.example .env
```

Éditer `.env` avec vos paramètres :

```env
# Configuration MongoDB (requis pour production)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=systeme_scolaire

# Port du serveur
PORT=3000

# Clés API (optionnel - pour fonctionnalités IA)
OPENAI_API_KEY=votre_cle_openai
GEMINI_API_KEY=votre_cle_gemini

# Web Push (optionnel - pour notifications)
VAPID_PUBLIC_KEY=votre_vapid_public
VAPID_PRIVATE_KEY=votre_vapid_private
VAPID_SUBJECT=mailto:admin@ecole.com
```

### 4. Démarrer le serveur

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

## 🗄️ Configuration MongoDB (Production)

### Option 1 : MongoDB Atlas (Cloud)

1. Créer un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un cluster gratuit
3. Créer un utilisateur avec droits de lecture/écriture
4. Obtenir l'URI de connexion
5. Copier l'URI dans `.env` :

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/
```

### Option 2 : MongoDB Local

```bash
# Installer MongoDB localement
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Démarrer MongoDB
sudo systemctl start mongodb

# Utiliser dans .env
MONGODB_URI=mongodb://localhost:27017
```

### Collections MongoDB

Le système créera automatiquement ces collections :

```
systeme_scolaire (DB)
├── distribution              # Distribution annuelle
├── plans_filles             # Plans hebdo filles
├── plans_garcons            # Plans hebdo garçons
├── devoirs_filles           # Devoirs filles
├── devoirs_garcons          # Devoirs garçons
├── eleves_filles            # Élèves filles
└── eleves_garcons           # Élèves garçons
```

## 🔑 Configuration des Clés API (Optionnel)

### OpenAI (pour génération Distribution)

1. Créer un compte sur [OpenAI](https://platform.openai.com/)
2. Générer une clé API
3. Ajouter dans `.env` :

```env
OPENAI_API_KEY=sk-...
```

### Google Gemini (pour génération Plans)

1. Obtenir une clé sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Ajouter dans `.env` :

```env
GEMINI_API_KEY=...
```

## 🌐 Déploiement

### Déploiement sur Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Configuration des variables d'environnement sur Vercel dashboard
# Settings > Environment Variables
```

### Déploiement sur Heroku

```bash
# Installer Heroku CLI
npm install -g heroku

# Se connecter
heroku login

# Créer une app
heroku create nom-de-votre-app

# Configurer MongoDB
heroku addons:create mongolab

# Déployer
git push heroku main

# Configurer les variables
heroku config:set OPENAI_API_KEY=...
heroku config:set GEMINI_API_KEY=...
```

### Déploiement sur Render

1. Créer un compte sur [Render](https://render.com/)
2. Créer un nouveau Web Service
3. Connecter votre dépôt GitHub
4. Configurer :
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables: Ajouter toutes les variables du `.env`

## 🔧 Dépannage

### Erreur : "Cannot find module"

```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Erreur : "Port already in use"

```bash
# Changer le port dans .env
PORT=3001

# Ou arrêter le processus existant
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Erreur MongoDB : "Cannot connect"

```bash
# Vérifier que MongoDB est démarré
# Local
sudo systemctl status mongodb

# Vérifier l'URI dans .env
# Atlas : Whitelist votre IP dans MongoDB Atlas Dashboard
```

### Mode Démo (sans MongoDB)

Si MongoDB n'est pas configuré, l'application démarre en mode démo :

```
⚠️  MongoDB non configuré - Mode démo (sans base de données)
📝 Configurez MONGODB_URI dans .env pour utiliser la base de données
```

Dans ce mode :
- L'application fonctionne normalement
- Les données ne sont pas persistées
- Idéal pour tester l'interface

## 📝 Premiers Pas

### 1. Accéder à l'application

```
http://localhost:3000
```

### 2. Remplir la Distribution Annuelle

```
http://localhost:3000/distribution.html
```

1. Choisir une section
2. Sélectionner une classe
3. Choisir une matière
4. Remplir les données
5. Enregistrer

### 3. Accéder aux Plans Hebdomadaires

```
http://localhost:3000/plans.html
```

1. Se connecter (nom = mot de passe)
2. Sélectionner une semaine
3. Les données se synchronisent automatiquement

### 4. Accéder aux Devoirs

```
http://localhost:3000/devoirs.html
```

Espace Parent :
1. Choisir une classe
2. Sélectionner un élève

Espace Enseignant :
1. Se connecter
2. Évaluer les devoirs

## 🆘 Support

Pour toute question :
- Consulter `README.md` pour la documentation technique
- Consulter `GUIDE_UTILISATION.md` pour le guide utilisateur
- Vérifier les logs du serveur
- Ouvrir une issue sur GitHub

## 📚 Ressources

- [Documentation MongoDB](https://docs.mongodb.com/)
- [Documentation Express.js](https://expressjs.com/)
- [Documentation Node.js](https://nodejs.org/docs/)
