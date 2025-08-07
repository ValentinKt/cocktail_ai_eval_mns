from django.urls import path
from . import views

app_name = 'cocktails'

urlpatterns = [
    path('', views.index, name='index'),
    path('history/', views.cocktail_history, name='history'),
    path('cocktail/<int:cocktail_id>/', views.cocktail_detail, name='detail'),
    
    # API endpoints
    path('api/generate-cocktail/', views.generate_cocktail, name='api_generate'),
    path('api/generate-cocktail-with-media/', views.generate_cocktail_with_media, name='api_generate_with_media'),
    path('api/cocktails/', views.api_cocktails, name='api_cocktails'),
    path('api/cocktail/<int:cocktail_id>/favorite/', views.toggle_favorite, name='api_toggle_favorite'),
    path('api/cocktail/<int:cocktail_id>/delete/', views.delete_cocktail, name='api_delete_cocktail'),
]