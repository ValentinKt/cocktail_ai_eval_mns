# 🍸 Mixologue Frontend - Guide Débutant

Ce guide vous explique comment lancer le frontend React du projet Mixologue étape par étape.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

1. **Node.js** (version 18 ou supérieure)
   - Téléchargez depuis : https://nodejs.org/
   - Vérifiez l'installation : `node --version`

2. **npm** (inclus avec Node.js)
   - Vérifiez l'installation : `npm --version`

3. **Git** (pour cloner le projet)
   - Téléchargez depuis : https://git-scm.com/

## 🚀 Installation et Lancement - Étape par Étape

### Étape 1 : Cloner le projet (si pas déjà fait)

```bash
# Cloner le repository
git clone [URL_DU_REPOSITORY]
cd mixologue
```

### Étape 2 : Naviguer vers le dossier frontend

```bash
cd frontend
```

### Étape 3 : Installer les dépendances

```bash
# Installer toutes les dépendances du projet
npm install
```

⏳ **Cette étape peut prendre quelques minutes la première fois**

### Étape 4 : Configurer les variables d'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env
```

📝 **Optionnel** : Modifiez le fichier `.env` si nécessaire :
```bash
# API Configuration
VITE_API_URL=http://127.0.0.1:8001

# Development Settings
VITE_DEV_MODE=true
```

### Étape 5 : Lancer le serveur de développement

```bash
# Démarrer le serveur de développement
npm run dev
```

✅ **Le frontend sera accessible sur : http://localhost:5173**

## 🛠️ Commandes Utiles

### Développement
```bash
# Lancer en mode développement (avec hot-reload)
npm run dev

# Vérifier les erreurs de code
npm run lint

# Construire pour la production
npm run build

# Prévisualiser la version de production
npm run preview
```

### Gestion des dépendances
```bash
# Installer une nouvelle dépendance
npm install nom-du-package

# Installer une dépendance de développement
npm install --save-dev nom-du-package

# Mettre à jour les dépendances
npm update
```

## 🔧 Structure du Projet

```
frontend/
├── src/
│   ├── components/     # Composants React réutilisables
│   ├── contexts/       # Contextes React (état global)
│   ├── services/       # Services API
│   ├── types/          # Types TypeScript
│   ├── assets/         # Images, icônes, etc.
│   ├── App.tsx         # Composant principal
│   └── main.tsx        # Point d'entrée
├── public/             # Fichiers statiques
├── package.json        # Configuration npm
├── vite.config.ts      # Configuration Vite
├── tailwind.config.js  # Configuration Tailwind CSS
└── tsconfig.json       # Configuration TypeScript
```

## 🌐 Connexion avec le Backend

**Important** : Pour que le frontend fonctionne correctement, le backend Django doit être lancé :

1. **Naviguez vers le dossier backend** :
   ```bash
   cd ../mixologue_improved
   ```

2. **Lancez le backend avec Docker** :
   ```bash
   ./deploy.sh start
   ```

3. **Vérifiez que l'API est accessible** :
   - Backend : http://localhost:8001
   - Frontend : http://localhost:5173

## 🐛 Résolution de Problèmes

### Erreur : "npm command not found"
- **Solution** : Installez Node.js depuis https://nodejs.org/

### Erreur : "Port 5173 already in use"
- **Solution** : Arrêtez les autres serveurs ou changez le port :
  ```bash
  npm run dev -- --port 3000
  ```

### Erreur : "Cannot connect to API"
- **Vérifiez** que le backend est lancé sur http://localhost:8001
- **Vérifiez** le fichier `.env` pour l'URL de l'API

### Erreur de dépendances
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Erreurs TypeScript
```bash
# Vérifier les types
npx tsc --noEmit
```

## 📱 Technologies Utilisées

- **React 19** - Framework JavaScript
- **TypeScript** - Typage statique
- **Vite** - Outil de build rapide
- **Tailwind CSS** - Framework CSS
- **Axios** - Client HTTP
- **React Router** - Navigation
- **Formik + Yup** - Gestion des formulaires

## 🎯 Première Utilisation

1. **Lancez le backend** (voir section connexion)
2. **Lancez le frontend** : `npm run dev`
3. **Ouvrez votre navigateur** : http://localhost:5173
4. **Créez un compte** ou connectez-vous
5. **Explorez l'application** !

## 📚 Ressources Supplémentaires

- [Documentation React](https://react.dev/)
- [Documentation TypeScript](https://www.typescriptlang.org/docs/)
- [Documentation Vite](https://vitejs.dev/)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)

---

**Besoin d'aide ?** Consultez les logs dans la console du navigateur (F12) ou les logs du terminal pour plus d'informations sur les erreurs.
