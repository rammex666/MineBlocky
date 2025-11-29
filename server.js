const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Autorise ton HTML à parler au serveur


app.use(express.static(__dirname));


const PORT = 3000;
const TEMPLATE_DIR = path.join(__dirname, 'templates', 'maven-base');
const BUILD_DIR = path.join(__dirname, 'temp_builds');

// Nettoyage au démarrage
fs.emptyDirSync(BUILD_DIR);

app.post('/compile', async (req, res) => {
    const { javaCode, pluginName } = req.body;
    const buildId = uuidv4();
    const workDir = path.join(BUILD_DIR, buildId);

    console.log(`[${buildId}] Nouvelle compilation demandée : ${pluginName}`);

    try {
        // 1. Copier le template Maven
        await fs.copy(TEMPLATE_DIR, workDir);

        // 2. Créer l'arborescence des dossiers Java (package com.mineblockly.plugin)
        const javaFileDir = path.join(workDir, 'src', 'main', 'java', 'com', 'mineblockly', 'plugin');
        await fs.ensureDir(javaFileDir);

        // 3. Écrire le fichier Java
        await fs.writeFile(path.join(javaFileDir, 'GeneratedPlugin.java'), javaCode);

        // 4. Écrire le plugin.yml
        const pluginYmlContent = `name: ${pluginName}\nversion: 1.0\nmain: com.mineblockly.plugin.GeneratedPlugin\napi-version: 1.20`;
        await fs.writeFile(path.join(workDir, 'src', 'main', 'resources', 'plugin.yml'), pluginYmlContent);

        // 5. Lancer Maven (Compilation)
        // Note: Sur Windows c'est "mvn.cmd", sur Linux/Mac c'est "mvn"
        const mvnCommand = process.platform === 'win32' ? 'mvn.cmd' : 'mvn';

        exec(`${mvnCommand} clean package`, { cwd: workDir }, (error, stdout, stderr) => {
            if (error) {
                console.error(`[${buildId}] Erreur Maven:`, stdout); // stdout contient souvent plus de détails que stderr pour Maven
                return res.status(500).send("Erreur de compilation:\n" + stdout);
            }

            // 6. Trouver le .jar généré
            const targetDir = path.join(workDir, 'target');
            const jarFile = fs.readdirSync(targetDir).find(file => file.endsWith('.jar') && !file.includes('original'));

            if (jarFile) {
                console.log(`[${buildId}] Succès ! Envoi du fichier.`);
                res.download(path.join(targetDir, jarFile), `${pluginName}.jar`, (err) => {
                    // Nettoyage optionnel après envoi (désactivé pour debug)
                    // fs.remove(workDir);
                });
            } else {
                res.status(500).send("Compilation réussie mais aucun fichier .jar trouvé.");
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur interne serveur.");
    }
});

// Nouvelle route pour compiler le projet complet
app.post('/compile-full', async (req, res) => {
    const { project, pluginName, javaVersion } = req.body;
    const buildId = uuidv4();
    const workDir = path.join(BUILD_DIR, buildId);

    console.log(`[${buildId}] Compilation complète : ${pluginName} (Java ${javaVersion})`);

    try {
        // Créer la structure du projet
        await fs.ensureDir(workDir);

        // Créer l'arborescence des packages Java
        const javaPackageDir = path.join(workDir, 'src', 'main', 'java', 'com', 'mineblockly', 'plugin');
        await fs.ensureDir(javaPackageDir);

        // Créer les dossiers pour events et commands
        const eventsDir = path.join(javaPackageDir, 'events');
        const commandsDir = path.join(javaPackageDir, 'commands');
        await fs.ensureDir(eventsDir);
        await fs.ensureDir(commandsDir);

        // Créer le dossier resources
        const resourcesDir = path.join(workDir, 'src', 'main', 'resources');
        await fs.ensureDir(resourcesDir);

        // Écrire tous les fichiers Java principaux
        await fs.writeFile(path.join(javaPackageDir, 'Main.java'), project.main);
        await fs.writeFile(path.join(javaPackageDir, 'GUIManager.java'), project.guiManager);
        await fs.writeFile(path.join(javaPackageDir, 'ConfigManager.java'), project.configManager);

        // Écrire tous les listeners
        for (const [className, code] of Object.entries(project.listenerClasses)) {
            await fs.writeFile(path.join(eventsDir, `${className}.java`), code);
        }

        // Écrire toutes les commandes
        for (const [className, code] of Object.entries(project.commandClasses)) {
            await fs.writeFile(path.join(commandsDir, `${className}.java`), code);
        }

        // Écrire les fichiers de configuration
        await fs.writeFile(path.join(resourcesDir, 'plugin.yml'), project.pluginYml);
        await fs.writeFile(path.join(workDir, 'pom.xml'), project.pom);

        console.log(`[${buildId}] Structure créée, lancement de Maven...`);

        // Lancer Maven
        const mvnCommand = process.platform === 'win32' ? 'mvn.cmd' : 'mvn';
        const mvnProcess = exec(`${mvnCommand} clean package -DskipTests`, {
            cwd: workDir,
            maxBuffer: 1024 * 1024 * 10 // 10MB buffer
        }, (error, stdout, stderr) => {
            if (error) {
                console.error(`[${buildId}] Erreur Maven:`, stdout);
                return res.status(500).json({
                    success: false,
                    error: "Erreur de compilation",
                    log: stdout
                });
            }

            // Trouver le .jar généré
            const targetDir = path.join(workDir, 'target');

            fs.readdir(targetDir, (err, files) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        error: "Erreur lors de la recherche du JAR"
                    });
                }

                const jarFile = files.find(file => file.endsWith('.jar') && !file.includes('original'));

                if (jarFile) {
                    console.log(`[${buildId}] Succès ! Envoi : ${jarFile}`);
                    res.download(path.join(targetDir, jarFile), `${pluginName}.jar`, (err) => {
                        if (!err) {
                            // Nettoyage après 30 secondes
                            setTimeout(() => {
                                fs.remove(workDir).catch(console.error);
                            }, 30000);
                        }
                    });
                } else {
                    res.status(500).json({
                        success: false,
                        error: "Compilation réussie mais aucun JAR trouvé",
                        log: stdout
                    });
                }
            });
        });

        // Afficher la progression en temps réel
        mvnProcess.stdout.on('data', (data) => {
            console.log(`[${buildId}] ${data.toString().trim()}`);
        });

    } catch (err) {
        console.error(`[${buildId}] Erreur:`, err);
        res.status(500).json({
            success: false,
            error: "Erreur interne serveur",
            details: err.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur de compilation prêt sur http://localhost:${PORT}`);
    console.log(`Assurez-vous que 'mvn' est accessible dans votre terminal.`);
});