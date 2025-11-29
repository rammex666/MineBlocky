/* =========================================
   BLOCS D'ACTIONS SUR LE MONDE
   ========================================= */

/**
 * Définit tous les blocs d'actions sur le monde
 * @param {Object} generator - Générateur Java
 */
function defineWorldBlocks(generator) {

    /* ========================================
       MÉTÉO & TEMPS
       ======================================== */

    // Définir l'heure
    Blockly.Blocks['world_set_time'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Mettre l'heure à")
                .appendField(new Blockly.FieldDropdown([
                    ["JOUR (1000)", "1000"],
                    ["MIDI (6000)", "6000"],
                    ["COUCHER DU SOLEIL (12000)", "12000"],
                    ["NUIT (13000)", "13000"],
                    ["MINUIT (18000)", "18000"]
                ]), "TIME");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#27ae60");
        }
    };
    generator.forBlock['world_set_time'] = function(block) {
        const time = block.getFieldValue('TIME');
        return `    player.getWorld().setTime(${time});\n`;
    };

    // Définir la météo
    Blockly.Blocks['world_set_weather'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Mettre météo")
                .appendField(new Blockly.FieldDropdown([
                    ["CLAIR", "false"],
                    ["PLUIE", "true"]
                ]), "WEATHER");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#27ae60");
        }
    };
    generator.forBlock['world_set_weather'] = function(block) {
        const weather = block.getFieldValue('WEATHER');
        return `    player.getWorld().setStorm(${weather});\n`;
    };

    // Définir l'orage
    Blockly.Blocks['world_set_thunder'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Mettre orage")
                .appendField(new Blockly.FieldDropdown([
                    ["OUI", "true"],
                    ["NON", "false"]
                ]), "THUNDER");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#27ae60");
        }
    };
    generator.forBlock['world_set_thunder'] = function(block) {
        const thunder = block.getFieldValue('THUNDER');
        return `    player.getWorld().setThundering(${thunder});\n`;
    };

    /* ========================================
       EXPLOSIONS & EFFETS
       ======================================== */

    // Créer une explosion
    Blockly.Blocks['world_create_explosion'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Créer explosion")
                .appendField("puissance")
                .appendField(new Blockly.FieldNumber(4, 0, 10), "POWER");
            this.appendDummyInput()
                .appendField("détruit blocs")
                .appendField(new Blockly.FieldDropdown([
                    ["OUI", "true"],
                    ["NON", "false"]
                ]), "BREAKS");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#27ae60");
        }
    };
    generator.forBlock['world_create_explosion'] = function(block) {
        const power = block.getFieldValue('POWER');
        const breaks = block.getFieldValue('BREAKS');
        return `    player.getWorld().createExplosion(player.getLocation(), ${power}f, ${breaks});\n`;
    };

    // Frapper avec la foudre
    Blockly.Blocks['world_strike_lightning'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Frapper foudre sur joueur");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#27ae60");
        }
    };
    generator.forBlock['world_strike_lightning'] = function(block) {
        return `    player.getWorld().strikeLightning(player.getLocation());\n`;
    };

    /* ========================================
       SPAWN D'ENTITÉS
       ======================================== */

    // Spawn une entité
    Blockly.Blocks['world_spawn_entity'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Faire apparaître")
                .appendField(new Blockly.FieldDropdown([
                    ["ZOMBIE", "ZOMBIE"],
                    ["SQUELETTE", "SKELETON"],
                    ["CREEPER", "CREEPER"],
                    ["ARAIGNÉE", "SPIDER"],
                    ["ENDERMAN", "ENDERMAN"],
                    ["COCHON", "PIG"],
                    ["VACHE", "COW"],
                    ["MOUTON", "SHEEP"],
                    ["POULET", "CHICKEN"],
                    ["CHEVAL", "HORSE"],
                    ["LOUP", "WOLF"],
                    ["CHAT", "CAT"],
                    ["VILLAGEOIS", "VILLAGER"],
                    ["GOLEM DE FER", "IRON_GOLEM"]
                ]), "ENTITY");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#27ae60");
        }
    };
    generator.forBlock['world_spawn_entity'] = function(block) {
        const entity = block.getFieldValue('ENTITY');
        return `    player.getWorld().spawnEntity(player.getLocation(), org.bukkit.entity.EntityType.${entity});\n`;
    };

    /* ========================================
       BLOCS & STRUCTURES
       ======================================== */

    // Définir un bloc
    Blockly.Blocks['world_set_block'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Placer bloc")
                .appendField(new Blockly.FieldDropdown([
                    ["DIAMANT", "DIAMOND_BLOCK"],
                    ["OR", "GOLD_BLOCK"],
                    ["FER", "IRON_BLOCK"],
                    ["ÉMERAUDE", "EMERALD_BLOCK"],
                    ["PIERRE", "STONE"],
                    ["TERRE", "DIRT"],
                    ["HERBE", "GRASS_BLOCK"],
                    ["BOIS", "OAK_LOG"],
                    ["VERRE", "GLASS"],
                    ["OBSIDIENNE", "OBSIDIAN"],
                    ["TNT", "TNT"],
                    ["AIR", "AIR"]
                ]), "BLOCK");
            this.appendDummyInput()
                .appendField("devant le joueur");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#27ae60");
        }
    };
    generator.forBlock['world_set_block'] = function(block) {
        const blockType = block.getFieldValue('BLOCK');
        return `    org.bukkit.Location loc = player.getTargetBlock(null, 5).getLocation();\n    loc.getBlock().setType(Material.${blockType});\n`;
    };

    /* ========================================
       SON & EFFETS VISUELS
       ======================================== */

    // Jouer un son global
    Blockly.Blocks['world_play_sound'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Jouer son global")
                .appendField(new Blockly.FieldDropdown([
                    ["EXPLOSION", "ENTITY_GENERIC_EXPLODE"],
                    ["FOUDRE", "ENTITY_LIGHTNING_BOLT_THUNDER"],
                    ["DRAGON", "ENTITY_ENDER_DRAGON_GROWL"],
                    ["WITHER", "ENTITY_WITHER_SPAWN"],
                    ["CLOCHE", "BLOCK_BELL_USE"]
                ]), "SOUND");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#27ae60");
        }
    };
    generator.forBlock['world_play_sound'] = function(block) {
        const sound = block.getFieldValue('SOUND');
        return `    player.getWorld().playSound(player.getLocation(), org.bukkit.Sound.${sound}, 10.0f, 1.0f);\n`;
    };

    // Jouer un effet
    Blockly.Blocks['world_play_effect'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Jouer effet")
                .appendField(new Blockly.FieldDropdown([
                    ["FUMÉE", "SMOKE"],
                    ["FLAMME", "FLAME"],
                    ["CŒUR", "HEART"],
                    ["ENCHANTEMENT", "ENCHANTMENT_TABLE"],
                    ["PORTAIL", "PORTAL"],
                    ["ENDER", "ENDER_SIGNAL"]
                ]), "EFFECT");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#27ae60");
        }
    };
    generator.forBlock['world_play_effect'] = function(block) {
        const effect = block.getFieldValue('EFFECT');
        return `    player.getWorld().playEffect(player.getLocation(), org.bukkit.Effect.${effect}, null);\n`;
    };

    /* ========================================
       RÈGLES DE JEU
       ======================================== */

    // Définir une gamerule
    Blockly.Blocks['world_set_gamerule'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Règle de jeu")
                .appendField(new Blockly.FieldDropdown([
                    ["KEEP INVENTORY", "keepInventory"],
                    ["MOB SPAWNING", "doMobSpawning"],
                    ["DAYLIGHT CYCLE", "doDaylightCycle"],
                    ["WEATHER CYCLE", "doWeatherCycle"],
                    ["MOB GRIEFING", "mobGriefing"],
                    ["FIRE SPREAD", "doFireTick"],
                    ["ANNOUNCE ADVANCEMENTS", "announceAdvancements"]
                ]), "RULE");
            this.appendDummyInput()
                .appendField("=")
                .appendField(new Blockly.FieldDropdown([
                    ["VRAI", "true"],
                    ["FAUX", "false"]
                ]), "VALUE");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#27ae60");
        }
    };
    generator.forBlock['world_set_gamerule'] = function(block) {
        const rule = block.getFieldValue('RULE');
        const value = block.getFieldValue('VALUE');
        return `    player.getWorld().setGameRule(org.bukkit.GameRule.${rule.toUpperCase()}, ${value});\n`;
    };
}
