# server-ngrok

Lance le serveur de développement Next.js du projet **agent-sorycode** et l'expose sur Internet via un tunnel **ngrok**, pour tester l'interface depuis un navigateur externe (mobile, autre machine, etc.).

## 🚀 Dans un GitHub Codespace

Le repo contient une config `.devcontainer/` : tout est installé automatiquement à la création du Codespace.

1. Sur la page du repo : **Code → Codespaces → Create codespace on main**
2. Une fois prêt (dépendances installées par `postCreateCommand`), dans le terminal :

```bash
npm run dev -- -p 8085
```

3. **Option A (Codespaces)** : VS Code affiche une notification pour le port 8085 → "Open in Browser" ; ou onglet **PORTS** → clic droit sur 8085 → **Port Visibility → Public** pour un URL accessible depuis n'importe quel navigateur externe.

4. **Option B (ngrok, URL fixe)** : dans un **second terminal** :

```bash
cd server-ngrok
npm start
```

> `npm start` lance aussi le serveur Next.js tout seul — utilise-le seul si le serveur n'est pas déjà démarré, sinon il y aura un conflit de port.

Le preview ngrok est disponible sur :
**https://broken-september-untreated.ngrok-free.dev**

## En local

```bash
cd server-ngrok
npm install
npm start
```

## Arrêt

`Ctrl+C` : ferme le tunnel et arrête proprement le serveur Next.js.

| Variable | Défaut | Description |
|---|---|---|
| `PORT` | `8085` | Port local du serveur Next.js |

> ⚠️ Le token ngrok est inséré directement dans `index.js` à la demande du projet. Pour un repo public, il est recommandé de le déplacer vers la variable d'environnement `NGROK_AUTHTOKEN` et de le régénérer sur [le dashboard ngrok](https://dashboard.ngrok.com/).
