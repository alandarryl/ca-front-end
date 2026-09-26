
---

# CompanyAudit — Frontend Client

Frontend web réactif et moderne pour l'application **CompanyAudit**, construit avec **Next.js 14** (App Router) et **Tailwind CSS**.

L'interface permet aux utilisateurs de configurer leurs paramètres d'analyse (choix de l'entreprise, fournisseur d'IA, modèle LLM et objectif métier), de visualiser dynamiquement le rapport d'audit sous forme de cartes claires et d'exporter ou prévisualiser le document au format PDF.

---

## Stack Technique

* **Next.js 14** (App Router) — Framework React avec rendu hybride et gestion moderne des routes.
* **React 18** — Bibliothèques d'interface avec gestion d'état locale (`useState`, `useEffect`).
* **Tailwind CSS** — Framework CSS utilitaire pour un design épuré, responsive et prêt pour le mode sombre.
* **Lucide React** — Collection d'icônes vectorielles modernes et légères.
* **Fetch API & Blob Storage** — Communication asynchrone avec l'API FastAPI et manipulation de flux binaires pour l'aperçu/téléchargement direct des fichiers PDF.

---

## Architecture du Projet

```text
company-audit-front/
│
├── app/
│   ├── favicon.ico       → Icône de l'application
│   ├── globals.css       → Directives Tailwind CSS et styles globaux
│   ├── layout.js         → Layout principal (structure HTML, métadonnées, police)
│   └── page.js           → Page unique interactive (Formulaire + Rapport d'audit)
│
├── lib/
│   └── api.js            → Client API centralisant les appels HTTP vers le backend FastAPI
│
├── public/               → Actifs statiques (images, logos, SVG)
│
├── .env.local            → Variables d'environnement locales (URL du backend)
├── .gitignore            → Exclusion des dépendances, builds et variables d'environnement
├── jsconfig.json         → Configuration des alias d'importation (`@/lib/api`, etc.)
├── next.config.js        → Configuration du serveur et du build Next.js
├── package.json          → Dépendances et scripts de démarrage
└── tailwind.config.js    → Configuration du thème et des plugins Tailwind CSS

```

---

## Fonctionnalités Clés

1. **Auto-Détection des Modèles LLM** : Récupération dynamique au chargement (`GET /api/models`) de la liste des modèles installés localement via Ollama ainsi que des modèles Gemini disponibles dans le cloud.
2. **Formulaire de Configuration Intuitif** : Sélection fluide du fournisseur (`ollama` ou `gemini`), du modèle adapté et de l'objectif métier (`entretien`, `candidature`, `collaboration`, `etude_marche`, `general`).
3. **Affichage Interactif du Rapport** : Rendu dynamique et structuré des 8 sections clés d'audit sous forme de cartes d'information intelligentes (support du texte brut, des listes et des dictionnaires clé-valeur).
4. **Prévisualisation PDF Native** : Ouverture immédiate du rapport PDF généré par le backend dans un nouvel onglet du navigateur sans déclencher de téléchargement forcé.
5. **Téléchargement Direct du PDF** : Exportation en un clic avec nommage automatique personnalisé (`audit_nom_entreprise.pdf`).
6. **Interface Full Responsive & Mode Sombre Native** : Optimisée pour ordinateurs, tablettes et mobiles avec adaptation automatique aux préférences système (Dark Mode).

---

## Installation & Configuration

### 1. Prérequis

* **Node.js** 18.17+ ou supérieur
* Le serveur **Backend FastAPI** en cours d'exécution sur `[http://127.0.0.1:8000](http://127.0.0.1:8000)`

### 2. Préparez le projet

```powershell
# Cloner le dépôt et accéder au dossier
cd company-audit-front

# Installer les dépendances
npm install

```

### 3. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

```

---

## Lancer le Projet

Exécutez le serveur de développement Next.js :

```powershell
npm run dev

```

Ouvrez ensuite votre navigateur à l'adresse : **`http://localhost:3000`**

---

## Scripts Disponibles

* `npm run dev` : Lance le serveur de développement local avec rechargement à chaud (Hot Reload).
* `npm run build` : Compile et optimise l'application pour la production.
* `npm run start` : Démarre le serveur Node.js de production après un build.
* `npm run lint` : Exécute le linter ESLint pour vérifier la qualité du code.

---

## Notes Importantes

* **Liaison avec le Backend** : Assurez-vous que le backend FastAPI autorise les requêtes originaires de `http://localhost:3000` via son middleware CORS (`CORSMiddleware`).
* **Gestion du Cache & Ollama** : Si l'instance local Ollama n'est pas démarrée sur votre machine hôte, le sélecteur basculera par défaut sur l'option Gemini (sous réserve d'avoir configuré la clé d'API côté backend).

---

## Pistes d'Évolution

* Ajout d'un historique d'audits sauvegardé localement dans le `localStorage` pour retrouver ses recherches précédentes sans refaire d'appel API.
* Implémentation d'un système de favoris et d'exportation au format Markdown / JSON.
* Ajout d'un bouton de comparaison côte à côte entre deux entreprises concurrentes.