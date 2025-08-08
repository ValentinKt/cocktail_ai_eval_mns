# Construction multi-étapes pour une image de production optimisée
# Étape 1: Construction des dépendances
FROM python:3.13-slim as builder

# Définir les arguments de construction
ARG BUILDPLATFORM
ARG TARGETPLATFORM

# Installer les dépendances de construction
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libpq-dev \
    python3-dev \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Créer l'environnement virtuel Python
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Mettre à jour pip et installer wheel
RUN pip install --upgrade pip setuptools wheel

# Copier et installer les dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Étape 2: Image de production
FROM python:3.13-slim as production

# Définir les variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONHASHSEED=random \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    DJANGO_SETTINGS_MODULE=mixologue_improved.settings

# Installer les outils système nécessaires
RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copier l'environnement virtuel depuis l'étape de construction
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Créer le répertoire de l'application
WORKDIR /app

# Créer un utilisateur non-root pour la sécurité
RUN groupadd -r appuser && useradd -r -g appuser -d /app -s /bin/bash appuser

# Copier le code de l'application avec les bonnes permissions
COPY --chown=appuser:appuser . .

# Créer les répertoires nécessaires avec les bonnes permissions
RUN mkdir -p /app/logs /app/staticfiles /app/mediafiles && \
    chown -R appuser:appuser /app/logs /app/staticfiles /app/mediafiles

# Basculer vers l'utilisateur non-root
USER appuser

# Collecter les fichiers statiques
RUN python manage.py collectstatic --noinput --clear

# Vérification de santé du conteneur
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8001/health/ || exit 1

# Exposer le port
EXPOSE 8001

# Utiliser la forme exec pour une meilleure gestion des signaux
CMD ["gunicorn", \
     "--bind", "0.0.0.0:8001", \
     "--workers", "4", \
     "--worker-class", "sync", \
     "--worker-connections", "1000", \
     "--max-requests", "1000", \
     "--max-requests-jitter", "100", \
     "--timeout", "30", \
     "--keep-alive", "2", \
     "--log-level", "info", \
     "--access-logfile", "-", \
     "--error-logfile", "-", \
     "mixologue_improved.wsgi:application"]