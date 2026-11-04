/**
 * server-ngrok — Lance le serveur Next.js (agent-sorycode) et l'expose
 * via un tunnel ngrok pour un preview depuis un navigateur externe.
 *
 * Usage :
 *   cd server-ngrok
 *   npm install
 *   npm start
 *
 * Le serveur Next.js démarre sur le port 8085 (PORT), puis le tunnel
 * ngrok est ouvert sur le domaine gratuit configuré ci-dessous.
 */
const { spawn } = require("child_process");
const http = require("http");
const path = require("path");

const ngrok = require("@ngrok/ngrok");

// ── Configuration ────────────────────────────────────────────────
const PORT = process.env.PORT || 8085;
const NGROK_AUTHTOKEN = "3LBxZqJUALKOorT1Wrhun4sW7Sr_UUfD1hVY5FYD5o7b1maA";
const NGROK_DOMAIN = "broken-september-untreated.ngrok-free.dev";
const REPO_ROOT = path.resolve(__dirname, "..");
// ─────────────────────────────────────────────────────────────────

let nextProcess = null;

function startNextDevServer() {
  console.log(`> Démarrage de Next.js sur le port ${PORT} ...`);
  // npm run dev -- -p PORT  (depuis la racine du projet)
  const isWin = process.platform === "win32";
  nextProcess = spawn(isWin ? "npm.cmd" : "npm", ["run", "dev", "--", "-p", String(PORT)], {
    cwd: REPO_ROOT,
    stdio: "inherit",
    env: { ...process.env, PORT: String(PORT) },
  });

  nextProcess.on("exit", (code) => {
    console.log(`Serveur Next.js arrêté (code ${code}).`);
    process.exit(code === null ? 1 : code);
  });
}

function waitForServer(port, host = "127.0.0.1", timeoutMs = 120000) {
  const startedAt = Date.now();
  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      const req = http.get({ host, port, path: "/", timeout: 3000 }, (res) => {
        res.resume();
        resolve();
      });
      req.on("error", () => {
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error(`Le serveur n'a pas démarré sur le port ${port} en ${timeoutMs / 1000}s`));
        } else {
          setTimeout(tryConnect, 1500);
        }
      });
    };
    tryConnect();
  });
}

async function forwardToApp() {
  const forwarder = await ngrok.forward({
    addr: `localhost:${PORT}`,
    authtoken: NGROK_AUTHTOKEN,
    domain: NGROK_DOMAIN,
  });
  console.log("──────────────────────────────────────────────");
  console.log(`✅ Preview disponible sur : ${forwarder.url()}`);
  console.log("──────────────────────────────────────────────");
}

async function main() {
  startNextDevServer();

  try {
    await waitForServer(PORT);
    console.log(`✅ Serveur Next.js prêt sur http://localhost:${PORT}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  try {
    await forwardToApp();
  } catch (err) {
    console.error("Erreur ngrok :", err.message);
    process.exit(1);
  }
}

// Arrêt propre : tue le serveur Next.js et ferme le tunnel
async function shutdown() {
  console.log("\nArrêt en cours ...");
  try { await ngrok.disconnect(); } catch (_) {}
  try { await ngrok.kill(); } catch (_) {}
  if (nextProcess) nextProcess.kill("SIGTERM");
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

main();
