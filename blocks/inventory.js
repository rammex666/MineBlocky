/* =========================================
   BLOCS D'INVENTAIRE MINECRAFT
   ========================================= */

/**
 * Définit tous les blocs liés à l'inventaire
 * @param {Object} generator - Générateur Java
 */
function defineInventoryBlocks(generator) {

    /* ========================================
       DONNER DES ITEMS
       ======================================== */

    // Donner un item
    Blockly.Blocks['inventory_give_item'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Donner item")
                .appendField(new Blockly.FieldDropdown([
                    ["DIAMANT", "DIAMOND"],
                    ["ÉMERAUDE", "EMERALD"],
                    ["OR", "GOLD_INGOT"],
                    ["FER", "IRON_INGOT"],
                    ["POMME", "APPLE"],
                    ["POMME D'OR", "GOLDEN_APPLE"],
                    ["STEAK", "COOKED_BEEF"],
                    ["PAIN", "BREAD"],
                    ["PELLE DIAMANT", "SHOVEL"],
                    ["PIOCHE DIAMANT", "DIAMOND_PICKAXE"],
                    ["HACHE DIAMANT", "DIAMOND_AXE"],
                    ["ÉPÉE DIAMANT", "DIAMOND_SWORD"],
                    ["ÉPÉE FER", "IRON_SWORD"],
                    ["ARC", "BOW"],
                    ["FLÈCHE", "ARROW"],
                    ["TERRE", "DIRT"],
                    ["PIERRE", "STONE"],
                    ["BOIS", "OAK_LOG"],
                    ["TNT", "TNT"],
                    ["OBSIDIENNE", "OBSIDIAN"]
                ]), "ITEM");
            this.appendDummyInput()
                .appendField("quantité")
                .appendField(new Blockly.FieldNumber(1, 1, 64), "AMOUNT");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.INVENTORY);
        }
    };
    generator.forBlock['inventory_give_item'] = function(block) {
        let item = block.getFieldValue('ITEM');
        const amount = block.getFieldValue('AMOUNT');
        const version = document.getElementById('versionSelect').value;

        // Compatibilité des versions anciennes
        if (item === "SHOVEL" && (version === "1.8" || version === "1.12")) {
            item = "DIAMOND_SPADE";
        } else if (item === "SHOVEL") {
            item = "DIAMOND_SHOVEL";
        }

        return `    player.getInventory().addItem(new ItemStack(Material.${item}, ${amount}));\n`;
    };

    // Donner item personnalisé avec nom
    Blockly.Blocks['inventory_give_item_custom'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Donner")
                .appendField(new Blockly.FieldDropdown([
                    ["DIAMANT", "DIAMOND"],
                    ["ÉPÉE DIAMANT", "DIAMOND_SWORD"],
                    ["BÂTON", "STICK"],
                    ["PIERRE", "STONE"]
                ]), "ITEM");
            this.appendValueInput("NAME")
                .setCheck("String")
                .appendField("avec nom");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.INVENTORY);
        }
    };
    generator.forBlock['inventory_give_item_custom'] = function(block) {
        const item = block.getFieldValue('ITEM');
        const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '""';
        return `    ItemStack customItem = new ItemStack(Material.${item});\n    org.bukkit.inventory.meta.ItemMeta meta = customItem.getItemMeta();\n    meta.setDisplayName(${name});\n    customItem.setItemMeta(meta);\n    player.getInventory().addItem(customItem);\n`;
    };

    /* ========================================
       RETIRER DES ITEMS
       ======================================== */

    // Vider l'inventaire
    Blockly.Blocks['inventory_clear'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Vider l'inventaire");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.INVENTORY);
        }
    };
    generator.forBlock['inventory_clear'] = function(block) {
        return `    player.getInventory().clear();\n`;
    };

    // Retirer un type d'item
    Blockly.Blocks['inventory_remove_item'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Retirer")
                .appendField(new Blockly.FieldDropdown([
                    ["DIAMANT", "DIAMOND"],
                    ["OR", "GOLD_INGOT"],
                    ["FER", "IRON_INGOT"],
                    ["TERRE", "DIRT"],
                    ["PIERRE", "STONE"]
                ]), "ITEM");
            this.appendDummyInput()
                .appendField("quantité")
                .appendField(new Blockly.FieldNumber(1, 1, 64), "AMOUNT");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.INVENTORY);
        }
    };
    generator.forBlock['inventory_remove_item'] = function(block) {
        const item = block.getFieldValue('ITEM');
        const amount = block.getFieldValue('AMOUNT');
        return `    player.getInventory().removeItem(new ItemStack(Material.${item}, ${amount}));\n`;
    };

    /* ========================================
       ÉQUIPEMENT & ARMURE
       ======================================== */

    // Définir casque
    Blockly.Blocks['inventory_set_helmet'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Équiper casque")
                .appendField(new Blockly.FieldDropdown([
                    ["DIAMANT", "DIAMOND_HELMET"],
                    ["FER", "IRON_HELMET"],
                    ["OR", "GOLDEN_HELMET"],
                    ["CUIR", "LEATHER_HELMET"],
                    ["MAILLE", "CHAINMAIL_HELMET"]
                ]), "HELMET");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.INVENTORY);
        }
    };
    generator.forBlock['inventory_set_helmet'] = function(block) {
        const helmet = block.getFieldValue('HELMET');
        return `    player.getInventory().setHelmet(new ItemStack(Material.${helmet}));\n`;
    };

    // Définir plastron
    Blockly.Blocks['inventory_set_chestplate'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Équiper plastron")
                .appendField(new Blockly.FieldDropdown([
                    ["DIAMANT", "DIAMOND_CHESTPLATE"],
                    ["FER", "IRON_CHESTPLATE"],
                    ["OR", "GOLDEN_CHESTPLATE"],
                    ["CUIR", "LEATHER_CHESTPLATE"],
                    ["MAILLE", "CHAINMAIL_CHESTPLATE"]
                ]), "CHESTPLATE");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.INVENTORY);
        }
    };
    generator.forBlock['inventory_set_chestplate'] = function(block) {
        const chestplate = block.getFieldValue('CHESTPLATE');
        return `    player.getInventory().setChestplate(new ItemStack(Material.${chestplate}));\n`;
    };

    // Définir jambières
    Blockly.Blocks['inventory_set_leggings'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Équiper jambières")
                .appendField(new Blockly.FieldDropdown([
                    ["DIAMANT", "DIAMOND_LEGGINGS"],
                    ["FER", "IRON_LEGGINGS"],
                    ["OR", "GOLDEN_LEGGINGS"],
                    ["CUIR", "LEATHER_LEGGINGS"],
                    ["MAILLE", "CHAINMAIL_LEGGINGS"]
                ]), "LEGGINGS");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.INVENTORY);
        }
    };
    generator.forBlock['inventory_set_leggings'] = function(block) {
        const leggings = block.getFieldValue('LEGGINGS');
        return `    player.getInventory().setLeggings(new ItemStack(Material.${leggings}));\n`;
    };

    // Définir bottes
    Blockly.Blocks['inventory_set_boots'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Équiper bottes")
                .appendField(new Blockly.FieldDropdown([
                    ["DIAMANT", "DIAMOND_BOOTS"],
                    ["FER", "IRON_BOOTS"],
                    ["OR", "GOLDEN_BOOTS"],
                    ["CUIR", "LEATHER_BOOTS"],
                    ["MAILLE", "CHAINMAIL_BOOTS"]
                ]), "BOOTS");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.INVENTORY);
        }
    };
    generator.forBlock['inventory_set_boots'] = function(block) {
        const boots = block.getFieldValue('BOOTS');
        return `    player.getInventory().setBoots(new ItemStack(Material.${boots}));\n`;
    };

    /* ========================================
       ITEM EN MAIN
       ======================================== */

    // Définir item dans la main principale
    Blockly.Blocks['inventory_set_item_in_hand'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Mettre dans la main")
                .appendField(new Blockly.FieldDropdown([
                    ["ÉPÉE DIAMANT", "DIAMOND_SWORD"],
                    ["PIOCHE DIAMANT", "DIAMOND_PICKAXE"],
                    ["ARC", "BOW"],
                    ["BÂTON", "STICK"],
                    ["POMME D'OR", "GOLDEN_APPLE"]
                ]), "ITEM");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.INVENTORY);
        }
    };
    generator.forBlock['inventory_set_item_in_hand'] = function(block) {
        const item = block.getFieldValue('ITEM');
        return `    player.getInventory().setItemInMainHand(new ItemStack(Material.${item}));\n`;
    };

    // Définir item dans l'off-hand
    Blockly.Blocks['inventory_set_item_in_offhand'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Mettre dans l'off-hand")
                .appendField(new Blockly.FieldDropdown([
                    ["BOUCLIER", "SHIELD"],
                    ["TORCHE", "TORCH"],
                    ["FLÈCHE", "ARROW"],
                    ["TOTEM", "TOTEM_OF_UNDYING"]
                ]), "ITEM");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour(COLORS.INVENTORY);
        }
    };
    generator.forBlock['inventory_set_item_in_offhand'] = function(block) {
        const item = block.getFieldValue('ITEM');
        return `    player.getInventory().setItemInOffHand(new ItemStack(Material.${item}));\n`;
    };
}
