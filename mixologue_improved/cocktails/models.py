# Imports Django pour la gestion des modèles et du temps
from django.db import models
from django.utils import timezone


class Cocktail(models.Model):
    """
    Modèle principal pour stocker les cocktails générés par l'IA
    
    Ce modèle contient toutes les informations d'un cocktail créé par l'IA :
    - Informations de base (nom, description, ingrédients)
    - Éléments d'ambiance (musique, image)
    - Métadonnées (demande utilisateur, date, favoris)
    """
    
    # Informations principales du cocktail
    name = models.CharField(
        max_length=200, 
        verbose_name="Nom du cocktail",
        help_text="Nom créatif du cocktail généré par l'IA"
    )
    
    description = models.TextField(
        verbose_name="Description/Histoire",
        help_text="Histoire et description détaillée du cocktail"
    )
    
    ingredients = models.TextField(
        verbose_name="Liste des ingrédients",
        help_text="Ingrédients et proportions, séparés par des retours à la ligne"
    )
    
    # Éléments d'ambiance et créatifs
    musical_ambiance = models.CharField(
        max_length=300, 
        verbose_name="Ambiance musicale",
        help_text="Suggestion d'ambiance musicale pour accompagner le cocktail"
    )
    
    image_prompt = models.TextField(
        blank=True, 
        null=True, 
        verbose_name="Prompt image MidJourney/SDXL",
        help_text="Prompt pour générer une image du cocktail avec l'IA"
    )
    
    # Métadonnées et gestion
    user_request = models.TextField(
        verbose_name="Demande originale du client",
        help_text="Demande initiale de l'utilisateur ayant généré ce cocktail"
    )
    
    created_at = models.DateTimeField(
        default=timezone.now, 
        verbose_name="Date de création",
        help_text="Date et heure de création du cocktail"
    )
    
    is_favorite = models.BooleanField(
        default=False, 
        verbose_name="Cocktail favori",
        help_text="Indique si ce cocktail est marqué comme favori"
    )
    
    class Meta:
        """Configuration du modèle Cocktail"""
        ordering = ['-created_at']  # Tri par date de création décroissante
        verbose_name = "Cocktail"
        verbose_name_plural = "Cocktails"
    
    def __str__(self):
        """Représentation textuelle du cocktail pour l'admin Django"""
        return self.name
    
    def get_ingredients_list(self):
        """
        Convertit le champ ingredients (texte) en liste Python
        
        Utile pour l'affichage frontend et le traitement des données.
        Filtre les lignes vides et supprime les espaces superflus.
        
        Returns:
            list: Liste des ingrédients nettoyés
        """
        return [ingredient.strip() for ingredient in self.ingredients.split('\n') if ingredient.strip()]
