# Imports Django pour les vues, réponses HTTP et décorateurs
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.paginator import Paginator
import json
import os
from .models import Cocktail

# Import des bibliothèques IA avec gestion d'erreur gracieuse
# Permet à l'application de fonctionner même si certaines dépendances manquent

try:
    import openai
    openai.api_key = os.getenv('OPENAI_API_KEY')
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    print("OpenAI non disponible - fonctionnalité désactivée")

try:
    import ollama
    OLLAMA_AVAILABLE = True
except ImportError:
    OLLAMA_AVAILABLE = False
    print("Ollama non disponible - fonctionnalité désactivée")

try:
    import requests
    REQUESTS_AVAILABLE = True
except ImportError:
    REQUESTS_AVAILABLE = False
    print("Requests non disponible - certaines fonctionnalités limitées")


def index(request):
    """
    Vue pour la page d'accueil de l'application
    Affiche l'interface principale de génération de cocktails
    """
    return render(request, 'cocktails/index.html')


def cocktail_history(request):
    """
    Vue pour l'historique des cocktails générés
    
    Affiche tous les cocktails avec pagination pour améliorer les performances.
    Utilise Django Paginator pour diviser les résultats en pages de 12 éléments.
    """
    cocktails = Cocktail.objects.all()
    paginator = Paginator(cocktails, 12)  # 12 cocktails par page pour un affichage optimal
    
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'cocktails/history.html', {'page_obj': page_obj})


def cocktail_detail(request, cocktail_id):
    """
    Vue pour afficher les détails d'un cocktail spécifique
    
    Args:
        cocktail_id: ID du cocktail à afficher
    
    Returns:
        Rendu de la page de détail ou erreur 404 si non trouvé
    """
    cocktail = get_object_or_404(Cocktail, id=cocktail_id)
    return render(request, 'cocktails/detail.html', {'cocktail': cocktail})


@csrf_exempt
@require_http_methods(["POST"])
def generate_cocktail(request):
    """API endpoint pour générer un cocktail via IA"""
    try:
        print(f"Request body: {request.body}")
        data = json.loads(request.body)
        print(f"Parsed data: {data}")
        user_request = data.get('user_request', '')
        print(f"User request: '{user_request}'")
        
        if not user_request:
            print("Error: Empty user_request")
            return JsonResponse({'error': 'Aucune demande fournie'}, status=400)
        
        # Génération du cocktail avec IA (Ollama prioritaire)
        cocktail_data = None
        
        # Essayer d'abord avec Ollama (local, plus rapide et créatif)
        if OLLAMA_AVAILABLE:
            try:
                cocktail_data = generate_cocktail_with_ollama(user_request)
                print("Cocktail généré avec Ollama")
            except Exception as e:
                print(f"Erreur Ollama: {e}")
                cocktail_data = None
        
        # Fallback vers OpenAI si Ollama échoue
        if not cocktail_data and OPENAI_AVAILABLE and openai.api_key:
            try:
                cocktail_data = generate_cocktail_with_openai(user_request)
                print("Cocktail généré avec OpenAI")
            except Exception as e:
                print(f"Erreur OpenAI: {e}")
                cocktail_data = None
        
        # Fallback final vers le mode démo
        if not cocktail_data:
            cocktail_data = generate_demo_cocktail(user_request)
            print("Cocktail généré en mode démo")
        
        # Sauvegarder en base de données
        cocktail = Cocktail.objects.create(
            name=cocktail_data['name'],
            description=cocktail_data['description'],
            ingredients=cocktail_data['ingredients'],
            musical_ambiance=cocktail_data['musical_ambiance'],
            image_prompt=cocktail_data.get('image_prompt', ''),
            user_request=user_request
        )
        
        return JsonResponse({
            'id': cocktail.id,
            'name': cocktail.name,
            'description': cocktail.description,
            'ingredients': cocktail.ingredients,
            'musical_ambiance': cocktail.musical_ambiance,
            'image_prompt': cocktail.image_prompt,
            'user_request': cocktail.user_request,
            'is_favorite': cocktail.is_favorite,
            'created_at': cocktail.created_at.isoformat()
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def generate_cocktail_with_ollama(user_request):
    """Génère un cocktail avec Ollama (Llama 3.1)"""
    # Prompt amélioré pour Ollama
    prompt = f"""Tu es un mixologue expert reconnu mondialement, créateur de cocktails innovants. Un client te demande : "{user_request}"

Analyse sa demande et crée un cocktail original qui correspond parfaitement à ses envies. Considère :
- Les saveurs demandées (sucré, amer, fruité, épicé, etc.)
- L'occasion (apéritif, digestif, soirée, détente, etc.)
- Les préférences d'alcool ou sans alcool
- L'ambiance souhaitée

Réponds UNIQUEMENT avec un JSON valide au format suivant :
{{
    "name": "Nom créatif et évocateur du cocktail",
    "description": "Histoire captivante du cocktail en 2-3 phrases, incluant son inspiration et ses caractéristiques gustatives",
    "ingredients": "Ingrédient 1 avec quantité précise\nIngrédient 2 avec quantité précise\nIngrédient 3 avec quantité précise\nGarniture et décoration",
    "musical_ambiance": "Genre musical spécifique qui s'harmonise parfaitement avec ce cocktail",
    "image_prompt": "Description détaillée pour générer une image artistique du cocktail : verre, couleurs, garniture, éclairage, ambiance"
}}

Sois créatif, précis dans les dosages, et assure-toi que le cocktail soit réalisable et délicieux."""
    
    try:
        response = ollama.chat(
            model='llama3.1:latest',
            messages=[
                {
                    'role': 'system',
                    'content': 'Tu es un mixologue expert et créatif. Tu réponds toujours avec du JSON valide uniquement.'
                },
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            options={
                'temperature': 0.8,
                'top_p': 0.9,
                'num_predict': 800
            }
        )
        
        ai_response = response['message']['content'].strip()
        
        # Nettoyer la réponse pour extraire le JSON
        if '```json' in ai_response:
            ai_response = ai_response.split('```json')[1].split('```')[0].strip()
        elif '```' in ai_response:
            ai_response = ai_response.split('```')[1].strip()
        
        # Chercher le JSON dans la réponse
        import re
        # Trouver le premier { et le dernier } correspondant
        start_idx = ai_response.find('{')
        if start_idx != -1:
            brace_count = 0
            end_idx = start_idx
            for i, char in enumerate(ai_response[start_idx:], start_idx):
                if char == '{':
                    brace_count += 1
                elif char == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        end_idx = i
                        break
            if brace_count == 0:
                ai_response = ai_response[start_idx:end_idx + 1]
        
        # Nettoyer les caractères de contrôle invalides
        import re
        ai_response = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', ai_response)
        
        # Parser le JSON
        cocktail_data = json.loads(ai_response)
        
        # Validation des champs requis
        required_fields = ['name', 'description', 'ingredients', 'musical_ambiance', 'image_prompt']
        for field in required_fields:
            if field not in cocktail_data or not cocktail_data[field]:
                raise ValueError(f"Champ manquant: {field}")
        
        return cocktail_data
        
    except json.JSONDecodeError as e:
        print(f"Erreur JSON Ollama: {e}")
        print(f"Réponse brute: {ai_response}")
        raise Exception("Réponse JSON invalide d'Ollama")
    except Exception as e:
        print(f"Erreur Ollama: {e}")
        raise


def generate_cocktail_with_openai(user_request):
    """Génère un cocktail avec OpenAI GPT"""
    prompt = f"""Tu es un mixologue expert et créatif. Un client te demande : "{user_request}"

Crée un cocktail original et réponds UNIQUEMENT au format JSON suivant :
{{
    "name": "Nom créatif du cocktail",
    "description": "Une courte histoire ou description du cocktail (2-3 phrases)",
    "ingredients": "Ingrédient 1\nIngrédient 2\nIngrédient 3\n...",
    "musical_ambiance": "Style musical qui accompagne bien ce cocktail",
    "image_prompt": "Prompt détaillé pour générer une image du cocktail avec MidJourney ou SDXL"
}}

Sois créatif, original et assure-toi que le cocktail correspond à la demande du client."""
    
    from openai import OpenAI
    client = OpenAI(api_key=openai.api_key)
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Tu es un mixologue expert et créatif."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=500,
        temperature=0.8
    )
    
    ai_response = response.choices[0].message.content.strip()
    
    try:
        cocktail_data = json.loads(ai_response)
        return cocktail_data
    except json.JSONDecodeError:
        # Fallback si l'IA ne retourne pas du JSON valide
        raise Exception("Réponse JSON invalide d'OpenAI")


def generate_demo_cocktail(user_request):
    """Génère un cocktail de démonstration sans IA"""
    demo_cocktails = [
        {
            "name": "Sunset Gin Fizz",
            "description": "Un cocktail rafraîchissant qui capture l'essence d'un coucher de soleil d'été. Parfait pour les amateurs de gin qui recherchent une touche fruitée sans excès de sucre.",
            "ingredients": "4 cl de Gin\n2 cl de jus de pamplemousse rose\n1 cl de sirop d'elderflower\nEau gazeuse\nZeste de citron vert",
            "musical_ambiance": "Indie folk acoustique",
            "image_prompt": "A refreshing gin cocktail with pink grapefruit, elderflower, in a tall glass with ice, garnished with lime zest, golden hour lighting, elegant bar setting"
        },
        {
            "name": "Jardin Secret",
            "description": "Une création sans alcool qui évoque la fraîcheur d'un jardin en été. Idéal pour une après-midi en terrasse, alliant saveurs herbacées et notes fruitées.",
            "ingredients": "10 cl de thé vert glacé\n3 cl de jus de concombre\n2 cl de sirop de basilic\n1 cl de jus de citron vert\nFeuilles de menthe fraîche\nEau pétillante",
            "musical_ambiance": "Bossa nova douce",
            "image_prompt": "A refreshing non-alcoholic cocktail with cucumber, basil, mint leaves, in a wine glass, garden terrace setting, natural daylight, green and fresh appearance"
        }
    ]
    
    # Sélection basée sur des mots-clés dans la demande
    if any(word in user_request.lower() for word in ['gin', 'fruité', 'pas trop sucré']):
        return demo_cocktails[0]
    else:
        return demo_cocktails[1]


def generate_cocktail_image_prompt(cocktail_name, ingredients, description):
    """Génère un prompt pour l'image du cocktail en utilisant Ollama"""
    if not OLLAMA_AVAILABLE:
        return None
    
    try:
        # Créer un prompt pour générer un prompt Stable Diffusion
        user_prompt = f"Create a detailed Stable Diffusion prompt for a cocktail image: {cocktail_name}. Ingredients: {', '.join(ingredients)}. Description: {description}. Make it photorealistic, professional bar photography style, with beautiful lighting and garnish."
        
        response = ollama.chat(
            model='brxce/stable-diffusion-prompt-generator',
            messages=[{
                'role': 'user',
                'content': user_prompt
            }]
        )
        
        return response['message']['content'].strip()
    except Exception as e:
        print(f"Erreur génération prompt image: {e}")
        return None


def get_background_music_suggestions(cocktail_style):
    """Suggère de la musique d'ambiance basée sur le style du cocktail"""
    # Mapping des styles de cocktails vers des genres musicaux
    music_mapping = {
        'tropical': ['reggae', 'bossa nova', 'caribbean'],
        'classic': ['jazz', 'swing', 'lounge'],
        'modern': ['electronic', 'ambient', 'chillout'],
        'sophisticated': ['classical', 'smooth jazz', 'piano'],
        'party': ['dance', 'pop', 'upbeat'],
        'romantic': ['romantic', 'soft jazz', 'acoustic'],
        'exotic': ['world music', 'ethnic', 'fusion']
    }
    
    # Déterminer le style basé sur les mots-clés
    style_keywords = cocktail_style.lower()
    suggested_genres = []
    
    for style, genres in music_mapping.items():
        if style in style_keywords:
            suggested_genres.extend(genres)
            break
    
    if not suggested_genres:
        suggested_genres = ['lounge', 'ambient', 'jazz']  # Par défaut
    
    # Retourner des suggestions de musique libre de droits
    music_suggestions = {
        'genres': suggested_genres,
        'sources': [
            {
                'name': 'Freesound',
                'url': 'https://freesound.org/',
                'description': 'Free background music and ambient sounds'
            },
            {
                'name': 'Pixabay Music',
                'url': 'https://pixabay.com/music/',
                'description': 'Royalty-free music for any project'
            },
            {
                'name': 'Chosic',
                'url': 'https://www.chosic.com/free-music/all/',
                'description': 'Free background music, no copyright'
            }
        ],
        'recommendations': [
            f"Search for '{genre} background music' on the suggested sources" for genre in suggested_genres[:3]
        ]
    }
    
    return music_suggestions


@csrf_exempt
@require_http_methods(["POST"])
def generate_cocktail_with_media(request):
    """API endpoint pour générer un cocktail avec image et suggestions musicales"""
    try:
        data = json.loads(request.body)
        user_request = data.get('user_request', '')
        
        if not user_request:
            return JsonResponse({'error': 'Requête utilisateur manquante'}, status=400)
        
        print(f"Request body: {request.body}")
        print(f"Parsed data: {data}")
        print(f"User request: '{user_request}'")
        
        # Générer le cocktail de base
        cocktail_data = None
        
        if OLLAMA_AVAILABLE:
            try:
                cocktail_data = generate_cocktail_with_ollama(user_request)
                print("Cocktail généré avec Ollama")
            except Exception as e:
                print(f"Erreur Ollama: {e}")
        
        if not cocktail_data and OPENAI_AVAILABLE:
            try:
                cocktail_data = generate_cocktail_with_openai(user_request)
                print("Cocktail généré avec OpenAI")
            except Exception as e:
                print(f"Erreur OpenAI: {e}")
        
        if not cocktail_data:
            cocktail_data = generate_demo_cocktail(user_request)
            print("Cocktail généré en mode démo")
        
        # Générer le prompt pour l'image
        image_prompt = None
        if cocktail_data:
            image_prompt = generate_cocktail_image_prompt(
                cocktail_data.get('name', ''),
                cocktail_data.get('ingredients', []),
                cocktail_data.get('description', '')
            )
        
        # Générer les suggestions musicales
        music_suggestions = None
        if cocktail_data:
            cocktail_style = f"{cocktail_data.get('name', '')} {cocktail_data.get('description', '')}"
            music_suggestions = get_background_music_suggestions(cocktail_style)
        
        # Ajouter les nouvelles données au cocktail
        if cocktail_data:
            cocktail_data['image_prompt'] = image_prompt
            cocktail_data['music_suggestions'] = music_suggestions
            cocktail_data['user_request'] = user_request
            
            # Créer et sauvegarder le cocktail en base de données
            cocktail = Cocktail.objects.create(
                name=cocktail_data.get('name', 'Cocktail Sans Nom'),
                description=cocktail_data.get('description', ''),
                ingredients=cocktail_data.get('ingredients', ''),
                musical_ambiance=cocktail_data.get('musical_ambiance', ''),
                image_prompt=cocktail_data.get('image_prompt', ''),
                user_request=user_request
            )
            
            # Retourner la réponse avec l'ID du cocktail créé
            response_data = {
                'id': cocktail.id,
                'name': cocktail.name,
                'description': cocktail.description,
                'ingredients': cocktail.ingredients,
                'musical_ambiance': cocktail.musical_ambiance,
                'image_prompt': cocktail.image_prompt,
                'music_suggestions': music_suggestions,
                'user_request': cocktail.user_request,
                'created_at': cocktail.created_at.isoformat(),
                'is_favorite': False
            }
            
            return JsonResponse(response_data)
        
        return JsonResponse({'error': 'Impossible de générer le cocktail'}, status=500)
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'JSON invalide'}, status=400)
    except Exception as e:
        print(f"Erreur inattendue: {e}")
        return JsonResponse({'error': 'Erreur serveur'}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def toggle_favorite(request, cocktail_id):
    """Toggle le statut favori d'un cocktail"""
    try:
        cocktail = get_object_or_404(Cocktail, id=cocktail_id)
        cocktail.is_favorite = not cocktail.is_favorite
        cocktail.save()
        
        return JsonResponse({
            'success': True,
            'is_favorite': cocktail.is_favorite
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@require_http_methods(["GET"])
def api_cocktails(request):
    """API pour récupérer la liste des cocktails"""
    cocktails = Cocktail.objects.all()[:20]  # Limite à 20 résultats
    
    cocktails_data = []
    for cocktail in cocktails:
        cocktails_data.append({
            'id': cocktail.id,
            'name': cocktail.name,
            'description': cocktail.description,
            'ingredients': cocktail.ingredients,
            'musical_ambiance': cocktail.musical_ambiance,
            'image_prompt': cocktail.image_prompt,
            'user_request': cocktail.user_request,
            'is_favorite': cocktail.is_favorite,
            'created_at': cocktail.created_at.isoformat()
        })
    
    return JsonResponse(cocktails_data, safe=False)


@csrf_exempt
@require_http_methods(["DELETE"])
def delete_cocktail(request, cocktail_id):
    """API pour supprimer un cocktail"""
    try:
        cocktail = get_object_or_404(Cocktail, id=cocktail_id)
        cocktail.delete()
        return JsonResponse({'success': True, 'message': 'Cocktail supprimé avec succès'})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)
