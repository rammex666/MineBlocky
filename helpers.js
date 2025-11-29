/* =========================================
   FONCTIONS UTILITAIRES
   ========================================= */

/**
 * Crée un bloc d'événement Minecraft
 * @param {string} type - Type du bloc
 * @param {string} label - Label affiché
 * @param {string} color - Couleur du bloc
 */
function createEventBlock(type, label, color) {
    Blockly.Blocks[type] = {
        init: function() {
            this.appendStatementInput("ACTIONS")
                .appendField(label);
            this.setColour(color);
        }
    };
}

/**
 * Crée un générateur d'événement Minecraft
 * @param {Object} generator - Générateur Java (javaGenerator)
 * @param {string} type - Type du bloc
 * @param {string} handlerName - Nom du handler Java
 * @param {string} eventClass - Classe de l'événement
 */
function createEventGenerator(generator, type, handlerName, eventClass) {
    generator.forBlock[type] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void ${handlerName}(${eventClass} event) {
    Player player = event.getPlayer();
${actions}}
`;
    };
}

/**
 * Crée un bloc d'action simple
 * @param {string} type - Type du bloc
 * @param {string} label - Label affiché
 * @param {string} color - Couleur du bloc
 * @param {Object} extraField - Champ supplémentaire optionnel
 */
function createActionBlock(type, label, color, extraField = null) {
    Blockly.Blocks[type] = {
        init: function() {
            const input = this.appendDummyInput().appendField(label);
            if (extraField) {
                input.appendField(extraField.field);
            }
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(color);
        }
    };
}

/**
 * Vérifie si une valeur est une chaîne de caractères (commence par ")
 * @param {string} value - Valeur à vérifier
 * @returns {boolean}
 */
function isStringValue(value) {
    return value && value.startsWith('"');
}

/**
 * Initialise le redimensionnement automatique du workspace
 * @param {Object} workspace - Workspace Blockly
 */
function initializeWorkspaceResize(workspace) {
    const blocklyArea = document.getElementById('blocklyArea');
    const blocklyDiv = document.getElementById('blocklyDiv');

    const onResize = function() {
        blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
        blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
        Blockly.svgResize(workspace);
    };

    window.addEventListener('resize', onResize);
    onResize();
}
