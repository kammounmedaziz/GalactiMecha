#!/bin/bash

# Script de test rapide pour le système de communication
# Usage: bash quick-test.sh

echo "🚀 Test du Système de Communication Terre ↔ Vaisseau"
echo "======================================================"
echo ""

API_URL="http://localhost:3000"
EARTH_TOKEN="earth-token-123"
SPACECRAFT_TOKEN="spacecraft-token-456"

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Chiffrement
echo -e "${BLUE}Test 1: Chiffrement d'un message${NC}"
echo "--------------------------------------"
curl -X POST ${API_URL}/api/encryption/encrypt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${EARTH_TOKEN}" \
  -d '{"message": "Houston, nous avons un problème!"}' \
  -w "\n\n"

sleep 1

# Test 2: Envoi de message
echo -e "${BLUE}Test 2: Envoi de message${NC}"
echo "--------------------------------------"
curl -X POST ${API_URL}/api/messages/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${EARTH_TOKEN}" \
  -d '{
    "from": "Earth",
    "to": "Spacecraft",
    "message": "Préparez-vous pour l'\''amarrage",
    "priority": "high"
  }' \
  -w "\n\n"

sleep 1

# Test 3: Réception des messages
echo -e "${BLUE}Test 3: Réception des messages${NC}"
echo "--------------------------------------"
curl -X GET ${API_URL}/api/messages/receive/Spacecraft \
  -H "Authorization: Bearer ${SPACECRAFT_TOKEN}" \
  -w "\n\n"

sleep 1

# Test 4: Envoi de télémétrie
echo -e "${BLUE}Test 4: Envoi de télémétrie${NC}"
echo "--------------------------------------"
curl -X POST ${API_URL}/api/telemetry \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SPACECRAFT_TOKEN}" \
  -d '{
    "spacecraft_id": "MARS-001",
    "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
    "position": {"x": 150000, "y": 200000, "z": 50000},
    "velocity": {"x": 2500, "y": 1800, "z": 300},
    "fuel_level": 75.5,
    "temperature": -120,
    "status": "operational"
  }' \
  -w "\n\n"

sleep 1

# Test 5: Récupération de télémétrie
echo -e "${BLUE}Test 5: Récupération de télémétrie${NC}"
echo "--------------------------------------"
curl -X GET ${API_URL}/api/telemetry/MARS-001 \
  -H "Authorization: Bearer ${EARTH_TOKEN}" \
  -w "\n\n"

echo ""
echo -e "${GREEN}✅ Tous les tests sont terminés!${NC}"
echo ""
