# 📅 Guide Utilisation - Module Emplois du Temps

## Introduction

Le module **Emplois du Temps** est le cœur organisationnel du système scolaire. Il permet de structurer les matières par jour et par période pour chaque classe de la **Section Secondaire Garçons**.

## 🎯 Objectif

Organiser l'emploi du temps hebdomadaire pour :
- **5 classes** : PEI1-G, PEI2-G, PEI3-G, PEI4-G, DP2-G
- **5 jours** : Dimanche à Jeudi
- **8 périodes** + 2 pauses par jour
- **Horaires** : 8:00 - 14:30

## 🚀 Accès au module

1. Ouvrir le navigateur : `http://localhost:3000`
2. Cliquer sur la carte **"Emplois du Temps"**
3. Vous êtes redirigé vers `/emplois.html`

## 📋 Interface

### 1. Sélection de classe

En haut de la page, un menu déroulant permet de choisir la classe :
```
PEI1 Garçons
PEI2 Garçons
PEI3 Garçons
PEI4 Garçons
DP2 Garçons
```

### 2. Grille horaire

Une grille affiche l'emploi du temps :

| Horaire       | Dimanche | Lundi | Mardi | Mercredi | Jeudi |
|---------------|----------|-------|-------|----------|-------|
| 8:00 - 8:45   | Sciences | ...   | ...   | ...      | ...   |
| 8:45 - 9:30   | Islamic  | ...   | ...   | ...      | ...   |
| ...           | ...      | ...   | ...   | ...      | ...   |

**Périodes** :
- **P1** : 8:00 - 8:45
- **P2** : 8:45 - 9:30
- **P3** : 9:30 - 10:15
- **Pause 1** : 10:15 - 10:35 ☕
- **P4** : 10:35 - 11:15
- **P5** : 11:15 - 11:55
- **P6** : 11:55 - 12:35
- **P7** : 12:35 - 13:15
- **Pause 2** : 13:15 - 13:45 🍽️
- **P8** : 13:45 - 14:30

### 3. Barre d'actions

En haut de la grille :

- **Charger par défaut** 📥 : Importer l'emploi par défaut depuis le fichier JSON (basé sur le PDF fourni)
- **Enregistrer** 💾 : Sauvegarder les modifications dans la base de données
- **Réinitialiser** 🔄 : Annuler les modifications non sauvegardées
- **Exporter Excel** 📊 : Télécharger l'emploi au format .xlsx
- **Imprimer** 🖨️ : Imprimer l'emploi du temps

## 📝 Utilisation

### Étape 1 : Charger l'emploi par défaut

1. Sélectionner une classe (ex : PEI1-G)
2. Cliquer sur **"Charger par défaut"**
3. Confirmer le chargement
4. L'emploi est automatiquement affiché et sauvegardé

**Contenu par défaut** :
- Basé sur le fichier `data/emplois_default.json`
- Extrait du PDF des emplois actuels fourni
- Toutes les matières et enseignants pré-remplis

### Étape 2 : Modifier une séance

1. Cliquer sur une cellule de la grille (ex : Dimanche, Période 1)
2. Une fenêtre modale s'ouvre avec :
   - **Matière** : Liste déroulante (ex : Maths, Sciences, Islamic...)
   - **Enseignant** : Liste déroulante (ex : Zine, Majed, Abas...)
   - **Salle** : Champ texte (optionnel)
3. Modifier les valeurs
4. Cliquer **"Enregistrer"**
5. La cellule se met à jour

### Étape 3 : Sauvegarder

1. Après toutes les modifications
2. Cliquer sur **"💾 Enregistrer"**
3. L'emploi est sauvegardé dans MongoDB

**Note** : Les modifications ne sont pas persistées tant que vous n'enregistrez pas !

## 🔄 Synchronisation avec Plans Hebdomadaires

Une fois l'emploi du temps défini :

1. Le système combine :
   - **Emplois** : Structure jour/période/matière/enseignant
   - **Distribution** : Contenu pédagogique par semaine
2. Génère automatiquement les **Plans Hebdomadaires**

**Exemple** :
```
Plans[Semaine 1][PEI1-G][Dimanche][Période 1] = {
  matiere: "Sciences",          // depuis Emplois
  enseignant: "Zine",           // depuis Emplois
  contenu: "Chapitre 3.2",      // depuis Distribution
  pages: "45-50"                // depuis Distribution
}
```

## 📊 Exporter l'emploi

### Format Excel

1. Cliquer sur **"📊 Exporter Excel"**
2. Un fichier `.xlsx` est téléchargé
3. Nom : `Emploi_[Classe]_[Date].xlsx`

**Contenu** :
- Onglet unique avec grille complète
- Colonnes : Horaire, Dimanche, Lundi, Mardi, Mercredi, Jeudi
- Mise en forme automatique

### Imprimer

1. Cliquer sur **"🖨️ Imprimer"**
2. La fenêtre d'impression du navigateur s'ouvre
3. Imprimer ou sauvegarder en PDF

## 🗂️ Structure des données

### Collection MongoDB : `emplois_temps`

```json
{
  "classe": "PEI1-G",
  "jour": "Dimanche",
  "periode": 1,
  "horaire": "8:00 - 8:45",
  "matiere": "Sciences",
  "enseignant": "Zine",
  "salle": "Lab 1",
  "type": "cours"
}
```

### Fichier par défaut : `data/emplois_default.json`

```json
{
  "PEI1-G": {
    "Dimanche": [
      { "matiere": "Sciences", "enseignant": "Zine" },
      { "matiere": "Islamic", "enseignant": "Majed" },
      ...
    ],
    "Lundi": [ ... ],
    ...
  },
  "PEI2-G": { ... },
  ...
}
```

## 🎓 Classes et matières

### Classes disponibles

- **PEI1-G** : Programme d'Éducation Intermédiaire 1 Garçons
- **PEI2-G** : Programme d'Éducation Intermédiaire 2 Garçons
- **PEI3-G** : Programme d'Éducation Intermédiaire 3 Garçons
- **PEI4-G** : Programme d'Éducation Intermédiaire 4 Garçons
- **DP2-G** : Diplôme Programme 2 Garçons

### Matières types

- **Langues** : Anglais, French L.L, Arabic, Easy Arabic
- **Sciences** : Sciences, Biologie, Physique chimie
- **Mathématiques** : Maths
- **Humanités** : Islamic, IS (Individuals & Societies), KSA, History
- **Arts** : ART, Music, Design
- **Autres** : P.E (Physical Education), Library, ES, SES

### Enseignants

- **Zine** : Sciences, Biologie
- **Majed** : Islamic
- **Abas** : French L.L
- **Youssif** : IS, Library
- **Sylvano Hervé** : Maths
- **Mohamed Ali** : P.E
- **Saeed Sulami** : Arabic
- **Kamel** : Anglais
- **Tonga** : Design, Physique chimie
- **Sami** : ART, Music
- **Jaber** : Islamic, KSA, Easy Arabic, History
- **Mohamed** : Physique chimie

## ⚙️ API Endpoints

### Charger un emploi

```bash
GET /api/emplois/classe/PEI1-G
```

**Réponse** :
```json
{
  "success": true,
  "data": [
    { "classe": "PEI1-G", "jour": "Dimanche", "periode": 1, ... },
    ...
  ],
  "source": "database"  // ou "default"
}
```

### Sauvegarder un emploi

```bash
POST /api/emplois/save
Content-Type: application/json

{
  "classe": "PEI1-G",
  "emploi": [
    { "jour": "Dimanche", "periode": 1, "matiere": "Sciences", ... },
    ...
  ]
}
```

### Charger emploi par défaut

```bash
POST /api/emplois/load-default/PEI1-G
```

**Effet** :
- Supprime l'emploi actuel de PEI1-G
- Insère l'emploi par défaut depuis JSON
- Retourne le nombre de séances insérées

## 🔧 Dépannage

### Problème : L'emploi ne se charge pas

**Solution** :
1. Vérifier que le serveur est démarré : `npm start`
2. Ouvrir la console navigateur (F12)
3. Vérifier les erreurs réseau
4. Tester l'API : `curl http://localhost:3000/api/emplois/health`

### Problème : Les modifications ne sont pas sauvegardées

**Solution** :
1. Vérifier MongoDB est configuré dans `.env`
2. Si mode démo, les données ne persistent pas
3. Cliquer bien sur **"💾 Enregistrer"** après chaque modification

### Problème : Le bouton "Charger par défaut" ne fonctionne pas

**Solution** :
1. Vérifier que `data/emplois_default.json` existe
2. Vérifier que le JSON est valide
3. Voir les logs serveur : `/tmp/server.log`

## 📞 Support

- **Email** : support@exemple.com
- **GitHub** : [github.com/medch24/Plan-Educatif](https://github.com/medch24/Plan-Educatif)
- **Documentation** : [README.md](README.md)

## 🎉 Bonnes pratiques

1. **Toujours charger l'emploi par défaut** avant de commencer
2. **Enregistrer régulièrement** pour ne pas perdre les modifications
3. **Exporter en Excel** pour avoir une copie de secours
4. **Tester les modifications** avant de synchroniser avec les Plans
5. **Vérifier la cohérence** avec la Distribution Annuelle

---

**Version** : 2.1.0  
**Dernière mise à jour** : 2026-01-19  
**Auteur** : GenSpark AI Developer
