/* =========================================
   BLOCS DE COMMANDES
   ========================================= */

/**
 * Définit tous les blocs pour créer des commandes personnalisées
 * @param {Object} generator - Générateur Java
 */
function defineCommandBlocks(generator) {

    /* ========================================
       DÉFINITION DE COMMANDE
       ======================================== */

    // Définir une nouvelle commande
    Blockly.Blocks['command_define'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Commande /")
                .appendField(new Blockly.FieldTextInput("macommande"), "CMD_NAME");
            this.appendValueInput("DESCRIPTION")
                .setCheck("String")
                .appendField("description");
            this.appendStatementInput("CODE")
                .appendField("actions :");
            this.setColour("#e67e22");
            this.setTooltip("Définit une nouvelle commande personnalisée");
        }
    };
    generator.forBlock['command_define'] = function(block) {
        const cmdName = block.getFieldValue('CMD_NAME').toLowerCase();
        const description = generator.valueToCode(block, 'DESCRIPTION', generator.ORDER_ATOMIC) || '"Commande personnalisée"';
        const code = generator.statementToCode(block, 'CODE');

        // Marquer cette commande pour la génération
        return `@COMMAND:${cmdName}:${description}\npublic boolean onCommand(org.bukkit.command.CommandSender sender, org.bukkit.command.Command command, String label, String[] args) {
        Player player = (Player) sender;
${code}    return true;
}
@ENDCOMMAND:${cmdName}\n`;
    };

    /* ========================================
       VÉRIFICATIONS DU SENDER
       ======================================== */

    // Vérifier si le sender est un joueur
    Blockly.Blocks['command_sender_is_player'] = {
        init: function() {
            this.appendStatementInput("IF_PLAYER")
                .appendField("Si l'expéditeur est un joueur :");
            this.appendStatementInput("ELSE")
                .appendField("Sinon :");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#e67e22");
        }
    };
    generator.forBlock['command_sender_is_player'] = function(block) {
        const ifPlayer = generator.statementToCode(block, 'IF_PLAYER');
        const elseCode = generator.statementToCode(block, 'ELSE');

        return `    if (sender instanceof Player) {
        Player player = (Player) sender;
${ifPlayer}    } else {
${elseCode}    }\n`;
    };

    // Obtenir le nom du sender
    Blockly.Blocks['command_get_sender_name'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("nom de l'expéditeur");
            this.setOutput(true, "String");
            this.setColour("#e67e22");
        }
    };
    generator.forBlock['command_get_sender_name'] = function(block) {
        return ['sender.getName()', generator.ORDER_ATOMIC];
    };

    // Vérifier la permission
    Blockly.Blocks['command_has_permission'] = {
        init: function() {
            this.appendValueInput("PERMISSION")
                .setCheck("String")
                .appendField("expéditeur a la permission");
            this.setOutput(true, "Boolean");
            this.setColour("#e67e22");
        }
    };
    generator.forBlock['command_has_permission'] = function(block) {
        const permission = generator.valueToCode(block, 'PERMISSION', generator.ORDER_ATOMIC) || '"default.permission"';
        return [`sender.hasPermission(${permission})`, generator.ORDER_ATOMIC];
    };

    /* ========================================
       GESTION DES ARGUMENTS
       ======================================== */

    // Obtenir un argument
    Blockly.Blocks['command_get_arg'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("argument")
                .appendField(new Blockly.FieldNumber(0, 0), "INDEX");
            this.setOutput(true, "String");
            this.setColour("#e67e22");
            this.setTooltip("Récupère l'argument à l'index spécifié (commence à 0)");
        }
    };
    generator.forBlock['command_get_arg'] = function(block) {
        const index = block.getFieldValue('INDEX');
        return [`args[${index}]`, generator.ORDER_ATOMIC];
    };

    // Nombre d'arguments
    Blockly.Blocks['command_get_args_length'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("nombre d'arguments");
            this.setOutput(true, "Number");
            this.setColour("#e67e22");
        }
    };
    generator.forBlock['command_get_args_length'] = function(block) {
        return ['args.length', generator.ORDER_ATOMIC];
    };

    // Vérifier le nombre d'arguments
    Blockly.Blocks['command_check_args'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Si nombre d'arguments")
                .appendField(new Blockly.FieldDropdown([
                    ["égal à", "=="],
                    ["supérieur à", ">"],
                    ["inférieur à", "<"],
                    ["supérieur ou égal à", ">="],
                    ["inférieur ou égal à", "<="]
                ]), "OPERATOR")
                .appendField(new Blockly.FieldNumber(0, 0), "COUNT");
            this.appendStatementInput("THEN")
                .appendField("alors :");
            this.appendStatementInput("ELSE")
                .appendField("sinon :");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#e67e22");
        }
    };
    generator.forBlock['command_check_args'] = function(block) {
        const operator = block.getFieldValue('OPERATOR');
        const count = block.getFieldValue('COUNT');
        const thenCode = generator.statementToCode(block, 'THEN');
        const elseCode = generator.statementToCode(block, 'ELSE');

        return `    if (args.length ${operator} ${count}) {
${thenCode}    } else {
${elseCode}    }\n`;
    };

    // Vérifier si un argument est un nombre
    Blockly.Blocks['command_arg_is_number'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("argument")
                .appendField(new Blockly.FieldNumber(0, 0), "INDEX")
                .appendField("est un nombre");
            this.setOutput(true, "Boolean");
            this.setColour("#e67e22");
        }
    };
    generator.forBlock['command_arg_is_number'] = function(block) {
        const index = block.getFieldValue('INDEX');
        return [`args[${index}].matches("-?\\\\d+(\\\\.\\\\d+)?")`, generator.ORDER_ATOMIC];
    };

    // Convertir argument en nombre
    Blockly.Blocks['command_arg_to_number'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("argument")
                .appendField(new Blockly.FieldNumber(0, 0), "INDEX")
                .appendField("en nombre");
            this.setOutput(true, "Number");
            this.setColour("#e67e22");
        }
    };
    generator.forBlock['command_arg_to_number'] = function(block) {
        const index = block.getFieldValue('INDEX');
        return [`Integer.parseInt(args[${index}])`, generator.ORDER_ATOMIC];
    };

    // Convertir argument en nombre décimal
    Blockly.Blocks['command_arg_to_double'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("argument")
                .appendField(new Blockly.FieldNumber(0, 0), "INDEX")
                .appendField("en décimal");
            this.setOutput(true, "Number");
            this.setColour("#e67e22");
        }
    };
    generator.forBlock['command_arg_to_double'] = function(block) {
        const index = block.getFieldValue('INDEX');
        return [`Double.parseDouble(args[${index}])`, generator.ORDER_ATOMIC];
    };

    // Joindre tous les arguments à partir d'un index
    Blockly.Blocks['command_join_args'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("joindre arguments depuis")
                .appendField(new Blockly.FieldNumber(0, 0), "START_INDEX");
            this.setOutput(true, "String");
            this.setColour("#e67e22");
            this.setTooltip("Joint tous les arguments en une seule chaîne à partir de l'index");
        }
    };
    generator.forBlock['command_join_args'] = function(block) {
        const startIndex = block.getFieldValue('START_INDEX');
        return [`String.join(" ", java.util.Arrays.copyOfRange(args, ${startIndex}, args.length))`, generator.ORDER_ATOMIC];
    };

    /* ========================================
       MESSAGES DE RÉPONSE
       ======================================== */

    // Envoyer un message au sender
    Blockly.Blocks['command_send_message'] = {
        init: function() {
            this.appendValueInput("MESSAGE")
                .setCheck("String")
                .appendField("Envoyer message");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#e67e22");
        }
    };
    generator.forBlock['command_send_message'] = function(block) {
        const message = generator.valueToCode(block, 'MESSAGE', generator.ORDER_ATOMIC) || '""';
        return `    sender.sendMessage(${message});\n`;
    };

    // Envoyer un message d'erreur
    Blockly.Blocks['command_send_error'] = {
        init: function() {
            this.appendValueInput("MESSAGE")
                .setCheck("String")
                .appendField("Envoyer erreur");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#e67e22");
        }
    };
    generator.forBlock['command_send_error'] = function(block) {
        const message = generator.valueToCode(block, 'MESSAGE', generator.ORDER_ATOMIC) || '""';
        return `    sender.sendMessage("§c" + ${message});\n`;
    };

    // Envoyer un message de succès
    Blockly.Blocks['command_send_success'] = {
        init: function() {
            this.appendValueInput("MESSAGE")
                .setCheck("String")
                .appendField("Envoyer succès");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#e67e22");
        }
    };
    generator.forBlock['command_send_success'] = function(block) {
        const message = generator.valueToCode(block, 'MESSAGE', generator.ORDER_ATOMIC) || '""';
        return `    sender.sendMessage("§a" + ${message});\n`;
    };

    /* ========================================
       RETOURS DE COMMANDE
       ======================================== */

    // Retourner succès
    Blockly.Blocks['command_return_success'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Retourner succès");
            this.setPreviousStatement(true);
            this.setColour("#e67e22");
        }
    };
    generator.forBlock['command_return_success'] = function(block) {
        return `    return true;\n`;
    };

    // Retourner échec
    Blockly.Blocks['command_return_failure'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Retourner échec");
            this.setPreviousStatement(true);
            this.setColour("#e67e22");
        }
    };
    generator.forBlock['command_return_failure'] = function(block) {
        return `    return false;\n`;
    };

    /* ========================================
       ACTIONS POUR COMMANDES JOUEUR
       ======================================== */

    // Trouver un joueur en ligne par nom
    Blockly.Blocks['command_get_online_player'] = {
        init: function() {
            this.appendValueInput("PLAYER_NAME")
                .setCheck("String")
                .appendField("Joueur en ligne");
            this.appendStatementInput("IF_FOUND")
                .appendField("si trouvé :");
            this.appendStatementInput("IF_NOT_FOUND")
                .appendField("si non trouvé :");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#e67e22");
            this.setTooltip("Cherche un joueur en ligne et crée une variable 'targetPlayer'");
        }
    };
    generator.forBlock['command_get_online_player'] = function(block) {
        const playerName = generator.valueToCode(block, 'PLAYER_NAME', generator.ORDER_ATOMIC) || '""';
        const ifFound = generator.statementToCode(block, 'IF_FOUND');
        const ifNotFound = generator.statementToCode(block, 'IF_NOT_FOUND');

        return `    Player targetPlayer = org.bukkit.Bukkit.getPlayer(${playerName});
    if (targetPlayer != null && targetPlayer.isOnline()) {
${ifFound}    } else {
${ifNotFound}    }\n`;
    };

    // Utiliser targetPlayer (pour utiliser dans les blocs d'actions)
    Blockly.Blocks['command_target_player'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("joueur ciblé");
            this.setOutput(true);
            this.setColour("#e67e22");
            this.setTooltip("Référence au joueur trouvé avec 'Joueur en ligne'");
        }
    };
    generator.forBlock['command_target_player'] = function(block) {
        return ['targetPlayer', generator.ORDER_ATOMIC];
    };

    /* ========================================
       COMMANDES CONSOLE
       ======================================== */

    // Exécuter une commande console
    Blockly.Blocks['command_execute_console'] = {
        init: function() {
            this.appendValueInput("COMMAND")
                .setCheck("String")
                .appendField("Exécuter commande console");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#e67e22");
        }
    };
    generator.forBlock['command_execute_console'] = function(block) {
        const command = generator.valueToCode(block, 'COMMAND', generator.ORDER_ATOMIC) || '""';
        return `    org.bukkit.Bukkit.dispatchCommand(org.bukkit.Bukkit.getConsoleSender(), ${command});\n`;
    };

    // Exécuter une commande en tant que joueur
    Blockly.Blocks['command_execute_as_player'] = {
        init: function() {
            this.appendValueInput("COMMAND")
                .setCheck("String")
                .appendField("Exécuter commande en tant que joueur");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#e67e22");
        }
    };
    generator.forBlock['command_execute_as_player'] = function(block) {
        const command = generator.valueToCode(block, 'COMMAND', generator.ORDER_ATOMIC) || '""';
        return `    if (sender instanceof Player) {
        Player player = (Player) sender;
        org.bukkit.Bukkit.dispatchCommand(player, ${command});
    }\n`;
    };
}
