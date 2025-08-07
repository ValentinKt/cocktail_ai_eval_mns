# CHOIX.md - Documentation des Commandes et Librairies

## Mixologue Augmenté - Choix Techniques et Commandes

### 🔄 Architecture Complète

```
Mixologue Augmenté
├── Backend (Django)
│   ├── API REST
│   ├── Modèles de données
│   ├── Intégration OpenAI
│   └── Templates Django (version initiale)
└── Frontend (React + TypeScript)
    ├── Interface utilisateur moderne
    ├── Gestion d'état
    ├── Validation de formulaires
    └── Communication API
```

### 🚀 Commandes de Développement

#### 1. Initialisation du Projet Django
```bash
django-admin startproject mixologue_improved
cd mixologue_improved
```
**Explication :** Crée la structure de base d'un projet Django avec les fichiers de configuration essentiels (settings.py, urls.py, wsgi.py, etc.)

#### 2. Création de l'Application Cocktails
```bash
python manage.py startapp cocktails
```
**Explication :** Génère une nouvelle application Django avec la structure MVC (models.py, views.py, admin.py, etc.) pour gérer la logique métier des cocktails

#### 3. Création du Frontend React
```bash
# Création du dossier frontend
mkdir frontend
cd frontend

# Initialisation du projet Vite avec React + TypeScript
npm create vite@latest . -- --template react-ts

# Installation des dépendances de base
npm install

# Installation de Tailwind CSS
npm install tailwindcss postcss autoprefixer @tailwindcss/vite

# Installation des dépendances pour l'application
npm install react-router-dom formik axios yup
npm install @types/react-router-dom
```
**Explication :** Configure l'environnement frontend React avec TypeScript, Tailwind CSS et les librairies nécessaires pour l'interface utilisateur moderne

#### 3. Migrations de Base de Données
```bash
python manage.py makemigrations
```
**Explication :** Analyse les modèles Django et génère les fichiers de migration SQL pour créer/modifier les tables de base de données

```bash
python manage.py migrate
```
**Explication :** Applique les migrations à la base de données, créant effectivement les tables et colonnes définies dans les modèles

#### 4. Démarrage du Serveur de Développement
```bash
python manage.py runserver
```
**Explication :** Lance le serveur de développement Django sur http://127.0.0.1:8000/ avec rechargement automatique des fichiers

#### 5. Installation des Dépendances
```bash
pip install -r requirements.txt
```
**Explication :** Installe toutes les librairies Python listées dans requirements.txt avec leurs versions spécifiées

```bash
pip install dj-database-url
```
**Explication :** Installation spécifique de la librairie pour parser les URLs de base de données (nécessaire pour PostgreSQL en production)

### 📦 Librairies et Dépendances

#### Core Framework
- **Django>=4.2,<5.0**
  - Framework web Python complet avec ORM, système de templates, authentification
  - Choisi pour sa robustesse, sécurité et écosystème mature

#### Intelligence Artificielle
- **openai>=1.0.0**
  - SDK officiel OpenAI pour l'intégration GPT
  - Utilisé pour générer des recettes de cocktails créatives avec ambiance musicale

#### Base de Données
- **psycopg2-binary>=2.9.0**
  - Adaptateur PostgreSQL pour Python
  - Permet la connexion à PostgreSQL en production (plus robuste que SQLite)

- **dj-database-url>=2.1.0**
  - Parse les URLs de base de données (format DATABASE_URL)
  - Facilite la configuration multi-environnement (dev/prod)

#### Déploiement et Production
- **gunicorn>=21.0.0**
  - Serveur WSGI Python pour la production
  - Remplace le serveur de développement Django en production

- **django-cors-headers>=4.0.0**
  - Gestion des requêtes Cross-Origin Resource Sharing
  - Nécessaire si frontend et backend sont sur des domaines différents

#### Utilitaires
- **python-dotenv>=1.0.0**
  - Charge les variables d'environnement depuis un fichier .env
  - Sécurise la gestion des clés API et configurations sensibles

- **django-environ>=0.11.0**
  - Gestion avancée des variables d'environnement pour Django
  - Alternative à python-dotenv avec plus de fonctionnalités

- **Pillow>=10.0.0**
  - Librairie de traitement d'images Python
  - Nécessaire pour les champs ImageField de Django

- **requests>=2.31.0**
  - Librairie HTTP simple et élégante
  - Utilisée pour les appels API externes si nécessaire

### 🐳 Commandes Docker

#### 1. Construction de l'Image
```bash
docker build -t mixologue-app .
```
**Explication :** Construit l'image Docker à partir du Dockerfile, installe les dépendances et configure l'environnement

#### 2. Démarrage avec Docker Compose
```bash
docker-compose up -d
```
**Explication :** Lance tous les services (web, db, nginx) en arrière-plan selon la configuration docker-compose.yml

#### 3. Arrêt des Services
```bash
docker-compose down
```
**Explication :** Arrête et supprime tous les conteneurs, réseaux créés par docker-compose

#### 4. Logs des Services
```bash
docker-compose logs -f web
```
**Explication :** Affiche les logs du service web en temps réel pour le débogage

### 🔧 Commandes de Maintenance

#### 1. Collecte des Fichiers Statiques
```bash
python manage.py collectstatic --noinput
```
**Explication :** Rassemble tous les fichiers CSS, JS, images dans un dossier unique pour la production

#### 2. Création d'un Superutilisateur
```bash
python manage.py createsuperuser
```
**Explication :** Crée un compte administrateur pour accéder à l'interface d'administration Django

#### 3. Shell Django Interactif
```bash
python manage.py shell
```
**Explication :** Lance un shell Python avec le contexte Django chargé pour tester les modèles et requêtes

### 🌐 Configuration Nginx

```nginx
upstream web {
    server web:8000;
}
```
**Explication :** Définit un groupe de serveurs backend (ici le conteneur Django) pour la répartition de charge

```nginx
location /static/ {
    alias /app/staticfiles/;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```
**Explication :** Configure le cache des fichiers statiques pour 1 an, améliore les performances

### 📊 Variables d'Environnement

#### Développement (.env)
```bash
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
OPENAI_API_KEY=your-openai-api-key
```

#### Production
```bash
SECRET_KEY=production-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgres://user:pass@host:port/dbname
OPENAI_API_KEY=your-openai-api-key
```

### 🎯 Choix Architecturaux

#### Frontend (React + TypeScript)
- **React 18** : Bibliothèque UI moderne avec hooks
- **TypeScript** : Typage statique pour robustesse
- **Vite** : Build tool rapide et moderne
- **Tailwind CSS** : Framework CSS utility-first
- **React Router** : Navigation côté client
- **Formik + Yup** : Gestion et validation de formulaires
- **Axios** : Client HTTP pour API

#### Backend (Django)
- **Django ORM** : Abstraction de base de données robuste et sécurisée
- **SQLite (dev) / PostgreSQL (prod)** : Base de données simple en développement, robuste en production
- **Django REST Framework** : API REST pour communication frontend
- **CORS** : Configuration pour communication cross-origin

#### Déploiement
- **Docker Multi-Stage** : Images optimisées et reproductibles
- **Nginx + Gunicorn** : Stack de production éprouvée et performante
- **Variables d'environnement** : Configuration flexible selon l'environnement

### 🔒 Sécurité

#### Headers de Sécurité (Production)
```python
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_HSTS_SECONDS = 31536000
```
**Explication :** Protection contre XSS, clickjacking, et force HTTPS pendant 1 an

#### Gestion des Secrets
- Clés API dans variables d'environnement
- SECRET_KEY généré automatiquement si absent
- DEBUG=False en production automatiquement

### 📝 Logging

```python
LOGGING = {
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'django.log',
        },
    },
}
```
**Explication :** Logs des erreurs et informations dans un fichier pour le débogage et monitoring

---

**Note :** Ce document détaille tous les choix techniques, commandes et configurations utilisés dans le projet Mixologue Augmenté. Chaque élément a été sélectionné pour optimiser les performances, la sécurité et la maintenabilité de l'application.