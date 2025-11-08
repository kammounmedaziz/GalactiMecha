# Guide de Test - Système de Communication Sécurisé Terre ↔ Vaisseau

## 🚀 Démarrage rapide

### 1. Installation des dépendances

```bash
cd earth-spacecraft-comms
npm install
```

### 2. Démarrer le serveur

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

---

## 🧪 Tests avec curl (Git Bash)

### Test 1: Chiffrement d'un message

```bash
curl -X POST http://localhost:3000/api/encryption/encrypt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer earth-token-123" \
  -d '{
    "message": "Houston, nous avons un problème!"
  }'
```

**Réponse attendue:**
```json
{
  "success": true,
  "encryptedMessage": "a1b2c3d4e5f6..."
}
```

---

### Test 2: Déchiffrement d'un message

```bash
curl -X POST http://localhost:3000/api/encryption/decrypt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer spacecraft-token-456" \
  -d '{
    "encryptedMessage": "a1b2c3d4e5f6..."
  }'
```

**Réponse attendue:**
```json
{
  "success": true,
  "decryptedMessage": "Houston, nous avons un problème!"
}
```

---

### Test 3: Envoyer un message

```bash
curl -X POST http://localhost:3000/api/messages/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer earth-token-123" \
  -d '{
    "from": "Earth",
    "to": "Spacecraft",
    "message": "Préparez-vous pour l'\''amarrage",
    "priority": "high"
  }'
```

---

### Test 4: Recevoir les messages

```bash
curl -X GET http://localhost:3000/api/messages/receive/Spacecraft \
  -H "Authorization: Bearer spacecraft-token-456"
```

---

### Test 5: Envoyer des données de télémétrie

```bash
curl -X POST http://localhost:3000/api/telemetry \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer spacecraft-token-456" \
  -d '{
    "spacecraft_id": "MARS-001",
    "timestamp": "2025-11-08T10:30:00Z",
    "position": {
      "x": 150000,
      "y": 200000,
      "z": 50000
    },
    "velocity": {
      "x": 2500,
      "y": 1800,
      "z": 300
    },
    "fuel_level": 75.5,
    "temperature": -120,
    "status": "operational"
  }'
```

---

### Test 6: Récupérer la télémétrie

```bash
curl -X GET http://localhost:3000/api/telemetry/MARS-001 \
  -H "Authorization: Bearer earth-token-123"
```

---

## 🧪 Tests avec PowerShell

### Test 1: Chiffrement (PowerShell)

```powershell
$body = @{
    message = "Houston, nous avons un problème!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/encryption/encrypt" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer earth-token-123"
    } `
    -Body $body
```

### Test 2: Envoyer un message (PowerShell)

```powershell
$body = @{
    from = "Earth"
    to = "Spacecraft"
    message = "Préparez-vous pour l'amarrage"
    priority = "high"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/messages/send" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer earth-token-123"
    } `
    -Body $body
```

---

## 🧪 Tests avec un fichier HTML (dans le navigateur)

Créez un fichier `test.html` :

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Communication Terre-Vaisseau</title>
</head>
<body>
    <h1>Test du Système de Communication</h1>
    
    <h2>Chiffrer un message</h2>
    <input type="text" id="message" placeholder="Entrez votre message">
    <button onclick="encryptMessage()">Chiffrer</button>
    <div id="encrypted-result"></div>
    
    <h2>Déchiffrer un message</h2>
    <input type="text" id="encrypted" placeholder="Message chiffré">
    <button onclick="decryptMessage()">Déchiffrer</button>
    <div id="decrypted-result"></div>

    <script>
        const API_URL = 'http://localhost:3000';
        const TOKEN = 'earth-token-123';

        async function encryptMessage() {
            const message = document.getElementById('message').value;
            
            const response = await fetch(`${API_URL}/api/encryption/encrypt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TOKEN}`
                },
                body: JSON.stringify({ message })
            });
            
            const data = await response.json();
            document.getElementById('encrypted-result').innerHTML = 
                `<strong>Chiffré:</strong> ${data.encryptedMessage}`;
        }

        async function decryptMessage() {
            const encryptedMessage = document.getElementById('encrypted').value;
            
            const response = await fetch(`${API_URL}/api/encryption/decrypt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TOKEN}`
                },
                body: JSON.stringify({ encryptedMessage })
            });
            
            const data = await response.json();
            document.getElementById('decrypted-result').innerHTML = 
                `<strong>Déchiffré:</strong> ${data.decryptedMessage}`;
        }
    </script>
</body>
</html>
```

---

## 📝 Tests automatisés avec un script Node.js

Créez un fichier `test-script.js` :

```javascript
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000';
const EARTH_TOKEN = 'earth-token-123';
const SPACECRAFT_TOKEN = 'spacecraft-token-456';

async function testEncryption() {
    console.log('🔐 Test 1: Chiffrement...');
    
    const response = await fetch(`${API_URL}/api/encryption/encrypt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${EARTH_TOKEN}`
        },
        body: JSON.stringify({
            message: 'Houston, nous avons un problème!'
        })
    });
    
    const data = await response.json();
    console.log('✅ Message chiffré:', data);
    return data.encryptedMessage;
}

async function testDecryption(encryptedMessage) {
    console.log('\n🔓 Test 2: Déchiffrement...');
    
    const response = await fetch(`${API_URL}/api/encryption/decrypt`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SPACECRAFT_TOKEN}`
        },
        body: JSON.stringify({ encryptedMessage })
    });
    
    const data = await response.json();
    console.log('✅ Message déchiffré:', data);
}

async function testSendMessage() {
    console.log('\n📡 Test 3: Envoi de message...');
    
    const response = await fetch(`${API_URL}/api/messages/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${EARTH_TOKEN}`
        },
        body: JSON.stringify({
            from: 'Earth',
            to: 'Spacecraft',
            message: 'Préparez-vous pour l\'amarrage',
            priority: 'high'
        })
    });
    
    const data = await response.json();
    console.log('✅ Message envoyé:', data);
}

async function runTests() {
    try {
        const encrypted = await testEncryption();
        await testDecryption(encrypted);
        await testSendMessage();
        console.log('\n✨ Tous les tests sont réussis!');
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

runTests();
```

Pour exécuter:
```bash
npm install node-fetch
node test-script.js
```

---

## 🔑 Tokens d'authentification

- **Terre:** `Bearer earth-token-123`
- **Vaisseau:** `Bearer spacecraft-token-456`

---

## 📊 Endpoints disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/encryption/encrypt` | Chiffrer un message |
| POST | `/api/encryption/decrypt` | Déchiffrer un message |
| POST | `/api/messages/send` | Envoyer un message |
| GET | `/api/messages/receive/:recipient` | Recevoir les messages |
| POST | `/api/telemetry` | Envoyer des données de télémétrie |
| GET | `/api/telemetry/:spacecraftId` | Récupérer la télémétrie |

---

## ⚠️ Dépannage

### Le serveur ne démarre pas
```bash
# Vérifier si le port 3000 est déjà utilisé
netstat -ano | findstr :3000

# Changer le port dans .env ou package.json
PORT=3001 npm start
```

### Erreur d'authentification
- Vérifiez que vous utilisez le bon token dans l'en-tête `Authorization`
- Format: `Bearer votre-token`

### CORS errors dans le navigateur
Ajoutez le middleware CORS dans `app.js`:
```bash
npm install cors
```

---

## 🎯 Scénario de test complet

1. **Démarrer le serveur**
2. **Terre chiffre un message** → obtient un message chiffré
3. **Terre envoie le message chiffré au vaisseau**
4. **Vaisseau reçoit et déchiffre le message**
5. **Vaisseau envoie sa télémétrie**
6. **Terre récupère la télémétrie**

Bonne chance avec vos tests! 🚀
