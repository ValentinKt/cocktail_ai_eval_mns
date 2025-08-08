# -*- coding: utf-8 -*-
"""
Service Ollama pour la génération de cocktails et d'images
Ce module gère l'intégration avec Ollama pour créer des recettes de cocktails
et analyser des images de cocktails.
"""

import json
import logging
import requests
from typing import Dict, List, Optional, Any
from django.conf import settings
from django.core.cache import cache

logger = logging.getLogger(__name__)


class OllamaService:
    """
    Service pour interagir avec Ollama pour la génération de contenu IA.
    """
    
    def __init__(self):
        self.base_url = getattr(settings, 'OLLAMA_URL', 'http://ollama:11434')
        self.model = getattr(settings, 'OLLAMA_MODEL', 'llama3.2:latest')
        self.prompt_model = getattr(settings, 'OLLAMA_PROMPT_MODEL', 'llama3.2:3b')
        self.timeout = getattr(settings, 'OLLAMA_TIMEOUT', 60)
        self.temperature = getattr(settings, 'OLLAMA_TEMPERATURE', 0.8)
        self.max_tokens = getattr(settings, 'OLLAMA_MAX_TOKENS', 2000)
    
    def _make_request(self, endpoint: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Effectue une requête vers l'API Ollama.
        
        Args:
            endpoint: Point de terminaison de l'API
            data: Données à envoyer
            
        Returns:
            Réponse de l'API ou None en cas d'erreur
        """
        try:
            url = f"{self.base_url}/api/{endpoint}"
            response = requests.post(
                url,
                json=data,
                timeout=self.timeout,
                headers={'Content-Type': 'application/json'}
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Erreur lors de la requête Ollama: {e}")
            return None
    
    def generate_cocktail_recipe(self, 
                               ingredients: List[str], 
                               style: str = "classique",
                               difficulty: str = "facile") -> Optional[Dict[str, Any]]:
        """
        Génère une recette de cocktail basée sur les ingrédients fournis.
        
        Args:
            ingredients: Liste des ingrédients disponibles
            style: Style de cocktail souhaité
            difficulty: Niveau de difficulté
            
        Returns:
            Dictionnaire contenant la recette générée
        """
        # Créer une clé de cache unique
        cache_key = f"cocktail_{hash(str(ingredients))}_{style}_{difficulty}"
        cached_result = cache.get(cache_key)
        
        if cached_result:
            logger.info("Recette trouvée dans le cache")
            return cached_result
        
        # Construire le prompt en français
        ingredients_str = ", ".join(ingredients)
        prompt = f"""
Tu es un barman expert français. Crée une recette de cocktail {style} de niveau {difficulty} 
avec ces ingrédients: {ingredients_str}

Réponds UNIQUEMENT avec un JSON valide dans ce format exact:
{{
    "nom": "Nom du cocktail",
    "description": "Description courte et attrayante",
    "ingredients": [
        {{
            "nom": "nom de l'ingrédient",
            "quantite": "quantité avec unité",
            "type": "alcool/sirop/jus/garniture/autre"
        }}
    ],
    "instructions": [
        "Étape 1 de préparation",
        "Étape 2 de préparation"
    ],
    "verre": "Type de verre recommandé",
    "garniture": "Garniture recommandée",
    "temps_preparation": "Temps en minutes",
    "difficulte": "{difficulty}",
    "style": "{style}",
    "conseils": "Conseils du barman"
}}

Ne réponds qu'avec le JSON, rien d'autre.
"""
        
        data = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": self.temperature,
                "num_predict": self.max_tokens
            }
        }
        
        response = self._make_request("generate", data)
        
        if not response:
            logger.error("Impossible de générer la recette")
            return None
        
        try:
            # Extraire le contenu de la réponse
            content = response.get('response', '')
            
            # Nettoyer le contenu pour extraire le JSON
            content = content.strip()
            if content.startswith('```json'):
                content = content[7:]
            if content.endswith('```'):
                content = content[:-3]
            
            # Parser le JSON
            recipe_data = json.loads(content)
            
            # Mettre en cache pour 1 heure
            cache.set(cache_key, recipe_data, 3600)
            
            logger.info(f"Recette générée avec succès: {recipe_data.get('nom', 'Sans nom')}")
            return recipe_data
            
        except json.JSONDecodeError as e:
            logger.error(f"Erreur lors du parsing JSON: {e}")
            logger.error(f"Contenu reçu: {response.get('response', '')}")
            return None
    
    def analyze_cocktail_image(self, image_base64: str) -> Optional[Dict[str, Any]]:
        """
        Analyse une image de cocktail pour identifier les ingrédients et suggérer une recette.
        
        Args:
            image_base64: Image encodée en base64
            
        Returns:
            Analyse de l'image avec suggestions
        """
        prompt = """
Analyse cette image de cocktail et réponds UNIQUEMENT avec un JSON valide:

{
    "cocktail_identifie": "Nom du cocktail si reconnu, sinon 'Cocktail personnalisé'",
    "ingredients_visibles": [
        "ingrédient 1 visible",
        "ingrédient 2 visible"
    ],
    "couleur_principale": "couleur dominante",
    "type_verre": "type de verre utilisé",
    "garnitures": ["garniture 1", "garniture 2"],
    "style_estime": "style du cocktail (tropical, classique, moderne, etc.)",
    "suggestions_ingredients": [
        "ingrédient suggéré 1",
        "ingrédient suggéré 2"
    ],
    "notes": "Observations sur la présentation"
}

Ne réponds qu'avec le JSON, rien d'autre.
"""
        
        data = {
            "model": self.vision_model,
            "prompt": prompt,
            "images": [image_base64],
            "stream": False,
            "options": {
                "temperature": 0.3,  # Plus conservateur pour l'analyse
                "num_predict": 1000
            }
        }
        
        response = self._make_request("generate", data)
        
        if not response:
            logger.error("Impossible d'analyser l'image")
            return None
        
        try:
            content = response.get('response', '').strip()
            
            # Nettoyer le contenu
            if content.startswith('```json'):
                content = content[7:]
            if content.endswith('```'):
                content = content[:-3]
            
            analysis_data = json.loads(content)
            logger.info("Image analysée avec succès")
            return analysis_data
            
        except json.JSONDecodeError as e:
            logger.error(f"Erreur lors du parsing de l'analyse d'image: {e}")
            return None
    
    def get_cocktail_suggestions(self, mood: str, occasion: str) -> Optional[List[Dict[str, Any]]]:
        """
        Suggère des cocktails basés sur l'humeur et l'occasion.
        
        Args:
            mood: Humeur (joyeux, détendu, énergique, etc.)
            occasion: Occasion (apéritif, soirée, dîner, etc.)
            
        Returns:
            Liste de suggestions de cocktails
        """
        cache_key = f"suggestions_{mood}_{occasion}"
        cached_result = cache.get(cache_key)
        
        if cached_result:
            return cached_result
        
        prompt = f"""
Tu es un barman expert. Suggère 3 cocktails parfaits pour quelqu'un qui se sent {mood} 
lors d'une occasion: {occasion}.

Réponds UNIQUEMENT avec un JSON valide:

{{
    "suggestions": [
        {{
            "nom": "Nom du cocktail",
            "description": "Pourquoi ce cocktail convient",
            "ingredients_principaux": ["ingrédient 1", "ingrédient 2"],
            "niveau_alcool": "faible/moyen/fort",
            "saveur_dominante": "sucrée/amère/acidulée/épicée"
        }}
    ]
}}

Ne réponds qu'avec le JSON, rien d'autre.
"""
        
        data = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.9,  # Plus créatif pour les suggestions
                "num_predict": 1500
            }
        }
        
        response = self._make_request("generate", data)
        
        if not response:
            return None
        
        try:
            content = response.get('response', '').strip()
            
            if content.startswith('```json'):
                content = content[7:]
            if content.endswith('```'):
                content = content[:-3]
            
            suggestions_data = json.loads(content)
            suggestions = suggestions_data.get('suggestions', [])
            
            # Mettre en cache pour 30 minutes
            cache.set(cache_key, suggestions, 1800)
            
            return suggestions
            
        except json.JSONDecodeError as e:
            logger.error(f"Erreur lors du parsing des suggestions: {e}")
            return None
    
    def generate_image_prompt(self, cocktail_name: str, ingredients: List[str], 
                            style: str = "classique", glass_type: str = "coupe", 
                            garnish: str = "") -> Optional[str]:
        """
        Génère un prompt créatif pour Stable Diffusion basé sur les détails du cocktail.
        
        Args:
            cocktail_name: Nom du cocktail
            ingredients: Liste des ingrédients
            style: Style du cocktail
            glass_type: Type de verre
            garnish: Garniture
            
        Returns:
            Prompt optimisé pour Stable Diffusion ou None en cas d'erreur
        """
        try:
            # Construire le prompt pour Ollama
            ingredients_text = ", ".join(ingredients)
            
            prompt = f"""
Créez un prompt détaillé et artistique en anglais pour générer une image de cocktail avec Stable Diffusion.

Détails du cocktail :
- Nom : {cocktail_name}
- Ingrédients : {ingredients_text}
- Style : {style}
- Verre : {glass_type}
- Garniture : {garnish}

Le prompt doit :
1. Décrire visuellement le cocktail de manière artistique
2. Inclure l'ambiance et l'éclairage
3. Mentionner la qualité photographique ("professional photography", "high quality")
4. Être optimisé pour Stable Diffusion
5. Faire maximum 200 mots
6. Être en anglais

Répondez uniquement avec le prompt, sans explication.
"""
            
            data = {
                "model": self.prompt_model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.9,  # Plus créatif pour les prompts
                    "top_p": 0.9,
                    "max_tokens": 300
                }
            }
            
            response = self._make_request("/api/generate", data)
            if response and "response" in response:
                return response["response"].strip()
                
            return None
            
        except Exception as e:
            logger.error(f"Erreur lors de la génération du prompt d'image: {e}")
            return None
    
    def is_available(self) -> bool:
        """
        Vérifie si le service Ollama est disponible.
        
        Returns:
            True si Ollama est accessible, False sinon
        """
        try:
            response = requests.get(f"{self.base_url}/api/tags", timeout=5)
            return response.status_code == 200
        except requests.exceptions.RequestException:
            return False


# Instance globale du service
ollama_service = OllamaService()