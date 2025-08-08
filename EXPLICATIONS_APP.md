# 🚀 Guide Complet pour Débutants - Lancement du Projet Mixologue

Ce guide vous accompagne pas à pas pour lancer le projet Mixologue, une application de création de cocktails avec IA.

## 📋 Prérequis

Avant de commencer, vous devez installer les outils suivants sur votre ordinateur :

### 1. Git
```bash
# Sur macOS avec Homebrew
brew install git

# Sur Ubuntu/Debian
sudo apt update && sudo apt install git

# Vérifier l'installation
git --version
```

### 2. Docker Desktop
1. Téléchargez Docker Desktop depuis [docker.com](https://www.docker.com/products/docker-desktop/)
2. Installez et lancez Docker Desktop
3. Vérifiez l'installation :
```bash
docker --version
docker-compose --version
```

### 3. Node.js (pour le frontend)
```bash
# Sur macOS avec Homebrew
brew install node

# Sur Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier l'installation
node --version
npm --version
```

### 4. Python 3.9+ (optionnel, pour le développement)
```bash
# Sur macOS avec Homebrew
brew install python@3.11

# Sur Ubuntu/Debian
sudo apt update && sudo apt install python3.11 python3.11-pip

# Vérifier l'installation
python3 --version
pip3 --version
```

## 📥 Téléchargement du Projet

### Étape 1 : Cloner le repository
```bash
# Cloner le projet
git clone <URL_DU_REPOSITORY>
cd mixologue
```

### Étape 2 : Explorer la structure
```bash
# Voir la structure du projet
ls -la

# Vous devriez voir :
# - frontend/          (Application React)
# - mixologue_improved/ (Application Django)
# - README.md
# - etc.
```

## ⚙️ Configuration

### Étape 3 : Configuration du Backend Django
```bash
# Aller dans le dossier backend
cd mixologue_improved

# Copier le fichier d'exemple d'environnement
cp .env.example .env

# Éditer le fichier .env avec vos paramètres
nano .env  # ou code .env si vous utilisez VS Code
```

**Variables importantes à configurer dans `.env` :**
```env
# Base de données
POSTGRES_DB=mixologue
POSTGRES_USER=mixologue_user
POSTGRES_PASSWORD=votre_mot_de_passe_securise

# Redis
REDIS_PASSWORD=votre_mot_de_passe_redis

# Django
SECRET_KEY=votre_cle_secrete_django_tres_longue_et_aleatoire
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# IA (optionnel)
OPENAI_API_KEY=votre_cle_openai_si_vous_en_avez_une
```

### Étape 4 : Configuration du Frontend React
```bash
# Aller dans le dossier frontend
cd ../frontend

# Copier le fichier d'exemple d'environnement
cp .env.example .env

# Éditer le fichier .env
nano .env  # ou code .env
```

**Variables importantes à configurer dans `frontend/.env` :**
```env
VITE_API_URL=http://localhost:8001
VITE_APP_NAME=Mixologue
```

## 🚀 Méthodes de Lancement

Vous avez plusieurs options pour lancer le projet :

### Option 1 : Développement Hybride (Recommandé pour débuter)

Cette méthode lance le backend avec Docker et le frontend en local.

```bash
# 1. Lancer le backend Django avec Docker
cd mixologue_improved
./deploy.sh light  # Lance sans les services IA

# 2. Dans un nouveau terminal, lancer le frontend
cd frontend
npm install  # Installer les dépendances (première fois seulement)
npm run dev  # Lancer le serveur de développement
```

**Accès :**
- Frontend : http://localhost:5173
- Backend API : http://localhost:8001
- Admin Django : http://localhost:8001/admin

### Option 2 : Développement Complet avec Docker

```bash
# Lancer tout avec Docker
cd mixologue_improved
./deploy.sh dev
```

**Accès :**
- Application complète : http://localhost:80
- Admin Django : http://localhost:80/admin

### Option 3 : Production Légère

```bash
# Lancer en mode production sans IA
cd mixologue_improved
./deploy.sh prod
```

### Option 4 : Production avec IA (Nécessite GPU)

```bash
# Lancer avec tous les services IA
cd mixologue_improved
./deploy.sh ai
```

## 🔧 Commandes Utiles

### Gestion des Services Docker
```bash
# Voir l'état des services
./deploy.sh status

# Voir les logs
./deploy.sh logs

# Arrêter tous les services
./deploy.sh stop

# Nettoyage complet
./deploy.sh clean
```

### Gestion de la Base de Données
```bash
# Appliquer les migrations (première fois)
docker-compose exec web python manage.py migrate

# Créer un superutilisateur
docker-compose exec web python manage.py createsuperuser

# Collecter les fichiers statiques
docker-compose exec web python manage.py collectstatic
```

### Développement Frontend
```bash
cd frontend

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Construire pour la production
npm run build

# Prévisualiser la build de production
npm run preview
```

## 🐛 Résolution de Problèmes

### Problème : Port déjà utilisé
```bash
# Trouver le processus utilisant le port 8001
lsof -i :8001

# Tuer le processus (remplacer PID par l'ID du processus)
kill -9 PID
```

### Problème : Docker ne démarre pas
```bash
# Vérifier que Docker Desktop est lancé
docker info

# Redémarrer Docker Desktop si nécessaire
```

### Problème : Erreur de permissions
```bash
# Donner les bonnes permissions au script
chmod +x deploy.sh

# Corriger les permissions des fichiers
sudo chown -R $USER:$USER .
```

### Problème : Base de données corrompue
```bash
# Supprimer les volumes Docker et recommencer
docker-compose down -v
./deploy.sh light
```

## 📚 Première Utilisation

### 1. Créer un compte administrateur
```bash
# Après avoir lancé l'application
docker-compose exec web python manage.py createsuperuser
```

### 2. Accéder à l'interface d'administration
1. Allez sur http://localhost:8001/admin (ou http://localhost/admin selon votre configuration)
2. Connectez-vous avec vos identifiants administrateur
3. Vous pouvez maintenant gérer les cocktails, utilisateurs, etc.

### 3. Tester l'API
```bash
# Tester l'endpoint de santé
curl http://localhost:8001/health/

# Lister les cocktails
curl http://localhost:8001/api/cocktails/
```

## 🎯 Étapes Recommandées pour un Débutant

1. **Commencez simple** : Utilisez l'Option 1 (Développement Hybride)
2. **Testez l'application** : Créez quelques cocktails via l'interface
3. **Explorez l'admin** : Familiarisez-vous avec l'interface Django Admin
4. **Consultez les logs** : Utilisez `./deploy.sh logs` pour comprendre ce qui se passe
5. **Expérimentez** : Modifiez le code et voyez les changements en temps réel

## 📖 Ressources Supplémentaires

- **Choix techniques** : Consultez `CHOIX.md`

## 🆘 Besoin d'Aide ?

Si vous rencontrez des problèmes :
1. Vérifiez les logs avec `./deploy.sh logs`
2. Consultez la section "Résolution de Problèmes" ci-dessus
3. Assurez-vous que tous les prérequis sont installés
4. Vérifiez que Docker Desktop est bien lancé

---
# CONCLUSION

## 🚀 Lancement Rapide pour Utilisateurs Novices

**Cette section est très importante pour un utilisateur débutant !**

### Étape 1 : Télécharger et lancer Ollama
1. Téléchargez Ollama depuis [ollama.ai](https://ollama.ai/)
2. Installez Ollama sur votre système
3. Lancez Ollama et téléchargez le modèle :
```bash
ollama pull llama3.1:latest
```

### Étape 2 : Lancer le Backend Django
Ouvrez un premier terminal et exécutez :
```bash
cd mixologue/mixologue_improved
source venv/bin/activate && python manage.py runserver 0.0.0.0:8001
```

### Étape 3 : Lancer le Frontend React
Ouvrez un second terminal et exécutez :
```bash
cd frontend
npm run dev
```

### Accès à l'Application
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:8001
- **Admin Django** : http://localhost:8001/admin

**C'est tout ! Votre application Mixologue est maintenant prête à être utilisée.**bash