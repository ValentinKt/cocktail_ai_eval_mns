from django.contrib import admin
from .models import Cocktail


@admin.register(Cocktail)
class CocktailAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'is_favorite', 'musical_ambiance')
    list_filter = ('is_favorite', 'created_at')
    search_fields = ('name', 'description', 'ingredients', 'user_request')
    readonly_fields = ('created_at',)
    
    fieldsets = (
        ('Informations principales', {
            'fields': ('name', 'description', 'is_favorite')
        }),
        ('Recette', {
            'fields': ('ingredients', 'musical_ambiance')
        }),
        ('IA et génération', {
            'fields': ('user_request', 'image_prompt')
        }),
        ('Métadonnées', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        })
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).order_by('-created_at')
