# Guide de Connexion API - Mixologue

## 🔗 Configuration de la Connexion Frontend-Backend

### Architecture

```
Frontend (React + TypeScript)     Backend (Django)
     Port 5173              ←→      Port 8000
```

### ✅ Configuration Réussie

La connexion entre le frontend React et l'API Django est maintenant **entièrement fonctionnelle** !

## 🚀 Endpoints API Disponibles

### 1. Génération de Cocktail
```http
POST /api/generate-cocktail/
Content-Type: application/json

{
  "user_request": "Je veux un cocktail tropical rafraîchissant"
}
```

**Réponse:**
```json
{
  "id": 1,
  "name": "Jardin Secret",
  "description": "Un cocktail mystérieux...",
  "ingredients": ["Rhum blanc", "Jus d'ananas", "..."]
  "musical_ambiance": "Jazz lounge",
  "image_prompt": "Elegant tropical cocktail...",
  "user_request": "Je veux un cocktail tropical rafraîchissant",
  "is_favorite": false,
  "created_at": "2025-01-06T09:47:00Z"
}
```

### 2. Liste des Cocktails
```http
GET /api/cocktails/
```

**Réponse:**
```json
[
  {
    "id": 1,
    "name": "Jardin Secret",
    "description": "...",
    "ingredients": [...],
    "musical_ambiance": "Jazz lounge",
    "image_prompt": "...",
    "user_request": "...",
    "is_favorite": false,
    "created_at": "2025-01-06T09:47:00Z"
  }
]
```

### 3. Toggle Favori
```http
POST /api/cocktail/{id}/favorite/
```

**Réponse:**
```json
{
  "success": true,
  "is_favorite": true
}
```

### 4. Détail d'un Cocktail
```http
GET /cocktail/{id}/
```

## ⚙️ Configuration Technique

### Backend Django

#### 1. CORS Configuration
```python
# settings.py
INSTALLED_APPS = [
    # ...
    "corsheaders",
    "cocktails",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    # ...
]

CORS_ALLOW_ALL_ORIGINS = DEBUG
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
]
```

#### 2. URLs Configuration
```python
# cocktails/urls.py
urlpatterns = [
    path('api/generate-cocktail/', views.generate_cocktail, name='api_generate'),
    path('api/cocktails/', views.api_cocktails, name='api_cocktails'),
    path('api/cocktail/<int:cocktail_id>/favorite/', views.toggle_favorite, name='api_toggle_favorite'),
]
```

### Frontend React

#### 1. Configuration API
```typescript
// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

#### 2. Variables d'Environnement
```bash
# frontend/.env
VITE_API_URL=http://127.0.0.1:8000
VITE_DEV_MODE=true
```

## 🧪 Tests de Connexion

### Test Automatique
Un script de test est disponible pour vérifier la connexion :

```bash
node test_api_connection.js
```

**Résultat attendu :**
```
🧪 Test de connexion API Django...

📋 Test 1: Récupération des cocktails...
✅ Succès! Nombre de cocktails: 5

🍹 Test 2: Génération d'un cocktail...
✅ Succès! Cocktail généré: Jardin Secret

❤️ Test 3: Toggle favorite...
✅ Succès! Statut favori: true

🎉 Tests terminés!
```

## 🚀 Démarrage des Serveurs

### 1. Backend Django
```bash
cd mixologue_improved
source env/bin/activate  # ou env\Scripts\activate sur Windows
python manage.py runserver
# Serveur disponible sur http://127.0.0.1:8000
```

### 2. Frontend React
```bash
cd frontend
npm run dev
# Serveur disponible sur http://localhost:5173
```

## 🔧 Dépannage

### Erreurs CORS
Si vous rencontrez des erreurs CORS :
1. Vérifiez que `corsheaders` est installé
2. Vérifiez la configuration dans `settings.py`
3. Redémarrez le serveur Django

### Erreurs de Connexion
Si le frontend ne peut pas se connecter au backend :
1. Vérifiez que le serveur Django fonctionne sur le port 8000
2. Vérifiez la variable `VITE_API_URL` dans `.env`
3. Vérifiez les URLs dans `cocktails/urls.py`

### Erreurs d'Endpoints
Si les endpoints ne fonctionnent pas :
1. Vérifiez les URLs dans `cocktails/urls.py`
2. Vérifiez les méthodes HTTP dans les vues
3. Vérifiez les décorateurs `@csrf_exempt` si nécessaire

## 📊 Statut de la Connexion

✅ **CORS configuré et fonctionnel**  
✅ **Endpoints API créés et testés**  
✅ **Service API frontend configuré**  
✅ **Communication bidirectionnelle établie**  
✅ **Tests de connexion réussis**  

**La connexion entre React et Django est maintenant entièrement opérationnelle !** 🎉