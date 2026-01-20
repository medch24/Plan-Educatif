# 🔐 Logins et Mots de Passe - Système Scolaire Intégré

## 📋 Liste Complète des Comptes Enseignants

**Note importante** : Le mot de passe est **identique** au nom d'utilisateur.

---

### 👨‍🏫 Enseignants

| N° | Nom d'utilisateur | Mot de passe | Nom Complet | Matières |
|----|-------------------|--------------|-------------|----------|
| 1  | `Zine` | `Zine` | Zine | Sciences, Biologie, ES (Systèmes de l'env.) |
| 2  | `Majed` | `Majed` | Majed | الدراسات الإسلامية |
| 3  | `Abas French` | `Abas French` | Abas French | Langue et Littérature |
| 4  | `Youssif` | `Youssif` | Youssif | Individus et Sociétés, Bibliothèque, Sciences Éco. et Sociales |
| 5  | `Sylvano Hervé` | `Sylvano Hervé` | Sylvano Hervé | Mathématiques, Physique-Chimie, ES (Systèmes de l'env.) |
| 6  | `Mohamed Ali` | `Mohamed Ali` | Mohamed Ali | Éducation Physique |
| 7  | `Imad` | `Imad` | Imad | اللغة العربية |
| 8  | `Kamel` | `Kamel` | Kamel | Anglais |
| 9  | `Tonga` | `Tonga` | Tonga | Design, Physique-Chimie, Mathématiques |
| 10 | `Jaber` | `Jaber` | Jaber | الدراسات الاجتماعية, التاريخ |
| 11 | `Sami` | `Sami` | Sami | Arts, Musique |
| 12 | `Mohamed` | `Mohamed` | Mohamed | Physique-Chimie |

---

### 👑 Compte Administrateur

| Nom d'utilisateur | Mot de passe | Nom Complet | Rôle |
|-------------------|--------------|-------------|------|
| `Admin` | `Admin2026` | Administrateur | admin |

**Privilèges** : Accès complet à tous les modules et toutes les classes.

---

## 🔑 Exemples de Connexion

### Connexion Enseignant

**Nom d'utilisateur** : `Zine`  
**Mot de passe** : `Zine`

**Nom d'utilisateur** : `Abas French`  
**Mot de passe** : `Abas French`

**Nom d'utilisateur** : `Sylvano Hervé`  
**Mot de passe** : `Sylvano Hervé`

### Connexion Administrateur

**Nom d'utilisateur** : `Admin`  
**Mot de passe** : `Admin2026`

---

## 🧪 Test de Connexion

### Via l'Interface Web

1. Aller sur : http://localhost:3000/plans.html
2. Entrer le nom d'utilisateur
3. Entrer le mot de passe (identique au nom)
4. Cliquer "Se connecter"

### Via API (curl)

```bash
# Test connexion enseignant
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Zine",
    "password": "Zine"
  }'

# Réponse attendue (succès):
{
  "success": true,
  "message": "Connexion réussie",
  "user": {
    "username": "Zine",
    "nom_complet": "Zine",
    "matieres": ["Sciences", "Biologie", "ES (Systèmes de l'env.)"],
    "role": "enseignant"
  }
}

# Test connexion administrateur
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Admin",
    "password": "Admin2026"
  }'
```

---

## 📝 Remarques Importantes

### Sensibilité à la Casse
- Les noms d'utilisateur et mots de passe sont **sensibles à la casse**
- `Zine` ≠ `zine` ≠ `ZINE`
- `Abas French` doit être écrit exactement comme indiqué (avec l'espace et la majuscule)

### Espaces dans les Noms
Certains enseignants ont des espaces dans leurs noms :
- `Abas French` (avec espace)
- `Mohamed Ali` (avec espace)
- `Sylvano Hervé` (avec espace)

**Important** : Tapez exactement comme écrit, y compris les espaces !

### Caractères Arabes
Les matières en arabe sont :
- الدراسات الإسلامية (Études Islamiques)
- اللغة العربية (Langue Arabe)
- الدراسات الاجتماعية (Études Sociales)
- التاريخ (Histoire)

---

## 🔒 Sécurité

### Pour l'Environnement de Production

**⚠️ IMPORTANT** : Ce système utilise des mots de passe simples (identiques aux noms) pour faciliter les tests.

**En production**, il est recommandé de :

1. **Changer tous les mots de passe** par des mots de passe forts
2. **Implémenter JWT** pour l'authentification
3. **Hasher les mots de passe** (bcrypt, argon2)
4. **Ajouter une expiration de session**
5. **Implémenter 2FA** (authentification à deux facteurs)
6. **Logs d'authentification** pour audit

### Fichier de Configuration

Les utilisateurs sont stockés dans : `/data/users.json`

**Ne jamais exposer ce fichier publiquement** en production !

---

## 🛠️ API Endpoints d'Authentification

### POST /api/auth/login
Authentifier un enseignant

**Request**:
```json
{
  "username": "Zine",
  "password": "Zine"
}
```

**Response (Succès)**:
```json
{
  "success": true,
  "message": "Connexion réussie",
  "user": {
    "username": "Zine",
    "nom_complet": "Zine",
    "matieres": ["Sciences", "Biologie"],
    "role": "enseignant"
  }
}
```

**Response (Échec)**:
```json
{
  "success": false,
  "message": "Nom d'utilisateur ou mot de passe incorrect"
}
```

### GET /api/auth/enseignants
Obtenir la liste des enseignants (sans mots de passe)

**Response**:
```json
{
  "success": true,
  "enseignants": [
    {
      "username": "Zine",
      "nom_complet": "Zine",
      "matieres": ["Sciences", "Biologie"]
    },
    ...
  ]
}
```

### GET /api/auth/health
Vérifier le statut du module d'authentification

**Response**:
```json
{
  "status": "ok",
  "module": "auth",
  "message": "Module d'authentification fonctionnel"
}
```

---

## ✅ Résumé

**Total Comptes** : 13 (12 enseignants + 1 admin)

**Règle Générale** : 
- Nom d'utilisateur = Mot de passe (pour les enseignants)
- Exception : Admin → mot de passe `Admin2026`

**Fichier Source** : `/data/users.json`

---

**Version** : 2.1.0  
**Date** : 19 janvier 2026  
**Statut** : ✅ Fonctionnel

---

**Note finale** : En cas de problème de connexion, vérifiez :
1. ✅ Pas de faute de frappe
2. ✅ Respect de la casse (majuscules/minuscules)
3. ✅ Espaces correctement saisis
4. ✅ Serveur démarré (`npm start`)
5. ✅ API `/api/auth/health` fonctionne
