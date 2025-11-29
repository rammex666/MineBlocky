/* =========================================
   TEMPLATES DE GÉNÉRATION JAVA
   ========================================= */

/**
 * Map des événements vers leurs classes listener
 */
const EVENT_TO_CLASS_MAP = {
    // Events Joueur
    'PlayerJoinEvent': 'PlayerJoinListener',
    'PlayerQuitEvent': 'PlayerQuitListener',
    'AsyncPlayerChatEvent': 'PlayerChatListener',
    'PlayerInteractEvent': 'PlayerInteractListener',
    'PlayerInteractEntityEvent': 'PlayerInteractEntityListener',
    'PlayerMoveEvent': 'PlayerMoveListener',
    'PlayerTeleportEvent': 'PlayerTeleportListener',
    'PlayerDeathEvent': 'PlayerDeathListener',
    'PlayerRespawnEvent': 'PlayerRespawnListener',
    'PlayerToggleSneakEvent': 'PlayerSneakListener',
    'PlayerToggleSprintEvent': 'PlayerSprintListener',
    'PlayerDropItemEvent': 'PlayerDropItemListener',
    'EntityPickupItemEvent': 'PlayerPickupItemListener',
    'PlayerItemConsumeEvent': 'PlayerConsumeListener',
    'PlayerBedEnterEvent': 'PlayerBedEnterListener',
    'PlayerBedLeaveEvent': 'PlayerBedLeaveListener',
    'PlayerCommandPreprocessEvent': 'PlayerCommandListener',
    'PlayerGameModeChangeEvent': 'PlayerGameModeChangeListener',
    'PlayerExpChangeEvent': 'PlayerExpChangeListener',
    'PlayerLevelChangeEvent': 'PlayerLevelChangeListener',
    'PlayerFishEvent': 'PlayerFishListener',
    'PlayerPortalEvent': 'PlayerPortalListener',

    // Events Bloc
    'BlockBreakEvent': 'BlockBreakListener',
    'BlockPlaceEvent': 'BlockPlaceListener',
    'BlockBurnEvent': 'BlockBurnListener',
    'BlockExplodeEvent': 'BlockExplodeListener',
    'BlockGrowEvent': 'BlockGrowListener',
    'BlockIgniteEvent': 'BlockIgniteListener',
    'BlockSpreadEvent': 'BlockSpreadListener',
    'SignChangeEvent': 'SignChangeListener',

    // Events Entité
    'EntityDamageEvent': 'EntityDamageListener',
    'EntityDamageByEntityEvent': 'EntityDamageByEntityListener',
    'EntityDeathEvent': 'EntityDeathListener',
    'EntitySpawnEvent': 'EntitySpawnListener',
    'EntityExplodeEvent': 'EntityExplodeListener',
    'EntityTargetEvent': 'EntityTargetListener',
    'ProjectileHitEvent': 'ProjectileHitListener',
    'ProjectileLaunchEvent': 'ProjectileLaunchListener',

    // Events Inventaire
    'InventoryClickEvent': 'InventoryClickListener',
    'InventoryCloseEvent': 'InventoryCloseListener',
    'InventoryOpenEvent': 'InventoryOpenListener',
    'InventoryDragEvent': 'InventoryDragListener',
    'CraftItemEvent': 'CraftItemListener',

    // Events Véhicule
    'VehicleEnterEvent': 'VehicleEnterListener',
    'VehicleExitEvent': 'VehicleExitListener',
    'VehicleDamageEvent': 'VehicleDamageListener',
    'VehicleDestroyEvent': 'VehicleDestroyListener',

    // Events Monde
    'WeatherChangeEvent': 'WeatherChangeListener',
    'ThunderChangeEvent': 'ThunderChangeListener',
    'ChunkLoadEvent': 'ChunkLoadListener',
    'ChunkUnloadEvent': 'ChunkUnloadListener'
};

/**
 * Extrait le type d'événement d'un bloc de code
 */
function extractEventType(code) {
    const match = code.match(/public void \w+\((\w+) event\)/);
    return match ? match[1] : null;
}

/**
 * Groupe le code par type d'événement
 */
function groupCodeByEvent(userCode) {
    const lines = userCode.split('\n');
    const eventGroups = {};
    let currentEvent = null;
    let currentCode = [];
    let bracketCount = 0;
    let inMethod = false;

    for (let line of lines) {
        // Détecter le début d'une méthode d'événement
        if (line.includes('@EventHandler')) {
            if (currentEvent && currentCode.length > 0) {
                // Sauvegarder l'événement précédent
                if (!eventGroups[currentEvent]) {
                    eventGroups[currentEvent] = [];
                }
                eventGroups[currentEvent].push(currentCode.join('\n'));
            }
            currentCode = ['@EventHandler'];
            inMethod = false;
            continue;
        }

        if (currentCode.length > 0 && !inMethod) {
            const eventType = extractEventType(line);
            if (eventType) {
                currentEvent = eventType;
                inMethod = true;
            }
        }

        if (inMethod) {
            currentCode.push(line);

            // Compter les accolades pour savoir quand la méthode se termine
            bracketCount += (line.match(/{/g) || []).length;
            bracketCount -= (line.match(/}/g) || []).length;

            if (bracketCount === 0 && line.includes('}')) {
                // Fin de la méthode
                if (currentEvent) {
                    if (!eventGroups[currentEvent]) {
                        eventGroups[currentEvent] = [];
                    }
                    eventGroups[currentEvent].push(currentCode.join('\n'));
                }
                currentCode = [];
                currentEvent = null;
                inMethod = false;
            }
        }
    }

    // Ajouter le dernier événement si nécessaire
    if (currentEvent && currentCode.length > 0) {
        if (!eventGroups[currentEvent]) {
            eventGroups[currentEvent] = [];
        }
        eventGroups[currentEvent].push(currentCode.join('\n'));
    }

    return eventGroups;
}

/**
 * Génère une classe listener pour un événement spécifique
 */
function generateEventListenerClass(eventType, methods) {
    const className = EVENT_TO_CLASS_MAP[eventType] || `${eventType}Listener`;
    const methodsCode = methods.join('\n\n');

    return `package com.mineblockly.plugin.events;

import org.bukkit.Material;
import org.bukkit.GameMode;
import org.bukkit.entity.Player;
import org.bukkit.inventory.ItemStack;
import org.bukkit.event.Listener;
import org.bukkit.event.EventHandler;
import org.bukkit.event.player.*;
import org.bukkit.event.block.*;
import org.bukkit.event.entity.*;
import org.bukkit.event.inventory.*;
import org.bukkit.event.vehicle.*;
import org.bukkit.event.world.*;
import org.bukkit.event.weather.*;
import com.mineblockly.plugin.GUIManager;

public class ${className} implements Listener {

${methodsCode}
}`;
}

/**
 * Génère toutes les classes listener
 */
function generateAllListenerClasses(userCode) {
    const eventGroups = groupCodeByEvent(userCode);
    const classes = {};

    for (const [eventType, methods] of Object.entries(eventGroups)) {
        const className = EVENT_TO_CLASS_MAP[eventType] || `${eventType}Listener`;
        classes[className] = generateEventListenerClass(eventType, methods);
    }

    return classes;
}

/**
 * Génère la classe GUIManager
 */
function generateGUIManagerClass() {
    return `package com.mineblockly.plugin;

import org.bukkit.entity.Player;
import org.bukkit.inventory.ItemStack;
import java.util.HashMap;
import java.util.function.BiConsumer;

/**
 * Gestionnaire centralisé pour les GUI personnalisées
 * Utilise BiConsumer pour gérer les actions des boutons
 */
public class GUIManager {

    // HashMap pour stocker les actions des boutons GUI
    private static HashMap<String, BiConsumer<Player, ItemStack>> guiActions = new HashMap<>();

    /**
     * Enregistre une action pour un bouton GUI
     * @param buttonId Identifiant unique du bouton
     * @param action Action à exécuter (BiConsumer)
     */
    public static void registerButtonAction(String buttonId, BiConsumer<Player, ItemStack> action) {
        guiActions.put(buttonId, action);
    }

    /**
     * Exécute l'action associée à un bouton
     * @param buttonId Identifiant du bouton
     * @param player Joueur qui a cliqué
     * @param item Item cliqué
     * @return true si l'action a été exécutée, false sinon
     */
    public static boolean executeButtonAction(String buttonId, Player player, ItemStack item) {
        if (guiActions.containsKey(buttonId)) {
            guiActions.get(buttonId).accept(player, item);
            return true;
        }
        return false;
    }

    /**
     * Vérifie si un bouton a une action enregistrée
     * @param buttonId Identifiant du bouton
     * @return true si une action existe
     */
    public static boolean hasButtonAction(String buttonId) {
        return guiActions.containsKey(buttonId);
    }

    /**
     * Supprime toutes les actions enregistrées
     * Utile pour le reload du plugin
     */
    public static void clearAllActions() {
        guiActions.clear();
    }

    /**
     * Retourne le nombre d'actions enregistrées
     * @return Nombre d'actions
     */
    public static int getActionCount() {
        return guiActions.size();
    }
}`;
}

/**
 * Génère la classe ConfigManager
 */
function generateConfigManagerClass() {
    return `package com.mineblockly.plugin;

import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.configuration.file.YamlConfiguration;
import org.bukkit.plugin.java.JavaPlugin;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

/**
 * Gestionnaire centralisé pour les fichiers de configuration YAML
 * Gère config.yml et des fichiers YAML personnalisés
 */
public class ConfigManager {

    private static JavaPlugin plugin;
    private static FileConfiguration config;
    private static HashMap<String, FileConfiguration> customConfigs = new HashMap<>();
    private static HashMap<String, File> customFiles = new HashMap<>();

    /**
     * Initialise le ConfigManager
     * @param pluginInstance Instance du plugin
     */
    public static void init(JavaPlugin pluginInstance) {
        plugin = pluginInstance;
        plugin.saveDefaultConfig();
        config = plugin.getConfig();
    }

    /* =========================================
       CONFIG.YML PRINCIPAL
       ========================================= */

    /**
     * Obtient une chaîne de caractères
     */
    public static String getString(String path, String defaultValue) {
        return config.getString(path, defaultValue);
    }

    /**
     * Obtient un entier
     */
    public static int getInt(String path, int defaultValue) {
        return config.getInt(path, defaultValue);
    }

    /**
     * Obtient un double
     */
    public static double getDouble(String path, double defaultValue) {
        return config.getDouble(path, defaultValue);
    }

    /**
     * Obtient un booléen
     */
    public static boolean getBoolean(String path, boolean defaultValue) {
        return config.getBoolean(path, defaultValue);
    }

    /**
     * Obtient une liste de chaînes
     */
    public static List<String> getStringList(String path) {
        return config.getStringList(path);
    }

    /**
     * Définit une valeur
     */
    public static void set(String path, Object value) {
        config.set(path, value);
    }

    /**
     * Sauvegarde la configuration
     */
    public static void save() {
        try {
            plugin.saveConfig();
        } catch (Exception e) {
            plugin.getLogger().warning("Erreur lors de la sauvegarde de config.yml: " + e.getMessage());
        }
    }

    /**
     * Recharge la configuration
     */
    public static void reload() {
        plugin.reloadConfig();
        config = plugin.getConfig();
    }

    /**
     * Vérifie si une clé existe
     */
    public static boolean contains(String path) {
        return config.contains(path);
    }

    /**
     * Obtient toutes les clés d'une section
     */
    public static Set<String> getKeys(String path) {
        if (config.getConfigurationSection(path) != null) {
            return config.getConfigurationSection(path).getKeys(false);
        }
        return null;
    }

    /**
     * Crée une section
     */
    public static void createSection(String path) {
        config.createSection(path);
    }

    /**
     * Ajoute une valeur par défaut sans écraser
     */
    public static void addDefault(String path, Object value) {
        if (!config.contains(path)) {
            config.set(path, value);
        }
    }

    /* =========================================
       FICHIERS YAML PERSONNALISÉS
       ========================================= */

    /**
     * Charge ou crée un fichier YAML personnalisé
     */
    public static void loadCustomFile(String filename) {
        if (!customFiles.containsKey(filename)) {
            File file = new File(plugin.getDataFolder(), filename);

            if (!file.exists()) {
                try {
                    file.getParentFile().mkdirs();
                    file.createNewFile();
                } catch (IOException e) {
                    plugin.getLogger().warning("Impossible de créer " + filename + ": " + e.getMessage());
                    return;
                }
            }

            customFiles.put(filename, file);
            customConfigs.put(filename, YamlConfiguration.loadConfiguration(file));
        }
    }

    /**
     * Obtient une valeur d'un fichier personnalisé
     */
    public static Object getFromFile(String filename, String path, Object defaultValue) {
        loadCustomFile(filename);
        FileConfiguration fileConfig = customConfigs.get(filename);

        if (fileConfig != null) {
            return fileConfig.get(path, defaultValue);
        }
        return defaultValue;
    }

    /**
     * Définit une valeur dans un fichier personnalisé
     */
    public static void setInFile(String filename, String path, Object value) {
        loadCustomFile(filename);
        FileConfiguration fileConfig = customConfigs.get(filename);

        if (fileConfig != null) {
            fileConfig.set(path, value);
        }
    }

    /**
     * Sauvegarde un fichier personnalisé
     */
    public static void saveCustomFile(String filename) {
        FileConfiguration fileConfig = customConfigs.get(filename);
        File file = customFiles.get(filename);

        if (fileConfig != null && file != null) {
            try {
                fileConfig.save(file);
            } catch (IOException e) {
                plugin.getLogger().warning("Erreur lors de la sauvegarde de " + filename + ": " + e.getMessage());
            }
        }
    }

    /**
     * Nettoie tous les fichiers personnalisés
     */
    public static void clearCustomFiles() {
        customConfigs.clear();
        customFiles.clear();
    }
}`;
}

/**
 * Génère la classe Main du plugin
 */
function generateMainClass(name, listenerClasses, commandClasses = {}) {
    const registerListeners = Object.keys(listenerClasses)
        .map(className => `        getServer().getPluginManager().registerEvents(new com.mineblockly.plugin.events.${className}(), this);`)
        .join('\n');

    const registerCommands = Object.entries(commandClasses)
        .map(([className, _]) => {
            const cmdName = className.replace('Command', '').toLowerCase();
            return `        getCommand("${cmdName}").setExecutor(new com.mineblockly.plugin.commands.${className}());`;
        })
        .join('\n');

    const hasListeners = Object.keys(listenerClasses).length > 0;
    const hasCommands = Object.keys(commandClasses).length > 0;

    let enableCode = '';
    if (hasListeners) {
        enableCode += `        // Enregistrer tous les listeners\n${registerListeners}\n\n`;
    }
    if (hasCommands) {
        enableCode += `        // Enregistrer toutes les commandes\n${registerCommands}\n\n`;
    }

    let logInfo = `        getLogger().info("${name} a été activé !");`;
    if (hasListeners) {
        logInfo += `\n        getLogger().info("Nombre de listeners enregistrés: ${Object.keys(listenerClasses).length}");`;
    }
    if (hasCommands) {
        logInfo += `\n        getLogger().info("Nombre de commandes enregistrées: ${Object.keys(commandClasses).length}");`;
    }

    return `package com.mineblockly.plugin;

import org.bukkit.plugin.java.JavaPlugin;

public class Main extends JavaPlugin {

    @Override
    public void onEnable() {
        // Initialiser ConfigManager
        ConfigManager.init(this);

${enableCode}${logInfo}
    }

    @Override
    public void onDisable() {
        // Nettoyer les actions GUI
        GUIManager.clearAllActions();

        // Nettoyer les fichiers YAML personnalisés
        ConfigManager.clearCustomFiles();

        getLogger().info("${name} a été désactivé !");
    }
}`;
}

/**
 * Génère le fichier plugin.yml
 */
function generatePluginYml(name, commands = {}) {
    let yml = `name: ${name}
version: 1.0
main: com.mineblockly.plugin.Main
api-version: 1.13
author: MineBlockly
description: Plugin généré avec MineBlockly`;

    // Ajouter les commandes si elles existent
    if (Object.keys(commands).length > 0) {
        yml += '\n\ncommands:';
        for (const [cmdName, description] of Object.entries(commands)) {
            yml += `\n  ${cmdName}:`;
            yml += `\n    description: ${description}`;
            yml += `\n    usage: /${cmdName}`;
        }
    }

    return yml;
}

/**
 * Génère le fichier pom.xml pour Maven
 */
function generatePomXml(name, javaVersion, apiVersion) {
    return `<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>
    <groupId>com.mineblockly</groupId>
    <artifactId>${name.toLowerCase()}</artifactId>
    <version>1.0</version>
    <packaging>jar</packaging>

    <properties>
        <java.version>${javaVersion}</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <repositories>
        <repository>
            <id>spigot-repo</id>
            <url>https://hub.spigotmc.org/nexus/content/repositories/snapshots/</url>
        </repository>
    </repositories>

    <dependencies>
        <dependency>
            <groupId>org.spigotmc</groupId>
            <artifactId>spigot-api</artifactId>
            <version>${apiVersion}</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>${javaVersion}</source>
                    <target>${javaVersion}</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`;
}

/* =========================================
   GÉNÉRATION DES COMMANDES
   ========================================= */

/**
 * Extrait les commandes du code généré
 * Format attendu : @COMMAND:nom:description...@ENDCOMMAND:nom
 */
function extractCommands(userCode) {
    const commands = {};
    const commandRegex = /@COMMAND:(\w+):(.*?)\n([\s\S]*?)@ENDCOMMAND:\1/g;

    let match;
    while ((match = commandRegex.exec(userCode)) !== null) {
        const cmdName = match[1];
        const description = match[2];
        const code = match[3];

        if (!commands[cmdName]) {
            commands[cmdName] = {
                description: description,
                code: code
            };
        }
    }

    return commands;
}

/**
 * Génère une classe CommandExecutor pour une commande
 */
function generateCommandClass(commandName, commandData) {
    const className = commandName.charAt(0).toUpperCase() + commandName.slice(1) + 'Command';

    return `package com.mineblockly.plugin.commands;

import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.Material;
import org.bukkit.GameMode;
import org.bukkit.inventory.ItemStack;
import com.mineblockly.plugin.GUIManager;

/**
 * Commande: /${commandName}
 * ${commandData.description}
 */
public class ${className} implements CommandExecutor {

    @Override
${commandData.code}}`;
}

/**
 * Génère toutes les classes de commandes
 */
function generateAllCommandClasses(userCode) {
    const commands = extractCommands(userCode);
    const classes = {};

    for (const [cmdName, cmdData] of Object.entries(commands)) {
        const className = cmdName.charAt(0).toUpperCase() + cmdName.slice(1) + 'Command';
        classes[className] = generateCommandClass(cmdName, cmdData);
    }

    return classes;
}

/**
 * Obtient la liste des commandes avec leurs descriptions
 */
function getCommandsList(userCode) {
    const commands = extractCommands(userCode);
    const commandsList = {};

    for (const [cmdName, cmdData] of Object.entries(commands)) {
        commandsList[cmdName] = cmdData.description;
    }

    return commandsList;
}

/* =========================================
   SCRIPTS DE COMPILATION
   ========================================= */

/**
 * Génère le fichier README.md avec les instructions de compilation
 */
function generateReadme(pluginName, javaVersion, mcVersion) {
    return `# ${pluginName}

Plugin Minecraft généré avec MineBlockly

## Prérequis

- **Java ${javaVersion}** (JDK)
- **Apache Maven** 3.6+

## Versions

- Minecraft: ${mcVersion}
- Java: ${javaVersion}
- API: Spigot/Bukkit

## Installation de Maven

### Windows
1. Téléchargez Maven depuis https://maven.apache.org/download.cgi
2. Extrayez l'archive dans C:\\Program Files\\Apache\\maven
3. Ajoutez le dossier bin de Maven à votre PATH

### Linux/Mac
\`\`\`bash
# Ubuntu/Debian
sudo apt-get install maven

# Mac (avec Homebrew)
brew install maven
\`\`\`

## Compilation

### Méthode 1 : Scripts automatiques

#### Windows
\`\`\`cmd
build.bat
\`\`\`

#### Linux/Mac
\`\`\`bash
chmod +x build.sh
./build.sh
\`\`\`

Le fichier JAR sera généré dans \`target/${pluginName.toLowerCase()}-1.0.jar\`

### Méthode 2 : Maven manuel

\`\`\`bash
mvn clean package
\`\`\`

## Installation du plugin

1. Copiez le fichier JAR généré dans le dossier \`plugins/\` de votre serveur Spigot/Bukkit
2. Redémarrez votre serveur
3. Le plugin sera chargé automatiquement

## Vérification de la version Java

Pour vérifier votre version de Java :

\`\`\`bash
java -version
\`\`\`

Vous devez avoir **Java ${javaVersion}** ou supérieur.

## Problèmes courants

### "Unsupported class file major version"
Votre version de Java est trop ancienne. Installez Java ${javaVersion} ou supérieur.

### "JAVA_HOME is not set"
Définissez la variable d'environnement JAVA_HOME :

#### Windows
\`\`\`cmd
setx JAVA_HOME "C:\\Program Files\\Java\\jdk-${javaVersion}"
\`\`\`

#### Linux/Mac
\`\`\`bash
export JAVA_HOME=/usr/lib/jvm/java-${javaVersion}-openjdk
\`\`\`

## Structure du projet

\`\`\`
${pluginName.toLowerCase()}/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/mineblockly/plugin/
│       │       ├── Main.java
│       │       ├── GUIManager.java
│       │       ├── ConfigManager.java
│       │       ├── events/
│       │       │   └── *Listener.java
│       │       └── commands/
│       │           └── *Command.java
│       └── resources/
│           └── plugin.yml
├── pom.xml
├── build.bat
├── build.sh
└── README.md
\`\`\`

## Support

Plugin généré avec MineBlockly - https://github.com/yourusername/mineblockly

---

*Généré automatiquement par MineBlockly*
`;
}

/**
 * Génère le script de compilation pour Windows (build.bat)
 */
function generateBuildBat(pluginName, javaVersion) {
    return `@echo off
echo ========================================
echo Compilation de ${pluginName}
echo ========================================
echo.

REM Vérifier si Maven est installé
where mvn >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERREUR] Maven n'est pas installé ou n'est pas dans le PATH
    echo.
    echo Veuillez installer Maven depuis https://maven.apache.org/download.cgi
    echo et ajouter le dossier bin de Maven a votre PATH
    pause
    exit /b 1
)

REM Vérifier la version de Java
echo Verification de la version de Java...
java -version 2>&1 | findstr /i "version" > nul
if %errorlevel% neq 0 (
    echo [ERREUR] Java n'est pas installé
    echo.
    echo Veuillez installer Java ${javaVersion} ou superieur
    pause
    exit /b 1
)

echo Version de Java detectee :
java -version
echo.

REM Vérifier que JAVA_HOME est défini
if not defined JAVA_HOME (
    echo [ATTENTION] JAVA_HOME n'est pas defini
    echo Le build peut echouer si vous n'avez pas Java ${javaVersion}
    echo.
)

echo ========================================
echo Compilation avec Maven...
echo ========================================
echo.

REM Compiler le projet
call mvn clean package

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo [SUCCES] Compilation reussie !
    echo ========================================
    echo.
    echo Le fichier JAR a ete genere dans :
    echo target\\${pluginName.toLowerCase()}-1.0.jar
    echo.
    echo Copiez ce fichier dans le dossier plugins/ de votre serveur
    echo.
) else (
    echo.
    echo ========================================
    echo [ERREUR] La compilation a echoue
    echo ========================================
    echo.
    echo Verifiez que vous avez Java ${javaVersion} ou superieur
    echo.
)

pause
`;
}

/**
 * Génère le script de compilation pour Linux/Mac (build.sh)
 */
function generateBuildSh(pluginName, javaVersion) {
    return `#!/bin/bash

echo "========================================"
echo "Compilation de ${pluginName}"
echo "========================================"
echo ""

# Vérifier si Maven est installé
if ! command -v mvn &> /dev/null; then
    echo "[ERREUR] Maven n'est pas installé"
    echo ""
    echo "Installation de Maven :"
    echo "  Ubuntu/Debian: sudo apt-get install maven"
    echo "  Mac (Homebrew): brew install maven"
    echo ""
    exit 1
fi

# Vérifier la version de Java
echo "Vérification de la version de Java..."
if ! command -v java &> /dev/null; then
    echo "[ERREUR] Java n'est pas installé"
    echo ""
    echo "Veuillez installer Java ${javaVersion} ou supérieur"
    echo ""
    exit 1
fi

echo "Version de Java détectée :"
java -version
echo ""

# Vérifier que JAVA_HOME est défini
if [ -z "\$JAVA_HOME" ]; then
    echo "[ATTENTION] JAVA_HOME n'est pas défini"
    echo "Le build peut échouer si vous n'avez pas Java ${javaVersion}"
    echo ""
fi

echo "========================================"
echo "Compilation avec Maven..."
echo "========================================"
echo ""

# Compiler le projet
mvn clean package

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "[SUCCÈS] Compilation réussie !"
    echo "========================================"
    echo ""
    echo "Le fichier JAR a été généré dans :"
    echo "target/${pluginName.toLowerCase()}-1.0.jar"
    echo ""
    echo "Copiez ce fichier dans le dossier plugins/ de votre serveur"
    echo ""
else
    echo ""
    echo "========================================"
    echo "[ERREUR] La compilation a échoué"
    echo "========================================"
    echo ""
    echo "Vérifiez que vous avez Java ${javaVersion} ou supérieur"
    echo ""
    exit 1
fi
`;
}
