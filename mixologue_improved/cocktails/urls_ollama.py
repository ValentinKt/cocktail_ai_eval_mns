# -*- coding: utf-8 -*-
"""
URLs pour les fonctionnalités Ollama de l'application cocktails
Ce module définit les routes pour l'intégration IA locale.
"""

from django.urls import path
from . import views_ollama

# Namespace pour les URLs Ollama
app_name = 'ollama'

urlpatterns = [
    # Vérification de l'état du service Ollama
    path('health/', 
         views_ollama.OllamaHealthView.as_view(), 
         name='health'),
    
    # Génération de recettes de cocktails
    path('generate-cocktail/', 
         views_ollama.GenerateCocktailView.as_view(), 
         name='generate_cocktail'),
    
    # Génération d'images de cocktails
    path('generate-image/', 
         views_ollama.GenerateCocktailImageView.as_view(), 
         name='generate_image'),
    
    # Suggestions de cocktails basées sur l'humeur/occasion
    path('suggestions/', 
         views_ollama.CocktailSuggestionsView.as_view(), 
         name='suggestions'),
    
    # Liste des modèles Ollama disponibles
    path('models/', 
         views_ollama.ollama_models_view, 
         name='models'),
]

"""
Exemples d'utilisation des APIs:

1. Vérifier l'état d'Ollama:
   GET /api/ollama/health/

2. Générer une recette de cocktail:
   POST /api/ollama/generate-cocktail/
   {
       "ingredients": ["vodka", "jus de cranberry", "lime"],
       "style": "moderne",
       "difficulty": "facile"
   }

3. Générer une image de cocktail:
   POST /api/ollama/generate-image/
   Content-Type: application/json
   {
       "cocktail_name": "Mojito",
       "ingredients": ["rhum blanc", "menthe", "citron vert", "sucre", "eau gazeuse"],
       "style": "realistic",
       "glass_type": "highball glass",
       "garnish": "feuilles de menthe et quartier de citron vert"
   }

4. Obtenir des suggestions:
   POST /api/ollama/suggestions/
   {
       "mood": "joyeux",
       "occasion": "soirée"
   }

5. Lister les modèles disponibles:
   GET /api/ollama/models/
"""