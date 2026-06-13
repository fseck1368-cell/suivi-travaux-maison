# Suivi Travaux Maison (Chantier)

Application web de suivi de travaux de construction en temps réel.

**Stack technique :**
- Backend : Node.js + Express.js + Socket.io + MongoDB
- Frontend : Vue.js 3 + Pinia + Vue Router
- Temps réel : Socket.io (avancement live, chat, notifications)

## Prérequis

- Node.js >= 18
- MongoDB (local ou Atlas)
- npm

## Installation & Lancement

### Backend

```bash
cd backend
npm install
```

Copier `.env.example` vers `.env` et configurer la connexion MongoDB :
```bash
cp .env.example .env
```

Lancer les seeders (données de démo) :
```bash
npm run seed
```

Démarrer le serveur :
```bash
npm run dev
```

Le backend tourne sur `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend tourne sur `http://localhost:5173`

## Comptes de test (après seed)

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Maître d'ouvrage | mamadou@test.com | password123 |
| Maître d'oeuvre | fatou@test.com | password123 |
| Artisan (Maçonnerie) | ibrahima@test.com | password123 |
| Artisan (Plomberie) | ousmane@test.com | password123 |

## Fonctionnalités

- Gestion de projets, phases et tâches
- Avancement en temps réel (Socket.io)
- Messagerie instantanée par projet
- Suivi budget et dépenses
- Rapports journaliers avec photos
- Rôles : maître d'ouvrage, maître d'oeuvre, artisan
- JWT pour l'authentification

## Endpoints API

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /api/v1/auth/register | Inscription |
| POST | /api/v1/auth/login | Connexion |
| GET | /api/v1/projets | Liste des projets |
| GET | /api/v1/projets/:id | Détail projet + phases + tâches |
| POST | /api/v1/projets | Créer un projet |
| POST | /api/v1/phases | Créer une phase |
| POST | /api/v1/taches | Créer une tâche |
| PUT | /api/v1/taches/:id | Mettre à jour avancement |
| POST | /api/v1/depenses | Ajouter une dépense |
| POST | /api/v1/rapports | Rapport journalier |
| GET | /api/v1/projets/dashboard | Statistiques globales |

## WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| join-projet | Client → Serveur | Rejoindre la room du projet |
| avancement | Bidirectionnel | Mise à jour % en temps réel |
| tache-terminee | Serveur → Client | Notification tâche à 100% |
| message | Bidirectionnel | Chat en temps réel |
| typing | Bidirectionnel | Indicateur de saisie |

## Structure du projet

```
suivi-travaux-maison/
├── backend/
│   ├── src/
│   │   ├── config/       # Connexion DB
│   │   ├── controllers/  # Logique métier
│   │   ├── middleware/    # Auth JWT, upload
│   │   ├── models/        # Schémas Mongoose
│   │   ├── routes/        # Routes Express
│   │   ├── sockets/       # Socket.io handlers
│   │   ├── utils/         # Seeders
│   │   └── server.js      # Point d'entrée
│   └── uploads/           # Fichiers uploadés
├── frontend/
│   ├── src/
│   │   ├── assets/        # CSS global
│   │   ├── components/    # Layout
│   │   ├── views/         # Pages
│   │   ├── stores/        # Pinia
│   │   ├── services/      # API + Socket
│   │   ├── router/        # Vue Router
│   │   └── main.js
│   └── index.html
└── README.md
```

## Auteur

Projet L3 ISI — Technologies Web Backend | Année 2025-2026
