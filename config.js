/* =========================================
   CONFIGURATION & CONSTANTES
   ========================================= */

/**
 * Données de version Minecraft
 * Associe chaque version à sa version Java et son API Spigot
 */
const VERSION_DATA = {
    "1.20": { java: "17", api: "1.20.4-R0.1-SNAPSHOT" },
    "1.19": { java: "17", api: "1.19.4-R0.1-SNAPSHOT" },
    "1.18": { java: "17", api: "1.18.2-R0.1-SNAPSHOT" },
    "1.17": { java: "16", api: "1.17.1-R0.1-SNAPSHOT" },
    "1.16": { java: "16", api: "1.16.5-R0.1-SNAPSHOT" },
    "1.12": { java: "1.8", api: "1.12.2-R0.1-SNAPSHOT" },
    "1.8":  { java: "1.8", api: "1.8.8-R0.1-SNAPSHOT" }
};

/**
 * Couleurs des catégories de blocs
 */
const COLORS = {
    LOGIC: "#f1c40f",
    CONDITIONS: "#d35400",
    EVENT_PLAYER: "#3498db",
    EVENT_BLOCK: "#e67e22",
    ACTIONS: "#2980b9",
    INVENTORY: "#9b59b6",
    DATA: "#95a5a6",
    CANCEL: "#e74c3c"
};

/**
 * Opérateurs de comparaison (Blockly → Java)
 */
const COMPARISON_OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
};

/**
 * Thème sombre personnalisé pour Blockly
 */
const DARK_THEME = {
    'base': Blockly.Themes.Classic,
    'componentStyles': {
        'workspaceBackgroundColour': '#1e1e1e',
        'toolboxBackgroundColour': '#252526',
        'toolboxForegroundColour': '#ffffff',
        'flyoutBackgroundColour': '#333',
        'scrollbarColour': '#555',
    }
};

/**
 * Configuration de la grille du workspace
 */
const GRID_CONFIG = {
    spacing: 25,
    length: 3,
    colour: '#444',
    snap: true
};
