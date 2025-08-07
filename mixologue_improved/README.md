# Le Mixologue Augmenté

> Application web intelligente pour la création de cocktails personnalisés propulsée par l'IA

## 📋 Description du projet

Le Mixologue Augmenté est une application web développée pour le bar d'Arnaud Dumas à Metz. Elle permet de générer des cocktails personnalisés en fonction des envies des clients grâce à l'intelligence artificielle, offrant une expérience ludique et accessible sur tablette ou mobile.

### Fonctionnalités principales

- 🤖 **Génération IA de cocktails** : Création de recettes originales basées sur les envies des clients
- 📱 **Interface responsive** : Optimisée pour tablettes et mobiles
- 📚 **Historique complet** : Sauvegarde et consultation de tous les cocktails créés
- ⭐ **Système de favoris** : Marquer les cocktails préférés
- 🎵 **Ambiance musicale** : Suggestion d'accompagnement musical pour chaque cocktail
- 🖼️ **Prompts d'images IA** : Génération de descriptions pour créer des visuels avec MidJourney/SDXL
- 🔍 **Recherche et filtres** : Navigation facile dans l'historique

## 🛠️ Choix technologiques

### Pourquoi Django ?

Django a été choisi comme framework principal pour plusieurs raisons :

1. **Robustesse et maturité** : Framework éprouvé avec une large communauté
2. **ORM intégré** : Gestion simplifiée de la base de données avec des modèles Python
3. **Interface d'administration** : Panel admin automatique pour la gestion des cocktails
4. **Sécurité** : Protection CSRF, authentification, et bonnes pratiques intégrées
5. **Scalabilité** : Capable de gérer la montée en charge d'un bar fréquenté
6. **Écosystème riche** : Nombreux packages disponibles (API REST, déploiement, etc.)

**Comparaison avec Flask :**
- Django offre plus de fonctionnalités "out-of-the-box" (admin, ORM, authentification)
- Structure de projet plus organisée pour une application métier
- Meilleure pour des projets avec des besoins d'évolution

### Architecture découplée

- **Backend** : Django avec API REST pour la logique métier
- **Frontend** : Interface web moderne avec TailwindCSS v4
- **IA** : Intégration OpenAI GPT pour la génération de cocktails
- **Base de données** : SQLite en développement, PostgreSQL en production

### Technologies utilisées

- **Framework** : Django 5.2.4
- **CSS** : TailwindCSS v4 (CDN)
- **IA** : OpenAI GPT-3.5-turbo
- **Base de données** : SQLite/PostgreSQL
- **Déploiement** : Docker + Docker Compose
- **Serveur web** : Nginx + Gunicorn
- **Icons** : Font Awesome 6

## 🚀 Installation et configuration

### Prérequis

- Python 3.13+
- pip
- Git
- Docker et Docker Compose (pour le déploiement)

### Installation locale

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd mixologue_improved
   ```

2. **Créer un environnement virtuel**
   ```bash
   python -m venv env
   source env/bin/activate  # Sur Windows: env\Scripts\activate
   ```

3. **Installer les dépendances**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configuration des variables d'environnement**
   ```bash
   cp .env.example .env
   # Éditer le fichier .env avec vos valeurs
   ```

5. **Migrations de base de données**
   ```bash
   python manage.py migrate
   ```

6. **Créer un superutilisateur (optionnel)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Lancer le serveur de développement**
   ```bash
   python manage.py runserver
   ```

   L'application sera accessible sur `http://localhost:8000`

### Installation avec Docker

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd mixologue_improved
   ```

2. **Configuration des variables d'environnement**
   ```bash
   cp .env.example .env
   # Configurer les variables nécessaires
   ```

3. **Lancer avec Docker Compose**
   ```bash
   docker-compose up --build
   ```

   L'application sera accessible sur `http://localhost`

## ⚙️ Variables configurables

### Variables d'environnement essentielles

| Variable | Description | Valeur par défaut | Obligatoire |
|----------|-------------|-------------------|-------------|
| `SECRET_KEY` | Clé secrète Django | - | ✅ |
| `DEBUG` | Mode debug | `True` | ❌ |
| `ALLOWED_HOSTS` | Hosts autorisés | `localhost,127.0.0.1` | ❌ |
| `OPENAI_API_KEY` | Clé API OpenAI | - | ⚠️ Recommandé |
| `DATABASE_URL` | URL de la base de données | SQLite local | ❌ |

### Configuration OpenAI

- **Avec clé API** : Génération intelligente de cocktails via GPT-3.5-turbo
- **Sans clé API** : Mode démo avec cocktails prédéfinis

### Configuration de base de données

- **Développement** : SQLite (par défaut)
- **Production** : PostgreSQL (recommandé)

## 📱 Utilisation

### Interface utilisateur

1. **Page d'accueil** : Interface de génération avec exemples d'inspiration
2. **Génération** : Saisir une description d'envie et obtenir un cocktail personnalisé
3. **Historique** : Consulter tous les cocktails créés avec filtres et recherche
4. **Détails** : Vue complète d'un cocktail avec options de partage et impression

### Exemples d'utilisation

- "J'ai envie de quelque chose de fruité mais avec du gin, et pas trop sucré"
- "Un cocktail sans alcool pour une après-midi en terrasse"
- "Une création originale à base de whisky et citron vert"
- "Je suis de bonne humeur et il fait beau aujourd'hui, tu me conseilles de boire quoi ?"

### Interface d'administration

Accès via `/admin/` pour :
- Gérer les cocktails créés
- Consulter les statistiques
- Modérer le contenu

## 🐳 Déploiement

### Déploiement Docker (recommandé)

1. **Préparer l'environnement**
   ```bash
   # Configurer les variables de production
   export OPENAI_API_KEY="your-api-key"
   export SECRET_KEY="your-secret-key"
   ```

2. **Lancer en production**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

3. **Vérifier le déploiement**
   ```bash
   docker-compose ps
   docker-compose logs web
   ```

### Déploiement manuel

1. **Serveur avec Gunicorn**
   ```bash
   gunicorn --bind 0.0.0.0:8000 mixologue_improved.wsgi:application
   ```

2. **Avec Nginx (configuration fournie)**
   - Copier `nginx.conf` vers `/etc/nginx/sites-available/`
   - Créer un lien symbolique vers `/etc/nginx/sites-enabled/`
   - Redémarrer Nginx

## 🔧 Développement

### Structure du projet

```
mixologue_improved/
├── cocktails/              # Application principale
│   ├── models.py          # Modèles de données
│   ├── views.py           # Logique métier et API
│   ├── urls.py            # Routes
│   ├── admin.py           # Interface d'administration
│   └── templates/         # Templates HTML
├── mixologue_improved/     # Configuration Django
├── requirements.txt        # Dépendances Python
├── Dockerfile             # Configuration Docker
├── docker-compose.yml     # Orchestration des services
└── README.md              # Documentation
```

### API Endpoints

- `POST /api/generate/` : Génération d'un nouveau cocktail
- `GET /api/cocktails/` : Liste des cocktails
- `POST /api/cocktail/<id>/favorite/` : Toggle favori

### Commandes utiles

```bash
# Tests
python manage.py test

# Collecte des fichiers statiques
python manage.py collectstatic

# Shell Django
python manage.py shell

# Sauvegarde de la base de données
python manage.py dumpdata > backup.json
```

## 🤝 Contribution

Pour contribuer au projet :

1. Fork le repository
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📄 Licence

Ce projet est développé pour le bar d'Arnaud Dumas à Metz. Tous droits réservés.

## 🆘 Support

Pour toute question ou problème :
- Consulter la documentation
- Vérifier les logs : `docker-compose logs`
- Contacter l'équipe de développement

---

**Le Mixologue Augmenté** - Créé avec ❤️ pour révolutionner l'expérience cocktail