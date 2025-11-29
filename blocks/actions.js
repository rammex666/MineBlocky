/* =========================================
   BLOCS D'ACTIONS MINECRAFT
   ========================================= */

/**
 * Définit tous les blocs d'actions Minecraft
 * @param {Object} generator - Générateur Java
 */
function defineActionBlocks(generator) {

    /* ========================================
       ACTIONS JOUEUR - COMMUNICATION
       ======================================== */

    // Envoyer un message
    Blockly.Blocks['player_send_message'] = {
        init: function() {
            this.appendValueInput("MSG")
                .setCheck("String")
                .appendField("Envoyer message");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_send_message'] = function(block) {
        const message = generator.valueToCode(block, 'MSG', generator.ORDER_ATOMIC) || '""';
        return `    player.sendMessage(${message});\n`;
    };

    // Envoyer titre
    Blockly.Blocks['player_send_title'] = {
        init: function() {
            this.appendValueInput("TITLE")
                .setCheck("String")
                .appendField("Envoyer titre");
            this.appendValueInput("SUBTITLE")
                .setCheck("String")
                .appendField("sous-titre");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_send_title'] = function(block) {
        const title = generator.valueToCode(block, 'TITLE', generator.ORDER_ATOMIC) || '""';
        const subtitle = generator.valueToCode(block, 'SUBTITLE', generator.ORDER_ATOMIC) || '""';
        return `    player.sendTitle(${title}, ${subtitle}, 10, 70, 20);\n`;
    };

    // Action bar
    Blockly.Blocks['player_send_actionbar'] = {
        init: function() {
            this.appendValueInput("MSG")
                .setCheck("String")
                .appendField("Envoyer action bar");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_send_actionbar'] = function(block) {
        const msg = generator.valueToCode(block, 'MSG', generator.ORDER_ATOMIC) || '""';
        return `    player.spigot().sendMessage(net.md_5.bungee.api.ChatMessageType.ACTION_BAR, new net.md_5.bungee.api.chat.TextComponent(${msg}));\n`;
    };

    /* ========================================
       ACTIONS JOUEUR - STATISTIQUES
       ======================================== */

    // Définir la vie
    Blockly.Blocks['player_set_health'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Mettre vie à")
                .appendField(new Blockly.FieldNumber(20, 0, 20), "HP");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_set_health'] = function(block) {
        const health = block.getFieldValue('HP');
        return `    player.setHealth(${health});\n`;
    };

    // Définir la faim
    Blockly.Blocks['player_set_food'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Mettre faim à")
                .appendField(new Blockly.FieldNumber(20, 0, 20), "FOOD");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_set_food'] = function(block) {
        const food = block.getFieldValue('FOOD');
        return `    player.setFoodLevel(${food});\n`;
    };

    // Définir la saturation
    Blockly.Blocks['player_set_saturation'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Mettre saturation à")
                .appendField(new Blockly.FieldNumber(20, 0, 20), "SAT");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_set_saturation'] = function(block) {
        const sat = block.getFieldValue('SAT');
        return `    player.setSaturation(${sat});\n`;
    };

    // Soigner complètement
    Blockly.Blocks['player_heal'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Soigner complètement");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_heal'] = function(block) {
        return `    player.setHealth(20.0);\n    player.setFoodLevel(20);\n    player.setSaturation(20.0f);\n`;
    };

    // Tuer
    Blockly.Blocks['player_kill'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Tuer le joueur");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_kill'] = function(block) {
        return `    player.setHealth(0);\n`;
    };

    /* ========================================
       ACTIONS JOUEUR - MODE & PERMISSIONS
       ======================================== */

    // Changer le mode de jeu
    Blockly.Blocks['player_set_gamemode'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Changer mode de jeu")
                .appendField(new Blockly.FieldDropdown([
                    ["SURVIE", "SURVIVAL"],
                    ["CRÉATIF", "CREATIVE"],
                    ["AVENTURE", "ADVENTURE"],
                    ["SPECTATEUR", "SPECTATOR"]
                ]), "MODE");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_set_gamemode'] = function(block) {
        const mode = block.getFieldValue('MODE');
        return `    player.setGameMode(GameMode.${mode});\n`;
    };

    // Kick le joueur
    Blockly.Blocks['player_kick'] = {
        init: function() {
            this.appendValueInput("REASON")
                .setCheck("String")
                .appendField("Kick le joueur");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_kick'] = function(block) {
        const reason = generator.valueToCode(block, 'REASON', generator.ORDER_ATOMIC) || '""';
        return `    player.kickPlayer(${reason});\n`;
    };

    // Bannir
    Blockly.Blocks['player_ban'] = {
        init: function() {
            this.appendValueInput("REASON")
                .setCheck("String")
                .appendField("Bannir le joueur");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_ban'] = function(block) {
        const reason = generator.valueToCode(block, 'REASON', generator.ORDER_ATOMIC) || '""';
        return `    player.ban(${reason});\n`;
    };

    // Définir OP
    Blockly.Blocks['player_set_op'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Mettre OP")
                .appendField(new Blockly.FieldDropdown([
                    ["OUI", "true"],
                    ["NON", "false"]
                ]), "OP");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_set_op'] = function(block) {
        const op = block.getFieldValue('OP');
        return `    player.setOp(${op});\n`;
    };

    /* ========================================
       ACTIONS JOUEUR - EXPÉRIENCE
       ======================================== */

    // Donner de l'expérience
    Blockly.Blocks['player_give_exp'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Donner")
                .appendField(new Blockly.FieldNumber(10, 0), "EXP")
                .appendField("XP");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_give_exp'] = function(block) {
        const exp = block.getFieldValue('EXP');
        return `    player.giveExp(${exp});\n`;
    };

    // Définir le niveau
    Blockly.Blocks['player_set_level'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Mettre niveau à")
                .appendField(new Blockly.FieldNumber(10, 0), "LEVEL");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_set_level'] = function(block) {
        const level = block.getFieldValue('LEVEL');
        return `    player.setLevel(${level});\n`;
    };

    /* ========================================
       ACTIONS JOUEUR - EFFETS
       ======================================== */

    // Donner effet de potion
    Blockly.Blocks['player_add_potion_effect'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Donner effet")
                .appendField(new Blockly.FieldDropdown([
                    ["VITESSE", "SPEED"],
                    ["LENTEUR", "SLOW"],
                    ["FORCE", "INCREASE_DAMAGE"],
                    ["SAUT", "JUMP"],
                    ["RÉGÉNÉRATION", "REGENERATION"],
                    ["RÉSISTANCE AU FEU", "FIRE_RESISTANCE"],
                    ["RESPIRATION", "WATER_BREATHING"],
                    ["INVISIBILITÉ", "INVISIBILITY"],
                    ["CÉCITÉ", "BLINDNESS"],
                    ["VISION NOCTURNE", "NIGHT_VISION"],
                    ["FAIM", "HUNGER"],
                    ["FAIBLESSE", "WEAKNESS"],
                    ["POISON", "POISON"],
                    ["WITHER", "WITHER"],
                    ["ABSORPTION", "ABSORPTION"],
                    ["SATURATION", "SATURATION"],
                    ["CHANCE", "LUCK"]
                ]), "EFFECT");
            this.appendDummyInput()
                .appendField("durée")
                .appendField(new Blockly.FieldNumber(60, 1), "DURATION")
                .appendField("sec");
            this.appendDummyInput()
                .appendField("niveau")
                .appendField(new Blockly.FieldNumber(1, 1, 10), "LEVEL");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_add_potion_effect'] = function(block) {
        const effect = block.getFieldValue('EFFECT');
        const duration = block.getFieldValue('DURATION');
        const level = block.getFieldValue('LEVEL');
        return `    player.addPotionEffect(new org.bukkit.potion.PotionEffect(org.bukkit.potion.PotionEffectType.${effect}, ${duration} * 20, ${level} - 1));\n`;
    };

    // Retirer tous les effets
    Blockly.Blocks['player_clear_effects'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Retirer tous les effets");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_clear_effects'] = function(block) {
        return `    for (org.bukkit.potion.PotionEffect effect : player.getActivePotionEffects()) {\n        player.removePotionEffect(effect.getType());\n    }\n`;
    };

    /* ========================================
       ACTIONS JOUEUR - TÉLÉPORTATION & MOUVEMENT
       ======================================== */

    // Téléporter à spawn
    Blockly.Blocks['player_teleport_spawn'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Téléporter au spawn du monde");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_teleport_spawn'] = function(block) {
        return `    player.teleport(player.getWorld().getSpawnLocation());\n`;
    };

    // Téléporter à son bed
    Blockly.Blocks['player_teleport_bed'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Téléporter à son lit");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_teleport_bed'] = function(block) {
        return `    if (player.getBedSpawnLocation() != null) {\n        player.teleport(player.getBedSpawnLocation());\n    }\n`;
    };

    // Définir le mode de vol
    Blockly.Blocks['player_set_fly'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Autoriser le vol")
                .appendField(new Blockly.FieldDropdown([
                    ["OUI", "true"],
                    ["NON", "false"]
                ]), "FLY");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_set_fly'] = function(block) {
        const fly = block.getFieldValue('FLY');
        return `    player.setAllowFlight(${fly});\n    player.setFlying(${fly});\n`;
    };

    // Définir vitesse de marche
    Blockly.Blocks['player_set_walk_speed'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Vitesse de marche")
                .appendField(new Blockly.FieldNumber(0.2, 0, 1, 0.1), "SPEED");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_set_walk_speed'] = function(block) {
        const speed = block.getFieldValue('SPEED');
        return `    player.setWalkSpeed(${speed}f);\n`;
    };

    // Définir vitesse de vol
    Blockly.Blocks['player_set_fly_speed'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Vitesse de vol")
                .appendField(new Blockly.FieldNumber(0.2, 0, 1, 0.1), "SPEED");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_set_fly_speed'] = function(block) {
        const speed = block.getFieldValue('SPEED');
        return `    player.setFlySpeed(${speed}f);\n`;
    };

    /* ========================================
       ACTIONS JOUEUR - DÉGÂTS & EFFETS
       ======================================== */

    // Mettre en feu
    Blockly.Blocks['player_set_fire'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Mettre en feu pendant")
                .appendField(new Blockly.FieldNumber(5, 0), "SECONDS")
                .appendField("sec");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_set_fire'] = function(block) {
        const seconds = block.getFieldValue('SECONDS');
        return `    player.setFireTicks(${seconds} * 20);\n`;
    };

    // Frapper avec la foudre
    Blockly.Blocks['player_strike_lightning'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Frapper avec foudre");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_strike_lightning'] = function(block) {
        return `    player.getWorld().strikeLightning(player.getLocation());\n`;
    };

    /* ========================================
       ACTIONS JOUEUR - SON & VISUEL
       ======================================== */

    // Jouer un son
    Blockly.Blocks['player_play_sound'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Jouer son")
                .appendField(new Blockly.FieldDropdown([
                    ["SUCCÈS", "ENTITY_PLAYER_LEVELUP"],
                    ["CLICK", "UI_BUTTON_CLICK"],
                    ["EXPLOSION", "ENTITY_GENERIC_EXPLODE"],
                    ["DING", "BLOCK_NOTE_BLOCK_PLING"],
                    ["CLOCHE", "BLOCK_BELL_USE"],
                    ["PORTE", "BLOCK_WOODEN_DOOR_OPEN"],
                    ["COFFRE", "BLOCK_CHEST_OPEN"],
                    ["ENCLUME", "BLOCK_ANVIL_USE"],
                    ["PORTAIL", "BLOCK_PORTAL_TRAVEL"]
                ]), "SOUND");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.ACTIONS);
        }
    };
    generator.forBlock['player_play_sound'] = function(block) {
        const sound = block.getFieldValue('SOUND');
        return `    player.playSound(player.getLocation(), org.bukkit.Sound.${sound}, 1.0f, 1.0f);\n`;
    };

    /* ========================================
       ACTIONS GÉNÉRALES
       ======================================== */

    // Annuler l'événement
    Blockly.Blocks['event_cancel'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Annuler l'événement !");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.CANCEL);
        }
    };
    generator.forBlock['event_cancel'] = function(block) {
        return `    event.setCancelled(true);\n`;
    };
}
