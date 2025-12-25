# 🚀 BetterBacklog - Jira Forge App

Une application Forge pour Jira qui utilise l'intelligence artificielle pour analyser et améliorer vos tickets automatiquement.

## ✨ Fonctionnalités

- 🤖 **Analyse IA** : Analyse automatique des tickets Jira avec Claude AI
- 💡 **Suggestions d'amélioration** : Recommandations intelligentes pour enrichir vos descriptions
- 🎨 **Interface moderne** : Design épuré avec animations fluides
- ⚡ **Intégration native** : Panel latéral directement dans Jira

## 📋 Prérequis

- [Node.js](https://nodejs.org/) (v20.x ou supérieur)
- [Forge CLI](https://developer.atlassian.com/platform/forge/getting-started/) installé globalement
- Un compte Atlassian avec accès développeur
- Une clé API Anthropic (pour Claude AI)

## 🛠️ Installation

### 1. Cloner le repository

```bash
git clone https://github.com/votre-username/betterbacklog.git
cd betterbacklog
```

### 2. Installer les dépendances

```bash
# Dépendances racine (backend Forge)
npm install

# Dépendances frontend (React)
cd static/frontend
npm install
cd ../..
```

### 3. Configuration

Créez un fichier `.env` à la racine avec votre clé API :

```env
ANTHROPIC_API_KEY=votre_cle_api_anthropic
```

### 4. Build du frontend

```bash
cd static/frontend
npm run build
cd ../..
```

## 🚀 Développement

### Mode développement avec tunnel

```bash
# Terminal 1 : Démarrer le serveur React en dev
cd static/frontend
npm start

# Terminal 2 : Démarrer le tunnel Forge
cd ../..
forge tunnel
```

Le frontend sera accessible sur `http://localhost:3000` et se synchronisera automatiquement avec Jira via le tunnel Forge.

### Déploiement

```bash
# Build du frontend
cd static/frontend
npm run build
cd ../..

# Déployer sur Forge
forge deploy
```

## 📁 Structure du projet

```
betterbacklog/
├── manifest.yml                 # Configuration Forge
├── src/
│   └── resolvers/
│       └── index.js            # Resolvers backend (API Claude)
├── static/
│   └── frontend/               # Application React
│       ├── src/
│       │   ├── components/
│       │   │   ├── Analyzer/
│       │   │   │   ├── Analyzer.jsx
│       │   │   │   └── Analyzer.module.css
│       │   │   └── ui/
│       │   │       ├── Button.jsx
│       │   │       └── Button.module.css
│       │   ├── services/
│       │   │   ├── api/
│       │   │   │   └── fetchAnalysis.js
│       │   │   ├── hooks/
│       │   │   │   └── useAnalysis.js
│       │   │   └── utils/
│       │   │       └── parseDescription.js
│       │   └── App.jsx
│       ├── public/
│       └── package.json
└── README.md
```

## 🎯 Utilisation

1. Ouvrez un ticket dans Jira
2. Cliquez sur le panel **BetterBacklog** dans la barre latérale
3. Cliquez sur le bouton **"Analyser avec l'IA"**
4. Consultez les suggestions d'amélioration générées par l'IA

## 🧪 Scripts disponibles

### Racine du projet

```bash
npm run format          # Formater tout le code avec Prettier
npm run format:check    # Vérifier le formatage
forge deploy            # Déployer l'application
forge tunnel            # Démarrer le tunnel de développement
forge logs              # Voir les logs de l'application
```

### Frontend (static/frontend)

```bash
npm start              # Démarrer le serveur de développement
npm run build          # Build de production
npm test               # Lancer les tests
npm run format         # Formater le code frontend
```

## 🔧 Configuration Forge

### Permissions requises

- `read:jira-work` : Lecture des tickets Jira
- Accès externe à `https://api.anthropic.com` : Appels API Claude

### Modules

- **Issue Panel** : Panel latéral dans les tickets Jira
- **Function** : Resolver backend pour l'analyse IA

## 🎨 Technologies utilisées

### Frontend

- **React** 18.x
- **@forge/bridge** - Communication avec Jira
- **CSS Modules** - Styles scopés

### Backend

- **Forge Resolver** - Gestion des requêtes
- **@forge/api** - API Atlassian
- **Claude AI (Anthropic)** - Analyse intelligente

### Outils

- **Prettier** - Formatage du code
- **ESLint** - Linting (inclus dans CRA)

## 🐛 Debugging

### Voir les logs en temps réel

```bash
forge logs --follow
```

### Logs frontend

Les logs frontend sont visibles dans la console du navigateur. Filtrez par `[BetterBacklog]` pour voir uniquement vos logs.

### Problèmes courants

#### Le panel ne s'affiche pas

- Vérifiez que l'app est bien déployée : `forge deploy`
- Rafraîchissez la page Jira (Cmd/Ctrl + R)
- Vérifiez les logs : `forge logs`

#### Erreur 401 Unauthorized

- Vérifiez que la permission `read:jira-work` est dans le manifest
- Redéployez : `forge deploy`

#### Le build frontend échoue

```bash
cd static/frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📝 Workflow de développement

1. **Créer une branche**

   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   ```

2. **Développer avec le tunnel**

   ```bash
   cd static/frontend && npm start
   # Dans un autre terminal
   forge tunnel
   ```

3. **Formater le code**

   ```bash
   npm run format
   ```

4. **Tester localement**
   - Ouvrez Jira dans votre navigateur
   - Testez votre fonctionnalité

5. **Commit et push**

   ```bash
   git add .
   git commit -m "feat: description de la fonctionnalité"
   git push origin feature/ma-nouvelle-fonctionnalite
   ```

6. **Créer une Pull Request**

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'feat: Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Convention de commits

Nous utilisons [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage, pas de changement de code
- `refactor:` Refactorisation du code
- `test:` Ajout de tests
- `chore:` Tâches de maintenance

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Auteurs

- **Votre Nom** - _Travail initial_ - [votre-github](https://github.com/votre-username)

## 🙏 Remerciements

- [Atlassian Forge](https://developer.atlassian.com/platform/forge/) pour la plateforme
- [Anthropic](https://www.anthropic.com/) pour l'API Claude
- La communauté open source

## 📞 Support

Pour toute question ou problème :

- Ouvrez une [issue](https://github.com/votre-username/betterbacklog/issues)
- Contactez-nous à : support@votredomaine.com

## 🗺️ Roadmap

- [ ] Support multilingue
- [ ] Templates de suggestions personnalisables
- [ ] Historique des analyses
- [ ] Export des suggestions en PDF
- [ ] Intégration avec Confluence
- [ ] Analyse en batch de plusieurs tickets

---

Fait avec ❤️ par Semb0y(https://github.com/Semb0y)
