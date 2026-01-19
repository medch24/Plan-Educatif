# 🧪 Plan de Test - Module Emplois du Temps

## URL de test

**Système** : https://3000-i1grez4pqs9hl8g25g1eq-5634da27.sandbox.novita.ai

## Tests à effectuer

### ✅ Test 1 : Accès au module

1. Ouvrir l'URL principale
2. Cliquer sur la carte **"Emplois du Temps"**
3. **Résultat attendu** : Redirection vers `/emplois.html`

### ✅ Test 2 : Chargement interface

1. Sur la page Emplois
2. Vérifier présence de :
   - Menu déroulant classes (PEI1-G à DP2-G)
   - 5 boutons d'action en haut
   - Message "Sélectionnez une classe..."
3. **Résultat attendu** : Interface complète et responsive

### ✅ Test 3 : Sélection classe

1. Sélectionner **"PEI1 Garçons"** dans le dropdown
2. **Résultat attendu** : 
   - Grille 5×10 (jours × périodes) affichée
   - Toutes les cellules remplies avec matières/enseignants
   - 2 pauses visibles (10:15-10:35, 13:15-13:45)

### ✅ Test 4 : Affichage données

1. Vérifier les données PEI1-G :
   - **Dimanche P1** : Sciences (Zine)
   - **Dimanche P2** : Islamic (Majed)
   - **Dimanche P3** : French L.L (Abas)
   - **Pause 1** : 10:15-10:35
   - **Dimanche P4** : IS (Youssif)
2. **Résultat attendu** : Données correctes depuis JSON

### ✅ Test 5 : Charger emploi par défaut

1. Sélectionner **"PEI2 Garçons"**
2. Si grille vide ou erreur, cliquer **"Charger par défaut"**
3. Confirmer le chargement
4. **Résultat attendu** :
   - Notification "Emploi par défaut chargé avec succès"
   - Grille remplie avec données PEI2-G
   - 40 cours + 10 pauses affichés

### ✅ Test 6 : Édition d'une cellule

1. Sur PEI1-G, cliquer sur **Dimanche Période 1**
2. Modal d'édition s'ouvre
3. Modifier :
   - Matière : **"Maths"**
   - Enseignant : **"Sylvano Hervé"**
   - Salle : **"A101"**
4. Cliquer **"Enregistrer"** dans le modal
5. **Résultat attendu** :
   - Modal se ferme
   - Cellule mise à jour avec nouvelles valeurs
   - Notification succès

### ✅ Test 7 : Sauvegarde modifications

**Note** : Ce test nécessite MongoDB configuré

1. Après modification (Test 6)
2. Cliquer **"💾 Enregistrer"**
3. **Résultat attendu** :
   - Notification "Emploi sauvegardé avec succès"
   - Si mode démo : "Base de données non disponible"

### ✅ Test 8 : Réinitialisation

1. Modifier une cellule (ne pas sauvegarder)
2. Cliquer **"🔄 Réinitialiser"**
3. **Résultat attendu** :
   - Confirmation demandée
   - Emploi rechargé depuis DB (ou par défaut)
   - Modifications annulées

### ✅ Test 9 : Export Excel

1. Sur PEI1-G avec emploi chargé
2. Cliquer **"📊 Exporter Excel"**
3. **Résultat attendu** :
   - Fichier `.xlsx` téléchargé
   - Nom : `Emploi_PEI1-G_YYYY-MM-DD.xlsx`
   - Contenu : grille avec 5 jours × 10 périodes
   - Formatage correct

### ✅ Test 10 : Impression

1. Sur n'importe quelle classe
2. Cliquer **"🖨️ Imprimer"**
3. **Résultat attendu** :
   - Fenêtre d'impression s'ouvre
   - Mise en page adaptée A4
   - Logo et en-tête visibles
   - Grille complète et lisible

### ✅ Test 11 : Navigation entre classes

1. Charger **PEI1-G**
2. Passer à **PEI2-G**
3. Passer à **PEI3-G**
4. Passer à **PEI4-G**
5. Passer à **DP2-G**
6. **Résultat attendu** :
   - Chaque classe charge son emploi propre
   - Pas d'erreur console
   - Pas de mélange de données

### ✅ Test 12 : Toutes les classes

Vérifier pour chaque classe :

#### PEI1-G
- Dimanche P1 : **Sciences** (Zine)
- Total séances : 40 + 10 pauses = 50

#### PEI2-G
- Dimanche P1 : **Islamic** (Jaber)
- Total séances : 40 + 10 pauses = 50

#### PEI3-G
- Dimanche P1 : **ART** (Sami)
- Total séances : 40 + 10 pauses = 50

#### PEI4-G
- Dimanche P1 : **KSA** (Jaber)
- Total séances : 40 + 10 pauses = 50

#### DP2-G
- Dimanche P1 : **IS** (Youssif)
- Total séances : 40 + 10 pauses = 50

### ✅ Test 13 : API Endpoints

**Test via curl ou Postman**

#### Health check
```bash
GET /api/emplois/health
Expected: { "status": "ok", "module": "emplois", ... }
```

#### Charger emploi
```bash
GET /api/emplois/classe/PEI1-G
Expected: { "success": true, "data": [...], "source": "default" }
```

#### Charger par défaut
```bash
POST /api/emplois/load-default/PEI1-G
Expected: { "success": true, "message": "...", "count": 50 }
```

#### Matières
```bash
GET /api/emplois/matieres/PEI1-G
Expected: { "success": true, "matieres": [...] }
```

#### Enseignants
```bash
GET /api/emplois/enseignants/PEI1-G
Expected: { "success": true, "enseignants": [...] }
```

### ✅ Test 14 : Responsive Design

1. Ouvrir `/emplois.html` sur :
   - Desktop (1920×1080)
   - Tablet (768×1024)
   - Mobile (375×667)
2. **Résultat attendu** :
   - Grille adaptée à la taille écran
   - Scroll horizontal si nécessaire
   - Boutons accessibles
   - Pas de débordement

### ✅ Test 15 : Performance

1. Charger PEI1-G
2. Ouvrir Console navigateur (F12)
3. Onglet Network
4. **Résultat attendu** :
   - Temps chargement < 1s
   - Taille réponse API < 10KB
   - Pas d'erreurs 404

## 🐛 Tests de régression

### Test R1 : Modules précédents intacts

1. Tester `/distribution.html` fonctionne
2. Tester `/plans.html` fonctionne
3. Tester `/devoirs.html` fonctionne
4. **Résultat attendu** : Aucun module cassé

### Test R2 : Page d'accueil

1. Ouvrir `/`
2. Vérifier 4 cartes :
   - Distribution Annuelle
   - Emplois du Temps
   - Plans Hebdomadaires
   - Devoirs
3. **Résultat attendu** : Navigation fluide

### Test R3 : Bouton retour

1. Sur `/emplois.html`, cliquer **🏠 Accueil**
2. **Résultat attendu** : Retour à la page d'accueil

## 📊 Résultats attendus

| Test | Description | Statut | Notes |
|------|-------------|--------|-------|
| 1 | Accès module | ⬜ | |
| 2 | Interface | ⬜ | |
| 3 | Sélection classe | ⬜ | |
| 4 | Affichage données | ⬜ | |
| 5 | Charger par défaut | ⬜ | |
| 6 | Édition cellule | ⬜ | |
| 7 | Sauvegarde | ⬜ | Nécessite MongoDB |
| 8 | Réinitialisation | ⬜ | |
| 9 | Export Excel | ⬜ | |
| 10 | Impression | ⬜ | |
| 11 | Navigation classes | ⬜ | |
| 12 | Toutes classes | ⬜ | |
| 13 | API Endpoints | ⬜ | |
| 14 | Responsive | ⬜ | |
| 15 | Performance | ⬜ | |
| R1 | Modules intacts | ⬜ | |
| R2 | Page accueil | ⬜ | |
| R3 | Bouton retour | ⬜ | |

## 📝 Rapport de bugs

Format :
```
**Bug ID** : BUG-001
**Titre** : [Court titre]
**Description** : [Description détaillée]
**Étapes** : 
  1. [Étape 1]
  2. [Étape 2]
**Résultat attendu** : [Ce qui devrait se passer]
**Résultat actuel** : [Ce qui se passe]
**Priorité** : [Haute/Moyenne/Basse]
**Navigateur** : [Chrome, Firefox, Safari...]
```

## ✅ Checklist finale

- [ ] Tous les tests passent
- [ ] Aucun bug critique
- [ ] Performance acceptable
- [ ] Responsive OK
- [ ] API fonctionnelle
- [ ] Documentation à jour

---

**Testeur** : _________  
**Date** : _________  
**Version** : 2.1.0
