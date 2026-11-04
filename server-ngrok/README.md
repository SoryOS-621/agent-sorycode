# server-ngrok

Lance le serveur de développement Next.js du projet **agent-sorycode** et l'expose sur Internet via un tunnel **ngrok**, pour tester l'interface depuis un navigateur externe (mobile, autre machine, etc.).

## Utilisation

```bash
cd server-ngrok
npm install
npm start
```

Le script :

1. Démarre le serveur Next.js (`npm run dev`) sur le port **8085** depuis la racine du projet.
2. Attend que le serveur soit prêt.
3. Ouvre le tunnel ngrok sur le domaine gratuit `broken-september-untreated.ngrok-free.dev`.
4. Affiche l'URL publique du preview.

## Arrêt

`Ctrl+C` : ferme le tunnel et arrête proprement le serveur Next.js.

## Variables utiles

| Variable | Défaut | Description |
|---|---|---|
| `PORT` | `8085` | Port local du serveur Next.js |

> ⚠️ Le token ngrok est inséré directement dans `index.js` à la demande du projet. Pour un repo public, il est recommandé de le déplacer vers la variable d'environnement `NGROK_AUTHTOKEN` et de le régénérer sur [le dashboard ngrok](https://dashboard.ngrok.com/).
