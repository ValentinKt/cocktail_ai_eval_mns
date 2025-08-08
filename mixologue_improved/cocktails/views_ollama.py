# -*- coding: utf-8 -*-
"""
Vues Django utilisant le service Ollama pour la génération de cocktails
Ce module contient les vues qui intègrent l'IA locale Ollama.
"""

import base64
import json
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views import View
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from .ollama_service import ollama_service

logger = logging.getLogger(__name__)


class OllamaHealthView(View):
    """
    Vue pour vérifier l'état du service Ollama.
    """
    
    def get(self, request):
        """
        Vérifie si Ollama est disponible et fonctionnel.
        """
        is_available = ollama_service.is_available()
        
        return JsonResponse({
            'status': 'healthy' if is_available else 'unavailable',
            'service': 'Ollama',
            'available': is_available,
            'base_url': ollama_service.base_url,
            'model': ollama_service.model,
            'prompt_model': ollama_service.prompt_model
        })


@method_decorator(csrf_exempt, name='dispatch')
class GenerateCocktailView(View):
    """
    Vue pour générer une recette de cocktail avec Ollama.
    """
    
    def post(self, request):
        """
        Génère une recette de cocktail basée sur les paramètres fournis.
        
        Paramètres attendus (JSON):
        - ingredients: Liste des ingrédients disponibles
        - style: Style de cocktail (optionnel, défaut: "classique")
        - difficulty: Niveau de difficulté (optionnel, défaut: "facile")
        """
        try:
            # Parser les données JSON
            data = json.loads(request.body)
            
            # Extraire les paramètres
            ingredients = data.get('ingredients', [])
            style = data.get('style', 'classique')
            difficulty = data.get('difficulty', 'facile')
            
            # Validation des paramètres
            if not ingredients:
                return JsonResponse({
                    'error': 'Au moins un ingrédient est requis',
                    'code': 'MISSING_INGREDIENTS'
                }, status=400)
            
            if not isinstance(ingredients, list):
                return JsonResponse({
                    'error': 'Les ingrédients doivent être fournis sous forme de liste',
                    'code': 'INVALID_INGREDIENTS_FORMAT'
                }, status=400)
            
            # Vérifier la disponibilité d'Ollama
            if not ollama_service.is_available():
                return JsonResponse({
                    'error': 'Service Ollama indisponible',
                    'code': 'OLLAMA_UNAVAILABLE'
                }, status=503)
            
            # Générer la recette
            recipe = ollama_service.generate_cocktail_recipe(
                ingredients=ingredients,
                style=style,
                difficulty=difficulty
            )
            
            if not recipe:
                return JsonResponse({
                    'error': 'Impossible de générer la recette',
                    'code': 'GENERATION_FAILED'
                }, status=500)
            
            # Ajouter des métadonnées
            recipe['generated_by'] = 'Ollama'
            recipe['model_used'] = ollama_service.model
            recipe['generation_timestamp'] = request.META.get('HTTP_X_FORWARDED_FOR', 
                                                            request.META.get('REMOTE_ADDR'))
            
            logger.info(f"Recette générée avec succès: {recipe.get('nom', 'Sans nom')}")
            
            return JsonResponse({
                'success': True,
                'recipe': recipe
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'error': 'Format JSON invalide',
                'code': 'INVALID_JSON'
            }, status=400)
        
        except Exception as e:
            logger.error(f"Erreur lors de la génération de recette: {e}")
            return JsonResponse({
                'error': 'Erreur interne du serveur',
                'code': 'INTERNAL_ERROR'
            }, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class GenerateCocktailImageView(View):
    """
    Vue pour générer une image de cocktail avec Stable Diffusion.
    """
    
    def post(self, request):
        """
        Génère une image de cocktail basée sur les paramètres fournis.
        
        Paramètres attendus (JSON):
        - cocktail_name: Nom du cocktail
        - ingredients: Liste des ingrédients
        - style: Style de l'image (défaut: "realistic")
        - glass_type: Type de verre (défaut: "cocktail glass")
        - garnish: Garniture
        """
        try:
            # Vérifier la disponibilité de Stable Diffusion
            try:
                import requests
                from django.conf import settings
                
                sd_health = requests.get(
                    f"{getattr(settings, 'STABLE_DIFFUSION_URL', 'http://localhost:7860')}/docs",
                    timeout=5
                )
                if sd_health.status_code != 200:
                    return JsonResponse({
                        'error': 'Service Stable Diffusion non disponible',
                        'code': 'SD_UNAVAILABLE'
                    }, status=503)
            except requests.exceptions.RequestException:
                return JsonResponse({
                    'error': 'Service Stable Diffusion non accessible',
                    'code': 'SD_UNREACHABLE'
                }, status=503)
            
            # Parser les données JSON
            data = json.loads(request.body)
            
            # Récupérer les paramètres de génération
            cocktail_name = data.get('cocktail_name', '')
            ingredients = data.get('ingredients', [])
            style = data.get('style', 'realistic')
            glass_type = data.get('glass_type', 'cocktail glass')
            garnish = data.get('garnish', '')
            
            if not cocktail_name and not ingredients:
                return JsonResponse({
                    'error': 'Nom du cocktail ou ingrédients requis',
                    'code': 'MISSING_PARAMETERS'
                }, status=400)
            
            # Générer un prompt créatif avec Ollama
            if isinstance(ingredients, list):
                ingredients_list = ingredients
            else:
                ingredients_list = [str(ingredients)] if ingredients else []
            
            # Utiliser Ollama pour créer un prompt artistique
            creative_prompt = ollama_service.generate_image_prompt(
                cocktail_name=cocktail_name,
                ingredients=ingredients_list,
                style=style,
                glass_type=glass_type,
                garnish=garnish
            )
            
            # Fallback si Ollama échoue
            if not creative_prompt:
                ingredients_str = ', '.join(ingredients_list)
                prompt_parts = [
                    f"A beautiful {style} photograph of a {cocktail_name} cocktail" if cocktail_name else f"A beautiful {style} cocktail",
                    f"served in a {glass_type}",
                    f"made with {ingredients_str}" if ingredients_str else "",
                    f"garnished with {garnish}" if garnish else "",
                    "professional food photography, high quality, detailed, appetizing, well-lit, clean background"
                ]
                prompt = ' '.join(filter(None, prompt_parts))
            else:
                prompt = creative_prompt
            
            negative_prompt = "blurry, low quality, distorted, ugly, bad anatomy, extra limbs, text, watermark, signature"
            
            # Paramètres de génération
            generation_params = {
                "prompt": prompt,
                "negative_prompt": negative_prompt,
                "steps": 30,
                "cfg_scale": 7.5,
                "width": 512,
                "height": 512,
                "sampler_name": "Euler a",
                "batch_size": 1,
                "n_iter": 1,
                "seed": -1
            }
            
            # Appeler Stable Diffusion
            sd_response = requests.post(
                f"{getattr(settings, 'STABLE_DIFFUSION_URL', 'http://localhost:7860')}/sdapi/v1/txt2img",
                json=generation_params,
                timeout=120
            )
            
            if sd_response.status_code != 200:
                logger.error(f"Erreur Stable Diffusion: {sd_response.text}")
                return JsonResponse({
                    'error': 'Erreur lors de la génération de l\'image',
                    'code': 'GENERATION_FAILED'
                }, status=500)
            
            result = sd_response.json()
            
            # Récupérer la première image générée
            if result.get('images') and len(result['images']) > 0:
                image_base64 = result['images'][0]
                
                logger.info(f"Image générée avec succès pour: {cocktail_name or 'cocktail personnalisé'}")
                
                return JsonResponse({
                    'success': True,
                    'image_base64': image_base64,
                    'prompt_used': prompt,
                    'parameters': generation_params,
                    'info': result.get('info', {}),
                    'generated_by': 'Stable Diffusion'
                })
            else:
                return JsonResponse({
                    'error': 'Aucune image générée',
                    'code': 'NO_IMAGE_GENERATED'
                }, status=500)
            
        except json.JSONDecodeError:
            return JsonResponse({
                'error': 'Format JSON invalide',
                'code': 'INVALID_JSON'
            }, status=400)
        
        except requests.exceptions.RequestException as e:
            logger.error(f"Erreur de connexion Stable Diffusion: {str(e)}")
            return JsonResponse({
                'error': 'Service Stable Diffusion non accessible',
                'code': 'SD_CONNECTION_ERROR'
            }, status=503)
        
        except Exception as e:
            logger.error(f"Erreur lors de la génération d'image: {e}")
            return JsonResponse({
                'error': 'Erreur interne du serveur',
                'code': 'INTERNAL_ERROR'
            }, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class CocktailSuggestionsView(View):
    """
    Vue pour obtenir des suggestions de cocktails basées sur l'humeur et l'occasion.
    """
    
    def post(self, request):
        """
        Suggère des cocktails basés sur l'humeur et l'occasion.
        
        Paramètres attendus (JSON):
        - mood: Humeur (joyeux, détendu, énergique, etc.)
        - occasion: Occasion (apéritif, soirée, dîner, etc.)
        """
        try:
            # Parser les données JSON
            data = json.loads(request.body)
            
            mood = data.get('mood', 'détendu')
            occasion = data.get('occasion', 'apéritif')
            
            # Vérifier la disponibilité d'Ollama
            if not ollama_service.is_available():
                return JsonResponse({
                    'error': 'Service Ollama indisponible',
                    'code': 'OLLAMA_UNAVAILABLE'
                }, status=503)
            
            # Obtenir les suggestions
            suggestions = ollama_service.get_cocktail_suggestions(mood, occasion)
            
            if not suggestions:
                return JsonResponse({
                    'error': 'Impossible de générer des suggestions',
                    'code': 'SUGGESTIONS_FAILED'
                }, status=500)
            
            logger.info(f"Suggestions générées pour humeur: {mood}, occasion: {occasion}")
            
            return JsonResponse({
                'success': True,
                'suggestions': suggestions,
                'parameters': {
                    'mood': mood,
                    'occasion': occasion
                },
                'generated_by': 'Ollama',
                'model_used': ollama_service.model
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'error': 'Format JSON invalide',
                'code': 'INVALID_JSON'
            }, status=400)
        
        except Exception as e:
            logger.error(f"Erreur lors de la génération de suggestions: {e}")
            return JsonResponse({
                'error': 'Erreur interne du serveur',
                'code': 'INTERNAL_ERROR'
            }, status=500)


@require_http_methods(["GET"])
def ollama_models_view(request):
    """
    Vue pour lister les modèles Ollama disponibles.
    """
    try:
        import requests
        
        response = requests.get(f"{ollama_service.base_url}/api/tags", timeout=10)
        
        if response.status_code == 200:
            models_data = response.json()
            return JsonResponse({
                'success': True,
                'models': models_data.get('models', []),
                'configured_model': ollama_service.model,
                'configured_prompt_model': ollama_service.prompt_model
            })
        else:
            return JsonResponse({
                'error': 'Impossible de récupérer la liste des modèles',
                'code': 'MODELS_FETCH_FAILED'
            }, status=500)
            
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des modèles: {e}")
        return JsonResponse({
            'error': 'Erreur interne du serveur',
            'code': 'INTERNAL_ERROR'
        }, status=500)