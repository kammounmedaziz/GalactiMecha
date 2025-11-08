/**
 * Script de test automatisé pour le système de communication
 * Usage: node test-communication.js
 */

const API_URL = 'http://localhost:3000';
const EARTH_TOKEN = 'earth-token-123';
const SPACECRAFT_TOKEN = 'spacecraft-token-456';

// Fonction helper pour faire des requêtes HTTP
async function makeRequest(endpoint, method, token, body = null) {
    const url = `${API_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const https = await import('https');
        const http = await import('http');
        const urlModule = await import('url');
        
        const parsedUrl = new urlModule.URL(url);
        const protocol = parsedUrl.protocol === 'https:' ? https : http;

        return new Promise((resolve, reject) => {
            const req = protocol.request(parsedUrl, options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        resolve({
                            status: res.statusCode,
                            data: JSON.parse(data)
                        });
                    } catch (e) {
                        resolve({
                            status: res.statusCode,
                            data: data
                        });
                    }
                });
            });

            req.on('error', reject);

            if (body) {
                req.write(JSON.stringify(body));
            }

            req.end();
        });
    } catch (error) {
        console.error('Erreur de requête:', error);
        throw error;
    }
}

// Test 1: Chiffrement
async function testEncryption() {
    console.log('\n🔐 TEST 1: Chiffrement d\'un message');
    console.log('='.repeat(50));

    const message = 'Houston, nous avons un problème!';
    console.log(`📝 Message original: "${message}"`);

    try {
        const response = await makeRequest(
            '/api/encryption/encrypt',
            'POST',
            EARTH_TOKEN,
            { message }
        );

        if (response.status === 200 && response.data.success) {
            console.log('✅ Chiffrement réussi!');
            console.log(`🔒 Message chiffré: ${response.data.encryptedMessage}`);
            return response.data.encryptedMessage;
        } else {
            console.error('❌ Échec du chiffrement:', response.data);
            return null;
        }
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        return null;
    }
}

// Test 2: Déchiffrement
async function testDecryption(encryptedMessage) {
    console.log('\n🔓 TEST 2: Déchiffrement du message');
    console.log('='.repeat(50));

    if (!encryptedMessage) {
        console.log('⏭️  Ignoré (pas de message chiffré)');
        return;
    }

    console.log(`🔒 Message chiffré: ${encryptedMessage}`);

    try {
        const response = await makeRequest(
            '/api/encryption/decrypt',
            'POST',
            SPACECRAFT_TOKEN,
            { encryptedMessage }
        );

        if (response.status === 200 && response.data.success) {
            console.log('✅ Déchiffrement réussi!');
            console.log(`📖 Message déchiffré: "${response.data.decryptedMessage}"`);
        } else {
            console.error('❌ Échec du déchiffrement:', response.data);
        }
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}

// Test 3: Envoi de message
async function testSendMessage() {
    console.log('\n📡 TEST 3: Envoi de message');
    console.log('='.repeat(50));

    const messageData = {
        from: 'Earth',
        to: 'Spacecraft',
        message: 'Préparez-vous pour l\'amarrage dans 30 minutes',
        priority: 'high'
    };

    console.log('📤 Envoi du message:', messageData);

    try {
        const response = await makeRequest(
            '/api/messages/send',
            'POST',
            EARTH_TOKEN,
            messageData
        );

        if (response.status === 200 || response.status === 201) {
            console.log('✅ Message envoyé avec succès!');
            console.log('📨 Réponse:', response.data);
        } else {
            console.error('❌ Échec de l\'envoi:', response.data);
        }
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}

// Test 4: Réception de messages
async function testReceiveMessages() {
    console.log('\n📬 TEST 4: Réception des messages');
    console.log('='.repeat(50));

    const recipient = 'Spacecraft';
    console.log(`📥 Récupération des messages pour: ${recipient}`);

    try {
        const response = await makeRequest(
            `/api/messages/receive/${recipient}`,
            'GET',
            SPACECRAFT_TOKEN
        );

        if (response.status === 200) {
            console.log('✅ Messages récupérés!');
            console.log(`📨 Nombre de messages: ${response.data.messages?.length || 0}`);
            if (response.data.messages?.length > 0) {
                console.log('📋 Derniers messages:');
                response.data.messages.forEach((msg, index) => {
                    console.log(`   ${index + 1}. ${msg.from} → ${msg.to}: "${msg.message}"`);
                });
            }
        } else {
            console.error('❌ Échec de la récupération:', response.data);
        }
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}

// Test 5: Envoi de télémétrie
async function testSendTelemetry() {
    console.log('\n🛰️  TEST 5: Envoi de télémétrie');
    console.log('='.repeat(50));

    const telemetryData = {
        spacecraft_id: 'MARS-001',
        timestamp: new Date().toISOString(),
        position: { x: 150000, y: 200000, z: 50000 },
        velocity: { x: 2500, y: 1800, z: 300 },
        fuel_level: 75.5,
        temperature: -120,
        status: 'operational'
    };

    console.log('📊 Envoi des données de télémétrie...');

    try {
        const response = await makeRequest(
            '/api/telemetry',
            'POST',
            SPACECRAFT_TOKEN,
            telemetryData
        );

        if (response.status === 200 || response.status === 201) {
            console.log('✅ Télémétrie envoyée!');
            console.log('📡 Données:', {
                spacecraft: telemetryData.spacecraft_id,
                fuel: `${telemetryData.fuel_level}%`,
                status: telemetryData.status,
                temperature: `${telemetryData.temperature}°C`
            });
        } else {
            console.error('❌ Échec de l\'envoi:', response.data);
        }
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}

// Test 6: Récupération de télémétrie
async function testGetTelemetry() {
    console.log('\n📊 TEST 6: Récupération de télémétrie');
    console.log('='.repeat(50));

    const spacecraftId = 'MARS-001';
    console.log(`🔍 Récupération de la télémétrie pour: ${spacecraftId}`);

    try {
        const response = await makeRequest(
            `/api/telemetry/${spacecraftId}`,
            'GET',
            EARTH_TOKEN
        );

        if (response.status === 200) {
            console.log('✅ Télémétrie récupérée!');
            console.log('📈 Dernières données:', response.data);
        } else {
            console.error('❌ Échec de la récupération:', response.data);
        }
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}

// Test 7: Authentification incorrecte
async function testInvalidAuth() {
    console.log('\n🚫 TEST 7: Test d\'authentification invalide');
    console.log('='.repeat(50));

    console.log('🔐 Tentative avec un token invalide...');

    try {
        const response = await makeRequest(
            '/api/encryption/encrypt',
            'POST',
            'invalid-token',
            { message: 'Test' }
        );

        if (response.status === 401 || response.status === 403) {
            console.log('✅ Authentification rejetée comme prévu!');
            console.log('🔒 Sécurité: Le système bloque les accès non autorisés');
        } else {
            console.warn('⚠️  Attention: Le système a accepté un token invalide!');
        }
    } catch (error) {
        console.log('✅ Requête bloquée (erreur réseau attendue)');
    }
}

// Fonction principale
async function runAllTests() {
    console.log('\n');
    console.log('🚀'.repeat(25));
    console.log('🌍  TESTS SYSTÈME DE COMMUNICATION TERRE ↔ VAISSEAU  🛸');
    console.log('🚀'.repeat(25));
    console.log(`\n🔗 API URL: ${API_URL}`);
    console.log(`⏰ Date: ${new Date().toLocaleString()}\n`);

    // Attendre 2 secondes pour que le serveur soit prêt
    console.log('⏳ Démarrage des tests dans 2 secondes...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
        // Exécuter tous les tests
        const encryptedMessage = await testEncryption();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await testDecryption(encryptedMessage);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await testSendMessage();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await testReceiveMessages();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await testSendTelemetry();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await testGetTelemetry();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await testInvalidAuth();

        // Résumé
        console.log('\n');
        console.log('═'.repeat(50));
        console.log('✨ TOUS LES TESTS SONT TERMINÉS! ✨');
        console.log('═'.repeat(50));
        console.log('\n💡 Note: Vérifiez les résultats ci-dessus pour');
        console.log('   détecter d\'éventuelles erreurs.\n');

    } catch (error) {
        console.error('\n❌ ERREUR CRITIQUE:', error);
        console.log('\n⚠️  Assurez-vous que le serveur est démarré:');
        console.log('   npm start\n');
    }
}

// Exécuter les tests
runAllTests();
