// Script de test pour vérifier la connexion API entre React et Django

const API_BASE_URL = 'http://127.0.0.1:8001';

// Test de connexion basique
async function testApiConnection() {
  console.log('🧪 Test de connexion API Django...');
  
  try {
    // Test 1: Récupérer la liste des cocktails
    console.log('\n📋 Test 1: Récupération des cocktails...');
    const cocktailsResponse = await fetch(`${API_BASE_URL}/api/cocktails/`);
    
    if (cocktailsResponse.ok) {
      const cocktails = await cocktailsResponse.json();
      console.log('✅ Succès! Nombre de cocktails:', cocktails.length);
    } else {
      console.log('❌ Erreur:', cocktailsResponse.status, cocktailsResponse.statusText);
    }
    
    // Test 2: Générer un cocktail
    console.log('\n🍹 Test 2: Génération d\'un cocktail...');
    const generateResponse = await fetch(`${API_BASE_URL}/api/generate-cocktail/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_request: 'Je veux un cocktail tropical rafraîchissant'
      })
    });
    
    if (generateResponse.ok) {
      const newCocktail = await generateResponse.json();
      console.log('✅ Succès! Cocktail généré:', newCocktail.name);
      
      // Test 3: Toggle favorite
      if (newCocktail.id) {
        console.log('\n❤️ Test 3: Toggle favorite...');
        const favoriteResponse = await fetch(`${API_BASE_URL}/api/cocktail/${newCocktail.id}/favorite/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (favoriteResponse.ok) {
          const favoriteResult = await favoriteResponse.json();
          console.log('✅ Succès! Statut favori:', favoriteResult.is_favorite);
        } else {
          console.log('❌ Erreur toggle favorite:', favoriteResponse.status);
        }
      }
    } else {
      console.log('❌ Erreur génération:', generateResponse.status, generateResponse.statusText);
    }
    
    console.log('\n🎉 Tests terminés!');
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.log('\n🔧 Vérifiez que:');
    console.log('- Le serveur Django fonctionne sur http://127.0.0.1:8001');
    console.log('- CORS est correctement configuré');
    console.log('- Les endpoints API sont accessibles');
  }
}

// Exécuter les tests
testApiConnection();