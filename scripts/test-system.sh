#!/bin/bash

###############################################################################
# Script de Test Automatisé - Système Scolaire Intégré
# Vérifie que tous les services fonctionnent correctement
###############################################################################

BASE_URL="http://localhost:3000"
PASSED=0
FAILED=0

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "════════════════════════════════════════════════════════════"
echo "     TESTS AUTOMATISÉS - SYSTÈME SCOLAIRE INTÉGRÉ"
echo "════════════════════════════════════════════════════════════"
echo ""

# Test 1: Health Check Auth
echo -n "Test 1: Health Check Auth API... "
response=$(curl -s "${BASE_URL}/api/auth/health")
if echo "$response" | jq -e '.status == "ok"' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Test 2: Login Mohamed
echo -n "Test 2: Login Mohamed/Mohamed... "
response=$(curl -s -X POST "${BASE_URL}/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username": "Mohamed", "password": "Mohamed"}')
if echo "$response" | jq -e '.success == true' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    echo "  Response: $response"
    ((FAILED++))
fi

# Test 3: Login Zine
echo -n "Test 3: Login Zine/Zine... "
response=$(curl -s -X POST "${BASE_URL}/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username": "Zine", "password": "Zine"}')
if echo "$response" | jq -e '.success == true' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Test 4: Login Admin
echo -n "Test 4: Login Admin/Admin2026... "
response=$(curl -s -X POST "${BASE_URL}/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username": "Admin", "password": "Admin2026"}')
if echo "$response" | jq -e '.success == true and .user.role == "admin"' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Test 5: Login avec mauvais mot de passe
echo -n "Test 5: Login avec mauvais mot de passe... "
response=$(curl -s -X POST "${BASE_URL}/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username": "Mohamed", "password": "WrongPassword"}')
if echo "$response" | jq -e '.success == false' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Test 6: Emploi du temps PEI1-G
echo -n "Test 6: Emploi du temps PEI1-G (50 séances)... "
response=$(curl -s "${BASE_URL}/api/emplois/classe/PEI1-G")
count=$(echo "$response" | jq '.data | length')
if [ "$count" = "50" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (trouvé: $count séances)"
    ((FAILED++))
fi

# Test 7: Emploi du temps PEI2-G
echo -n "Test 7: Emploi du temps PEI2-G (50 séances)... "
response=$(curl -s "${BASE_URL}/api/emplois/classe/PEI2-G")
count=$(echo "$response" | jq '.data | length')
if [ "$count" = "50" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (trouvé: $count séances)"
    ((FAILED++))
fi

# Test 8: Emploi du temps PEI3-G
echo -n "Test 8: Emploi du temps PEI3-G (50 séances)... "
response=$(curl -s "${BASE_URL}/api/emplois/classe/PEI3-G")
count=$(echo "$response" | jq '.data | length')
if [ "$count" = "50" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (trouvé: $count séances)"
    ((FAILED++))
fi

# Test 9: Emploi du temps PEI4-G
echo -n "Test 9: Emploi du temps PEI4-G (50 séances)... "
response=$(curl -s "${BASE_URL}/api/emplois/classe/PEI4-G")
count=$(echo "$response" | jq '.data | length')
if [ "$count" = "50" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (trouvé: $count séances)"
    ((FAILED++))
fi

# Test 10: Emploi du temps DP2-G
echo -n "Test 10: Emploi du temps DP2-G (50 séances)... "
response=$(curl -s "${BASE_URL}/api/emplois/classe/DP2-G")
count=$(echo "$response" | jq '.data | length')
if [ "$count" = "50" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (trouvé: $count séances)"
    ((FAILED++))
fi

# Test 11: Health Check Emplois
echo -n "Test 11: Health Check Emplois API... "
response=$(curl -s "${BASE_URL}/api/emplois/health")
if echo "$response" | jq -e '.status == "ok"' > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Test 12: Page d'accueil
echo -n "Test 12: Page d'accueil accessible... "
status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/")
if [ "$status" = "200" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $status)"
    ((FAILED++))
fi

# Test 13: Page Plans
echo -n "Test 13: Page Plans accessible... "
status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/plans.html")
if [ "$status" = "200" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $status)"
    ((FAILED++))
fi

# Test 14: Page Emplois
echo -n "Test 14: Page Emplois accessible... "
status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/emplois.html")
if [ "$status" = "200" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $status)"
    ((FAILED++))
fi

# Résumé
echo ""
echo "────────────────────────────────────────────────────────────"
echo "RÉSUMÉ DES TESTS"
echo "────────────────────────────────────────────────────────────"
TOTAL=$((PASSED + FAILED))
echo -e "Total: $TOTAL tests"
echo -e "${GREEN}Réussis: $PASSED${NC}"
echo -e "${RED}Échoués: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ TOUS LES TESTS SONT PASSÉS!${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}❌ CERTAINS TESTS ONT ÉCHOUÉ!${NC}"
    echo ""
    exit 1
fi
