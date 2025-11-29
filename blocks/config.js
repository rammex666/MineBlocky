/* =========================================
   BLOCS DE CONFIGURATION YAML
   ========================================= */

/**
 * Définit tous les blocs pour gérer les fichiers de configuration YAML
 * @param {Object} generator - Générateur Java
 */
function defineConfigBlocks(generator) {

    /* ========================================
       LECTURE DE CONFIGURATION
       ======================================== */

    // Obtenir une valeur String
    Blockly.Blocks['config_get_string'] = {
        init: function() {
            this.appendValueInput("PATH")
                .setCheck("String")
                .appendField("Config : obtenir texte");
            this.appendValueInput("DEFAULT")
                .setCheck("String")
                .appendField("défaut");
            this.setOutput(true, "String");
            this.setColour("#95a5a6");
            this.setTooltip("Obtient une valeur texte de la config");
        }
    };
    generator.forBlock['config_get_string'] = function(block) {
        const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
        const defaultValue = generator.valueToCode(block, 'DEFAULT', generator.ORDER_ATOMIC) || '""';
        return [`ConfigManager.getString(${path}, ${defaultValue})`, generator.ORDER_ATOMIC];
    };

    // Obtenir une valeur Int
    Blockly.Blocks['config_get_int'] = {
        init: function() {
            this.appendValueInput("PATH")
                .setCheck("String")
                .appendField("Config : obtenir nombre");
            this.appendDummyInput()
                .appendField("défaut")
                .appendField(new Blockly.FieldNumber(0), "DEFAULT");
            this.setOutput(true, "Number");
            this.setColour("#95a5a6");
        }
    };
    generator.forBlock['config_get_int'] = function(block) {
        const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
        const defaultValue = block.getFieldValue('DEFAULT');
        return [`ConfigManager.getInt(${path}, ${defaultValue})`, generator.ORDER_ATOMIC];
    };

    // Obtenir une valeur Double
    Blockly.Blocks['config_get_double'] = {
        init: function() {
            this.appendValueInput("PATH")
                .setCheck("String")
                .appendField("Config : obtenir décimal");
            this.appendDummyInput()
                .appendField("défaut")
                .appendField(new Blockly.FieldNumber(0.0), "DEFAULT");
            this.setOutput(true, "Number");
            this.setColour("#95a5a6");
        }
    };
    generator.forBlock['config_get_double'] = function(block) {
        const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
        const defaultValue = block.getFieldValue('DEFAULT');
        return [`ConfigManager.getDouble(${path}, ${defaultValue})`, generator.ORDER_ATOMIC];
    };

    // Obtenir une valeur Boolean
    Blockly.Blocks['config_get_boolean'] = {
        init: function() {
            this.appendValueInput("PATH")
                .setCheck("String")
                .appendField("Config : obtenir booléen");
            this.appendDummyInput()
                .appendField("défaut")
                .appendField(new Blockly.FieldDropdown([
                    ["VRAI", "true"],
                    ["FAUX", "false"]
                ]), "DEFAULT");
            this.setOutput(true, "Boolean");
            this.setColour("#95a5a6");
        }
    };
    generator.forBlock['config_get_boolean'] = function(block) {
        const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
        const defaultValue = block.getFieldValue('DEFAULT');
        return [`ConfigManager.getBoolean(${path}, ${defaultValue})`, generator.ORDER_ATOMIC];
    };

    // Obtenir une liste de strings
    Blockly.Blocks['config_get_string_list'] = {
        init: function() {
            this.appendValueInput("PATH")
                .setCheck("String")
                .appendField("Config : obtenir liste");
            this.setOutput(true, "Array");
            this.setColour("#95a5a6");
            this.setTooltip("Retourne une liste de chaînes de caractères");
        }
    };
    generator.forBlock['config_get_string_list'] = function(block) {
        const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
        return [`ConfigManager.getStringList(${path})`, generator.ORDER_ATOMIC];
    };

    /* ========================================
       ÉCRITURE DE CONFIGURATION
       ======================================== */

    // Définir une valeur
    Blockly.Blocks['config_set'] = {
        init: function() {
            this.appendValueInput("PATH")
                .setCheck("String")
                .appendField("Config : définir");
            this.appendValueInput("VALUE")
                .appendField("valeur");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#95a5a6");
        }
    };
    generator.forBlock['config_set'] = function(block) {
        const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
        const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || 'null';
        return `    ConfigManager.set(${path}, ${value});\n`;
    };

    // Définir une liste
    Blockly.Blocks['config_set_list'] = {
        init: function() {
            this.appendValueInput("PATH")
                .setCheck("String")
                .appendField("Config : définir liste");
            this.appendValueInput("LIST")
                .setCheck("Array")
                .appendField("valeur");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#95a5a6");
        }
    };
    generator.forBlock['config_set_list'] = function(block) {
        const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
        const list = generator.valueToCode(block, 'LIST', generator.ORDER_ATOMIC) || 'null';
        return `    ConfigManager.set(${path}, ${list});\n`;
    };

    /* ========================================
       GESTION DE LA CONFIGURATION
       ======================================== */

    // Sauvegarder la config
    Blockly.Blocks['config_save'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Config : sauvegarder");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#95a5a6");
        }
    };
    generator.forBlock['config_save'] = function(block) {
        return `    ConfigManager.save();\n`;
    };

    // Recharger la config
    Blockly.Blocks['config_reload'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Config : recharger");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#95a5a6");
        }
    };
    generator.forBlock['config_reload'] = function(block) {
        return `    ConfigManager.reload();\n`;
    };

    // Vérifier si une clé existe
    Blockly.Blocks['config_contains'] = {
        init: function() {
            this.appendValueInput("PATH")
                .setCheck("String")
                .appendField("Config : contient clé");
            this.setOutput(true, "Boolean");
            this.setColour("#95a5a6");
        }
    };
    generator.forBlock['config_contains'] = function(block) {
        const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
        return [`ConfigManager.contains(${path})`, generator.ORDER_ATOMIC];
    };

    /* ========================================
       SECTIONS DE CONFIGURATION
       ======================================== */

    // Obtenir toutes les clés d'une section
    Blockly.Blocks['config_get_keys'] = {
        init: function() {
            this.appendValueInput("PATH")
                .setCheck("String")
                .appendField("Config : obtenir clés de");
            this.setOutput(true, "Array");
            this.setColour("#95a5a6");
            this.setTooltip("Retourne un Set de toutes les clés d'une section");
        }
    };
    generator.forBlock['config_get_keys'] = function(block) {
        const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
        return [`ConfigManager.getKeys(${path})`, generator.ORDER_ATOMIC];
    };

    // Créer une section
    Blockly.Blocks['config_create_section'] = {
        init: function() {
            this.appendValueInput("PATH")
                .setCheck("String")
                .appendField("Config : créer section");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#95a5a6");
        }
    };
    generator.forBlock['config_create_section'] = function(block) {
        const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
        return `    ConfigManager.createSection(${path});\n`;
    };

    /* ========================================
       VALEURS PAR DÉFAUT
       ======================================== */

    // Ajouter des défauts (sans écraser)
    Blockly.Blocks['config_add_default'] = {
        init: function() {
            this.appendValueInput("PATH")
                .setCheck("String")
                .appendField("Config : ajouter défaut");
            this.appendValueInput("VALUE")
                .appendField("valeur");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#95a5a6");
            this.setTooltip("Ajoute une valeur par défaut si elle n'existe pas");
        }
    };
    generator.forBlock['config_add_default'] = function(block) {
        const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
        const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || 'null';
        return `    ConfigManager.addDefault(${path}, ${value});\n`;
    };

    /* ========================================
       FICHIERS YAML PERSONNALISÉS
       ======================================== */

    // Créer/charger un fichier YAML personnalisé
    Blockly.Blocks['yaml_load_file'] = {
        init: function() {
            this.appendValueInput("FILENAME")
                .setCheck("String")
                .appendField("YAML : charger fichier");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#7f8c8d");
            this.setTooltip("Charge un fichier YAML personnalisé (ex: 'data.yml')");
        }
    };
    generator.forBlock['yaml_load_file'] = function(block) {
        const filename = generator.valueToCode(block, 'FILENAME', generator.ORDER_ATOMIC) || '"data.yml"';
        return `    ConfigManager.loadCustomFile(${filename});\n`;
    };

    // Obtenir une valeur d'un fichier YAML personnalisé
    Blockly.Blocks['yaml_get'] = {
        init: function() {
            this.appendValueInput("FILENAME")
                .setCheck("String")
                .appendField("YAML : obtenir de");
            this.appendValueInput("PATH")
                .setCheck("String")
                .appendField("clé");
            this.appendValueInput("DEFAULT")
                .appendField("défaut");
            this.setOutput(true);
            this.setColour("#7f8c8d");
        }
    };
    generator.forBlock['yaml_get'] = function(block) {
        const filename = generator.valueToCode(block, 'FILENAME', generator.ORDER_ATOMIC) || '"data.yml"';
        const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
        const defaultValue = generator.valueToCode(block, 'DEFAULT', generator.ORDER_ATOMIC) || 'null';
        return [`ConfigManager.getFromFile(${filename}, ${path}, ${defaultValue})`, generator.ORDER_ATOMIC];
    };

    // Définir une valeur dans un fichier YAML personnalisé
    Blockly.Blocks['yaml_set'] = {
        init: function() {
            this.appendValueInput("FILENAME")
                .setCheck("String")
                .appendField("YAML : définir dans");
            this.appendValueInput("PATH")
                .setCheck("String")
                .appendField("clé");
            this.appendValueInput("VALUE")
                .appendField("valeur");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#7f8c8d");
        }
    };
    generator.forBlock['yaml_set'] = function(block) {
        const filename = generator.valueToCode(block, 'FILENAME', generator.ORDER_ATOMIC) || '"data.yml"';
        const path = generator.valueToCode(block, 'PATH', generator.ORDER_ATOMIC) || '""';
        const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || 'null';
        return `    ConfigManager.setInFile(${filename}, ${path}, ${value});\n`;
    };

    // Sauvegarder un fichier YAML personnalisé
    Blockly.Blocks['yaml_save_file'] = {
        init: function() {
            this.appendValueInput("FILENAME")
                .setCheck("String")
                .appendField("YAML : sauvegarder fichier");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#7f8c8d");
        }
    };
    generator.forBlock['yaml_save_file'] = function(block) {
        const filename = generator.valueToCode(block, 'FILENAME', generator.ORDER_ATOMIC) || '"data.yml"';
        return `    ConfigManager.saveCustomFile(${filename});\n`;
    };

    /* ========================================
       HELPERS POUR LISTES
       ======================================== */

    // Créer une liste vide
    Blockly.Blocks['config_create_list'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Créer liste vide");
            this.setOutput(true, "Array");
            this.setColour("#95a5a6");
        }
    };
    generator.forBlock['config_create_list'] = function(block) {
        return ['new java.util.ArrayList<>()', generator.ORDER_ATOMIC];
    };

    // Ajouter un élément à une liste
    Blockly.Blocks['config_list_add'] = {
        init: function() {
            this.appendValueInput("LIST")
                .setCheck("Array")
                .appendField("Ajouter à liste");
            this.appendValueInput("ITEM")
                .appendField("élément");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#95a5a6");
        }
    };
    generator.forBlock['config_list_add'] = function(block) {
        const list = generator.valueToCode(block, 'LIST', generator.ORDER_ATOMIC) || 'new java.util.ArrayList<>()';
        const item = generator.valueToCode(block, 'ITEM', generator.ORDER_ATOMIC) || '""';
        return `    ${list}.add(${item});\n`;
    };
}
