#!/bin/bash

# =============================================================================
# SCRIPT DE DÉPLOIEMENT MIXOLOGUE OPTIMISÉ
# =============================================================================
# Script simplifié pour déployer Mixologue avec différentes configurations
# Usage: ./deploy.sh [dev|prod|light|ai|stop|logs]
# =============================================================================

set -euo pipefail

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Fonctions
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

show_usage() {
    echo -e "${BLUE}🐳 Déploiement Mixologue Simplifié${NC}"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start   - Démarrage de l'application"
    echo "  stop    - Arrêt de tous les services"
    echo "  restart - Redémarrage des services"
    echo "  logs    - Affichage des logs"
    echo "  status  - État des services"
    echo "  clean   - Nettoyage complet"
    echo ""
}

check_env() {
    if [[ ! -f ".env" ]]; then
        log_warning "Fichier .env manquant"
        if [[ -f ".env.example" ]]; then
            log_info "Copie de .env.example vers .env"
            cp .env.example .env
            log_warning "Veuillez configurer le fichier .env avant de continuer"
            exit 1
        fi
    fi
}

start_services() {
    log_info "Démarrage de l'application..."
    check_env
    docker-compose up -d --build
    log_success "Application démarrée"
    log_info "Accès: http://localhost:8001"
    log_info "Base de données: localhost:5432"
    log_info "Redis: localhost:6379"
}

restart_services() {
    log_info "Redémarrage des services..."
    docker-compose restart
    log_success "Services redémarrés"
}

stop_services() {
    log_info "Arrêt des services..."
    docker-compose down
    log_success "Services arrêtés"
}

show_logs() {
    docker-compose logs -f
}

show_status() {
    log_info "État des services:"
    docker-compose ps
    echo ""
    log_info "Utilisation des ressources:"
    docker stats --no-stream
}

clean_all() {
    log_warning "Nettoyage complet (suppression des données)..."
    read -p "Êtes-vous sûr ? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v
        docker system prune -f
        log_success "Nettoyage terminé"
    else
        log_info "Nettoyage annulé"
    fi
}

# Main
case "${1:-}" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    clean)
        clean_all
        ;;
    *)
        show_usage
        exit 1
        ;;
esac